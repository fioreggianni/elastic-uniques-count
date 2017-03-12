String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length === 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return (hash >>> 0).toString(2);
};

if (!Object.keys) {
    Object.keys = function (object) {
        var keys = [];

        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                keys.push(key);
            }
        }
    }
}

module.exports = {
  "hashToBits": function(key, seed) {
    var nMask = key * seed * 47000 / 16 + 15602;
    for (var nFlag = 0, nShifted = nMask, sMask = ""; nFlag < 32;
         nFlag++, sMask += String(nShifted >>> 31), nShifted <<= 1);
      return sMask;
  },
  "hashToBucket": function(key, seed, buckets) {
    return Math.round(key*seed) % buckets;
  },
  "countTrailingZeroes": function(h){
    var count = 0;
    for (var i=h.length-1; i>=0; i--) {
      if (h[i] == "0") count += 1
      else return count;
    }
    return count;
  },
  "median": function(array){
    var sorted = array.sort(function(a,b){ return (a||0)-(b||0); });
    var half = Math.floor(sorted.length/2);
    if (sorted.length % 2) return sorted[half];
    else return Math.floor((sorted[half-1] + sorted[half]) / 2.0);
  },
  "getRandomInt": function(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}