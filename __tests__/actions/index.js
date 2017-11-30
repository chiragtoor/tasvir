import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as Actions from '../../js/actions';
import * as Album from '../../js/actions/album';
import * as AlbumChannel from '../../js/actions/album_channel';
import * as App from '../../js/actions/app';
import * as Reel from '../../js/actions/reel';
import * as Gallery from '../../js/actions/gallery';
import * as Confirmation from '../../js/actions/confirmation';
import * as TasvirApi from '../../js/actions/tasvir_api';
import MockAsyncStorage from '../../__mocks__/mock_async_storage';
import MockCameraRoll from '../../__mocks__/mock_camera_roll';
import DeviceInfo from 'react-native-device-info';

import { AUTO_SHARE_STORAGE, SENDER_ID_STORAGE,
         NAVIGATION_ACTION, NAVIGATION_BACK_ACTION, ALBUM_ID_STORAGE,
         ALBUM_NAME_STORAGE, ALBUM_LINK_STORAGE, ROUTES } from '../../js/constants';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

describe('index_actions', () => {
  afterEach(() => {
    jest.resetModules();
  });

  it('dispatches APP_UPDATE_SENDER_ID with save flag true when no senderId exists', async () => {
    const store = mockStore({});
    const senderId = "DKSN93-ASDFS";

    DeviceInfo.getUniqueID = jest.fn(() => {
      return "DKSN93-ASDFS";
    });
    const AsyncStorage = new MockAsyncStorage({});
    jest.setMock('AsyncStorage', AsyncStorage);

    await store.dispatch(Actions.loadAndDispatchState());
    expect(store.getActions()).toEqual([
      { type: App.SET_HISTORY, history: [] },
      { type: App.APP_UPDATE_SENDER_ID, senderId: senderId },
      { type: NAVIGATION_ACTION, routeName: ROUTES.WALKTHROUGH }
    ]);

    await expect(AsyncStorage.getItem(SENDER_ID_STORAGE)).resolves.toBe(JSON.stringify(senderId));
  });

  it('dispatches SET_HISTORY with the history from storage', async () => {
    const store = mockStore({ });
    const senderId = "DKSN93-ASDFS";
    DeviceInfo.getUniqueID = jest.fn(() => {
      return "DKSN93-ASDFS";
    });

    const history = [0, 1, 2];
    const AsyncStorage = new MockAsyncStorage({ albumHistory: JSON.stringify(history) });
    jest.setMock('AsyncStorage', AsyncStorage);

    await store.dispatch(Actions.loadAndDispatchState());
    expect(store.getActions()).toEqual([
      { type: App.SET_HISTORY, history: history },
      { type: App.APP_UPDATE_SENDER_ID, senderId: senderId },
      { type: NAVIGATION_ACTION, routeName: ROUTES.WALKTHROUGH }
    ]);

    await expect(AsyncStorage.getItem(SENDER_ID_STORAGE)).resolves.toBe(JSON.stringify(senderId));
  });

  it('dispatches APP_LOAD_SAVED_PHOTOS when previous saved photos exist', async () => {
    const store = mockStore({});
    const senderId = "DKSN93-ASDFS";
    DeviceInfo.getUniqueID = jest.fn(() => {
      return "DKSN93-ASDFS";
    });
    const savedPhotos = ["one", "two", "three"];

    const AsyncStorage = new MockAsyncStorage({ savedPhotos: JSON.stringify(savedPhotos) });
    jest.setMock('AsyncStorage', AsyncStorage);

    await store.dispatch(Actions.loadAndDispatchState());
    expect(store.getActions()).toEqual([
      { type: App.SET_HISTORY, history: [] },
      { type: App.APP_UPDATE_SENDER_ID, senderId: senderId },
      { type: App.APP_LOAD_SAVED_PHOTOS, savedPhotos: savedPhotos },
      { type: NAVIGATION_ACTION, routeName: ROUTES.WALKTHROUGH }
    ]);
  });

  it('dispatches NAVIGATION_ACTION to walkthrough initially', async () => {
    const store = mockStore({});
    const senderId = "DKSN93-ASDFS";
    DeviceInfo.getUniqueID = jest.fn(() => {
      return "DKSN93-ASDFS";
    });

    const AsyncStorage = new MockAsyncStorage({ });
    jest.setMock('AsyncStorage', AsyncStorage);

    await store.dispatch(Actions.loadAndDispatchState());
    expect(store.getActions()).toEqual([
      { type: App.SET_HISTORY, history: [] },
      { type: App.APP_UPDATE_SENDER_ID, senderId: senderId },
      { type: NAVIGATION_ACTION, routeName: ROUTES.WALKTHROUGH }
    ]);
  });

  it('dispatches NAVIGATION_ACTION to app if walkthrough completed, loads gallery', async () => {
    const store = mockStore({});
    const senderId = "DKSN93-ASDFS";
    DeviceInfo.getUniqueID = jest.fn(() => {
      return "DKSN93-ASDFS";
    });

    const AsyncStorage = new MockAsyncStorage({ walkthrough: JSON.stringify(true) });
    jest.setMock('AsyncStorage', AsyncStorage);
    const mockGalleryLoadAction = { type: Gallery.LOAD_IMAGES, data: "MOCK LOAD" };
    Gallery.loadGallery  = jest.fn((fun) => {
      return mockGalleryLoadAction;
    });

    await store.dispatch(Actions.loadAndDispatchState());
    expect(store.getActions()).toEqual([
      { type: App.SET_HISTORY, history: [] },
      { type: App.APP_UPDATE_SENDER_ID, senderId: senderId },
      mockGalleryLoadAction,
      { type: NAVIGATION_ACTION, routeName: ROUTES.MAIN }
    ]);
  });

  it('dispatches APP_UPDATE_AUTO_SHARE if setting is saved to true', async () => {
    const store = mockStore({});
    const senderId = "DKSN93-ASDFS";
    DeviceInfo.getUniqueID = jest.fn(() => {
      return "DKSN93-ASDFS";
    });

    const AsyncStorage = new MockAsyncStorage({ autoShare: JSON.stringify(true) });
    jest.setMock('AsyncStorage', AsyncStorage);

    await store.dispatch(Actions.loadAndDispatchState());
    expect(store.getActions()).toEqual([
      { type: App.SET_HISTORY, history: [] },
      { type: App.APP_UPDATE_SENDER_ID, senderId: senderId },
      { type: App.APP_UPDATE_AUTO_SHARE, autoShare: true },
      { type: NAVIGATION_ACTION, routeName: ROUTES.WALKTHROUGH }
    ]);
  });

  it('loads stored album state, joins channel, and syncs with endpoint if in album', async () => {
    // preload viewing album in state as in tests dispatches do not really update
    const viewingAlbum = {name: "album", image: { uri: "uri", width: 9, height: 16 }, images: [1, 2, 3], albumDate: "Jan. 1st, 2017"};
    const store = mockStore({album: viewingAlbum});
    const albumId = "some id";
    const albumName = "some name";
    const senderId = "DKSN93-ASDFS";
    DeviceInfo.getUniqueID = jest.fn(() => {
      return "DKSN93-ASDFS";
    });
    const albumDate = "Jan. 10th, 2017";

    const AsyncStorage = new MockAsyncStorage({ albumId: JSON.stringify(albumId),
                                                albumName: JSON.stringify(albumName),
                                                albumDate: JSON.stringify(albumDate)});
    jest.setMock('AsyncStorage', AsyncStorage);
    const mockJoinChannel = { type: "MOCK JOIN CHANNEL" };
    AlbumChannel.joinChannel  = jest.fn((fun) => {
      return mockJoinChannel;
    });
    const mockLoadAlbum = { type: "MOCK LOAD ALBUM" };
    TasvirApi.loadAlbum  = jest.fn((fun) => {
      return mockLoadAlbum;
    });

    await store.dispatch(Actions.loadAndDispatchState());
    expect(store.getActions()).toEqual([
      { type: App.SET_HISTORY, history: [] },
      { type: App.APP_UPDATE_SENDER_ID, senderId: senderId },
      { type: Album.UPDATE_ALBUM_ID, id: albumId },
      { type: Album.UPDATE_ALBUM_NAME, name: albumName },
      { type: Album.LOAD_ALBUM_DATE, albumDate: albumDate },
      { type: Gallery.SET_VIEWING_ALBUM, album: viewingAlbum },
      { type: App.SET_GALLERY_STATE, state: App.APP_GALLERY_STATE_IMAGES},
      { type: Reel.UPDATE_CURRENT_INDEX, currentIndex: Actions.CAMERA_INDEX },
      mockJoinChannel,
      { type: NAVIGATION_ACTION, routeName: ROUTES.WALKTHROUGH },
      mockLoadAlbum
    ]);
  });

  it('loads preview reel, if in album', async () => {
    const store = mockStore({});
    const senderId = "DKSN93-ASDFS";
    DeviceInfo.getUniqueID = jest.fn(() => {
      return "DKSN93-ASDFS";
    });
    const albumId = "some album id";
    const previewReel = ["one", "three", "two"];

    const AsyncStorage = new MockAsyncStorage({ albumId: JSON.stringify(albumId),
                                                previewReel: JSON.stringify(previewReel) });
    jest.setMock('AsyncStorage', AsyncStorage);

    await store.dispatch(Actions.loadAndDispatchState());
    expect(store.getActions()).toContainEqual({ type: Reel.LOAD_PREVIEW_REEL, previewReel: previewReel });
  });
});
