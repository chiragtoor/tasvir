import { combineReducers } from 'redux';
import * as Actions from '../actions/settings';

function autoShare(state = false, action) {
  switch(action.type) {
    case Actions.UPDATE_SETTINGS_AUTO_SHARE:
      return action.autoShare;
    default:
      return state;
  }
}

const settings = combineReducers({
  autoShare
});

export default settings;
