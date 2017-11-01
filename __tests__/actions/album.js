import * as Actions from '../../js/actions/album';
import * as TasvirApi from '../../js/actions/tasvir_api';
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

  it('setHistory() dipatches SET_HISTORY', () => {
    const albumHistory = [{id: "old id", name: "old album 1"}, {id: "old id 2", name: "old name 2"}];
    const expectedAction = {
      type: Actions.SET_HISTORY,
      history: albumHistory
    }
    expect(Actions.setHistory(albumHistory)).toEqual(expectedAction);
  });

  it('openAlbum opens album at index, loads via API, removes from history', () => {
    const albumHistory = [{id: "old id", name: "old album 1"}, {id: "old id 2", name: "old name 2"}];
    const mockAction = { type: "MOCK_ACTION" };
    TasvirApi.loadAlbum = jest.fn(() => {
      return mockAction;
    });

    const expectedActions = [
      { type: Actions.RESET_ALBUM },
      { type: Actions.UPDATE_ALBUM_ID, id: "old id" },
      { type: Actions.UPDATE_ALBUM_NAME, name: "old album 1" },
      mockAction,
      { type: Actions.SET_HISTORY, history: [{id: "old id 2", name: "old name 2"}]}
    ];
    const store = mockStore({ album: { history: albumHistory } });
    store.dispatch(Actions.openAlbum(0));
    expect(store.getActions()).toEqual(expectedActions);
  })
});
