const { getRandom, xor } = require('../src/helpers/random');

let count = 10000000;
//        10,000,000
let map = {low: 0, high: 0};

while(count > 0) {
  let randA = getRandom();
  let randB = getRandom();
  let rand = Math.abs(xor([randA, randB]));
  if(rand < 52**2) {
    console.log("Rand:", rand);
    map.low++;
  }
  if(rand > 52**6) {
    map.high++;
  }
  count--;
}

console.log(map);
