import { combineReducers } from 'redux';
import * as Actions from '../actions/album_form';

function name(state = "", action) {
  switch(action.type) {
    case Actions.UPDATE_ALBUM_NAME:
      return action.name;
    case Actions.RESET_ALBUM_FORM:
      return "";
    default:
      return state;
  }
}

const albumForm = combineReducers({
  name
});

export default albumForm;
