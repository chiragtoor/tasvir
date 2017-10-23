import * as Actions from '../../js/actions/album';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares)

describe('album_actions', () => {
  it('updateId() dipatches UPDATE_ALBUM_ID', () => {
    const id = "album_id_hash";
    const expectedAction = {
      type: Actions.UPDATE_ALBUM_ID,
      id
    }
    expect(Actions.updateId(id)).toEqual(expectedAction);
  });

  it('updateName() dipatches UPDATE_ALBUM_NAME', () => {
    const name = "Test Album";
    const expectedAction = {
      type: Actions.UPDATE_ALBUM_NAME,
      name
    }
    expect(Actions.updateName(name)).toEqual(expectedAction);
  });

  it('updateLatestChannelImage() dipatches UPDATE_CHANNEL_IMAGE', () => {
    const id = "album_id_hash";
    const expectedAction = {
      type: Actions.UPDATE_CHANNEL_IMAGE,
      id
    }
    expect(Actions.updateLatestChannelImage(id)).toEqual(expectedAction);
  });

  it('updateLink() dipatches LOAD_LINK', () => {
    const link = "branch link";
    const expectedAction = {
      type: Actions.LOAD_LINK,
      link
    }
    expect(Actions.updateLink(link)).toEqual(expectedAction);
  });

  it('reset() dipatches RESET_ALBUM', () => {
    const expectedAction = {
      type: Actions.RESET_ALBUM
    }
    expect(Actions.reset()).toEqual(expectedAction);
  });

  it('closeAlbum() dipatches RESET_ALBUM, Navigation/NAVIGATE', () => {
    const store = mockStore({});
    store.dispatch(Actions.closeAlbum());
    expect(store.getActions()).toEqual([
      { type: Actions.RESET_ALBUM },
      { type: 'Navigation/BACK' }
    ]);
  });

  it('keepAlbumOpen() navigates to App', () => {
    const store = mockStore({});
    expect(store.dispatch(Actions.keepAlbumOpen())).toEqual({ type: 'Navigation/NAVIGATE', routeName: 'App' });
  });

  it('attemptCloseAlbum() navigates to CloseAlbum', () => {
    const store = mockStore({});
    expect(store.dispatch(Actions.attemptCloseAlbum())).toEqual({ type: 'Navigation/NAVIGATE', routeName: 'CloseAlbum' });
  });
});
