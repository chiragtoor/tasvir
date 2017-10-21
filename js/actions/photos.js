import { CameraRoll } from 'react-native';
import * as Storage from '../storage';

export const LOAD_GALLERY_PHOTOS = 'album/LOAD_GALLERY_PHOTOS';
export const LOAD_LATEST_IMAGE = 'album/LOAD_LATEST_IMAGE';

export function loadLatestImage(latestImage) {
  return {type: LOAD_LATEST_IMAGE, latestImage};
}

export function loadGallery(galleryImages) {
  return {type: LOAD_GALLERY_PHOTOS, galleryImages};
}

export function loadGalleryImages() {
  return (dispatch) => {
    CameraRoll.getPhotos({
      first: 1,
      assetType: 'Photos'
    }).then(roll => {
      dispatch(loadLatestImage(roll.edges[0].node.image.uri));
      CameraRoll.getPhotos({
        first: 100,
        assetType: 'Photos'
      }).then(roll => {
        dispatch(loadGallery(roll.edges));
      });
    });
  }
}
