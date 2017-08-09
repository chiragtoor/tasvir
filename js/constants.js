export const CAMERA_PAGE = 0;
export const MENU_PAGE = 1;

export const POST_ACTION_SCROLL = {
  LEFT: 0,
  RIGHT: 1,
  NONE: 3
}

export const URL_BASE = __DEV__ ? 'https://7472c4a5.ngrok.io/' : 'https://stormy-stream-34151.herokuapp.com/';
export const URL = URL_BASE + 'api';
export const ALBUMS_ENDPOINT = '/albums';

export const PREVIEW_REEL_STORAGE = 'previewReel';
export const ALBUM_ID_STORAGE = 'albumId';
export const ALBUM_NAME_STORAGE = 'albumName';
export const AUTO_SHARE_STORAGE = 'autoShare';
export const WALKTHROUGH_FLAG_STORAGE = 'walkthrough';
export const DOWNLOADED_PHOTOS_STORAGE = 'downloadedPhotos';

export const BASE_REEL = {
  key: 0,
  isImage: false,
  postAction: POST_ACTION_SCROLL.NONE
};

export const REEL = [
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
  },
  BASE_REEL,
  {
    key: 4,
    isImage: true,
    image: 'https://images.unsplash.com/photo-1441260038675-7329ab4cc264?h=1024',
    postAction: POST_ACTION_SCROLL.RIGHT
  },
  {
    key: 5,
    isImage: true,
    image: 'https://images.unsplash.com/photo-1441126270775-739547c8680c?h=1024',
    postAction: POST_ACTION_SCROLL.RIGHT
  },
  {
    key: 6,
    isImage: true,
    image: 'https://images.unsplash.com/photo-1440964829947-ca3277bd37f8?h=1024',
    postAction: POST_ACTION_SCROLL.RIGHT
  },
  {
    key: 7,
    isImage: true,
    image: 'https://images.unsplash.com/photo-1440847899694-90043f91c7f9?h=1024',
    postAction: POST_ACTION_SCROLL.LEFT
  }
];
