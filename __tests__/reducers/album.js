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

  it('handles LOAD_IMAGES properly', () => {
    const images = [0, 1, 2]
    expect(
      reducer({}, {
        type: Actions.LOAD_IMAGES,
        images
      })
    ).toEqual({
      ...expectedInitialState,
      images: images
    });
  });

  it('handles ADD_IMAGE properly', () => {
    const images = [0, 1, 2];
    const image = 3;
    expect(
      reducer({ images: images }, {
        type: Actions.ADD_IMAGE,
        image
      })
    ).toEqual({
      ...expectedInitialState,
      images: [image, ...images]
    });
  });

  it('handles LOAD_ALBUM_DATE properly', () => {
    const albumDate = "some date"
    expect(
      reducer({}, {
        type: Actions.LOAD_ALBUM_DATE,
        albumDate
      })
    ).toEqual({
      ...expectedInitialState,
      albumDate: albumDate
    });
  });
});
