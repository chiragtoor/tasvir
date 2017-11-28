import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import MockAsyncStorage from '../../__mocks__/mock_async_storage';
import * as Actions from '../../js/actions/album';
import * as App from '../../js/actions/app';
import * as Reel from '../../js/actions/reel';
import * as Confirmation from '../../js/actions/confirmation';
import * as TasvirApi from '../../js/actions/tasvir_api';
import * as AlbumChannel from '../../js/actions/album_channel';
import { URL, ALBUMS_ENDPOINT, ALBUM_ID_STORAGE,
         ALBUM_NAME_STORAGE, ALBUM_LINK_STORAGE,
         NAVIGATION_BACK_ACTION, NAVIGATION_ACTION,
         ROUTES, ALBUM_DATE_STORAGE, ALBUM_IMAGES_STORAGE,
         ALBUM_HISTORY_STORAGE } from '../../js/constants';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares)

describe('album_actions', () => {
  afterEach(() => {
    jest.resetModules();
  });

  it('updateId() dipatches UPDATE_ALBUM_ID, updates storage', async () => {
    const AsyncStorage = new MockAsyncStorage({});
    jest.setMock('AsyncStorage', AsyncStorage);

    const id = "album_id_hash";
    const expectedAction = { type: Actions.UPDATE_ALBUM_ID, id };
    expect(Actions.updateId(id)).toEqual(expectedAction);
    await expect(AsyncStorage.getItem(ALBUM_ID_STORAGE)).resolves.toBe(JSON.stringify(id));
  });

  it('updateName() dipatches UPDATE_ALBUM_NAME', async () => {
    const AsyncStorage = new MockAsyncStorage({});
    jest.setMock('AsyncStorage', AsyncStorage);

    const name = "album name";
    const expectedAction = { type: Actions.UPDATE_ALBUM_NAME, name };
    expect(Actions.updateName(name)).toEqual(expectedAction);
    await expect(AsyncStorage.getItem(ALBUM_NAME_STORAGE)).resolves.toBe(JSON.stringify(name));
  });

  it('updateLink() dipatches LOAD_LINK', async () => {
    const AsyncStorage = new MockAsyncStorage({});
    jest.setMock('AsyncStorage', AsyncStorage);

    const link = "branch link";
    const expectedAction = { type: Actions.LOAD_LINK, link };
    expect(Actions.updateLink(link)).toEqual(expectedAction);
    await expect(AsyncStorage.getItem(ALBUM_LINK_STORAGE)).resolves.toBe(JSON.stringify(link));
  });

  it('updateAlbumDate() dipatches LOAD_ALBUM_DATE', async () => {
    const AsyncStorage = new MockAsyncStorage({});
    jest.setMock('AsyncStorage', AsyncStorage);

    const albumDate = "date";
    const expectedAction = { type: Actions.LOAD_ALBUM_DATE, albumDate };
    expect(Actions.updateAlbumDate(albumDate)).toEqual(expectedAction);
    await expect(AsyncStorage.getItem(ALBUM_DATE_STORAGE)).resolves.toBe(JSON.stringify(albumDate));
  });

  it('loadImages() dipatches LOAD_IMAGES', async () => {
    const AsyncStorage = new MockAsyncStorage({});
    jest.setMock('AsyncStorage', AsyncStorage);

    const images = [0, 1, 2, 3];
    const expectedAction = { type: Actions.LOAD_IMAGES, images };
    expect(Actions.loadImages(images)).toEqual(expectedAction);
    await expect(AsyncStorage.getItem(ALBUM_IMAGES_STORAGE)).resolves.toBe(JSON.stringify(images));
  });

  it('addImage() dipatches ADD_IMAGE', () => {
    const image = { uri: "uri", width: 16, height: 9 };
    const expectedAction = { type: Actions.ADD_IMAGE, image };
    expect(Actions.addImage(image)).toEqual(expectedAction);
  });

  it('reset() dipatches actions to reset current album state', async () => {
    const store = mockStore({ });
    const expectedActions = [
      { type: Actions.UPDATE_ALBUM_ID, id: null },
      { type: Actions.UPDATE_ALBUM_NAME, name: null },
      { type: Actions.LOAD_LINK, link: null },
      { type: Actions.LOAD_ALBUM_DATE, albumDate: null },
      { type: Actions.LOAD_IMAGES, images: []}
    ];
    await store.dispatch(Actions.reset());
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('closeAlbum() dipatches actions to setup close confirmation', async () => {
    const mockAcceptAction = { type: App.APP_SET_CONFIRMATION_ACCEPT,
      accept: true };
    const mockRejectAction = { type: App.APP_SET_CONFIRMATION_REJECT,
      reject: false };
    Confirmation.setConfirmationAcceptAction = jest.fn((fun) => {
      return mockAcceptAction;
    });
    Confirmation.setConfirmationRejectAction = jest.fn((fun) => {
      return mockRejectAction;
    });
    const testAlbum = "test album";
    const store = mockStore({ album: { name: testAlbum }, reel: { previewReel: [] } });
    const expectedActions = [
      { type: App.APP_SET_CONFIRMATION_COPY, copy: "Close album '" + testAlbum + "'?" },
      { type: App.APP_SET_CONFIRMATION_ACCEPT_COPY, copy: "Yes, close the album" },
      { type: App.APP_SET_CONFIRMATION_REJECT_COPY, copy: "No, keep it open" },
      mockAcceptAction,
      mockRejectAction,
      { type: NAVIGATION_ACTION, routeName: ROUTES.ALBUM_ACTION }
    ];
    await store.dispatch(Actions.closeAlbum());
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('confirmCloseAlbum() closes existing ablum', async () => {
    const AsyncStorage = new MockAsyncStorage({});
    jest.setMock('AsyncStorage', AsyncStorage);
    const mockChannelLeaveAction = { type: "MOCK LEAVE CHANNEL" };
    AlbumChannel.leaveChannel = jest.fn(() => {
      return mockChannelLeaveAction;
    });
    const album = { name: "test album", id: "ASDF" };
    const store = mockStore({ album: album, app: { albumHistory: [] }, reel: { previewReel: [] } });
    const expectedActions = [
      { type: App.SET_HISTORY, history: [album] },
      { type: Actions.UPDATE_ALBUM_ID, id: null },
      { type: Actions.UPDATE_ALBUM_NAME, name: null },
      { type: Actions.LOAD_LINK, link: null },
      { type: Actions.LOAD_ALBUM_DATE, albumDate: null },
      { type: Actions.LOAD_IMAGES, images: []},
      mockChannelLeaveAction,
      { type: Reel.RESET_REEL },
      { type: App.SET_GALLERY_STATE, state: App.APP_GALLERY_STATE_LIST },
      { type: NAVIGATION_BACK_ACTION }
    ];
    await store.dispatch(Actions.confirmCloseAlbum());
    expect(store.getActions()).toEqual(expectedActions);
    await expect(AsyncStorage.getItem(ALBUM_HISTORY_STORAGE)).resolves.toBe(JSON.stringify([album]));
  });

  it('openAlbum() dipatches actions to setup open confirmation', async () => {
    const mockAcceptAction = { type: App.APP_SET_CONFIRMATION_ACCEPT,
      accept: true };
    const mockRejectAction = { type: App.APP_SET_CONFIRMATION_REJECT,
      reject: false };
    Confirmation.setConfirmationAcceptAction = jest.fn((fun) => {
      return mockAcceptAction;
    });
    Confirmation.setConfirmationRejectAction = jest.fn((fun) => {
      return mockRejectAction;
    });
    const testAlbum = { name: "test album" };
    const store = mockStore({ album: { }, reel: { previewReel: [] } });
    const expectedActions = [
      { type: App.APP_SET_CONFIRMATION_COPY, copy: "Re-open album '" + testAlbum.name + "'?" },
      { type: App.APP_SET_CONFIRMATION_ACCEPT_COPY, copy: "Yes, re-open album" },
      { type: App.APP_SET_CONFIRMATION_REJECT_COPY, copy: "No" },
      mockAcceptAction,
      mockRejectAction,
      { type: NAVIGATION_ACTION, routeName: ROUTES.ALBUM_ACTION }
    ];
    await store.dispatch(Actions.openAlbum(testAlbum));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('confirmOpenAlbum() dipatches actions to open album', async () => {
    const AsyncStorage = new MockAsyncStorage({});
    jest.setMock('AsyncStorage', AsyncStorage);
    const mockApiAction = { type: "MOCK API CALL" };
    TasvirApi.loadAlbum = jest.fn(() => {
      return mockApiAction;
    });
    const mockChannelJoinAction = { type: "MOCK JOIN CHANNEL" };
    AlbumChannel.joinChannel = jest.fn(() => {
      return mockChannelJoinAction;
    });
    const albumToOpen = { id: "old_album", name: "old album", albumDate: "old date", images: [1, 2, 3] };
    const store = mockStore({ album: { }, app: { albumHistory: [albumToOpen] } });
    const expectedActions = [
      { type: App.SET_HISTORY, history: [] },
      { type: Actions.UPDATE_ALBUM_ID, id: albumToOpen.id },
      { type: Actions.UPDATE_ALBUM_NAME, name: albumToOpen.name },
      { type: Actions.LOAD_ALBUM_DATE, albumDate: albumToOpen.albumDate },
      { type: Actions.LOAD_IMAGES, images: albumToOpen.images },
      mockApiAction,
      mockChannelJoinAction,
      { type: NAVIGATION_BACK_ACTION }
    ];
    await store.dispatch(Actions.confirmOpenAlbum(albumToOpen));
    expect(store.getActions()).toEqual(expectedActions);
    await expect(AsyncStorage.getItem(ALBUM_HISTORY_STORAGE)).resolves.toBe(JSON.stringify([]));
  });

  it('confirmOpenAlbum() when already in album closes existing ablum', async () => {
    const mockChannelLeaveAction = { type: "MOCK LEAVE CHANNEL" };
    AlbumChannel.leaveChannel = jest.fn(() => {
      return mockChannelLeaveAction;
    });
    const album = { name: "test album", id: "ASDF" };
    const store = mockStore({ album: album, app: { albumHistory: [] }, reel: { previewReel: [] } });
    const expectedActions = [
      { type: App.SET_HISTORY, history: [album] },
      { type: Actions.UPDATE_ALBUM_ID, id: null },
      { type: Actions.UPDATE_ALBUM_NAME, name: null },
      { type: Actions.LOAD_LINK, link: null },
      { type: Actions.LOAD_ALBUM_DATE, albumDate: null },
      { type: Actions.LOAD_IMAGES, images: []},
      mockChannelLeaveAction,
      { type: Reel.RESET_REEL }
    ];
    await store.dispatch(Actions.confirmOpenAlbum({ }));
    expectedActions.forEach((action) => expect(store.getActions()).toContainEqual(action));
  });

  it('confirmOpenAlbum() updates the history properly', async () => {
    const AsyncStorage = new MockAsyncStorage({});
    jest.setMock('AsyncStorage', AsyncStorage);
    let currentHistory = [{ name: "oldAlbum" }, { name: "openAlbum" }, { name: "olderAlbum" }];
    let store = mockStore({ album: { name: "currentAlbum", id: "XYZ" }, app: { albumHistory: currentHistory }, reel: { previewReel: [] } });
    await store.dispatch(Actions.confirmOpenAlbum({ index: 1 }));
    await expect(AsyncStorage.getItem(ALBUM_HISTORY_STORAGE)).resolves.toBe(JSON.stringify([{ name: "currentAlbum", id: "XYZ" }, { name: "oldAlbum" }, { name: "olderAlbum" }]));

    currentHistory = [{ name: "oldAlbum" }, { name: "openAlbum" }, { name: "olderAlbum" }];
    store = mockStore({ album: { name: "currentAlbum", id: "XYZ" }, app: { albumHistory: currentHistory }, reel: { previewReel: [] } });
    await store.dispatch(Actions.confirmOpenAlbum({ index: 0 }));
    await expect(AsyncStorage.getItem(ALBUM_HISTORY_STORAGE)).resolves.toBe(JSON.stringify([{ name: "currentAlbum", id: "XYZ" }, { name: "openAlbum" }, { name: "olderAlbum" }]));

    currentHistory = [{ name: "oldAlbum" }, { name: "openAlbum" }, { name: "olderAlbum" }];
    store = mockStore({ album: { name: "currentAlbum", id: "XYZ" }, app: { albumHistory: currentHistory }, reel: { previewReel: [] } });
    await store.dispatch(Actions.confirmOpenAlbum({ index: 2 }));
    await expect(AsyncStorage.getItem(ALBUM_HISTORY_STORAGE)).resolves.toBe(JSON.stringify([{ name: "currentAlbum", id: "XYZ" }, { name: "oldAlbum" }, { name: "openAlbum" }]));
  });

  it('joinAlbum() dipatches actions to setup join confirmation', async () => {
    const mockAcceptAction = { type: App.APP_SET_CONFIRMATION_ACCEPT,
      accept: true };
    const mockRejectAction = { type: App.APP_SET_CONFIRMATION_REJECT,
      reject: false };
    Confirmation.setConfirmationAcceptAction = jest.fn((fun) => {
      return mockAcceptAction;
    });
    Confirmation.setConfirmationRejectAction = jest.fn((fun) => {
      return mockRejectAction;
    });
    const testAlbum = "test album";
    const testId = "ASDF";
    const store = mockStore({ album: { }, reel: { previewReel: [] } });
    const expectedActions = [
      { type: App.APP_SET_CONFIRMATION_COPY, copy: "Join album '" + testAlbum + "'?" },
      { type: App.APP_SET_CONFIRMATION_ACCEPT_COPY, copy: "Yes, join album" },
      { type: App.APP_SET_CONFIRMATION_REJECT_COPY, copy: "No" },
      mockAcceptAction,
      mockRejectAction,
      { type: NAVIGATION_ACTION, routeName: ROUTES.ALBUM_ACTION }
    ];
    await store.dispatch(Actions.joinAlbum(testAlbum, testId));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('confirmJoinAlbum() dipatches actions to join album', async () => {
    const mockApiAction = { type: "MOCK API CALL" };
    TasvirApi.loadAlbum = jest.fn(() => {
      return mockApiAction;
    });
    const mockChannelJoinAction = { type: "MOCK JOIN CHANNEL" };
    AlbumChannel.joinChannel = jest.fn(() => {
      return mockChannelJoinAction;
    });
    const name = "test album";
    const id = "ASDF";
    const store = mockStore({ album: { }, app: { albumHistory: [] } });
    const expectedActions = [
      { type: Actions.UPDATE_ALBUM_ID, id },
      { type: Actions.UPDATE_ALBUM_NAME, name },
      mockApiAction,
      mockChannelJoinAction,
      { type: NAVIGATION_BACK_ACTION }
    ];
    await store.dispatch(Actions.confirmJoinAlbum(name, id));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('confirmJoinAlbum() when already in album closes existing ablum', async () => {
    const AsyncStorage = new MockAsyncStorage({});
    jest.setMock('AsyncStorage', AsyncStorage);
    const mockChannelLeaveAction = { type: "MOCK LEAVE CHANNEL" };
    AlbumChannel.leaveChannel = jest.fn(() => {
      return mockChannelLeaveAction;
    });
    const album = { name: "test album", id: "ASDF" };
    const store = mockStore({ album: album, app: { albumHistory: [] }, reel: { previewReel: [] } });
    const expectedActions = [
      { type: App.SET_HISTORY, history: [album] },
      { type: Actions.UPDATE_ALBUM_ID, id: null },
      { type: Actions.UPDATE_ALBUM_NAME, name: null },
      { type: Actions.LOAD_LINK, link: null },
      { type: Actions.LOAD_ALBUM_DATE, albumDate: null },
      { type: Actions.LOAD_IMAGES, images: []},
      mockChannelLeaveAction,
      { type: Reel.RESET_REEL }
    ];
    await store.dispatch(Actions.confirmJoinAlbum("new_album", "XYZ"));
    expectedActions.forEach((action) => expect(store.getActions()).toContainEqual(action));
    await expect(AsyncStorage.getItem(ALBUM_HISTORY_STORAGE)).resolves.toBe(JSON.stringify([album]));
  });

  it('confirmJoinAlbum() opens album if it was already in history', async () => {
    const AsyncStorage = new MockAsyncStorage({});
    jest.setMock('AsyncStorage', AsyncStorage);
    const mockApiAction = { type: "MOCK API CALL" };
    TasvirApi.loadAlbum = jest.fn(() => {
      return mockApiAction;
    });
    const mockChannelJoinAction = { type: "MOCK JOIN CHANNEL" };
    AlbumChannel.joinChannel = jest.fn(() => {
      return mockChannelJoinAction;
    });
    const albumToOpen = { id: "old_album", name: "old album", albumDate: "old date", images: [1, 2, 3] };
    const store = mockStore({ album: { }, app: { albumHistory: [albumToOpen] }, reel: { previewReel: [] } });
    const expectedActions = [
      { type: App.SET_HISTORY, history: [] },
      { type: Actions.UPDATE_ALBUM_ID, id: albumToOpen.id },
      { type: Actions.UPDATE_ALBUM_NAME, name: albumToOpen.name },
      { type: Actions.LOAD_ALBUM_DATE, albumDate: albumToOpen.albumDate },
      { type: Actions.LOAD_IMAGES, images: albumToOpen.images },
      mockApiAction,
      mockChannelJoinAction,
      { type: NAVIGATION_BACK_ACTION }
    ];

    await store.dispatch(Actions.confirmJoinAlbum("old album", "old_album"));
    expectedActions.forEach((action) => expect(store.getActions()).toContainEqual(action));
    await expect(AsyncStorage.getItem(ALBUM_HISTORY_STORAGE)).resolves.toBe(JSON.stringify([]));
  });

  it('finishAlbumAction() dipatches a navigate back', () => {
    const expectedAction = { type: NAVIGATION_BACK_ACTION };
    expect(Actions.finishAlbumAction()).toEqual(expectedAction);
  });

  // it('openAlbum opens album at index, loads via API, removes from history', () => {
  //   const albumHistory = [{id: "old id", name: "old album 1"}, {id: "old id 2", name: "old name 2"}];
  //   const mockAction = { type: "MOCK_ACTION" };
  //   TasvirApi.loadAlbum = jest.fn(() => {
  //     return mockAction;
  //   });
  //
  //   const expectedActions = [
  //     { type: Actions.RESET_ALBUM },
  //     { type: Actions.UPDATE_ALBUM_ID, id: "old id" },
  //     { type: Actions.UPDATE_ALBUM_NAME, name: "old album 1" },
  //     mockAction,
  //     { type: App.SET_HISTORY, history: [{id: "old id 2", name: "old name 2"}]}
  //   ];
  //   const store = mockStore({ album: { history: albumHistory } });
  //   store.dispatch(Actions.openAlbum(0));
  //   expect(store.getActions()).toEqual(expectedActions);
  // })
});
