import { POST_ACTION_SCROLL, CAMERA_PAGE, MENU_PAGE } from '../constants';

export const LOAD_PREVIEW_REEL = 'reel/LOAD_PREVIEW_REEL';
export const REEL_ADD_IMAGE = 'reel/REEL_ADD_IMAGE';
export const REEL_REMOVE_IMAGE = 'reel/REEL_REMOVE_IMAGE';
export const REEL_REMOVE_IMAGE_LEFT_EDGE = 'reel/REEL_REMOVE_IMAGE_LEFT_EDGE';
export const REEL_REMOVE_IMAGE_RIGHT_EDGE = 'reel/REEL_REMOVE_IMAGE_RIGHT_EDGE';

export const UPDATE_CURRENT_INDEX = 'reel/UPDATE_CURRENT_INDEX';

export function updateCurrentIndex(currentIndex) {
  return {type: UPDATE_CURRENT_INDEX, currentIndex}
}

export function loadPreviewReel(previewReel) {
  return {type: LOAD_PREVIEW_REEL, previewReel};
}

export function addImage(image) {
  return {type: REEL_ADD_IMAGE, image};
}

export function removeImage(index) {
  return {type: REEL_REMOVE_IMAGE, index};
}
