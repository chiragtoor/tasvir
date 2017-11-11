import { NavigationActions } from 'react-navigation';
import { AsyncStorage, CameraRoll } from 'react-native';
import { Socket } from 'phoenix';
import DeviceInfo from 'react-native-device-info';

import { PREVIEW_REEL_STORAGE, ALBUM_ID_STORAGE, ALBUM_NAME_STORAGE,
         AUTO_SHARE_STORAGE, WALKTHROUGH_FLAG_STORAGE, URL, SOCKET_URL,
         ALBUMS_ENDPOINT, SAVED_PHOTOS_STORAGE, SENDER_ID_STORAGE,
         ROUTES, ALBUM_IMAGES_STORAGE, ALBUM_HISTORY_STORAGE } from '../constants';

import * as Reel from './reel';
import * as Album from './album';
import * as App from './app';
import * as TasvirApi from './tasvir_api';
import * as Gallery from './gallery';

export { Reel as Reel,
         Album as Album,
         App as App,
         TasvirApi as TasvirApi,
         Gallery as Gallery };

export const GALLERY_INDEX = 1;
export const CAMERA_INDEX = 2;
export const PREVIEW_REEL_INDEX = 3;

export function saveImage(imageUrl) {
  return (dispatch, getState) => {
    const { album: { id } } = getState();
    CameraRoll.saveToCameraRoll(imageUrl).then((uri) => {
      if(id) {
        dispatch(Album.addImage(uri));
      }
      dispatch(Gallery.loadGallery());
    });
  }
}

export function loadAndDispatchState() {
  return (dispatch) => {
    return AsyncStorage.multiGet([PREVIEW_REEL_STORAGE, ALBUM_ID_STORAGE,
            ALBUM_NAME_STORAGE, AUTO_SHARE_STORAGE, WALKTHROUGH_FLAG_STORAGE,
            SENDER_ID_STORAGE, SAVED_PHOTOS_STORAGE, ALBUM_IMAGES_STORAGE,
            ALBUM_HISTORY_STORAGE]).then((value) => {

      const getValue = (arr, key) => {
        for (var i = 0; i < arr.length; i++) {
          if(arr[i][0] === key) {
            return JSON.parse(arr[i][1]);
          }
        }
        return null;
      };

      const albumId = getValue(value, ALBUM_ID_STORAGE);
      const autoShare = getValue(value, AUTO_SHARE_STORAGE);
      const previewReel = getValue(value, PREVIEW_REEL_STORAGE);
      const senderId = getValue(value, SENDER_ID_STORAGE);
      const savedPhotos = getValue(value, SAVED_PHOTOS_STORAGE);
      const albumImages = getValue(value, ALBUM_IMAGES_STORAGE);
      const albumHistory = getValue(value, ALBUM_HISTORY_STORAGE);

      if(albumHistory) {
        dispatch(Album.setHistory(albumHistory));
      } else {
        dispatch(Album.setHistory([]));
      }
      console.log("ALBUM HISTORY");
      console.log(albumHistory);

      if(senderId == null) {
        dispatch(App.updateSenderId(DeviceInfo.getUniqueID(), true));
      } else {
        dispatch(App.updateSenderId(senderId));
      }
      if(savedPhotos) dispatch(App.loadSavedPhotos(savedPhotos));
      if (autoShare) dispatch(App.updateAutoShare(autoShare));

      if(albumId) {
        dispatch(Album.updateId(albumId));
        dispatch(Album.updateName(getValue(value, ALBUM_NAME_STORAGE)));
        if(albumImages) dispatch(Album.loadImages(albumImages));
        if(previewReel) dispatch(Reel.loadPreviewReel(previewReel));
        dispatch(Reel.updateCurrentIndex(CAMERA_INDEX));
        dispatch(Album.joinChannel());
      }

      if(getValue(value, WALKTHROUGH_FLAG_STORAGE)) {
        dispatch(Gallery.loadGallery());
        dispatch(NavigationActions.navigate({ routeName: ROUTES.MAIN }));
      } else {
        dispatch(NavigationActions.navigate({ routeName: ROUTES.WALKTHROUGH }));
      }

      if(albumId) {
        dispatch(TasvirApi.loadAlbum());
      }

    }).catch((error) => {
      console.error(error);
    });
  }
}
