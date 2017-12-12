import * as Actions from '../../js/actions/gallery';

describe('gallery_actions', () => {
  it('loadImages() dispatches LOAD_IMAGES', () => {
    const images = ["one", "two", "three"];
    const expectedAction = {
      type: Actions.LOAD_IMAGES,
      images
    }
    expect(Actions.loadImages(images)).toEqual(expectedAction);
  });

  it('viewAlbum() dispatches SET_VIEWING_ALBUM', () => {
    const album = "album";
    const expectedAction = {
      type: Actions.SET_VIEWING_ALBUM,
      album
    }
    expect(Actions.viewAlbum(album)).toEqual(expectedAction);
  });

  it('setGalleryButtonImage() dispatches SET_GALLERY_BUTTON_IMAGE', () => {
    const image = "uri to image";
    const expectedAction = {
      type: Actions.SET_GALLERY_BUTTON_IMAGE,
      image
    }
    expect(Actions.setGalleryButtonImage(image)).toEqual(expectedAction);
  });
});
