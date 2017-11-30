/* due to use of react-native-fs in actions/album.js, must mock to run tests */
jest.mock('react-native-fs', () => ({
  writeFile: jest.fn(() => Promise.resolve()),
  ExternalStorageDirectoryPath: 'package-path',
  DocumentDirectoryPath: 'RNFS_TEST_MOCK'
}));

jest.mock('react-native-mixpanel', () => ({
  track: jest.fn((tag) => Promise.resolve()),
  trackWithProperties: jest.fn((tag, properties) => Promise.resolve()),
  identify: jest.fn((id) => Promise.resolve())
}));
