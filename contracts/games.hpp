#pragma once

#include <eosiolib/eosio.hpp>

using namespace eosio;

class [[eosio::contract]] games : public contract {

public:

    //using contract::contract;

    games( name receiver, name code, datastream<const char*> ds ): contract(receiver, code, ds),  _games(receiver, code.value), _players(receiver, code.value)
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
    struct [[eosio::table]] game
    {
        uint64_t     ipfsHash;
        uint8_t      round =0;
        std::string  option;
        uint32_t     count =0;

        uint64_t primary_key() const { return ipfsHash; }
        uint64_t by_round() const {return round; }
    };
    typedef multi_index<"game"_n, game, indexed_by<"ipfshash"_n, const_mem_fun<game, uint64_t, &game::by_round>>> gamestable;

    struct [[eosio::table]] gameplayers
    {
        uint64_t      name;
        uint64_t      gameId;

        uint64_t primary_key() const { return name; }
        uint64_t by_gameId() const {return gameId; }
    };
    typedef multi_index<"gameplayers"_n, gameplayers, indexed_by<"gameid"_n, const_mem_fun<gameplayers, uint64_t, &gameplayers::by_gameId>>> players;

    //// local instances of the multi indexes
    gamestable _games;
    players _players;
};
