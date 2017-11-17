import * as Actions from '../../js/actions/gallery';
import reducer from '../../js/reducers/gallery';

describe('gallery_reducer', () => {

  const expectedInitialState = {
    buttonImage: null,
    images: [],
    cursor: null,
    viewingAlbum: null
  };

  it('initial state is as expected', () => {
    expect(
      reducer(undefined, {})
    ).toEqual(expectedInitialState);
  });

  it('handles LOAD_IMAGES properly', () => {
    const images = [1, 2, 3];
    expect(
      reducer({}, {
        type: Actions.LOAD_IMAGES,
        images
      })
    ).toEqual(
      {
        ...expectedInitialState,
        images: images
      }
    );
  });

  it('handles ADD_IMAGES properly', () => {
    const existingImages = [1, 2, 3];
    const images = [4, 5, 6];
    expect(
      reducer({
        images: existingImages
      }, {
        type: Actions.ADD_IMAGES,
        images: images
      })
    ).toEqual(
      {
        ...expectedInitialState,
        images: [...existingImages, ...images]
      }
    );
  });

  it('handles SET_IMAGE_CURSOR properly', () => {
    const cursor = "cursor";
    expect(
      reducer({ }, {
        type: Actions.SET_IMAGE_CURSOR,
        cursor: cursor
      })
    ).toEqual(
      {
        ...expectedInitialState,
        cursor: cursor
      }
    );
  });

  it('handles SET_GALLERY_BUTTON_IMAGE properly', () => {
    const image = "image uri to display";
    expect(
      reducer({ }, {
        type: Actions.SET_GALLERY_BUTTON_IMAGE,
        image
      })
    ).toEqual(
      {
        ...expectedInitialState,
        buttonImage: image
      }
    );
  });

  it('handles SET_VIEWING_ALBUM properly', () => {
    const album = {name: "album", image: { uri: "uri", width: 9, height: 16 }, images: [1, 2, 3], albumDate: "Jan. 1st, 2017"};
    expect(
      reducer({ }, {
        type: Actions.SET_VIEWING_ALBUM,
        album
      })
    ).toEqual(
      {
        ...expectedInitialState,
        viewingAlbum: album
      }
    );
  });
});
