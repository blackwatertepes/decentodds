#include "decentodds.hpp"

// public methods exposed via the ABI

void decentodds::version() {
    print("DecentOdds version 0.0.0");
};

void decentodds::creategame(name creator, uint64_t gametypekey, checksum256 hash) {
    require_auth(creator);

    _games.emplace(get_self(), [&](auto& p) {
        p.key = _games.available_primary_key();
        p.gametypekey = gametypekey;
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
        if (item.gamekey == key && item.accepted == 1) {
            print("Open bets exists!");
            return;
        }
    }

    auto itr = _games.find(key);
    if (itr != _games.end()) {
        _games.erase(itr);
    }

    for(auto& item : _bets) {
        if (item.gamekey == key) {
            // TODO: Transfer funds to better
            // TODO: _bets.erase(item.key);
        }
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
    for(auto& item : _bets) {
        if (item.key == key) {
            // NOTE: Only the better can reveal
            require_auth(item.better);
        }
    }

    auto itr = _bets.find(key);
    if (itr != _bets.end()) {
        _bets.modify(itr, get_self(), [&](auto& p) {
            p.secret = secret;
        });
    }
};

void decentodds::acceptbet(uint64_t key) {
    for(auto& bet : _bets) {
        if (bet.key == key) {
            // TODO: Only the game creator can accept the bet
            /*
            for(auto& game : _games) {
                if (game.key = bet.gamekey) {
                    require_auth(game.better);
                }
            }
            */
        }
    }

    auto itr = _bets.find(key);
    if (itr != _bets.end()) {
        _bets.modify(itr, get_self(), [&](auto& p) {
            p.accepted = 1;
        });
    }
};

void decentodds::askpayout(uint64_t key, asset payout) {
    for(auto& item : _bets) {
        if (item.key == key) {
            // NOTE: Only the better can ask for a payout
            require_auth(item.better);
        }
    }

    auto itr = _bets.find(key);
    if (itr != _bets.end()) {
        _bets.modify(itr, get_self(), [&](auto& p) {
            p.requestedPayout = payout;
        });
    }

    // NOTE: Check to see if all bets have been ask for payout, and the sum is == to the pot
    /*
    // assign gamekey
    // assign pot
    // assign asksum
    for(auto& item : _bets) {
      if (item.gamekey == gamekey) {
          if (!item.requestedPayout) {
              print("Bet has yet to be resolved!");
              return;
          }

          pot += item.wager;
          asksum += item.requestedPayout;
      }
    }

    if (pot != sum) {
       print("Pot not yet 100% accounted for!");
       return;
    }

    for(auto& item : _bets) {
        if (item.gamekey == gamekey) {
            // TODO: Transfer funds
        }
    }
    */

    // TODO: Erase all bets
};

void decentodds::blowupgame(uint64_t key) {
    // NOTE: Only the contract owner can blowup games...
    require_auth(_self);

    // TODO: Transfer funds to contract owner, and delete bets

    auto itr = _games.find(key);
    if (itr != _games.end()) {
        _games.erase(itr);
    }

    // TODO: Delete all bets associated with game
};

void decentodds::creategametype(checksum256 hash) {
    require_auth(_self);

    _games.emplace(get_self(), [&](auto& p) {
        p.key = _games.available_primary_key();
        p.hash = hash;
        p.createdAt = current_time();
    });
};

void decentodds::deletegametype(uint64_t key) {
    require_auth(_self);

    auto itr = _gametypes.find(key);
    if (itr != _gametypes.end()) {
        _gametypes.erase(itr);
    }
};

EOSIO_DISPATCH( decentodds, (version)(creategame)(deletegame)(acceptbet)(bet)(unbet)(reveal)(askpayout)(blowupgame)(creategametype)(deletegametypes))
