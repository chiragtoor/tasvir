/*
 * Used in tests to mock react-native AsyncStorage library
 *
 * Mimics storage by keeping in memory key-value storage, mimics Promises
 *  just like the real library returns
 * Only implements the functions we use, setItem, getItem, multiGet
 */

export default class MockCameraRoll {
  constructor() {
    this.cameraRoll = [];
  }

  saveToCameraRoll = jest.fn((photo) => {
    return new Promise((resolve, reject) => {
      const entry = { node: { image: { uri: photo } } };
      return (typeof photo !== 'string')
        ? reject(new Error('photo must be string'))
        : resolve(this.cameraRoll = [entry, ...this.cameraRoll]);
    });
  });

  getPhotos = jest.fn(() => {
    return new Promise((resolve, reject) => {
      resolve({ edges: this.cameraRoll });
    });
  });

}
