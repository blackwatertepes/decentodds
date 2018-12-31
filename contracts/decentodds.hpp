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
    [[eosio::action]] void creategame(name s, uint64_t ipfsHash, uint64_t accountName);
    [[eosio::action]] void deletegame(name s, uint64_t ipfsHash);
    [[eosio::action]] void acceptbet(name s, uint64_t gameId, uint64_t accountNameBetter);
    // NOTE: Player methods...
    [[eosio::action]] void bet(name s, uint64_t gameId, uint64_t accountName, asset wager, asset deposit);
    [[eosio::action]] void requestpayout(name s, uint64_t gameId, asset payout);
    // NOTE: Admin methods...
    [[eosio::action]] void blowupgame(name s, uint64_t gameId); // Fix unresolved games, by collecting all outstanding bets, and erasing the game...

    //private: -- not private so the cleos get table call can see the table data.

    struct [[eosio::table]] games
    {
        uint64_t     ipfsHash;
        uint64_t     round =0;
        uint64_t     createdAt;

        uint64_t primary_key() const { return ipfsHash; }
        uint64_t by_round() const {return round; }
    };
    typedef multi_index<"games"_n, games, indexed_by<"ipfshash"_n, const_mem_fun<games, uint64_t, &games::by_round>>> gamestable;

    struct [[eosio::table]] bets
    {
        uint64_t      accountName;
        uint64_t      gameId;
        asset         wager;
        asset         deposit;
        asset         requestedPayout;
        bool          accepted;
        uint64_t      createdAt;

        uint64_t primary_key() const { return accountName; }
        uint64_t by_gameId() const {return gameId; }
    };
    typedef multi_index<"bets"_n, bets, indexed_by<"gameid"_n, const_mem_fun<bets, uint64_t, &bets::by_gameId>>> betstable;

    // NOTE: For leaderboards, history, trust, etc...
    struct [[eosio::table]] players
    {
        uint64_t      accountName;
        uint64_t      roundsPlayed;
        uint64_t      totalBetsPlaced;
        uint64_t      createdAt;

        uint64_t primary_key() const { return accountName; }
    };
    typedef multi_index<"players"_n, players> playerstable;

    //// local instances of the multi indexes
    gamestable    _games;
    betstable     _bets;
    playerstable  _players;
};
