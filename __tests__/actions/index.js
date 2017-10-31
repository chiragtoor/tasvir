import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as Actions from '../../js/actions';
import * as Album from '../../js/actions/album';
import * as App from '../../js/actions/app';
import * as Reel from '../../js/actions/reel';
import * as Gallery from '../../js/actions/gallery';
import * as Confirmation from '../../js/actions/confirmation';
import * as TasvirApi from '../../js/actions/tasvir_api';
import MockAsyncStorage from '../../__mocks__/mock_async_storage';
import MockCameraRoll from '../../__mocks__/mock_camera_roll';
import DeviceInfo from 'react-native-device-info';

import { AUTO_SHARE_STORAGE, SENDER_ID_STORAGE, CLOSE_ALBUM_ROUTE,
         NAVIGATION_ACTION, NAVIGATION_BACK_ACTION, ALBUM_ID_STORAGE,
         ALBUM_NAME_STORAGE, ALBUM_LINK_STORAGE, JOIN_ALBUM_ROUTE,
         WALKTHROUGH_ROUTE, MAIN_ROUTE } from '../../js/constants';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

describe('app_actions', () => {
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
      { type: App.APP_UPDATE_SENDER_ID, senderId: senderId },
      { type: NAVIGATION_ACTION, routeName: WALKTHROUGH_ROUTE }
    ]);

    await expect(AsyncStorage.getItem(SENDER_ID_STORAGE)).resolves.toBe(JSON.stringify(senderId));
  });

  it('dispatches APP_UPDATE_SENDER_ID when senderId exists', async () => {
    const store = mockStore({});
    const senderId = "ASIDF-354BAS";

    const AsyncStorage = new MockAsyncStorage({ senderId: JSON.stringify(senderId) });
    jest.setMock('AsyncStorage', AsyncStorage);

    await store.dispatch(Actions.loadAndDispatchState());
    expect(store.getActions()).toEqual([
      { type: App.APP_UPDATE_SENDER_ID, senderId: senderId },
      { type: NAVIGATION_ACTION, routeName: WALKTHROUGH_ROUTE }
    ]);
  });

  it('dispatches APP_LOAD_SAVED_PHOTOS when previous saved photos exist', async () => {
    const store = mockStore({});
    const senderId = "ASIDF-354BAS";
    const savedPhotos = ["one", "two", "three"];

    const AsyncStorage = new MockAsyncStorage({ savedPhotos: JSON.stringify(savedPhotos), senderId: JSON.stringify(senderId) });
    jest.setMock('AsyncStorage', AsyncStorage);

    await store.dispatch(Actions.loadAndDispatchState());
    expect(store.getActions()).toEqual([
      { type: App.APP_UPDATE_SENDER_ID, senderId: senderId },
      { type: App.APP_LOAD_SAVED_PHOTOS, savedPhotos: savedPhotos },
      { type: NAVIGATION_ACTION, routeName: WALKTHROUGH_ROUTE }
    ]);
  });

  it('dispatches NAVIGATION_ACTION to walkthrough initially', async () => {
    const store = mockStore({});
    const senderId = "ASIDF-354BAS";

    const AsyncStorage = new MockAsyncStorage({ senderId: JSON.stringify(senderId) });
    jest.setMock('AsyncStorage', AsyncStorage);

    await store.dispatch(Actions.loadAndDispatchState());
    expect(store.getActions()).toEqual([
      { type: App.APP_UPDATE_SENDER_ID, senderId: senderId },
      { type: NAVIGATION_ACTION, routeName: WALKTHROUGH_ROUTE }
    ]);
  });

  it('dispatches NAVIGATION_ACTION to app if walkthrough completed, loads gallery', async () => {
    const store = mockStore({});
    const senderId = "ASIDF-354BAS";

    const AsyncStorage = new MockAsyncStorage({ senderId: JSON.stringify(senderId), walkthrough: JSON.stringify(true) });
    jest.setMock('AsyncStorage', AsyncStorage);
    const mockGalleryLoadAction = { type: Gallery.LOAD_IMAGES, data: "MOCK LOAD" };
    Gallery.loadGallery  = jest.fn((fun) => {
      return mockGalleryLoadAction;
    });

    await store.dispatch(Actions.loadAndDispatchState());
    expect(store.getActions()).toEqual([
      { type: App.APP_UPDATE_SENDER_ID, senderId: senderId },
      mockGalleryLoadAction,
      { type: NAVIGATION_ACTION, routeName: MAIN_ROUTE }
    ]);
  });

  it('dispatches APP_UPDATE_AUTO_SHARE if setting is saved to true', async () => {
    const store = mockStore({});
    const senderId = "ASIDF-354BAS";

    const AsyncStorage = new MockAsyncStorage({ senderId: JSON.stringify(senderId), autoShare: JSON.stringify(true) });
    jest.setMock('AsyncStorage', AsyncStorage);

    await store.dispatch(Actions.loadAndDispatchState());
    expect(store.getActions()).toEqual([
      { type: App.APP_UPDATE_SENDER_ID, senderId: senderId },
      { type: App.APP_UPDATE_AUTO_SHARE, autoShare: true },
      { type: NAVIGATION_ACTION, routeName: WALKTHROUGH_ROUTE }
    ]);
  });

  it('loads stored album state, joins channel, and syncs with endpoint if in album', async () => {
    const store = mockStore({});
    const albumId = "some id";
    const albumName = "some name";
    const senderId = "ASIDF-354BAS";

    const AsyncStorage = new MockAsyncStorage({ senderId: JSON.stringify(senderId),
                                                albumId: JSON.stringify(albumId),
                                                albumName: JSON.stringify(albumName) });
    jest.setMock('AsyncStorage', AsyncStorage);
    const mockJoinChannel = { type: "MOCK JOIN CHANNEL" };
    Album.joinChannel  = jest.fn((fun) => {
      return mockJoinChannel;
    });
    const mockLoadAlbum = { type: "MOCK LOAD ALBUM" };
    TasvirApi.loadAlbum  = jest.fn((fun) => {
      return mockLoadAlbum;
    });

    await store.dispatch(Actions.loadAndDispatchState());
    expect(store.getActions()).toEqual([
      { type: App.APP_UPDATE_SENDER_ID, senderId: senderId },
      { type: Album.UPDATE_ALBUM_ID, id: albumId },
      { type: Album.UPDATE_ALBUM_NAME, name: albumName },
      { type: Reel.UPDATE_CURRENT_INDEX, currentIndex: Actions.CAMERA_INDEX },
      mockJoinChannel,
      { type: NAVIGATION_ACTION, routeName: WALKTHROUGH_ROUTE },
      mockLoadAlbum
    ]);
  });

  it('loads preview reel, if in album', async () => {
    const store = mockStore({});
    const senderId = "ASIDF-354BAS";
    const albumId = "some album id";
    const previewReel = ["one", "three", "two"];

    const AsyncStorage = new MockAsyncStorage({ senderId: JSON.stringify(senderId),
                                                albumId: JSON.stringify(albumId),
                                                previewReel: JSON.stringify(previewReel) });
    jest.setMock('AsyncStorage', AsyncStorage);

    await store.dispatch(Actions.loadAndDispatchState());
    expect(store.getActions()).toContainEqual({ type: Reel.LOAD_PREVIEW_REEL, previewReel: previewReel });
  });
});