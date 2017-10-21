import { AsyncStorage } from 'react-native';

import { PREVIEW_REEL_STORAGE, ALBUM_ID_STORAGE, ALBUM_NAME_STORAGE,
         ALBUM_LINK_STORAGE, AUTO_SHARE_STORAGE, WALKTHROUGH_FLAG_STORAGE,
         DOWNLOADED_PHOTOS_STORAGE, IDFV_STORAGE } from './constants';

function persist(key, value) {
  AsyncStorage.setItem(key, JSON.stringify(value));
}

export function saveIDFV(idfv) {
  persist(IDFV_STORAGE, idfv);
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

export function walkthroughCompleted() {
  persist(WALKTHROUGH_FLAG_STORAGE, true);
}

export function saveDownloadedPhotos(downloadedPhotos) {
  persist(DOWNLOADED_PHOTOS_STORAGE, downloadedPhotos);
}

export function saveAlbumLink(link) {
  persist(ALBUM_LINK_STORAGE, link);
}
