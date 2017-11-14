// export const URL_BASE = __DEV__ ? 'https://c3b305e6.ngrok.io/' : 'https://www.tasvirapp.com/';
export const URL_BASE = 'https://2f74c21f.ngrok.io/';
// export const URL_BASE = 'https://www.tasvirapp.com/';
export const URL = URL_BASE + 'api';
export const SOCKET_URL = URL_BASE + 'socket';
export const ALBUMS_ENDPOINT = '/albums';

export const PREVIEW_REEL_STORAGE = 'previewReel';
export const ALBUM_ID_STORAGE = 'albumId';
export const ALBUM_NAME_STORAGE = 'albumName';
export const AUTO_SHARE_STORAGE = 'autoShare';
export const WALKTHROUGH_FLAG_STORAGE = 'walkthrough';
export const SAVED_PHOTOS_STORAGE = 'savedPhotos';
export const ALBUM_LINK_STORAGE = 'albumLink';
export const SENDER_ID_STORAGE = 'senderId';
export const ALBUM_IMAGES_STORAGE = 'ablumImages';
export const ALBUM_HISTORY_STORAGE = 'albumHistory';
export const ALBUM_DATE_STORAGE = 'albumDate';

// routes
export const ROUTES = {
  ALBUM_LIST: 'AlbumList',
  MAIN: 'Main',
  CLOSE_ALBUM: 'CloseAlbum',
  JOIN_ALBUM: 'JoinAblum',
  WALKTHROUGH: 'Walkthrough'
}

export const NAVIGATION_ACTION = "Navigation/NAVIGATE";
export const NAVIGATION_BACK_ACTION = "Navigation/BACK";
