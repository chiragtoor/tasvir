import { POST_ACTION_SCROLL, CAMERA_PAGE, MENU_PAGE } from '../constants';

export const LOAD_PREVIEW_REEL = 'reel/LOAD_PREVIEW_REEL';
export const REEL_ADD_IMAGE = 'reel/REEL_ADD_IMAGE';
export const REEL_REMOVE_IMAGE = 'reel/REEL_REMOVE_IMAGE';
export const REEL_REMOVE_IMAGE_LEFT_EDGE = 'reel/REEL_REMOVE_IMAGE_LEFT_EDGE';
export const REEL_REMOVE_IMAGE_RIGHT_EDGE = 'reel/REEL_REMOVE_IMAGE_RIGHT_EDGE';

export const UPDATE_CURRENT_INDEX = 'reel/UPDATE_CURRENT_INDEX';
export const LOCK_VIEW_PAGER = 'reel/LOCK_VIEW_PAGER';
export const UNLOCK_VIEW_PAGER = 'reel/UNLOCK_VIEW_PAGER';
export const LOCK_SWIPER = 'reel/LOCK_SWIPER';
export const UNLOCK_SWIPER = 'reel/UNLOCK_SWIPER';

export const UPDATE_MAIN_PAGE_CAMERA = 'reel/UPDATE_MAIN_PAGE_CAMERA';
export const UPDATE_MAIN_PAGE_MENU = 'reel/UPDATE_MAIN_PAGE_MENU';

export function updateMainPage(page) {
  return (dispatch, getState) => {
    const { reel: { mainPage, viewPagerLocked } } = getState();

    if(page == CAMERA_PAGE) {
      dispatch({ type: UPDATE_MAIN_PAGE_CAMERA });
    } else if(page == MENU_PAGE) {
      dispatch({ type: UPDATE_MAIN_PAGE_MENU });
    }

    if(viewPagerLocked && page == CAMERA_PAGE) {
      dispatch(unlockViewPager());
    } else if(!viewPagerLocked && page != CAMERA_PAGE) {
      dispatch(lockViewPager());
    }
  }
}

export function lockViewPager() {
  return { type: LOCK_VIEW_PAGER }
}

export function unlockViewPager() {
  return { type: UNLOCK_VIEW_PAGER }
}

export function lockSwiper() {
  return { type: LOCK_SWIPER }
}

export function unlockSwiper() {
  return { type: UNLOCK_SWIPER }
}

export function updateCurrentIndex(currentIndex) {
  return (dispatch, getState) => {
    const { reel: { swiperLocked } } = getState();
    dispatch({type: UPDATE_CURRENT_INDEX, currentIndex});
    if(swiperLocked && currentIndex == 0) {
      dispatch(unlockSwiper());
    } else if(!swiperLocked && currentIndex != 0) {
      dispatch(lockSwiper());
    }
  }
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

    dispatch(addImage(imagePack, 1));
  }
}

export function removeFromReel(index, scrollCallback) {
  return (dispatch, getState) => {
    const {reel: {currentIndex, cameraIndex, previewReel}} = getState();
    if(index == (previewReel.length - 1)) {
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
