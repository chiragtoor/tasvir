import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';

import * as Actions from '../actions/app';
import * as Confirmation from '../actions/confirmation';

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

function confirmationAccept(state = null, action) {
  switch(action.type) {
    case Confirmation.CONFIRMATION_SET_CONFIRMATION_ACCEPT:
      return action.accept;
    default:
      return state;
  }
}

function confirmationReject(state = null, action) {
  switch(action.type) {
    case Confirmation.CONFIRMATION_SET_CONFIRMATION_REJECT:
      return action.reject;
    default:
      return state;
  }
}

function confirmationCopy(state = null, action) {
  switch(action.type) {
    case Actions.APP_SET_CONFIRMATION_COPY:
      return action.copy;
    default:
      return state;
  }
}

function confirmationAcceptCopy(state = null, action) {
  switch(action.type) {
    case Actions.APP_SET_CONFIRMATION_ACCEPT_COPY:
      return action.copy;
    default:
      return state;
  }
}

function confirmationRejectCopy(state = null, action) {
  switch(action.type) {
    case Actions.APP_SET_CONFIRMATION_REJECT_COPY:
      return action.copy;
    default:
      return state;
  }
}

function onCompleteWalkthrough(state = Actions.DEFAULT_WALKTHROUGH_COMPLETE, action) {
  switch(action.type) {
    case Actions.APP_SET_WALKTHROUGH_COMPLETE:
      return action.complete;
    default:
      return state;
  }
}

function albumHistory(state = [], action) {
  switch(action.type) {
    case Actions.SET_HISTORY:
      return action.history;
    default:
      return state;
  }
}

function galleryState(state = Actions.APP_GALLERY_STATE_LIST, action) {
  switch(action.type) {
    case Actions.SET_GALLERY_STATE:
      return action.state;
    default:
      return state;
  }
}

const app = combineReducers({
  autoShare,
  senderId,
  savedPhotos,
  imageReceivedFlag,
  albumFormState,
  albumHistory,
  confirmationAccept,
  confirmationReject,
  confirmationCopy,
  confirmationAcceptCopy,
  confirmationRejectCopy,
  onCompleteWalkthrough,
  galleryState
});

export default app;
