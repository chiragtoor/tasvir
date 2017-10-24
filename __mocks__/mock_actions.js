/*
 * Used in tests to mock phoenix socket
 *
 */

export default class MockActions {
  joinChannel = jest.fn(() => {
    console.log("IN MOCK FUN");
    return false;
  });
}
