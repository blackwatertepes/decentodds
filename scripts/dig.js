const ecc = require('eosjs-ecc');

/*
INFO: A test to determine how fast a typical laptop can hash
*/

let n = 1000000; // The number of strings to hash
let p = 100000; // How often we print to screen

while(n > 0) {
  let hash = ecc.sha256(n.toString() + ' foo');
  if (n % p == 0) { console.log(hash) }
  n--;
}

console.log("DONE");
