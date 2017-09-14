import { CameraRoll } from 'react-native';
import * as Storage from '../storage';

export const LOAD_SAVED_PHOTOS = 'album/LOAD_SAVED_PHOTOS';
export const ADD_SAVED_PHOTO = 'album/ADD_SAVED_PHOTO';
export const LOAD_GALLERY_PHOTOS = 'album/LOAD_GALLERY_PHOTOS';

export function loadSavedPhotos(savedPhotos) {
  return {type: LOAD_SAVED_PHOTOS, savedPhotos};
}

export function addSavedPhoto(savedPhoto) {
  return (dispatch, getState) => {
    const { photos: { savedPhotoIds } } = getState();
    Storage.saveDownloadedPhotos([savedPhoto, ...savedPhotoIds]);
    dispatch({type: ADD_SAVED_PHOTO, savedPhoto });
  }
}

export function loadGalleryImages() {
  return (dispatch) => {
    CameraRoll.getPhotos({
      first: 3,
      assetType: 'Photos'
    }).then(roll => {
      dispatch({type: LOAD_GALLERY_PHOTOS, galleryImages: roll.edges })
    });
  }
}
