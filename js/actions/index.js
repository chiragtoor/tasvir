import { NavigationActions } from 'react-navigation';
import { AsyncStorage, CameraRoll } from 'react-native';

import { PREVIEW_REEL_STORAGE, ALBUM_ID_STORAGE, ALBUM_NAME_STORAGE,
         AUTO_SHARE_STORAGE, WALKTHROUGH_FLAG_STORAGE, URL, ALBUMS_ENDPOINT, DOWNLOADED_PHOTOS_STORAGE } from '../constants';

import * as Reel from './reel';
import * as Album from './album';
import * as AlbumForm from './album_form';
import * as JoinAlbumForm from './join_album_form';
import * as Settings from './settings';
import * as TasvirApi from './tasvir_api';
import * as Photos from './photos';

import * as Storage from '../storage';

export {Reel as Reel,
        Album as Album,
        AlbumForm as AlbumForm,
        JoinAlbumForm as JoinAlbumForm,
        Settings as Settings,
        TasvirApi as TasvirApi,
        Photos as Photos};

export const NAVIGATE = 'Navigation/NAVIGATE';

export function completeWalkthrough() {
  return (dispatch, getState) => {
    const { joinAlbumForm: { id, name } } = getState();
    dispatch(Photos.loadGalleryImages());
    if(id && name) {
      dispatch(NavigationActions.navigate({routeName: 'JoinAlbum'}));
    } else {
      dispatch(NavigationActions.navigate({routeName: 'App'}));
    }
  }
}

export function saveImage(imageUrl, photoId) {
  return (dispatch, getState) => {
    const {album: {id}, photos: {savedPhotoIds}} = getState();
    if(id) {
      if(photoId === "NO_ALBUM") {
        CameraRoll.saveToCameraRoll(imageUrl).then((uri) => {
          dispatch(Photos.loadGalleryImages());
        });
      } else if(!(savedPhotoIds.includes(photoId))) {
        dispatch(Album.addSavedPhoto(photoId));
        CameraRoll.saveToCameraRoll(imageUrl).then((uri) => {
          dispatch(Photos.loadGalleryImages());
        });
      }
    } else {
      CameraRoll.saveToCameraRoll(imageUrl).then((uri) => {
        dispatch(Photos.loadGalleryImages());
      });
    }
  }
}

export function loadAndDispatchState() {
  return (dispatch) => {
    return AsyncStorage.multiGet([PREVIEW_REEL_STORAGE, ALBUM_ID_STORAGE,
            ALBUM_NAME_STORAGE, AUTO_SHARE_STORAGE, WALKTHROUGH_FLAG_STORAGE, DOWNLOADED_PHOTOS_STORAGE]).then((value) => {
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
      const savedPhotos = getValue(value, DOWNLOADED_PHOTOS_STORAGE);

      if(albumId) {
        dispatch(Album.updateId(albumId));
        dispatch(Album.updateName(getValue(value, ALBUM_NAME_STORAGE)));
        if(previewReel) dispatch(Reel.loadPreviewReel(previewReel));
        if (autoShare) dispatch(Settings.updateAutoShare(autoShare));
        dispatch(Reel.updateCurrentIndex(0));
      }

      if(savedPhotos) {
        dispatch(Photos.loadSavedPhotos(savedPhotos));
      }

      if(getValue(value, WALKTHROUGH_FLAG_STORAGE)) {
        dispatch(Photos.loadGalleryImages());
        dispatch(NavigationActions.navigate({routeName: 'App'}));
      } else {
        Storage.walkthroughCompleted();
        dispatch(NavigationActions.navigate({routeName: 'Walkthrough'}));
      }

      if(albumId) {
        dispatch(TasvirApi.loadAlbum());
      }
    }).catch((error) => {
      console.error(error);
    });
  }
}
