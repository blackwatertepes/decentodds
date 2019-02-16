function getRandom() {
  // INFO: The maximum number of cards that can be drawn randomly from MAX_SAFE_INTEGER is 8 (ie, 52**8)
  // TODO: Account for xor'ing number into a number larger than MAX_SAFE_INTEGER
  const min = 52**8
  const max = 52**9
  const range = max - min
  const rand = Math.random() * range
  const normalized_random = rand + min
  return Math.floor(normalized_random)
}

function xor(nums) {
  if (nums.length == 0) return 0
  return nums.reduce((acc, cur) => { return acc ^ cur })
}

module.exports ={
  getRandom,
  xor
}
