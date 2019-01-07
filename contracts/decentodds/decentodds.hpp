#pragma once

#include <eosiolib/asset.hpp>
#include <eosiolib/eosio.hpp>

using namespace eosio;

class [[eosio::contract]] decentodds : public contract {

public:

    //using contract::contract;

    decentodds( name receiver, name code, datastream<const char*> ds ): contract(receiver, code, ds),  _games(receiver, code.value), _bets(receiver, code.value), _players(receiver, code.value)
    {}

    // [[eosio::action]] will tell eosio-cpp that the function is to be exposed as an action for user of the smart contract.
    [[eosio::action]] void version();
    // NOTE: Host methods...
    [[eosio::action]] void creategame(name creator, uint64_t hash);
    [[eosio::action]] void deletegame(uint64_t hash);
    [[eosio::action]] void acceptbet(uint64_t hash);
    // NOTE: Player methods...
    [[eosio::action]] void bet(uint64_t hash, name better, asset wager, asset deposit);
    [[eosio::action]] void askpayout(uint64_t hash, asset payout);
    // NOTE: Admin methods...
    [[eosio::action]] void blowupgame(uint64_t hash); // Fix unresolved games, by collecting all outstanding bets, and erasing the game...

    //private: -- not private so the cleos get table call can see the table data.

    struct [[eosio::table]] games
    {
        uint64_t     hash;
        name         creator;
        uint64_t     round = 0;
        uint64_t     createdAt;

        uint64_t primary_key() const { return hash; }
        //name     by_creator() const { return creator; }
        uint64_t by_round() const { return round; }
    };
    typedef multi_index<"games"_n, games,
      //indexed_by<"creator"_n, const_mem_fun<games, name, &games::by_creator>>,
      indexed_by<"round"_n, const_mem_fun<games, uint64_t, &games::by_round>>> gamestable;

    struct [[eosio::table]] bets
    {
        uint64_t      key;
        name          better;
        uint64_t      hash;
        asset         wager;
        asset         deposit;
        asset         requestedPayout;
        bool          accepted;
        uint64_t      createdAt;

        uint64_t primary_key() const { return key; }
        //name by_better() const { return better; }
        uint64_t by_hash() const {return hash; }
    };
    typedef multi_index<"bets"_n, bets,
    //indexed_by<"better"_n, const_mem_fun<bets, name, &bets::by_better>>,
    indexed_by<"hash"_n, const_mem_fun<bets, uint64_t, &bets::by_hash>>> betstable;

    // NOTE: For leaderboards, history, trust, etc...
    struct [[eosio::table]] players
    {
        name          player;
        uint64_t      roundsPlayed;
        uint64_t      totalBetsPlaced;
        uint64_t      createdAt;

        name primary_key() const { return player; }
    };
    typedef multi_index<"players"_n, players> playerstable;

    //// local instances of the multi indexes
    gamestable    _games;
    betstable     _bets;
    playerstable  _players;
};
