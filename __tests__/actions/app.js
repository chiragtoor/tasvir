import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as Actions from '../../js/actions/app';
import * as Album from '../../js/actions/album';
import MockAsyncStorage from '../../__mocks__/mock_async_storage';

import { AUTO_SHARE_STORAGE, SENDER_ID_STORAGE, CLOSE_ALBUM_ROUTE,
         NAVIGATION_ACTION, NAVIGATION_BACK_ACTION, ALBUM_ID_STORAGE,
         ALBUM_NAME_STORAGE, ALBUM_LINK_STORAGE } from '../../js/constants';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

describe('app_actions', () => {
  afterEach(() => {
    jest.resetModules();
  });

  it('updateAutoShare() dispatches APP_UPDATE_AUTO_SHARE', async () => {
    const AsyncStorage = new MockAsyncStorage({});
    jest.setMock('AsyncStorage', AsyncStorage);

    expect(Actions.updateAutoShare(true)).toEqual({
      type: Actions.APP_UPDATE_AUTO_SHARE,
      autoShare: true
    });
    await expect(AsyncStorage.getItem(AUTO_SHARE_STORAGE)).resolves.toBe(JSON.stringify(true));

    expect(Actions.updateAutoShare(false)).toEqual({
      type: Actions.APP_UPDATE_AUTO_SHARE,
      autoShare: false
    });
    await expect(AsyncStorage.getItem(AUTO_SHARE_STORAGE)).resolves.toBe(JSON.stringify(false));
  });

  it('updateSenderId() dispatches APP_UPDATE_SENDER_ID', async () => {
    const AsyncStorage = new MockAsyncStorage({});
    jest.setMock('AsyncStorage', AsyncStorage);

    const senderId = "unique id";
    expect(Actions.updateSenderId(senderId, true)).toEqual({
      type: Actions.APP_UPDATE_SENDER_ID,
      senderId
    });
    await expect(AsyncStorage.getItem(SENDER_ID_STORAGE)).resolves.toBe(JSON.stringify(senderId));

    expect(Actions.updateSenderId("other id", false)).toEqual({
      type: Actions.APP_UPDATE_SENDER_ID,
      senderId: "other id"
    });
    await expect(AsyncStorage.getItem(SENDER_ID_STORAGE)).resolves.toBe(JSON.stringify(senderId));
  });

  it('loadSavedPhotos() dispatches APP_LOAD_SAVED_PHOTOS', () => {
    const savedPhotos = ["photo one", "photo two"];
    expect(Actions.loadSavedPhotos(savedPhotos)).toEqual({
      type: Actions.APP_LOAD_SAVED_PHOTOS,
      savedPhotos
    });
  });

  it('addSavedPhoto() dispatches APP_ADD_SAVED_PHOTO', () => {
    const photo = "photo";
    expect(Actions.addSavedPhoto(photo)).toEqual({
      type: Actions.APP_ADD_SAVED_PHOTO,
      photo
    });
  });

  it('openAlbumForm() dispatches APP_UPDATE_ALBUM_FORM_STATE', () => {
    expect(Actions.openAlbumForm()).toEqual({
      type: Actions.APP_OPEN_ALBUM_FORM
    });
  });

  it('resetAlbumForm() dispatches APP_UPDATE_ALBUM_FORM_STATE', () => {
    expect(Actions.resetAlbumForm()).toEqual({
      type: Actions.APP_RESET_ALBUM_FORM
    });
  });

  it('closeAlbum() dispatches NAVIGATION_ACTION', () => {
    const store = mockStore({});
    store.dispatch(Actions.closeAlbum());
    expect(store.getActions()).toEqual([
      { type: NAVIGATION_ACTION, routeName: CLOSE_ALBUM_ROUTE }
    ]);
  });

  it('confirmCloseAlbum() dispatches NAVIGATION_ACTION', async () => {
    const store = mockStore({ album: { id: "album id", name: "some album", link: "some link" } });

    const AsyncStorage = new MockAsyncStorage({});
    jest.setMock('AsyncStorage', AsyncStorage);

    const mockAction = { type: "MOCK_ACTION" };
    Actions.joinChannel = jest.fn(() => {
      return mockAction;
    });

    store.dispatch(Actions.confirmCloseAlbum());
    expect(store.getActions()).toEqual([
      { type: Album.RESET_ALBUM },
      { type: NAVIGATION_BACK_ACTION }
    ]);

    await expect(AsyncStorage.getItem(ALBUM_ID_STORAGE)).resolves.toBe(JSON.stringify(null));
    await expect(AsyncStorage.getItem(ALBUM_NAME_STORAGE)).resolves.toBe(JSON.stringify(null));
    await expect(AsyncStorage.getItem(ALBUM_LINK_STORAGE)).resolves.toBe(JSON.stringify(null));
  });

  it('cancelCloseAlbum() dispatches NAVIGATION_BACK_ACTION', () => {
    const store = mockStore({});
    store.dispatch(Actions.cancelCloseAlbum());
    expect(store.getActions()).toEqual([
      { type: NAVIGATION_BACK_ACTION }
    ]);
  });
});