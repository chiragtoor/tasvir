import fetch from 'isomorphic-fetch';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import * as TasvirApi from '../../js/actions/tasvir_api';
import * as AlbumForm from '../../js/actions/album_form';
import * as Album from '../../js/actions/album';
import MockAsyncStorage from '../../__mocks__/mock_async_storage';

import { URL, ALBUMS_ENDPOINT, ALBUM_ID_STORAGE } from '../../js/constants';

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
    const name = "Test Album";
    const id = "wyGqL7omNdR6DlKqe54r1yPb0VqD6MQx72B80nEmOJ4KRzkLgRkvWwVdeNlo1GpbXy3PrA9ja5QWw8GpBkzX3M2nx9AjOaEJMx2m";

    const AsyncStorage = new MockAsyncStorage({});
    jest.setMock('AsyncStorage', AsyncStorage);

    nock(URL)
      .post(ALBUMS_ENDPOINT)
      .reply(201, { success: 1, album: id })

    const expectedActions = [
      { type: Album.UPDATE_ALBUM_NAME, name },
      { type: Album.UPDATE_ALBUM_ID, id },
      { type: AlbumForm.RESET_ALBUM_FORM }
    ]
    const store = mockStore({ albumForm: { name: name } })
    await store.dispatch(TasvirApi.createAlbum())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })

    await expect(AsyncStorage.getItem(ALBUM_ID_STORAGE)).resolves.toBe(JSON.stringify(id));
  });

  it('correctly handles a error response when creating a group', async () => {
    const name = "Test Album";
    const id = "wyGqL7omNdR6DlKqe54r1yPb0VqD6MQx72B80nEmOJ4KRzkLgRkvWwVdeNlo1GpbXy3PrA9ja5QWw8GpBkzX3M2nx9AjOaEJMx2m";

    const AsyncStorage = new MockAsyncStorage({});
    jest.setMock('AsyncStorage', AsyncStorage);

    nock(URL)
      .post(ALBUMS_ENDPOINT)
      .reply(422, { success: 0 })

    const expectedActions = [
      { type: AlbumForm.RESET_ALBUM_FORM }
    ]
    const store = mockStore({ albumForm: { name: name } })
    await store.dispatch(TasvirApi.createAlbum())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })

    await expect(AsyncStorage.getItem(ALBUM_ID_STORAGE)).resolves.toBe(null);
  });

  it('correctly handles a server error when creating a group', async () => {
    const name = "Test Album";
    const id = "wyGqL7omNdR6DlKqe54r1yPb0VqD6MQx72B80nEmOJ4KRzkLgRkvWwVdeNlo1GpbXy3PrA9ja5QWw8GpBkzX3M2nx9AjOaEJMx2m";

    const AsyncStorage = new MockAsyncStorage({});
    jest.setMock('AsyncStorage', AsyncStorage);

    nock(URL)
      .post(ALBUMS_ENDPOINT)
      .reply(500, { })

    const expectedActions = [
      { type: AlbumForm.RESET_ALBUM_FORM }
    ]
    const store = mockStore({ albumForm: { name: name } })
    await store.dispatch(TasvirApi.createAlbum())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })

    await expect(AsyncStorage.getItem(ALBUM_ID_STORAGE)).resolves.toBe(null);
  });
});
