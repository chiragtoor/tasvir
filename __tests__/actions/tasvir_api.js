import fetch from 'isomorphic-fetch';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import * as TasvirApi from '../../js/actions/tasvir_api';
import * as App from '../../js/actions/app';
import * as Album from '../../js/actions/album';
import * as Actions from '../../js/actions';
import MockAsyncStorage from '../../__mocks__/mock_async_storage';
import MockActions from '../../__mocks__/mock_actions';

import { URL, ALBUMS_ENDPOINT, ALBUM_ID_STORAGE,
         ALBUM_NAME_STORAGE, ALBUM_LINK_STORAGE } from '../../js/constants';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares)

describe('user_actions', () => {
  afterEach(() => {
    jest.resetModules();
  });

  /*
   * Tests for creating a group
   */
  it('correctly handles a success response when creating a group', async () => {
    const name = "some album";
    const id = "album id";
    const link = "branch link";
    const mockAction = { type: "MOCK_ACTION" };

    const AsyncStorage = new MockAsyncStorage({});
    jest.setMock('AsyncStorage', AsyncStorage);
    // mock joinChannel due to internal phoenix js libraries used that will be
    //  undefined in test environment
    Actions.joinChannel = jest.fn(() => {
      return mockAction;
    });

    nock(URL)
      .post(ALBUMS_ENDPOINT)
      .reply(201, { success: 1, album: id, link: link })

    const expectedActions = [
      { type: Album.UPDATE_ALBUM_ID, id },
      { type: Album.LOAD_LINK, link },
      { type: App.APP_RESET_ALBUM_FORM },
      mockAction
    ];

    // when joinChannel is called after album creation it calls getState and depends on
    //  previous actions going through and updating reducer states. When called in tests
    //  the reducer state is not updated, so trying to access album id will be a undefined error, to get
    //  around this setting id in the mockStore so that once that action is called it is present
    const store = mockStore({ album: { name: name, id: id }, app: { senderId: "idfv" } })
    await store.dispatch(TasvirApi.createAlbum())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })

    await expect(AsyncStorage.getItem(ALBUM_ID_STORAGE)).resolves.toBe(JSON.stringify(id));
    await expect(AsyncStorage.getItem(ALBUM_NAME_STORAGE)).resolves.toBe(JSON.stringify(name));
    await expect(AsyncStorage.getItem(ALBUM_LINK_STORAGE)).resolves.toBe(JSON.stringify(link));
  });

  it('correctly handles a error response when creating a group', async () => {
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
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
    await expect(AsyncStorage.getItem(ALBUM_ID_STORAGE)).resolves.toBe(null);
  });

  it('correctly handles a server error when creating a album', async () => {
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
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
    await expect(AsyncStorage.getItem(ALBUM_ID_STORAGE)).resolves.toBe(null);
  });
});
