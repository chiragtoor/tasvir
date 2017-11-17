import fetch from 'isomorphic-fetch';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import * as TasvirApi from '../../js/actions/tasvir_api';
import * as App from '../../js/actions/app';
import * as Album from '../../js/actions/album';
import * as Actions from '../../js/actions';
import * as Gallery from '../../js/actions/gallery';
import MockAsyncStorage from '../../__mocks__/mock_async_storage';
import MockCameraRoll from '../../__mocks__/mock_camera_roll';
import MockImage from '../../__mocks__/mock_image';

import { URL, ALBUMS_ENDPOINT, ALBUM_ID_STORAGE,
         ALBUM_NAME_STORAGE, ALBUM_LINK_STORAGE } from '../../js/constants';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares)

describe('tasvir_api_actions', () => {
  afterEach(() => {
    jest.resetModules();
  });

  /*
   * Tests for creating a album
   */
  it('correctly handles a success response when creating an album', async () => {
    const name = "some album";
    const id = "album id";
    const link = "branch link";
    const date = "Jan. 10th, 2017";
    const mockAction = { type: "MOCK_ACTION" };

    const AsyncStorage = new MockAsyncStorage({});
    jest.setMock('AsyncStorage', AsyncStorage);
    // mock joinChannel due to internal phoenix js libraries used that will be
    //  undefined in test environment
    Album.joinChannel = jest.fn(() => {
      return mockAction;
    });

    nock(URL)
      .post(ALBUMS_ENDPOINT)
      .reply(201, { success: 1, album: id, link: link, album_date: date })

    const expectedActions = [
      { type: Album.UPDATE_ALBUM_ID, id },
      { type: Album.LOAD_LINK, link },
      { type: Album.LOAD_DATE, date },
      { type: App.APP_RESET_ALBUM_FORM },
      mockAction
    ];

    // when joinChannel is called after album creation it calls getState and depends on
    //  previous actions going through and updating reducer states. When called in tests
    //  the reducer state is not updated, so trying to access album id will be a undefined error, to get
    //  around this setting id in the mockStore so that once that action is called it is present
    const store = mockStore({ album: { name: name, id: id }, app: { senderId: "idfv" } })
    await store.dispatch(TasvirApi.createAlbum());
    expect(store.getActions()).toEqual(expectedActions)

    await expect(AsyncStorage.getItem(ALBUM_ID_STORAGE)).resolves.toBe(JSON.stringify(id));
    await expect(AsyncStorage.getItem(ALBUM_NAME_STORAGE)).resolves.toBe(JSON.stringify(name));
    await expect(AsyncStorage.getItem(ALBUM_LINK_STORAGE)).resolves.toBe(JSON.stringify(link));
  });

  it('correctly handles a error response when creating an album', async () => {
    const name = "Test Album";

    const AsyncStorage = new MockAsyncStorage({});
    jest.setMock('AsyncStorage', AsyncStorage);

    nock(URL)
      .post(ALBUMS_ENDPOINT)
      .reply(422, { success: 0 })

    const expectedActions = [
      { type: App.APP_RESET_ALBUM_FORM }
    ]
    const store = mockStore({ album: { name: name } })
    await store.dispatch(TasvirApi.createAlbum())
    expect(store.getActions()).toEqual(expectedActions)
    await expect(AsyncStorage.getItem(ALBUM_ID_STORAGE)).resolves.toBe(null);
  });

  it('correctly handles a server error when creating an album', async () => {
    const name = "Test Album";

    const AsyncStorage = new MockAsyncStorage({});
    jest.setMock('AsyncStorage', AsyncStorage);

    nock(URL)
      .post(ALBUMS_ENDPOINT)
      .reply(500, { })

    const expectedActions = [
      { type: App.APP_RESET_ALBUM_FORM }
    ]
    const store = mockStore({ album: { name: name } })
    await store.dispatch(TasvirApi.createAlbum())
    expect(store.getActions()).toEqual(expectedActions)
    await expect(AsyncStorage.getItem(ALBUM_ID_STORAGE)).resolves.toBe(null);
  });

  /*
   * Tests for loading a album
   */
  it('correctly handles a success response when loading an album', async() => {
    const albumId = "CAafsfs988";
    const albumLink = "album branch link";
    const senderId = "this user";
    const responsePhotos = [{sent_by: "some user", photo: 'one', id: "one", width: 9, height: 16},
                            {sent_by: "some user", photo: 'two', id: "two", width: 9, height: 16},
                            {sent_by: "some other user", photo: 'three', id: "three", width: 9, height: 16}];

    const CameraRoll = new MockCameraRoll();
    jest.setMock('CameraRoll', CameraRoll);
    const Image = new MockImage();
    jest.setMock('Image', Image);

    nock(URL)
      .get(ALBUMS_ENDPOINT + "/" + albumId)
      .reply(201, { success: 1, photos: responsePhotos, link: albumLink });

    const expectedActions = [
      { type: Album.LOAD_LINK, link: albumLink },
      /* due to mock promises, these actions resolve first in the test */
      { type: App.APP_ADD_SAVED_PHOTO, photo: "one" },
      { type: App.APP_ADD_SAVED_PHOTO, photo: "two" },
      { type: App.APP_ADD_SAVED_PHOTO, photo: "three" },
      { type: Album.ADD_IMAGE, image: { uri: "one", width: 9, height: 16 } },
      { type: Album.ADD_IMAGE, image: { uri: "two", width: 9, height: 16 } },
      { type: Album.ADD_IMAGE, image: { uri: "three", width: 9, height: 16 } },
      { type: Gallery.SET_GALLERY_BUTTON_IMAGE, image: {uri: "three", aspectRatio: (9/16)}},
      { type: Gallery.LOAD_IMAGES, images: [
                                            { uri: "three", width: 9, height: 16 },
                                            { uri: "two", width: 9, height: 16 },
                                            { uri: "one", width: 9, height: 16 }
                                          ]}
    ];

    const store = mockStore({ album: { name: "some album", id: albumId }, app: { senderId: senderId, savedPhotos: [] } });
    await store.dispatch(TasvirApi.loadAlbum());
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('does not save own images when loading an album', async() => {
    const albumId = "CAafsfs988";
    const albumLink = "album branch link";
    const senderId = "this user";
    const responsePhotos = [{sent_by: "some user", photo: 'one', id: "one", width: 9, height: 16},
                            {sent_by: senderId, photo: 'two', id: "two", width: 9, height: 16},
                            {sent_by: senderId, photo: 'three', id: "three", width: 9, height: 16}];

    const CameraRoll = new MockCameraRoll();
    jest.setMock('CameraRoll', CameraRoll);

    nock(URL)
      .get(ALBUMS_ENDPOINT + "/" + albumId)
      .reply(201, { success: 1, photos: responsePhotos, link: albumLink });

    const expectedActions = [
      { type: Album.LOAD_LINK, link: albumLink },
      { type: App.APP_ADD_SAVED_PHOTO, photo: "one" },
      { type: Album.ADD_IMAGE, image: { uri: "one", width: 9, height: 16 } },
      { type: Gallery.SET_GALLERY_BUTTON_IMAGE, image: "one"},
      { type: Gallery.LOAD_IMAGES, images: [
                                            { uri: "one", width: 9, height: 16 }
                                          ]}
    ];

    const store = mockStore({ album: { name: "some album", id: albumId }, app: { senderId: senderId, savedPhotos: [] } });
    await store.dispatch(TasvirApi.loadAlbum())
    expect(store.getActions()).toEqual(expectedActions)
  });

  it('does not save own previously loaded images when loading an album', async() => {
    const albumId = "CAafsfs988";
    const albumLink = "album branch link";
    const senderId = "this user";
    const responsePhotos = [{sent_by: "some user", photo: 'one', id: "one", width: 9, height: 16},
                            {sent_by: "some user", photo: 'two', id: "two", width: 9, height: 16},
                            {sent_by: "some user", photo: 'three', id: "three", width: 9, height: 16}];

    const CameraRoll = new MockCameraRoll();
    jest.setMock('CameraRoll', CameraRoll);

    nock(URL)
      .get(ALBUMS_ENDPOINT + "/" + albumId)
      .reply(201, { success: 1, photos: responsePhotos, link: albumLink });

      const expectedActions = [
        { type: Album.LOAD_LINK, link: albumLink },
        { type: App.APP_ADD_SAVED_PHOTO, photo: "one" },
        { type: App.APP_ADD_SAVED_PHOTO, photo: "two" },
        { type: Album.ADD_IMAGE, image: { uri: "one", width: 9, height: 16 } },
        { type: Album.ADD_IMAGE, image: { uri: "two", width: 9, height: 16 } },
        { type: Gallery.SET_GALLERY_BUTTON_IMAGE, image: "two"},
        { type: Gallery.LOAD_IMAGES, images: [
                                              { uri: "two", width: 9, height: 16 },
                                              { uri: "one", width: 9, height: 16 }
                                            ]}
      ];

    const store = mockStore({ album: { name: "some album", id: albumId }, app: { senderId: senderId, savedPhotos: ["three"] } });
    await store.dispatch(TasvirApi.loadAlbum())
    expect(store.getActions()).toEqual(expectedActions)
  });

  it('correctly handles a error response when loading an album', async() => {
    const albumId = "CAafsfs988";
    const senderId = "this user";

    const CameraRoll = new MockCameraRoll();
    jest.setMock('CameraRoll', CameraRoll);

    nock(URL)
      .get(ALBUMS_ENDPOINT + "/" + albumId)
      .reply(404, { })

    const expectedActions = [];
    const store = mockStore({ album: { name: "some album", id: albumId }, app: { senderId: senderId, savedPhotos: [] } });
    await store.dispatch(TasvirApi.loadAlbum())
    expect(store.getActions()).toEqual(expectedActions)
  });

  it('correctly handles a server error when loading an album', async() => {
    const albumId = "CAafsfs988";
    const senderId = "this user";

    const CameraRoll = new MockCameraRoll();
    jest.setMock('CameraRoll', CameraRoll);

    nock(URL)
      .get(ALBUMS_ENDPOINT + "/" + albumId)
      .reply(500, { })

    const expectedActions = [];
    const store = mockStore({ album: { name: "some album", id: albumId }, app: { senderId: senderId, savedPhotos: [] } });
    await store.dispatch(TasvirApi.loadAlbum())
    expect(store.getActions()).toEqual(expectedActions)
  });
});
