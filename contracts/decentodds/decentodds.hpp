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
    [[eosio::action]] void bet(uint64_t hash, uint64_t gamehash, name better, asset wager, asset deposit);
    [[eosio::action]] void unbet(uint64_t hash);
    [[eosio::action]] void reveal(uint64_t hash, uint64_t secret);
    [[eosio::action]] void askpayout(uint64_t hash, asset payout);
    // NOTE: Admin methods...
    [[eosio::action]] void blowupgame(uint64_t hash); // Fix unresolved games, by collecting all outstanding bets, and erasing the game...

    //private: -- not private so the cleos get table call can see the table data.

    struct [[eosio::table]] games
    {
        uint64_t     hash;
        name         creator;
        uint32_t     round = 0;
        uint32_t     createdAt;

        uint64_t primary_key() const { return hash; }
        //name     by_creator() const { return creator; }
    };
    typedef multi_index<"games"_n, games> gamestable;
      //indexed_by<"creator"_n, const_mem_fun<games, name, &games::by_creator>>> gamestable;

    struct [[eosio::table]] bets
    {
        uint64_t      hash;
        name          better;
        uint64_t      gamehash;
        asset         wager;
        asset         deposit;
        asset         requestedPayout;
        bool          accepted;
        uint64_t      secret;
        uint32_t      createdAt;

        uint64_t primary_key() const { return hash; }
        //name by_better() const { return better; }
        //uint64_t by_gamehash() const {return gamehash; }
    };
    typedef multi_index<"bets"_n, bets> betstable;
    //indexed_by<"better"_n, const_mem_fun<bets, name, &bets::by_better>>,
    //indexed_by<"gamehash"_n, const_mem_fun<bets, uint64_t, &bets::by_gamehash>>> betstable;

    // NOTE: For leaderboards, history, trust, etc...
    struct [[eosio::table]] players
    {
        name          player;
        uint32_t      roundsPlayed;
        asset         totalBetsPlaced;
        uint32_t      createdAt;

        name primary_key() const { return player; }
    };
    typedef multi_index<"players"_n, players> playerstable;

    //// local instances of the multi indexes
    gamestable    _games;
    betstable     _bets;
    playerstable  _players;
};
