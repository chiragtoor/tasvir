import { combineReducers } from 'redux';
import * as Actions from '../actions/gallery';

function buttonImage(state = null, action) {
  switch(action.type) {
    case Actions.SET_GALLERY_BUTTON_IMAGE:
      return action.image;
    default:
      return state;
  }
}

function images(state = [], action) {
  switch(action.type) {
    case Actions.LOAD_IMAGES:
      return action.images;
    case Actions.ADD_IMAGES:
      return [...state, ...action.images];
    default:
      return state;
  }
}

function cursor(state = null, action) {
  switch(action.type) {
    case Actions.SET_IMAGE_CURSOR:
      return action.cursor;
    default:
      return state;
  }
}

function viewingAlbum(state = null, action) {
  switch(action.type) {
    case Actions.SET_VIEWING_ALBUM:
      return action.album;
    default:
      return state;
  }
}

const gallery = combineReducers({
  buttonImage,
  images,
  cursor,
  viewingAlbum
});

export default gallery;
