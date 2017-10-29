import { CameraRoll } from 'react-native';
import * as Storage from '../storage';

export const LOAD_SAVED_PHOTOS = 'album/LOAD_SAVED_PHOTOS';
export const ADD_SAVED_PHOTO = 'album/ADD_SAVED_PHOTO';
export const LOAD_GALLERY_PHOTOS = 'album/LOAD_GALLERY_PHOTOS';
export const LOAD_LATEST_IMAGE = 'album/LOAD_LATEST_IMAGE';

export function loadSavedPhotos(savedPhotos) {
  return {type: LOAD_SAVED_PHOTOS, savedPhotos};
}

export function addSavedPhoto(savedPhoto) {
  return {type: ADD_SAVED_PHOTO, savedPhoto };
}

export function loadLatestImage(latestImage) {
  return {type: LOAD_LATEST_IMAGE, latestImage};
}

export function loadGallery(galleryImages) {
  return {type: LOAD_GALLERY_PHOTOS, galleryImages};
}

export function loadGalleryImages() {
  return (dispatch) => {
    return CameraRoll.getPhotos({
      first: 1,
      assetType: 'Photos'
    }).then(roll => {
      dispatch(loadLatestImage(roll.edges[0].node.image.uri));
      return CameraRoll.getPhotos({
        first: 100,
        assetType: 'Photos'
      }).then(roll => {
        dispatch(loadGallery(roll.edges));
      });
    });
  }
}
