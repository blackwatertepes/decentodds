#include "decentodds.hpp"

// public methods exposed via the ABI

void decentodds::version() {
    print("DecentOdds version 0.0.0");
};

void decentodds::creategame(name creator, checksum256 hash) {
    require_auth(creator);

    _games.emplace(get_self(), [&](auto& p) {
        p.key = _games.available_primary_key();
        p.hash = hash;
        p.creator = creator;
        p.round = 0;
        p.createdAt = current_time();
    });
};

void decentodds::deletegame(uint64_t key) {
    // NOTE: Require auth from the game creator...
    for(auto& item : _games) {
    if (item.key == key) {
            require_auth(item.creator);
        }
    }

    // NOTE: Game can not have any open bets...
    for(auto& item : _bets) {
        if (item.gamekey == key) {
            print("Bets exists!");
            return;
        }
    }

    auto itr = _games.find(key);
    if (itr != _games.end()) {
        _games.erase(itr);
    }
};

void decentodds::bet(checksum256 hash, uint64_t gamekey, name better, asset wager, asset deposit) {
    require_auth(better);

    // NOTE: First, make sure the game exists...
    auto itr = _games.find(gamekey);
    if (itr == _games.end()) {
        print("No game found!");
        return; // No Game Found!
    }

    // NOTE: If the bet already exists, exit...
    for(auto& item : _bets) {
        if (item.gamekey == gamekey && item.better == better) {
            print("Bet already exists!");
            return;
        }
    }

    // TODO: Transfer funds for wager & deposit

    // NOTE: Otherwise, create new bet...
    _bets.emplace(get_self(), [&](auto& p) {
        p.key = _bets.available_primary_key();
        p.hash = hash;
        p.gamekey = gamekey;
        p.better = better;
        p.wager = wager;
        p.deposit = deposit;
        p.accepted = 0;
        //p.requestedPayout = 0;
        //p.secret;
        p.createdAt = current_time();
    });
};

void decentodds::unbet(uint64_t key) {
    for(auto& item : _bets) {
        if (item.key == key) {
            // NOTE: Only the better can unbet
            require_auth(item.better);

            // NOTE: Accepted bets can be unbet
            if (item.accepted == 1) {
              print("Bet has already been accepted!");
              return;
            }
        }
    }

    // TODO: Transfer funds for wager & deposit

    auto itr = _bets.find(key);
    if (itr != _bets.end()) {
        _bets.erase(itr);
    }
};

void decentodds::reveal(uint64_t key, checksum256 secret) {
    // TODO: Update the bet with the secret
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

void decentodds::blowupgame(uint64_t key) {
    // NOTE: Only the contract owner can blowup games...
    require_auth(_self);

    auto itr = _games.find(key);
    if (itr != _games.end()) {
        _games.erase(itr);
    }
};

EOSIO_DISPATCH( decentodds, (version)(creategame)(deletegame)(acceptbet)(bet)(unbet)(reveal)(askpayout)(blowupgame))
