import { CameraRoll } from 'react-native';
import * as Storage from '../storage';

export const LOAD_SAVED_PHOTOS = 'album/LOAD_SAVED_PHOTOS';
export const ADD_SAVED_PHOTO = 'album/ADD_SAVED_PHOTO';
export const LOAD_GALLERY_PHOTOS = 'album/LOAD_GALLERY_PHOTOS';
export const ADD_GALLERY_PHOTOS = 'album/ADD_GALLERY_PHOTOS';
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

export function addGalleryImages(galleryImages) {
  return {type: ADD_GALLERY_PHOTOS, galleryImages};
}

export function loadGalleryImages() {
  return (dispatch) => {
    CameraRoll.getPhotos({
      first: 1,
      assetType: 'Photos'
    }).then(roll => {
      dispatch(loadLatestImage(roll.edges[0].node.image.uri));
      dispatch(loadGallery(roll.edges));
      if(roll.page_info.has_next_page) {
        dispatch(loadAllImages(roll.page_info.end_cursor));
      }
    });
  }
}

export function loadAllImages(end_cursor) {
  return (dispatch) => {
    CameraRoll.getPhotos({
      first: 20,
      after: end_cursor,
      assetType: 'Photos'
    }).then(roll => {
      dispatch(addGalleryImages(roll.edges));
      // if(roll.page_info.has_next_page) {
      //   dispatch(loadAllImages(roll.page_info.end_cursor));
      // }
    });
  }
}
