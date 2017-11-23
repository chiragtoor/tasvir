import { combineReducers } from 'redux';
import * as Actions from '../actions/album';

function id(state = null, action) {
  switch(action.type) {
    case Actions.UPDATE_ALBUM_ID:
      return action.id;
    default:
      return state;
  }
}

function name(state = null, action) {
  switch(action.type) {
    case Actions.UPDATE_ALBUM_NAME:
      return action.name;
    default:
      return state;
  }
}

function link(state = null, action) {
  switch(action.type) {
    case Actions.LOAD_LINK:
      return action.link;
    default:
      return state;
  }
}

function images(state = [], action) {
  switch(action.type) {
    case Actions.LOAD_IMAGES:
      return action.images;
    case Actions.ADD_IMAGE:
      return [action.image, ...state];
    default:
      return state;
  }
}

function albumDate(state = null, action) {
  switch(action.type) {
    case Actions.LOAD_ALBUM_DATE:
      return action.albumDate;
    default:
      return state;
  }
}

const album = combineReducers({
  id,
  name,
  link,
  images,
  albumDate
});

export default album;
