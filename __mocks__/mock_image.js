export default class MockImage {

  getSize = jest.fn((uri, callback) => {
    callback(9, 1);
  });
}
