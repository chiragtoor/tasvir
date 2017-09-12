import { combineReducers } from 'redux';
import * as Actions from '../actions/reel';

import { INIT_REEL, POST_ACTION_SCROLL, CAMERA_PAGE, MENU_PAGE } from '../constants';

function previewReel(state = INIT_REEL, action) {
  switch(action.type) {
    case Actions.LOAD_PREVIEW_REEL:
      return action.previewReel;
    case Actions.REEL_ADD_IMAGE:
      return [
        ...state.slice(0, action.index),
        action.imagePack,
        ...state.slice(action.index)
      ];
    case Actions.REEL_REMOVE_IMAGE:
      return [
        ...state.slice(0, action.index),
        ...state.slice(action.index + 1)
      ];
    case Actions.REEL_REMOVE_IMAGE_RIGHT_EDGE:
      let imagePackRightmost = state[action.index - 1];
      imagePackRightmost.postAction = POST_ACTION_SCROLL.LEFT;
      return [
        ...state.slice(0, action.index - 1),
        imagePackRightmost,
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
