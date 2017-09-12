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

function addImage(imagePack, index) {
  return {type: REEL_ADD_IMAGE, imagePack, index};
}

function removeImage(index) {
  return {type: REEL_REMOVE_IMAGE, index};
}

function removeImageRightEdge(index) {
  return {type: REEL_REMOVE_IMAGE_RIGHT_EDGE, index};
}

function getUniqueKey() {
  return (new Date()).getTime();
}

export function addToReel(image) {
  return (dispatch, getState) => {
    const { reel: { previewReel } } = getState();
    let scrollDirection = POST_ACTION_SCROLL.LEFT;
    // change to a post action right scroll if conditions are met
    if(previewReel.length > 1) {
      scrollDirection = POST_ACTION_SCROLL.RIGHT;
    }

    const imagePack = {
      key: getUniqueKey(),
      isImage: true,
      image: image,
      postAction: scrollDirection
    }

    dispatch(addImage(imagePack, 2));
  }
}

export function removeFromReel(index, scrollCallback) {
  return (dispatch, getState) => {
    const {reel: {currentIndex, cameraIndex, previewReel}} = getState();
    if(index == (previewReel.length - 1) && previewReel.length > 1) {
      dispatch(removeImageRightEdge(index));
    } else {
      dispatch(removeImage(index));
    }
    if(previewReel[index].postAction == POST_ACTION_SCROLL.LEFT) {
      dispatch(updateCurrentIndex(currentIndex - 1));
      scrollCallback(currentIndex - 1);
    } else {
      scrollCallback(currentIndex);
    }
  }
}
