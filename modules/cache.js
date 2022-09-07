'use strict';

class Cache {
  constructor() {
    this.cache = {};
  }

  get(key) {
    if (this.isCached(key)) {
      this.cache[key].timeStamp = Date.now();
      return this.cache[key];
    } else return;
  }

  set(key, data) {
    this.cache[key] = {
      data: data,
      timeStamp: Date.now(),
    };
  }

  clear() {
    this.cache = {};
  }

  isCached(key) {
    return this.cache[key] ? true : false;
  }

  isExpired(key) {
    return (Date.now() - this.cache[key].timeStamp) > 3.6e+6 ? true : false;
  }
}

module.exports = {
  cache: new Cache()
};
