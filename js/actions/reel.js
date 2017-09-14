import * as Storage from '../storage';

export const LOAD_PREVIEW_REEL = 'reel/LOAD_PREVIEW_REEL';
export const REEL_ADD_IMAGE = 'reel/REEL_ADD_IMAGE';
export const REEL_REMOVE_IMAGE = 'reel/REEL_REMOVE_IMAGE';
export const UPDATE_CURRENT_INDEX = 'reel/UPDATE_CURRENT_INDEX';

export function updateCurrentIndex(currentIndex) {
  return {type: UPDATE_CURRENT_INDEX, currentIndex}
}

export function loadPreviewReel(previewReel) {
  return {type: LOAD_PREVIEW_REEL, previewReel};
}

export function addImage(image) {
  return (dispatch, getState) => {
    const { reel: { previewReel } } = getState();
    Storage.savePreviewReel([image, ...previewReel]);
    dispatch({type: REEL_ADD_IMAGE, image});
  }
}

export function removeImage(index) {
  return {type: REEL_REMOVE_IMAGE, index};
}
