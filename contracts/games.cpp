#include "games.hpp"

void games::creategame(uint64_t ipfs_hash, name account_name) {
    require_auth(account_name);

    _games.emplace(get_self(), [&](auto& game) {
        game.ipfs_hash = ipfs_hash;
        game.round = 0;
        game.created_at = now();
    });

    _players.emplace(get_self(), [&](auto& player) {
        player.account_name = account_name;
        player.game_id = game_id;
    });
}

void games::entergame(uint64_t game_id, name account_name) {
    require_auth(account_name);

    auto iter = _games.find(game_id);
    eosio_assert(iter != _games.end(), "Game not found!");

    _players.emplace(get_self(), [&](auto& player) {
        player.account_name = account_name;
        player.game_id = game_id;
    });
}

void games::leavegame(uint64_t game_id, name account_name) {
    require_auth(account_name);

    auto gameIter = _games.find(game_id);
    eosio_assert(gameIter != _games.end(), "Game not found!");

    auto playerIter = _players.find(account_name);
    eosio_assert(playerIter != _players.end(), "No player found!");

    _games.erase(gameIter);
    _players.erase(playerIter);
}

EOSIO_DISPATCH(games, (creategame)(entergame)(leavegame))
