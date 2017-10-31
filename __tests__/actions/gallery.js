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

  it('addImages() dispatches ADD_IMAGES', () => {
    const images = ["one", "two", "three"];
    const expectedAction = {
      type: Actions.ADD_IMAGES,
      images
    }
    expect(Actions.addImages(images)).toEqual(expectedAction);
  });

  it('setCursor() dispatches SET_IMAGE_CURSOR', () => {
    const cursor = "next image load cursor";
    const expectedAction = {
      type: Actions.SET_IMAGE_CURSOR,
      cursor
    }
    expect(Actions.setCursor(cursor)).toEqual(expectedAction);
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
