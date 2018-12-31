#include "games.hpp"

// public methods exposed via the ABI

void games::version() {
    //eosio::print("YouVote version  0.22");
};

void games::creategame(uint64_t ipfsHash, uint64_t accountName) {
    // require_auth(s);

    _games.emplace(get_self(), [&](auto& p) {
        p.ipfsHash = ipfsHash;
        p.round = 0;
        p.createdAt = 0;
    });
}

void games::joingame(uint64_t gameId, uint64_t accountName)
{
    // Only allow players to enter games that have not yet started...
    for(auto& item : _games) {
        if (item.ipfsHash == gameId) {
            if (item.round > 0) {
                return;
            }
            break;
        }
    }

    // Only one instance of each player at any given game...
    for(auto& player : _players) {
        if (player.name == accountName) {
            return;
        }
    }

    _players.emplace(get_self(), [&](auto& pv){
        pv.gameId = gameId;
        pv.name = accountName;
    });
}

void games::leavegame(uint64_t gameId, uint64_t accountName) {
    //require_auth(s);

    std::vector<uint64_t> keysForDeletion;
    for(auto& item : _games) {
        if (item.ipfsHash == gameId) {
            keysForDeletion.push_back(item.ipfsHash);
        }
    }

    // TODO: Only delete the game, when the last player has left
    for (uint64_t key : keysForDeletion) {
        auto itr = _games.find(key);
        if (itr != _games.end()) {
            _games.erase(itr);
        }
    }

    std::vector<uint64_t> keysForDeletionFromVotes;
    for(auto& item : _players) {
        if (item.gameId == gameId) {
            keysForDeletionFromVotes.push_back(item.gameId);
        }
    }

    // TODO: Prevent players from leaving games when they still have bets
    for (uint64_t key : keysForDeletionFromVotes) {
        auto itr = _players.find(key);
        if (itr != _players.end()) {
            _players.erase(itr);
        }
    }
}

void games::bet(uint64_t gameId, uint64_t accountName, asset balance) {
    //require_auth(s);

    // TODO: Increment the round, after all bets are finalized, not when bets are made
    /*
    for(auto& item : _games) {
        if (item.ipfsHash == pollName) {
            _games.modify(item, get_self(), [&](auto& p) {
                p.round = p.round + 1;
            });
        }
    }
    */
}

EOSIO_DISPATCH( games, (version)(creategame)(joingame)(leavegame)(bet))
