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

function formState(state = Actions.INIT_STATE, action) {
  switch(action.type) {
    case Actions.UPDATE_ALBUM_FORM_STATE:
      return action.state;
    case Actions.RESET_ALBUM_FORM:
      return Actions.INIT_STATE;
    default:
      return state;
  }
}

const albumForm = combineReducers({
  name,
  formState
});

export default albumForm;
