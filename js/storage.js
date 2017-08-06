import { AsyncStorage } from 'react-native';

import { PREVIEW_REEL_STORAGE, ALBUM_ID_STORAGE, ALBUM_NAME_STORAGE,
         AUTO_SHARE_STORAGE } from './constants';

function persist(key, value) {
  AsyncStorage.setItem(key, JSON.stringify(value));
}

export function saveAutoShare(autoShare) {
  persist(AUTO_SHARE_STORAGE, autoShare);
}

export function savePreviewReel(previewReel) {
  persist(PREVIEW_REEL_STORAGE, previewReel);
}

export function saveAlbumId(albumId) {
  persist(ALBUM_ID_STORAGE, albumId);
}

export function saveAlbumName(albumName) {
  persist(ALBUM_NAME_STORAGE, albumName);
}
