import { NavigationActions } from 'react-navigation';
import { AsyncStorage, CameraRoll } from 'react-native';
import { Socket } from 'phoenix';
import DeviceInfo from 'react-native-device-info';
var RNFS = require('react-native-fs');
var Mixpanel = require('react-native-mixpanel');
import Permissions from 'react-native-permissions';

import { PREVIEW_REEL_STORAGE, ALBUM_ID_STORAGE, ALBUM_NAME_STORAGE,
         AUTO_SHARE_STORAGE, WALKTHROUGH_FLAG_STORAGE, URL, SOCKET_URL,
         ALBUMS_ENDPOINT, SAVED_PHOTOS_STORAGE, SENDER_ID_STORAGE,
         ROUTES, ALBUM_IMAGES_STORAGE, ALBUM_HISTORY_STORAGE,
         ALBUM_DATE_STORAGE, WALKTHROUGH } from '../constants';

import * as Reel from './reel';
import * as Album from './album';
import * as AlbumChannel from './album_channel';
import * as App from './app';
import * as TasvirApi from './tasvir_api';
import * as Gallery from './gallery';

export { Reel as Reel,
         Album as Album,
         App as App,
         TasvirApi as TasvirApi,
         Gallery as Gallery };

export const GALLERY_INDEX = 0;
export const CAMERA_INDEX = 1;
export const PREVIEW_REEL_INDEX = 2;

export function saveImage(image, appendDir = true) {
  return async (dispatch, getState) => {
    const { album: { id } } = getState();
    const imagePath = appendDir ? (RNFS.DocumentDirectoryPath + '/' + image.uri) : image.uri;
    return CameraRoll.saveToCameraRoll(imagePath).then((uri) => {
      dispatch(Gallery.loadGallery());
      return uri;
    });
  }
}

export function loadAndDispatchState() {
  return (dispatch, getState) => {
    return AsyncStorage.multiGet([PREVIEW_REEL_STORAGE, ALBUM_ID_STORAGE,
            ALBUM_NAME_STORAGE, AUTO_SHARE_STORAGE, WALKTHROUGH_FLAG_STORAGE,
            SENDER_ID_STORAGE, SAVED_PHOTOS_STORAGE, ALBUM_IMAGES_STORAGE,
            ALBUM_HISTORY_STORAGE, ALBUM_DATE_STORAGE]).then((value) => {

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
      const savedPhotos = getValue(value, SAVED_PHOTOS_STORAGE);
      const albumImages = getValue(value, ALBUM_IMAGES_STORAGE);
      const albumHistory = getValue(value, ALBUM_HISTORY_STORAGE);
      const walkthroughValue = getValue(value, WALKTHROUGH_FLAG_STORAGE);

      if(albumHistory) {
        dispatch(App.setHistory(albumHistory));
      } else {
        dispatch(App.setHistory([]));
      }

      const senderId = DeviceInfo.getUniqueID();
      Mixpanel.identify(senderId);
      dispatch(App.updateSenderId(senderId));

      if(savedPhotos) dispatch(App.loadSavedPhotos(savedPhotos));
      if (autoShare) dispatch(App.updateAutoShare(autoShare));

      if(albumId) {
        dispatch(Album.updateId(albumId));
        dispatch(Album.updateName(getValue(value, ALBUM_NAME_STORAGE)));
        dispatch(Album.updateAlbumDate(getValue(value, ALBUM_DATE_STORAGE)));
        if(albumImages) dispatch(Album.loadImages(albumImages));
        dispatch(App.galleryViewAlbum(getState().album));
        if(previewReel) dispatch(Reel.loadPreviewReel(previewReel));
        dispatch(Reel.updateCurrentIndex(CAMERA_INDEX));
        dispatch(AlbumChannel.joinChannel());
      }

      if(walkthroughValue === WALKTHROUGH.COMPLETE) {
        dispatch(Gallery.loadGallery());
        dispatch(NavigationActions.navigate({ routeName: ROUTES.MAIN }));
      } else if(walkthroughValue === WALKTHROUGH.PERMISSION_NEEDED) {
        // check if permissions fulfilled now
        Permissions.request('photo').then(response => {
          if(response === 'authorized') {
            Permissions.request('camera').then(response => {
              if(response === 'authorized') {
                dispatch(App.completeWalkthrough());
              } else {
                dispatch(NavigationActions.navigate({ routeName: ROUTES.PERMISSION_REQUIRED }));
              }
            });
          } else {
            dispatch(NavigationActions.navigate({ routeName: ROUTES.PERMISSION_REQUIRED }));
          }
        });
        dispatch(NavigationActions.navigate({ routeName: ROUTES.WALKTHROUGH }));
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
