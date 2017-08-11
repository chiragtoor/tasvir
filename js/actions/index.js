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

import * as Storage from '../storage';

export {Reel as Reel,
        Album as Album,
        AlbumForm as AlbumForm,
        JoinAlbumForm as JoinAlbumForm,
        Settings as Settings,
        TasvirApi as TasvirApi};

export const NAVIGATE = 'Navigation/NAVIGATE';

export function completeWalkthrough() {
  return (dispatch) => {
    dispatch(NavigationActions.navigate({routeName: 'App'}));
  }
}

export function saveImage(imageUrl) {
  CameraRoll.saveToCameraRoll(imageUrl)
        .then(console.log("SAVED TO CAMERA ROLL"))
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
      let savedPhotos = getValue(value, DOWNLOADED_PHOTOS_STORAGE);

      if(albumId) {
        dispatch(Album.updateId(albumId));
        dispatch(Album.updateName(getValue(value, ALBUM_NAME_STORAGE)));
        dispatch(Reel.loadPreviewReel(getValue(value, PREVIEW_REEL_STORAGE)));
        if (autoShare) dispatch(Settings.updateAutoShare(autoShare));
        dispatch(Reel.updateCurrentIndex(0));
      }

      if(savedPhotos) {
        dispatch(Album.loadSavedPhotos(savedPhotos));
      }

      if(getValue(value, WALKTHROUGH_FLAG_STORAGE)) {
        dispatch(NavigationActions.navigate({routeName: 'App'}));
      } else {
        Storage.walkthroughCompleted();
        dispatch(NavigationActions.navigate({routeName: 'Walkthrough'}));
      }

      if(albumId){
        fetch(URL + ALBUMS_ENDPOINT + "/" +  albumId)
        .then((response) => response.json())
        .then((responseJson) => {
          if(responseJson.success) {
            for(var i = 0; i < responseJson.photos.length; i++) {
              const photo = responseJson.photos[i];
              if(!(savedPhotos.includes(photo.id))) {
                saveImage(photo.photo);
                savedPhotos.push(photo.id);
              }
            }
            Storage.saveDownloadedPhotos(savedPhotos);
            dispatch(Album.loadSavedPhotos(savedPhotos));
          }
        });
      }
    }).catch((error) => {
      console.error(error);
    });
  }
}
