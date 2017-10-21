import { combineReducers } from 'redux';
import * as Actions from '../actions/photos';

function galleryImages(state = [], action) {
  switch(action.type) {
    case Actions.LOAD_GALLERY_PHOTOS:
      return action.galleryImages;
    default:
      return state;
  }
}

function latestImage(state = [], action) {
  switch(action.type) {
    case Actions.LOAD_LATEST_IMAGE:
      return action.latestImage;
    default:
      return state;
  }
}

const photos = combineReducers({
  galleryImages,
  latestImage
});

export default photos;
