#pragma once

#include <eosiolib/asset.hpp>
#include <eosiolib/eosio.hpp>

using namespace eosio;

class [[eosio::contract]] games : public contract {

public:

    //using contract::contract;

    games( name receiver, name code, datastream<const char*> ds ): contract(receiver, code, ds),  _games(receiver, code.value), _players(receiver, code.value)
    {}

    // [[eosio::action]] will tell eosio-cpp that the function is to be exposed as an action for user of the smart contract.
    [[eosio::action]] void version();
    [[eosio::action]] void creategame(uint64_t ipfsHash, uint64_t accountName);
    [[eosio::action]] void joingame(uint64_t gameId, uint64_t accountName);
    [[eosio::action]] void leavegame(uint64_t gameId, uint64_t accountName);
    [[eosio::action]] void bet(uint64_t gameId, uint64_t accountName, asset balance);

    //private: -- not private so the cleos get table call can see the table data.

    // create the multi index tables to store the data
    struct [[eosio::table]] game
    {
        uint64_t     ipfsHash;
        uint8_t      round =0;
        uint64_t     createdAt;

        uint64_t primary_key() const { return ipfsHash; }
        uint64_t by_round() const {return round; }
    };
    typedef multi_index<"game"_n, game, indexed_by<"ipfshash"_n, const_mem_fun<game, uint64_t, &game::by_round>>> gamestable;

    struct [[eosio::table]] gameplayers
    {
        uint64_t      name;
        uint64_t      gameId;
        asset         balance;

        uint64_t primary_key() const { return name; }
        uint64_t by_gameId() const {return gameId; }
    };
    typedef multi_index<"gameplayers"_n, gameplayers, indexed_by<"gameid"_n, const_mem_fun<gameplayers, uint64_t, &gameplayers::by_gameId>>> players;

    //// local instances of the multi indexes
    gamestable _games;
    players _players;
};
