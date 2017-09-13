import { combineReducers } from 'redux';
import * as Actions from '../actions/reel';

import { INIT_REEL, POST_ACTION_SCROLL, CAMERA_PAGE, MENU_PAGE } from '../constants';

function previewReel(state = [], action) {
  switch(action.type) {
    case Actions.LOAD_PREVIEW_REEL:
      return action.previewReel;
    case Actions.REEL_ADD_IMAGE:
      return [action.image, ...state];
    case Actions.REEL_REMOVE_IMAGE:
      return [
        ...state.slice(0, action.index),
        ...state.slice(action.index + 1)
      ];
    default:
      return state;
  }
}

function currentIndex(state = 1, action) {
  switch(action.type) {
    case Actions.UPDATE_CURRENT_INDEX:
      return action.currentIndex;
    default:
      return state;
  }
}

const reel = combineReducers({
  previewReel,
  currentIndex
});

export default reel;
