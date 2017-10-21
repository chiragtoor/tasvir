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

function idfv(state = null, action) {
  switch(action.type) {
    case Actions.UPDATE_SETTINGS_IDFV:
      console.log("TASVIR -- SET IN REDUCER: ", action.idfv);
      return action.idfv;
    default:
      return state;
  }
}

const settings = combineReducers({
  autoShare,
  idfv
});

export default settings;
