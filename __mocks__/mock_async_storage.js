/*
 * Used in tests to mock react-native AsyncStorage library
 *
 * Mimics storage by keeping in memory key-value storage, mimics Promises
 *  just like the real library returns
 * Only implements the functions we use, setItem, getItem, multiGet
 */

export default class MockAsyncStorage {
  constructor(cache) {
    this.storageCache = cache;
  }

  setItem = jest.fn((key, value) => {
    return new Promise((resolve, reject) => {
      return (typeof key !== 'string' || typeof value !== 'string')
        ? reject(new Error('key and value must be string'))
        : resolve(this.storageCache[key] = value);
    });
  });

  getItem = jest.fn((key) => {
    return new Promise((resolve) => {
      return this.storageCache.hasOwnProperty(key)
        ? resolve(this.storageCache[key])
        : resolve(null);
    });
  });

  multiGet = jest.fn((keys) => {
    return new Promise((resolve) => {
      let pulledValues = [];
      for (i in keys) {
        var key = keys[i];
        if(this.storageCache[key]) {
          pulledValues.push([key, this.storageCache[key]]);
        }
      }
      return resolve(pulledValues);
    })
  });
}
