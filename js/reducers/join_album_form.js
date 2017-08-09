import { combineReducers } from 'redux';
import * as Actions from '../actions/join_album_form';

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

const joinAlbumForm = combineReducers({
  id,
  name
});

export default joinAlbumForm;
