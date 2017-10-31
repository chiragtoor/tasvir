import { CameraRoll } from 'react-native';
import * as Storage from '../storage';

export const LOAD_IMAGES = 'gallery/LOAD_IMAGES';
export const ADD_IMAGES = 'gallery/ADD_IMAGES';
export const SET_IMAGE_CURSOR = 'gallery/SET_IMAGE_CURSOR';
export const SET_GALLERY_BUTTON_IMAGE = 'gallery/SET_GALLERY_BUTTON_IMAGE';

export function loadImages(images) {
  return {type: LOAD_IMAGES, images};
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
  return (dispatch) => {
    return CameraRoll.getPhotos({
      first: 1,
      assetType: 'Photos'
    }).then(roll => {
      if(roll.edges && roll.edges.length > 0) {
        dispatch(setGalleryButtonImage(roll.edges[0].node.image.uri));
        return CameraRoll.getPhotos({
          first: 100,
          assetType: 'Photos'
        }).then(roll => {
          dispatch(loadImages(roll.edges));
        });
      }
    });
  }
}