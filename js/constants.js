let URL_BASE = 'https://www.tasvirapp.com/';
if(__DEV__) {
  URL_BASE = 'https://5e1b6ab4.ngrok.io/';
}
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
  ALBUM_ACTION: 'AlbumAction',
  WALKTHROUGH: 'Walkthrough',
  ALBUM_REEL: 'AlbumReel',
  HELP: 'Help',
  PERMISSION_REQUIRED: 'PermissionRequired',
  VIEW_ALBUM: 'ViewAlbum',
  VIEW_ALL_IMAGES: 'ViewAllImages'
};

export const WALKTHROUGH = {
  COMPLETE: 1,
  PERMISSION_NEEDED: 2
};

export const NAVIGATION_ACTION = "Navigation/NAVIGATE";
export const NAVIGATION_BACK_ACTION = "Navigation/BACK";
export const UPLOAD_ACTION = "NO_REDUCER_STUB_UPLOAD_IMAGE";
export const COMMIT_ACTION = "NO_REDUCER_STUB_IMAGE_UPLOADED";
