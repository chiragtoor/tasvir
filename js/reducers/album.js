import { combineReducers } from 'redux';
import * as Actions from '../actions/album';

function id(state = null, action) {
  switch(action.type) {
    case Actions.UPDATE_ALBUM_ID:
      return action.id;
    case Actions.RESET_ALBUM:
      return null;
    default:
      return state;
  }
}

function name(state = null, action) {
  switch(action.type) {
    case Actions.UPDATE_ALBUM_NAME:
      return action.name;
    case Actions.RESET_ALBUM:
      return null;
    default:
      return state;
  }
}

function link(state = null, action) {
  switch(action.type) {
    case Actions.LOAD_LINK:
      return action.link;
    case Actions.RESET_ALBUM:
      return null;
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
    case Actions.RESET_ALBUM:
      return [];
    default:
      return state;
  }
}

function albumDate(state = null, action) {
  switch(action.type) {
    case Actions.LOAD_DATE:
      return action.date;
    default:
      return state;
  }
}

function history(state = [], action) {
  switch(action.type) {
    case Actions.SET_HISTORY:
      return action.history;
    default:
      return state;
  }
}

const album = combineReducers({
  id,
  name,
  link,
  images,
  albumDate,
  history
});

export default album;
