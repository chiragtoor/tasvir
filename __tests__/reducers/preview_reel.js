import * as Actions from '../../js/actions/preview_reel';
import reducer from '../../js/reducers/preview_reel';

import {BASE_REEL, POST_ACTION_SCROLL} from '../../js/constants';

describe('reel_reducer', () => {
  it('initial state is as expected', () => {
    expect(
      reducer(undefined, {})
    ).toEqual(
      {
        previewReel: [BASE_REEL],
        currentIndex: 0,
        viewPagerLocked: false,
        swiperLocked: false,
        mainPage: 0
      }
    );
  });

  it('handles REEL_ADD_IMAGE properly at start of reel', () => {
    const existingPreviewReel = [
      BASE_REEL
    ];
    const imagePack = {key: 1, isImage: true, image: 'TEST_1', postAction: POST_ACTION_SCROLL.LEFT};
    expect(
      reducer({
        previewReel: existingPreviewReel
      }, {
        type: Actions.REEL_ADD_IMAGE,
        imagePack: imagePack,
        index: 0
      })
    ).toEqual(
      {
        previewReel: [imagePack, BASE_REEL],
        currentIndex: 0,
        viewPagerLocked: false,
        swiperLocked: false,
        mainPage: 0
      }
    );
  });

  it('handles REEL_ADD_IMAGE properly at end of reel', () => {
    const existingPreviewReel = [
      BASE_REEL
    ];
    const imagePack = {key: 1, isImage: true, image: 'TEST_1', postAction: POST_ACTION_SCROLL.LEFT};
    expect(
      reducer({
        previewReel: existingPreviewReel
      }, {
        type: Actions.REEL_ADD_IMAGE,
        imagePack: imagePack,
        index: 1
      })
    ).toEqual(
      {
        previewReel: [BASE_REEL, imagePack],
        currentIndex: 0,
        viewPagerLocked: false,
        swiperLocked: false,
        mainPage: 0
      }
    );
  });

  it('handles REEL_ADD_IMAGE properly inside the reel', () => {
    const existingPreviewReel = [
      BASE_REEL,
      {key: 1, isImage: true, image: 'TEST_1', postAction: POST_ACTION_SCROLL.LEFT}
    ];
    const imagePack = {key: 2, isImage: true, image: 'TEST_2', postAction: POST_ACTION_SCROLL.RIGHT};
    expect(
      reducer({
        previewReel: existingPreviewReel
      }, {
        type: Actions.REEL_ADD_IMAGE,
        imagePack: imagePack,
        index: 1
      })
    ).toEqual(
      {
        previewReel: [existingPreviewReel[0], imagePack, existingPreviewReel[1]],
        currentIndex: 0,
        viewPagerLocked: false,
        swiperLocked: false,
        mainPage: 0
      }
    );
  });

  it('handles LOAD_PREVIEW_REEL properly', () => {
    const previewReel = [
      {
        key: 1,
        isImage: true,
        image: 'https://images.unsplash.com/photo-1441742917377-57f78ee0e582?h=1024',
        postAction: POST_ACTION_SCROLL.RIGHT
      },
      {
        key: 2,
        isImage: true,
        image: 'https://images.unsplash.com/photo-1441716844725-09cedc13a4e7?h=1024',
        postAction: POST_ACTION_SCROLL.LEFT
      },
      {
        key: 3,
        isImage: true,
        image: 'https://images.unsplash.com/photo-1441448770220-76743f9e6af6?h=1024',
        postAction: POST_ACTION_SCROLL.LEFT
      }
    ];
    expect(
      reducer({}, {
        type: Actions.LOAD_PREVIEW_REEL,
        previewReel
      })
    ).toEqual(
      {
        previewReel: previewReel,
        currentIndex: 0,
        viewPagerLocked: false,
        swiperLocked: false,
        mainPage: 0
      }
    );
  });

  it('handles UPDATE_CURRENT_INDEX properly', () => {
    const currentIndex = 3;
    expect(
      reducer({}, {
        type: Actions.UPDATE_CURRENT_INDEX,
        currentIndex
      })
    ).toEqual(
      {
        previewReel: [BASE_REEL],
        currentIndex: currentIndex,
        viewPagerLocked: false,
        swiperLocked: false,
        mainPage: 0
      }
    );
  });

  it('handles LOCK_VIEW_PAGER properly', () => {
    expect(
      reducer({}, {
        type: Actions.LOCK_VIEW_PAGER
      })
    ).toEqual(
      {
        previewReel: [BASE_REEL],
        currentIndex: 0,
        viewPagerLocked: true,
        swiperLocked: false,
        mainPage: 0
      }
    );
  });

  it('handles UNLOCK_VIEW_PAGER properly', () => {
    expect(
      reducer({}, {
        type: Actions.UNLOCK_VIEW_PAGER
      })
    ).toEqual(
      {
        previewReel: [BASE_REEL],
        currentIndex: 0,
        viewPagerLocked: false,
        swiperLocked: false,
        mainPage: 0
      }
    );
  });

  it('handles LOCK_SWIPER properly', () => {
    expect(
      reducer({}, {
        type: Actions.LOCK_SWIPER
      })
    ).toEqual(
      {
        previewReel: [BASE_REEL],
        currentIndex: 0,
        viewPagerLocked: false,
        swiperLocked: true,
        mainPage: 0
      }
    );
  });

  it('handles UNLOCK_SWIPER properly', () => {
    expect(
      reducer({}, {
        type: Actions.UNLOCK_SWIPER
      })
    ).toEqual(
      {
        previewReel: [BASE_REEL],
        currentIndex: 0,
        viewPagerLocked: false,
        swiperLocked: false,
        mainPage: 0
      }
    );
  });

  it('handles UPDATE_CAMERA_INDEX properly', () => {
    const cameraIndex = 3;
    expect(
      reducer({}, {
        type: Actions.UPDATE_CAMERA_INDEX,
        cameraIndex
      })
    ).toEqual(
      {
        previewReel: [BASE_REEL],
        currentIndex: 0,
        viewPagerLocked: false,
        swiperLocked: false,
        mainPage: 0
      }
    );
  });

    it('handles REEL_REMOVE_IMAGE properly', () => {
    const existingPreviewReel = [
      {key: 1, isImage: true, image: 'TEST_1', postAction: POST_ACTION_SCROLL.RIGHT},
      {key: 2, isImage: true, image: 'TEST_2', postAction: POST_ACTION_SCROLL.LEFT},
      BASE_REEL,
      {key: 3, isImage: true, image: 'TEST_3', postAction: POST_ACTION_SCROLL.RIGHT},
      {key: 4, isImage: true, image: 'TEST_4', postAction: POST_ACTION_SCROLL.LEFT}
    ];
    expect(
      reducer({
        previewReel: existingPreviewReel
      }, {
        type: Actions.REEL_REMOVE_IMAGE,
        index: 1
      })
    ).toEqual(
      {
        previewReel: [existingPreviewReel[0], existingPreviewReel[2], existingPreviewReel[3], existingPreviewReel[4]],
        currentIndex: 0,
        viewPagerLocked: false,
        swiperLocked: false,
        mainPage: 0
      }
    );
  });

  it('handles REEL_REMOVE_IMAGE_RIGHT_EDGE properly', () => {
    const existingPreviewReel = [
      {key: 1, isImage: true, image: 'TEST_1', postAction: POST_ACTION_SCROLL.RIGHT},
      {key: 2, isImage: true, image: 'TEST_2', postAction: POST_ACTION_SCROLL.LEFT},
      BASE_REEL,
      {key: 3, isImage: true, image: 'TEST_3', postAction: POST_ACTION_SCROLL.RIGHT},
      {key: 4, isImage: true, image: 'TEST_4', postAction: POST_ACTION_SCROLL.LEFT}
    ];
    expect(
      reducer({
        previewReel: existingPreviewReel
      }, {
        type: Actions.REEL_REMOVE_IMAGE_RIGHT_EDGE,
        index: 4
      })
    ).toEqual(
      {
        previewReel: [existingPreviewReel[0], existingPreviewReel[1], existingPreviewReel[2],
          {key: 3, isImage: true, image: 'TEST_3', postAction: POST_ACTION_SCROLL.LEFT},
        ],
        currentIndex: 0,
        viewPagerLocked: false,
        swiperLocked: false,
        mainPage: 0
      }
    );
  });
});
