/*
 * Used in tests to mock react-native AsyncStorage library
 *
 * Mimics storage by keeping in memory key-value storage, mimics Promises
 *  just like the real library returns
 * Only implements the functions we use, setItem, getItem, multiGet
 */

export default class MockCameraRoll {
  constructor(roll = []) {
    this.cameraRoll = roll.map((photo) => this.buildEntry(photo));
  }

  saveToCameraRoll = jest.fn((photo) => {
    return new Promise((resolve, reject) => {
      this.cameraRoll = [this.buildEntry(photo), ...this.cameraRoll]
      resolve(photo);
    });
  });

  getPhotos = jest.fn(() => {
    return new Promise((resolve, reject) => {
      resolve({ edges: this.cameraRoll });
    });
  });

  buildEntry(photo) {
    return { node: { image: { uri: photo, width: 9, height: 16 } } };
  }

}
