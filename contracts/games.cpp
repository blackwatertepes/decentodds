#include "games.hpp"

// note we are explcit in our use of eosio library functions
// note we liberally use print to assist in debugging

// public methods exposed via the ABI

void games::version() {
    //eosio::print("YouVote version  0.22");
};

void games::addpoll(name s, uint64_t pollName) {
    // require_auth(s);

    //eosio::print("Add poll ", pollName);

    // update the table to include a new poll
    _games.emplace(get_self(), [&](auto& p) {
        p.ipfsHash = pollName;
        p.round = 0;
        p.option = "";
        p.count = 0;
    });
}

void games::rmpoll(name s, uint64_t pollName) {
    //require_auth(s);

    //eosio::print("Remove poll ", pollName);

    std::vector<uint64_t> keysForDeletion;
    // find items which are for the named poll
    for(auto& item : _games) {
        if (item.ipfsHash == pollName) {
            keysForDeletion.push_back(item.ipfsHash);
        }
    }

    // now delete each item for that poll
    for (uint64_t key : keysForDeletion) {
        //eosio::print("remove from _polls ", key);
        auto itr = _games.find(key);
        if (itr != _games.end()) {
            _games.erase(itr);
        }
    }


    // add remove players ... don't need it the axtions are permanently stored on the block chain

    std::vector<uint64_t> keysForDeletionFromVotes;
    // find items which are for the named poll
    for(auto& item : _players) {
        if (item.name == pollName) {
            keysForDeletionFromVotes.push_back(item.name);
        }
    }

    // now delete each item for that poll
    for (uint64_t key : keysForDeletionFromVotes) {
        //eosio::print("remove from _players ", key);
        auto itr = _players.find(key);
        if (itr != _players.end()) {
            _players.erase(itr);
        }
    }
}

void games::status(uint64_t pollName) {
    //eosio::print("Change poll status ", pollName);

    std::vector<uint64_t> keysForModify;
    // find items which are for the named poll
    for(auto& item : _games) {
        if (item.ipfsHash == pollName) {
            keysForModify.push_back(item.ipfsHash);
        }
    }

    // now get each item and modify the status
    for (uint64_t key : keysForModify) {
        //eosio::print("modify _polls status", key);
        auto itr = _games.find(key);
        if (itr != _games.end()) {
            _games.modify(itr, get_self(), [&](auto& p) {
                p.round = p.round + 1;
            });
        }
    }
}

void games::statusreset(uint64_t pollName) {
    //eosio::print("Reset poll status ", pollName);

    std::vector<uint64_t> keysForModify;
    // find all poll items
    for(auto& item : _games) {
        if (item.ipfsHash == pollName) {
            keysForModify.push_back(item.ipfsHash);
        }
    }

    // update the status in each poll item
    for (uint64_t key : keysForModify) {
        //eosio::print("modify _polls status", key);
        auto itr = _games.find(key);
        if (itr != _games.end()) {
            _games.modify(itr, get_self(), [&](auto& p) {
                p.round = 0;
            });
        }
    }
}


void games::addpollopt(uint64_t pollName, std::string option) {
    //eosio::print("Add poll option ", pollName, "option ", option);

    // find the pollId, from _polls, use this to update the _polls with a new option
    for(auto& item : _games) {
        if (item.ipfsHash == pollName) {
            // can only add if the poll is not started or finished
            if(item.round == 0) {
                _games.emplace(get_self(), [&](auto& p) {
                    p.ipfsHash = item.ipfsHash;
                    p.round = 0;
                    p.option = option;
                    p.count = 0;});
            }
            else {
                //eosio::print("Can not add poll option ", pollName, "option ", option, " Poll has started or is finished.");
            }

            break; // so you only add it once
        }
    }
}

void games::rmpollopt(uint64_t pollName, std::string option)
{
    //eosio::print("Remove poll option ", pollName, "option ", option);

    std::vector<uint64_t> keysForDeletion;
    // find and remove the named poll
    for(auto& item : _games) {
        if (item.ipfsHash == pollName) {
            keysForDeletion.push_back(item.ipfsHash);
        }
    }

    for (uint64_t key : keysForDeletion) {
        //eosio::print("remove from _polls ", key);
        auto itr = _games.find(key);
        if (itr != _games.end()) {
            if (itr->option == option) {
                _games.erase(itr);
            }
        }
    }
}


void games::vote(uint64_t pollName, std::string option, uint64_t accountName)
{
    //eosio::print("vote for ", option, " in poll ", pollName, " by ", accountName);

    // is the poll open
    for(auto& item : _games) {
        if (item.ipfsHash == pollName) {
            if (item.round != 1) {
                //eosio::print("Poll ",pollName,  " is not open");
                return;
            }
            break; // only need to check status once
        }
    }

    // has account name already voted?
    for(auto& vote : _players) {
        if (vote.name == pollName && vote.name == accountName) {
            //eosio::print(accountName, " has already voted in poll ", pollName);
            //eosio_assert(true, "Already Voted");
            return;
        }
    }

    // find the poll and the option and increment the count
    for(auto& item : _games) {
        if (item.ipfsHash == pollName && item.option == option) {
            _games.modify(item, get_self(), [&](auto& p) {
                p.count = p.count + 1;
            });
        }
    }

    // record that accountName has voted
    _players.emplace(get_self(), [&](auto& pv){
        pv.gameId = pollName;
        pv.name = accountName;
    });
}


EOSIO_DISPATCH( games, (version)(addpoll)(rmpoll)(status)(statusreset)(addpollopt)(rmpollopt)(vote))
