import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as Actions from '../../js/actions/app';
import * as IndexActions from '../../js/actions';
import * as Album from '../../js/actions/album';
import * as Gallery from '../../js/actions/gallery';
import * as Reel from '../../js/actions/reel';
import * as Confirmation from '../../js/actions/confirmation';
import * as TasvirApi from '../../js/actions/tasvir_api';
import MockAsyncStorage from '../../__mocks__/mock_async_storage';

import { AUTO_SHARE_STORAGE, SENDER_ID_STORAGE, ALBUM_HISTORY_STORAGE,
         NAVIGATION_ACTION, NAVIGATION_BACK_ACTION, ALBUM_ID_STORAGE,
         ALBUM_NAME_STORAGE, ALBUM_LINK_STORAGE, ROUTES,
         WALKTHROUGH_FLAG_STORAGE } from '../../js/constants';

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
    expect(Actions.updateSenderId(senderId)).toEqual({
      type: Actions.APP_UPDATE_SENDER_ID,
      senderId
    });
    await expect(AsyncStorage.getItem(SENDER_ID_STORAGE)).resolves.toBe(JSON.stringify(senderId));
  });

  it('setHistory() dipatches SET_HISTORY', async () => {
    const AsyncStorage = new MockAsyncStorage({});
    jest.setMock('AsyncStorage', AsyncStorage);

    const history = [{id: "old id", name: "old album 1"}, {id: "old id 2", name: "old name 2"}];
    const expectedAction = {
      type: Actions.SET_HISTORY,
      history
    }
    expect(Actions.setHistory(history)).toEqual(expectedAction);
    await expect(AsyncStorage.getItem(ALBUM_HISTORY_STORAGE)).resolves.toBe(JSON.stringify(history));
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

  it('flagImageReceivedFromChannel() dispatches APP_UPDATE_RECEIVED_IMAGE_FLAG with flag true', () => {
    expect(Actions.flagImageReceivedFromChannel()).toEqual({
      type: Actions.APP_UPDATE_RECEIVED_IMAGE_FLAG,
      flag: true
    });
  });

  it('acknowledgeFlagImageReceivedFromChannel() dispatches APP_UPDATE_RECEIVED_IMAGE_FLAG with flag false', () => {
    expect(Actions.acknowledgeFlagImageReceivedFromChannel()).toEqual({
      type: Actions.APP_UPDATE_RECEIVED_IMAGE_FLAG,
      flag: false
    });
  });

  it('setConfirmationCopy() dispatches APP_SET_CONFIRMATION_COPY', () => {
    const copy = "test copy";
    expect(Actions.setConfirmationCopy(copy)).toEqual({
      type: Actions.APP_SET_CONFIRMATION_COPY,
      copy
    });
  });

  it('setConfirmationAcceptCopy() dispatches APP_SET_CONFIRMATION_ACCEPT_COPY', () => {
    const copy = "test copy";
    expect(Actions.setConfirmationAcceptCopy(copy)).toEqual({
      type: Actions.APP_SET_CONFIRMATION_ACCEPT_COPY,
      copy
    });
  });

  it('setConfirmationRejectCopy() dispatches APP_SET_CONFIRMATION_REJECT_COPY', () => {
    const copy = "test copy";
    expect(Actions.setConfirmationRejectCopy(copy)).toEqual({
      type: Actions.APP_SET_CONFIRMATION_REJECT_COPY,
      copy
    });
  });

  it('confirmationAccept() calls the confirmationAccept function in state', async () => {
    const action = { type: "CONFIRMATION_ACCEPT" };
    const accept = () => action;

    const store = mockStore({ app: { confirmationAccept: accept } });
    await store.dispatch(Actions.confirmationAccept());
    expect(store.getActions()).toEqual([action]);
  });

  it('confirmationReject() calls the confirmationReject function in state', async () => {
    const action = { type: "CONFIRMATION_REJECT" };
    const reject = () => action;

    const store = mockStore({ app: { confirmationReject: reject } });
    await store.dispatch(Actions.confirmationReject());
    expect(store.getActions()).toEqual([action]);
  });

  it('closeAlbumReel() dipatches a navigation back action', async () => {
    const store = mockStore({ });
    const expectedActions = [
      { type: NAVIGATION_BACK_ACTION }
    ];
    await store.dispatch(Actions.closeAlbumReel());
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('setWalkthroughComplete() dispatches APP_SET_WALKTHROUGH_COMPLETE', () => {
    const complete = (() => true);
    const expectedAction = {
      type: Actions.APP_SET_WALKTHROUGH_COMPLETE,
      complete
    }
    expect(Actions.setWalkthroughComplete(complete)).toEqual(expectedAction);
  });

  it('completeWalkthrough() calls the onCompleteWalkthrough function in state', async () => {
    const AsyncStorage = new MockAsyncStorage({});
    jest.setMock('AsyncStorage', AsyncStorage);
    const mockGalleryLoad = { type: "MOCK GALLERY LOAD" };
    Gallery.loadGallery = jest.fn(() => {
      return mockGalleryLoad;
    });
    const action = { type: "COMPLETE WALKTHROUGH" };
    const complete = () => action;

    const store = mockStore({ app: { onCompleteWalkthrough: complete } });
    const expectedActions = [
      mockGalleryLoad,
      action,
    ];

    await store.dispatch(Actions.completeWalkthrough());
    expect(store.getActions()).toEqual(expectedActions);
    await expect(AsyncStorage.getItem(WALKTHROUGH_FLAG_STORAGE)).resolves.toBe(JSON.stringify(true));
  });

  it('galleryListAlbums() dispatches SET_GALLERY_STATE', () => {
    expect(Actions.galleryListAlbums()).toEqual({
      type: Actions.SET_GALLERY_STATE,
      state: Actions.APP_GALLERY_STATE_LIST
    });
  });

  it('galleryViewAlbum() dispatches SET_GALLERY_STATE and views album', async () => {
    const mockViewAlbum = { type: "MOCK VIEW ALBUM" };
    Gallery.viewAlbum = jest.fn((album) => {
      return mockViewAlbum;
    });
    const store = mockStore({ });
    const expectedActions = [
      mockViewAlbum,
      { type: Actions.SET_GALLERY_STATE, state: Actions.APP_GALLERY_STATE_IMAGES }
    ];

    await store.dispatch(Actions.galleryViewAlbum({ }));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('viewAlbumReel() dispatches actions to view a album at a index', async () => {
    const mockViewAlbum = { type: "MOCK VIEW ALBUM" };
    Gallery.viewAlbum = jest.fn((album) => {
      return mockViewAlbum;
    });
    const index = 5;
    const images = [0, 1, 2, 3, 4, 5, 6];
    const store = mockStore({ });
    const expectedActions = [
      { type: Actions.SET_ALBUM_REEL_INDEX, index },
      { type: Actions.SET_ALBUM_REEL_IMAGES, images },
      { type: NAVIGATION_ACTION, routeName: ROUTES.ALBUM_REEL }
    ];

    await store.dispatch(Actions.viewAlbumReel(index, images));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('capture() dispatches actions to upload if in album and auto-sharing', async () => {
    const uploadAction = { type: "MOCK UPLOAD IMAGE" };
    TasvirApi.uploadImage  = jest.fn((image) => {
      return uploadAction;
    });
    const store = mockStore({ album: { id: "test_album" }, app: { autoShare: true } });
    await store.dispatch(Actions.capture("one", 16, 9));
    expect(store.getActions()).toEqual([uploadAction]);
  });

  it('capture() dispatches actions to add to reel if in album and not auto-sharing', async () => {
    const image = { uri: "one", width: 16, height: 9 };
    const store = mockStore({ album: { id: "test_album" }, app: { autoShare: false } });
    const expectedActions = [
      { type: Reel.REEL_ADD_IMAGE, image: { uri: "one", width: 16, height: 9 } }
    ];
    await store.dispatch(Actions.capture("one", 16, 9));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('capture() dispatches actions to save image if not in album', async () => {
    const mockSave = { type: "SAVE_IMAGE" };
    IndexActions.saveImage = jest.fn((image) => mockSave);
    const image = { uri: "one", width: 16, height: 9 };
    const store = mockStore({ album: { }, app: { autoShare: true } });
    const expectedActions = [
      mockSave
    ];
    await store.dispatch(Actions.capture("one", 16, 9));
    expect(store.getActions()).toEqual(expectedActions);
  });
});
