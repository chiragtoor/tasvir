/*
 * Used in tests to mock react-native AsyncStorage library
 *
 * Mimics storage by keeping in memory key-value storage, mimics Promises
 *  just like the real library returns
 * Only implements the functions we use, setItem, getItem, multiGet
 */

export default class MockDeviceInfo {
  constructor(senderId) {
    this.senderId = senderId;
  }

  getUniqueID = jest.fn((photo) => {
    return this.senderId;
  });

}
