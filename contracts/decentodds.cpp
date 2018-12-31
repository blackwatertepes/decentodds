#include "decentodds.hpp"

// public methods exposed via the ABI

void decentodds::version() {
    //eosio::print("YouVote version  0.22");
};

void decentodds::creategame(name s, uint64_t ipfsHash, uint64_t accountName) {
    // require_auth(s);

    _games.emplace(get_self(), [&](auto& p) {
        p.ipfsHash = ipfsHash;
        p.round = 0;
        p.createdAt = 0;
    });
}

void decentodds::deletegame(name s, uint64_t gameId) {
    //require_auth(s);
}

void decentodds::acceptbet(name s, uint64_t gameId, uint64_t accountNameBetter) {
    //require_auth(s);
}

void decentodds::bet(name s, uint64_t gameId, uint64_t accountName, asset wager, asset deposit) {
    //require_auth(s);
}

void decentodds::requestpayout(name s, uint64_t gameId, asset payout) {
    //require_auth(s);

    // Once all players who have bet, have reported...
    // And, the balance of all resolved assets is equal to the pot...
    // Then, resolve the round
}

void decentodds::blowupgame(name s, uint64_t gameId) {
    require_auth(s);
}

//EOSIO_DISPATCH( decentodds, (version)(creategame)(deletegame)(acceptbet)(bet)(requestpayout)(blowupgame))
