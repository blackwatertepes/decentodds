#include <eosiolib/eosio.hpp>
#include <eosiolib/print.hpp>

using namespace eosio;
using namespace std;

class [[eosio::contract]] games : public contract {

  private:

    struct [[eosio::table]] game {
        uint64_t ipfs_hash;
        uint16_t round;
        uint64_t created_at;

        uint64_t primary_key() const { return ipfs_hash; }
        uint64_t by_round() const { return round; }
    };

    typedef multi_index<name("game"), game,
      indexed_by<name("round"), const_mem_fun<game, uint64_t, &game::by_round>>
    > games_table;

    struct [[eosio::table]] player {
        uint64_t account_name;
        uint64_t game_id;

        uint64_t primary_key() const { return account_name; }
        uint64_t by_game_id() const { return game_id; }
    };

    typedef multi_index<name("player"), player,
      indexed_by<name("game_id"), const_mem_fun<player, uint64_t, &player::by_game_id>>
    > players_table;

  public:

    games_table _games;
    players_table _players;

    uint8_t version = 0;

    [[eosio::action]] void creategame(uint64_t ipfs_hash, name account_name);
    [[eosio::action]] void entergame(uint64_t game_id, name account_name);
    [[eosio::action]] void leavegame(uint64_t game_id, name account_name);
};
