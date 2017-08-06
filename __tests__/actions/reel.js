import fetch from 'isomorphic-fetch';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as Reel from '../../js/actions/reel';
import { BASE_REEL, POST_ACTION_SCROLL, REEL, CAMERA_PAGE, MENU_PAGE } from '../../js/constants';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares)

describe('settings_actions', () => {
  afterEach(() => {
    jest.resetModules();
  })

  it('creates UPDATE_MAIN_PAGE_CAMERA action, unlocks view pager', () => {
    const store = mockStore({
      reel: {
        previewReel: [0, 1, 2],
        currentIndex: 1,
        swiperLocked: false,
        viewPagerLocked: true,
        mainPage: 1
      }
    });
    const expectedActions = [
      { type: Reel.UPDATE_MAIN_PAGE_CAMERA },
      { type: Reel.UNLOCK_VIEW_PAGER }
    ];
    store.dispatch(Reel.updateMainPage(CAMERA_PAGE));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('creates UPDATE_MAIN_PAGE_MENU action, locks view pager', () => {
    const store = mockStore({
      reel: {
        previewReel: [0, 1, 2],
        cameraIndex: 1,
        currentIndex: 1,
        swiperLocked: false,
        viewPagerLocked: false,
        mainPage: 0
      }
    });
    const expectedActions = [
      { type: Reel.UPDATE_MAIN_PAGE_MENU },
      { type: Reel.LOCK_VIEW_PAGER }
    ];
    store.dispatch(Reel.updateMainPage(MENU_PAGE));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('creates UPDATE_CURRENT_INDEX action', () => {
    const store = mockStore({
      reel: {
        previewReel: [0, 1, 2, 3],
        cameraIndex: 1,
        currentIndex: 2,
        swiperLocked: true,
        viewPagerLocked: false,
        mainPage: 0
      }
    });
    const expectedActions = [
      {
        type: Reel.UPDATE_CURRENT_INDEX,
        currentIndex: 3
      }
    ]
    store.dispatch(Reel.updateCurrentIndex(3))
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('UPDATE_CURRENT_INDEX action locks swiper when swiping to images from camera', () => {
    const store = mockStore({
      reel: {
        previewReel: [0, 1, 2],
        cameraIndex: 1,
        currentIndex: 1,
        swiperLocked: false,
        viewPagerLocked: false,
        mainPage: 0
      }
    });
    const expectedActions = [
      {
        type: Reel.UPDATE_CURRENT_INDEX,
        currentIndex: 2
      },
      { type: Reel.LOCK_SWIPER }
    ]
    store.dispatch(Reel.updateCurrentIndex(2))
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('UPDATE_CURRENT_INDEX action unlocks swiper when swiping back to camera', () => {
    const store = mockStore({
      reel: {
        previewReel: [0, 1, 2],
        cameraIndex: 0,
        currentIndex: 1,
        swiperLocked: true,
        viewPagerLocked: false,
        mainPage: 0
      }
    });
    const expectedActions = [
      {
        type: Reel.UPDATE_CURRENT_INDEX,
        currentIndex: 0
      },
      { type: Reel.UNLOCK_SWIPER }
    ]
    store.dispatch(Reel.updateCurrentIndex(0))
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('creates LOCK_VIEW_PAGER action', () => {
    const expectedAction = {
      type: Reel.LOCK_VIEW_PAGER,
    };
    expect(Reel.lockViewPager()).toEqual(expectedAction)
  });

  it('creates UNLOCK_VIEW_PAGER action', () => {
    const expectedAction = {
      type: Reel.UNLOCK_VIEW_PAGER,
    };
    expect(Reel.unlockViewPager()).toEqual(expectedAction)
  });

  it('creates LOCK_SWIPER action', () => {
    const expectedAction = {
      type: Reel.LOCK_SWIPER,
    };
    expect(Reel.lockSwiper()).toEqual(expectedAction)
  });

  it('creates UNLOCK_SWIPER action', () => {
    const expectedAction = {
      type: Reel.UNLOCK_SWIPER,
    };
    expect(Reel.unlockSwiper()).toEqual(expectedAction)
  });

  it('creates LOAD_PREVIEW_REEL action', () => {
    const expectedAction = {
      type: Reel.LOAD_PREVIEW_REEL,
      previewReel: REEL
    };
    expect(Reel.loadPreviewReel(REEL)).toEqual(expectedAction)
  });

  it('adds a user taken image to the previews in a non-empty reel', () => {
    const setDate = new Date('2017');
    global.Date = jest.fn(() => setDate);
    const existingReel = [
      BASE_REEL,
      {
        key: 4,
        isImage: true,
        image: 'TEST_4',
        postAction: POST_ACTION_SCROLL.LEFT
      },
    ];
    const store = mockStore({
      reel: {
        previewReel: existingReel,
        cameraIndex: 0,
        currentIndex: 0,
        swiperLocked: false,
        viewPagerLocked: false,
        mainPage: 0
      }
    });
    const image = 'TEST_1';
    const expectedActions = [
      {
        type: Reel.REEL_ADD_IMAGE,
        imagePack: {
          key: setDate.getTime(),
          isImage: true,
          image: image,
          postAction: POST_ACTION_SCROLL.RIGHT
        },
        index: 1
      }

    ]
    store.dispatch(Reel.addToReel(image, true))
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('removes a image from the previews in a non-empty reel, no scrollCallback', () => {
    let currentIndex = 1;
    scrollCallback = (index) => {
      currentIndex = index;
    }
    const existingReel = [
      BASE_REEL,
      {
        key: 3,
        isImage: true,
        image: 'TEST_3',
        postAction: POST_ACTION_SCROLL.RIGHT
      },
      {
        key: 4,
        isImage: true,
        image: 'TEST_4',
        postAction: POST_ACTION_SCROLL.LEFT
      },
    ];
    const store = mockStore({
      reel: {
        previewReel: existingReel,
        cameraIndex: 0,
        currentIndex: currentIndex,
        swiperLocked: true,
        viewPagerLocked: false,
        mainPage: 0
      }
    });
    const expectedActions = [
      { type: Reel.REEL_REMOVE_IMAGE, index: currentIndex }
    ];
    store.dispatch(Reel.removeFromReel(currentIndex, scrollCallback))
    expect(store.getActions()).toEqual(expectedActions);
    expect(currentIndex).toEqual(1);
  });

  it('removes the rightmost image from the previews in a non-empty reel', () => {
    let currentIndex = 2;
    scrollCallback = (index) => {
      currentIndex = index;
    }
    const existingReel = [
      BASE_REEL,
      {
        key: 3,
        isImage: true,
        image: 'TEST_3',
        postAction: POST_ACTION_SCROLL.RIGHT
      },
      {
        key: 4,
        isImage: true,
        image: 'TEST_4',
        postAction: POST_ACTION_SCROLL.LEFT
      },
    ];
    const store = mockStore({
      reel: {
        previewReel: existingReel,
        cameraIndex: 0,
        currentIndex: currentIndex,
        swiperLocked: true,
        viewPagerLocked: false,
        mainPage: 0
      }
    });
    const expectedActions = [
      { type: Reel.REEL_REMOVE_IMAGE_RIGHT_EDGE, index: currentIndex },
      { type: Reel.UPDATE_CURRENT_INDEX, currentIndex: 1 }
    ];
    store.dispatch(Reel.removeFromReel(currentIndex, scrollCallback))
    expect(store.getActions()).toEqual(expectedActions);
    expect(currentIndex).toEqual(1);
  });

  it('removing all preview images and going back to camera unlocks the swiper', () => {
    let currentIndex = 1;
    scrollCallback = (index) => {
      currentIndex = index;
    }
    const existingReel = [
      BASE_REEL,
      {
        key: 2,
        isImage: true,
        image: 'TEST_2',
        postAction: POST_ACTION_SCROLL.LEFT
      }
    ];
    const store = mockStore({
      reel: {
        previewReel: existingReel,
        currentIndex: currentIndex,
        swiperLocked: true,
        viewPagerLocked: false,
        mainPage: 0
      }
    });
    const expectedActions = [
      { type: Reel.REEL_REMOVE_IMAGE_RIGHT_EDGE, index: currentIndex },
      { type: Reel.UPDATE_CURRENT_INDEX, currentIndex: 0 },
      { type: Reel.UNLOCK_SWIPER }
    ];
    store.dispatch(Reel.removeFromReel(currentIndex, scrollCallback))
    expect(store.getActions()).toEqual(expectedActions);
    expect(currentIndex).toEqual(0);
  });
});
