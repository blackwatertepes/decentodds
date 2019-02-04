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
    [[eosio::action]] void creategame(name creator, checksum256 hash);
    [[eosio::action]] void deletegame(uint64_t key);
    [[eosio::action]] void acceptbet(uint64_t key);
    // NOTE: Player methods...
    [[eosio::action]] void bet(checksum256 hash, uint64_t gamekey, name better, asset wager, asset deposit);
    [[eosio::action]] void unbet(uint64_t key);
    [[eosio::action]] void reveal(uint64_t key, checksum256 secret);
    [[eosio::action]] void askpayout(uint64_t key, asset payout); // TODO: Finish, once we have true p2p
    // NOTE: Admin methods...
    [[eosio::action]] void paybet(uint64_t key, asset amount); // NOTE: Needed, until we have true p2p
    [[eosio::action]] void blowupgame(uint64_t key); // Fix unresolved games, by collecting all outstanding bets, and erasing the game...

    //private: -- not private so the cleos get table call can see the table data.

    struct [[eosio::table]] games
    {
        uint64_t     key;
        checksum256  hash;
        name         creator;
        uint32_t     round;
        uint64_t     createdAt;

        uint64_t      primary_key() const { return key; }
        //checksum256   by_hash() const { return hash; }
        //name        by_creator() const { return creator; }
    };
    typedef multi_index<"games"_n, games> gamestable;
      //indexed_by<"hash"_n, const_mem_fun<games, name, &games::by_hash>>> gamestable;
      //indexed_by<"creator"_n, const_mem_fun<games, name, &games::by_creator>>> gamestable;

    struct [[eosio::table]] bets
    {
        uint64_t      key;
        checksum256   hash;
        name          better;
        uint64_t      gamekey;
        asset         wager;
        asset         deposit;
        bool          accepted;
        asset         requestedPayout;
        checksum256   secret;
        uint64_t      createdAt;

        uint64_t primary_key() const { return key; }
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
        uint64_t      createdAt;

        name primary_key() const { return player; }
    };
    typedef multi_index<"players"_n, players> playerstable;

    //// local instances of the multi indexes
    gamestable    _games;
    betstable     _bets;
    playerstable  _players;
};
