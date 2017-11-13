import * as Actions from '../../js/actions/album';
import reducer from '../../js/reducers/album';

describe('album_reducer', () => {

  const expectedInitialState = {
    id: null,
    name: null,
    link: null,
    history: [],
    images: []
  };

  it('initial state is as expected', () => {
    expect(
      reducer(undefined, { })
    ).toEqual(expectedInitialState);
  });

  it('handles UPDATE_ALBUM_NAME properly', () => {
    const name = "Album";
    expect(
      reducer({}, {
        type: Actions.UPDATE_ALBUM_NAME,
        name: name
      })
    ).toEqual({
      ...expectedInitialState,
      name: name
    });
  });

  it('handles UPDATE_ALBUM_ID properly', () => {
    const id = "album link"
    expect(
      reducer({}, {
        type: Actions.UPDATE_ALBUM_ID,
        id
      })
    ).toEqual({
      ...expectedInitialState,
      id: id
    });
  });

  it('handles LOAD_LINK properly', () => {
    const link = "branch link"
    expect(
      reducer({}, {
        type: Actions.LOAD_LINK,
        link
      })
    ).toEqual({
      ...expectedInitialState,
      link: link
    });
  });

  it('handles RESET_ALBUM properly', () => {
    expect(
      reducer({
        id: "some id",
        name: "an album",
        link: "branch link"
      }, {
        type: Actions.RESET_ALBUM
      })
    ).toEqual(expectedInitialState);
  });

  it('handles SET_HISTORY properly', () => {
    const albumHistory = [{id: "old id", name: "old album 1"}, {id: "old id 2", name: "old name 2"}];
    expect(
      reducer({ }, {
        type: Actions.SET_HISTORY,
        history: albumHistory
      })
    ).toEqual({
      ...expectedInitialState,
      history: albumHistory
    });
  });
});
