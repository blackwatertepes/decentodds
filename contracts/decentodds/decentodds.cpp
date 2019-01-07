#include "decentodds.hpp"

// public methods exposed via the ABI

void decentodds::version() {
    print("DecentOdds version 0.0.0");
};

void decentodds::creategame(name creator, uint64_t hash) {
    require_auth(creator);

    _games.emplace(get_self(), [&](auto& p) {
        p.hash = hash;
        p.creator = creator;
        p.round = 0;
        p.createdAt = 0; // TODO
    });
};

void decentodds::deletegame(uint64_t hash) {
    // TODO: require_auth(gameowner)

    // TODO: Require game to have no open bets
    auto itr = _games.find(hash);
    if (itr != _games.end()) {
        _games.erase(itr);
    }
};

void decentodds::bet(uint64_t hash, name better, asset wager, asset deposit) {
    require_auth(better);

    // TODO: Transfer funds for wager & deposit

    // TODO: Check if a bet already exists
    // If yes, modify
    // Otherwise, create new bet...
    _bets.emplace(get_self(), [&](auto& p) {
        p.key = _bets.available_primary_key();
        p.hash = hash;
        p.better = better;
        p.wager = wager;
        p.deposit = deposit;
        //p.requestedPayout = 0;
        p.accepted = 0;
        p.createdAt = 0; // TODO
    });
};

void decentodds::acceptbet(uint64_t key) {
    // TODO: require_auth(game.creator)

    auto itr = _bets.find(key);
    if (itr != _bets.end()) {
        _bets.modify(itr, get_self(), [&](auto& p) {
            p.accepted = 1;
        });
    }
};

void decentodds::askpayout(uint64_t key, asset payout) {
    // TODO: require_auth(bet.better);

    // TODO...
    // Once all players who have bet, have reported...
    // And, the balance of all resolved assets is equal to the pot...
    // Then, resolve the round

    auto itr = _bets.find(key);
    if (itr != _bets.end()) {
        _bets.modify(itr, get_self(), [&](auto& p) {
            p.requestedPayout = payout;
        });
    }
};

void decentodds::blowupgame(uint64_t hash) {
    // TODO: require_auth(game admin)

    auto itr = _games.find(hash);
    if (itr != _games.end()) {
        _games.erase(itr);
    }
};

EOSIO_DISPATCH( decentodds, (version)(creategame)(deletegame)(acceptbet)(bet)(askpayout)(blowupgame))
