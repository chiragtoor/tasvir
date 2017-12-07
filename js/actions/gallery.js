import { CameraRoll } from 'react-native';
import * as Storage from '../storage';

export const LOAD_IMAGES = 'gallery/LOAD_IMAGES';
export const ADD_IMAGES = 'gallery/ADD_IMAGES';
export const SET_IMAGE_CURSOR = 'gallery/SET_IMAGE_CURSOR';
export const SET_GALLERY_BUTTON_IMAGE = 'gallery/SET_GALLERY_BUTTON_IMAGE';
export const SET_VIEWING_ALBUM = 'gallery/SET_VIEWING_ALBUM';

export function loadImages(images) {
  return {type: LOAD_IMAGES, images};
}

export function viewAlbum(album) {
  return { type: SET_VIEWING_ALBUM, album };
}

export function addImages(images) {
  return {type: ADD_IMAGES, images };
}

export function setCursor(cursor) {
  return {type: SET_IMAGE_CURSOR, cursor};
}

export function setGalleryButtonImage(image) {
  return {type: SET_GALLERY_BUTTON_IMAGE, image};
}

export function loadGallery() {
  return (dispatch, getState) => {
    return CameraRoll.getPhotos({
      first: 1,
      assetType: 'Photos'
    }).then(roll => {
      if(roll.edges && roll.edges.length > 0) {
        const buttonImage = roll.edges[0].node.image;
        dispatch(setGalleryButtonImage({uri: buttonImage.uri, width: buttonImage.width, height: buttonImage.height}));
        return CameraRoll.getPhotos({
          first: 20,
          assetType: 'Photos'
        }).then(roll => {
          if(roll.page_info.has_next_page) {
            dispatch(setCursor(roll.page_info.end_cursor));
          }
          const images = roll.edges.map((data) => {
            const image = data.node.image;
            return {
              uri: image.uri,
              width: image.width,
              height: image.height
            }
          });
          dispatch(loadImages(images));
        });
      }
    });
  }
}

export function loadMoreGallery() {
  return (dispatch, getState) => {
    const { gallery: { cursor, viewingAlbum: { images } } } = getState();
    return CameraRoll.getPhotos({
      first: 20,
      assetType: 'Photos',
      after: cursor
    }).then(roll => {
      if(roll.page_info.has_next_page) {
        dispatch(setCursor(roll.page_info.end_cursor));
      }
      const newImages = roll.edges.map((data) => {
        const image = data.node.image;
        return {
          uri: image.uri,
          width: image.width,
          height: image.height
        }
      });
      const viewImages = [...images, ...newImages];
      dispatch(viewAlbum({name: "All Images", images: viewImages, fullGallery: true}))
    });
  }
}
