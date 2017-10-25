import { combineReducers } from 'redux';
import * as Actions from '../actions/app';

function autoShare(state = false, action) {
  switch(action.type) {
    case Actions.APP_UPDATE_AUTO_SHARE:
      return action.autoShare;
    default:
      return state;
  }
}

function senderId(state = null, action) {
  switch(action.type) {
    case Actions.APP_UPDATE_SENDER_ID:
      return action.senderId;
    default:
      return state;
  }
}

function savedPhotos(state = [], action) {
  switch(action.type) {
    case Actions.APP_LOAD_SAVED_PHOTOS:
      return action.savedPhotos;
    case Actions.APP_ADD_SAVED_PHOTO:
      return [...state, action.photo];
    default:
      return state;
  }
}

function imageReceivedFlag(state = false, action) {
  switch(action.type) {
    case Actions.APP_UPDATE_RECEIVED_IMAGE_FLAG:
      return action.flag;
    default:
      return state;
  }
}

function albumFormState(state = Actions.APP_ALBUM_FORM_STATE_INIT, action) {
  switch(action.type) {
    case Actions.APP_OPEN_ALBUM_FORM:
      return Actions.APP_ALBUM_FORM_STATE_OPEN;
    case Actions.APP_RESET_ALBUM_FORM:
      return Actions.APP_ALBUM_FORM_STATE_INIT;
    default:
      return state;
  }
}

const app = combineReducers({
  autoShare,
  senderId,
  savedPhotos,
  imageReceivedFlag,
  albumFormState
});

export default app;
