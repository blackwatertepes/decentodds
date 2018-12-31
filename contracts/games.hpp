#pragma once

#include <eosiolib/eosio.hpp>

using namespace eosio;

class [[eosio::contract]] games : public contract {

public:

    //using contract::contract;

    games( name receiver, name code, datastream<const char*> ds ): contract(receiver, code, ds),  _polls(receiver, code.value), _players(receiver, code.value)
    {}

    // [[eosio::action]] will tell eosio-cpp that the function is to be exposed as an action for user of the smart contract.
    [[eosio::action]] void version();
    [[eosio::action]] void addpoll(name s, uint64_t pollName);
    [[eosio::action]] void rmpoll(name s, uint64_t pollName);
    [[eosio::action]] void status(uint64_t pollName);
    [[eosio::action]] void statusreset(uint64_t pollName);
    [[eosio::action]] void addpollopt(uint64_t pollName, std::string option);
    [[eosio::action]] void rmpollopt(uint64_t pollName, std::string option);
    [[eosio::action]] void vote(uint64_t pollName, std::string option, uint64_t accountName);

    //private: -- not private so the cleos get table call can see the table data.

    // create the multi index tables to store the data
    struct [[eosio::table]] poll
    {
        uint64_t      key; // primary key
        uint64_t      pollId; // second key, non-unique, this table will have dup rows for each poll because of option
        uint64_t   pollName; // name of poll
        uint8_t      pollStatus =0; // staus where 0 = closed, 1 = open, 2 = finished
        std::string  option; // the item you can vote for
        uint32_t    count =0; // the number of votes for each itme -- this to be pulled out to separte table.

        uint64_t primary_key() const { return key; }
        uint64_t by_pollId() const {return pollId; }
    };
    typedef multi_index<"poll"_n, poll, indexed_by<"pollid"_n, const_mem_fun<poll, uint64_t, &poll::by_pollId>>> pollstable;

    struct [[eosio::table]] gameplayers
    {
        uint64_t      name;
        uint64_t      gameId;

        uint64_t primary_key() const { return name; }
        uint64_t by_gameId() const {return gameId; }
    };
    typedef multi_index<"gameplayers"_n, gameplayers, indexed_by<"pollid"_n, const_mem_fun<gameplayers, uint64_t, &gameplayers::by_gameId>>> players;

    //// local instances of the multi indexes
    pollstable _polls;
    players _players;
};
