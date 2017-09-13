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

const album = combineReducers({
  id,
  name,
  link
});

export default album;
