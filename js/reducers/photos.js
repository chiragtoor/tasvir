import { combineReducers } from 'redux';
import * as Actions from '../actions/photos';

function savedPhotoIds(state = [], action) {
  switch(action.type) {
    case Actions.LOAD_SAVED_PHOTOS:
      return action.savedPhotos;
    case Actions.ADD_SAVED_PHOTO:
      return [...state, action.savedPhoto];
    default:
      return state;
  }
}

function galleryImages(state = [], action) {
  switch(action.type) {
    case Actions.LOAD_GALLERY_PHOTOS:
      return action.galleryImages;
    default:
      return state;
  }
}

const photos = combineReducers({
  savedPhotoIds,
  galleryImages
});

export default photos;