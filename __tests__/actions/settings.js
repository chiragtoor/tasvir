import * as Actions from '../../js/actions/settings';
import MockAsyncStorage from '../../__mocks__/mock_async_storage';

import { AUTO_SHARE_STORAGE, IDFV_STORAGE } from '../../js/constants';

describe('settings_actions', () => {
  afterEach(() => {
    jest.resetModules();
  });

  it('updateAutoShare() dispatches UPDATE_SETTINGS_AUTO_SHARE', async () => {
    const AsyncStorage = new MockAsyncStorage({});
    jest.setMock('AsyncStorage', AsyncStorage);

    expect(Actions.updateAutoShare(true)).toEqual({
      type: Actions.UPDATE_SETTINGS_AUTO_SHARE,
      autoShare: true
    });
    await expect(AsyncStorage.getItem(AUTO_SHARE_STORAGE)).resolves.toBe(JSON.stringify(true));

    expect(Actions.updateAutoShare(false)).toEqual({
      type: Actions.UPDATE_SETTINGS_AUTO_SHARE,
      autoShare: false
    });
    await expect(AsyncStorage.getItem(AUTO_SHARE_STORAGE)).resolves.toBe(JSON.stringify(false));
  });

  it('updateIDFV() dispatches UPDATE_SETTINGS_IDFV', async () => {
    const AsyncStorage = new MockAsyncStorage({});
    jest.setMock('AsyncStorage', AsyncStorage);

    const idfv = "idfv";
    expect(Actions.updateIDFV(idfv, true)).toEqual({
      type: Actions.UPDATE_SETTINGS_IDFV,
      idfv
    });
    await expect(AsyncStorage.getItem(IDFV_STORAGE)).resolves.toBe(JSON.stringify(idfv));

    expect(Actions.updateIDFV("other idfv", false)).toEqual({
      type: Actions.UPDATE_SETTINGS_IDFV,
      idfv: "other idfv"
    });
    await expect(AsyncStorage.getItem(IDFV_STORAGE)).resolves.toBe(JSON.stringify(idfv));
  });
});
