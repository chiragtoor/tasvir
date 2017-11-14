import * as Actions from '../../js/actions/album';
import reducer from '../../js/reducers/album';

describe('album_reducer', () => {

  const expectedInitialState = {
    id: null,
    name: null,
    link: null,
    images: [],
    albumDate: null
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

  it('handles LOAD_DATE properly', () => {
    const date = "some date"
    expect(
      reducer({}, {
        type: Actions.LOAD_DATE,
        date
      })
    ).toEqual({
      ...expectedInitialState,
      albumDate: date
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
});
