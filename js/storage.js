import { AsyncStorage } from 'react-native';

import { PREVIEW_REEL_STORAGE, ALBUM_ID_STORAGE, ALBUM_NAME_STORAGE,
         ALBUM_LINK_STORAGE, AUTO_SHARE_STORAGE, WALKTHROUGH_FLAG_STORAGE,
         SAVED_PHOTOS_STORAGE, IDFV_STORAGE, SENDER_ID_STORAGE,
         ALBUM_IMAGES_STORAGE, ALBUM_HISTORY_STORAGE, ALBUM_DATE_STORAGE,
         WALKTHROUGH } from './constants';

function persist(key, value) {
  AsyncStorage.setItem(key, JSON.stringify(value));
}

export function saveSenderId(senderId) {
  persist(SENDER_ID_STORAGE, senderId);
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

export function saveAlbumDate(albumDate) {
  persist(ALBUM_DATE_STORAGE, albumDate);
}

export function saveAlbumImages(albumImages) {
  persist(ALBUM_IMAGES_STORAGE, albumImages);
}

export function saveAlbumHistory(history) {
  persist(ALBUM_HISTORY_STORAGE, history);
}

export function walkthroughCompleted() {
  persist(WALKTHROUGH_FLAG_STORAGE, WALKTHROUGH.COMPLETE);
}

export function walkthroughCompletedWithoutPermission() {
  persist(WALKTHROUGH_FLAG_STORAGE, WALKTHROUGH.PERMISSION_NEEDED);
}

export function saveDownloadedPhotos(downloadedPhotos) {
  persist(SAVED_PHOTOS_STORAGE, downloadedPhotos);
}

export function saveAlbumLink(link) {
  persist(ALBUM_LINK_STORAGE, link);
}
