import { NavigationActions } from 'react-navigation';
import { AsyncStorage, CameraRoll } from 'react-native';
import { Socket } from 'phoenix';
var DeviceInfo = require('react-native-device-info');

import { PREVIEW_REEL_STORAGE, ALBUM_ID_STORAGE, ALBUM_NAME_STORAGE,
         AUTO_SHARE_STORAGE, WALKTHROUGH_FLAG_STORAGE, URL, SOCKET_URL,
         ALBUMS_ENDPOINT, DOWNLOADED_PHOTOS_STORAGE, IDFV_STORAGE } from '../constants';

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

export const GALLERY_INDEX = 0;
export const CAMERA_INDEX = 1;
export const PREVIEW_REEL_INDEX = 2;

const socket = new Socket(SOCKET_URL);
let chan = null;

export function joinChannel() {
  return (dispatch, getState) => {
    const {album: {id}, settings: {idfv}} = getState();
    if(id != null) {
      socket.connect();
      chan = socket.channel("album:" + id, {});

      chan.join();
      chan.on("new:photo", msg => {
        if(!(msg.sent_by === idfv)) {
          CameraRoll.saveToCameraRoll(msg.photo).then((uri) => {
            dispatch(Photos.loadGalleryImages());
            dispatch(Album.updateLatestChannelImage(msg.id));
          });
        }
      });
    }
  }
}

export function leaveChannel() {
  return (dispatch) => {
    if(chan != null) {
      chan.leave();
    }
    if(socket != null) {
      socket.disconnect();
    }
  }
}

export function completeWalkthrough() {
  return (dispatch, getState) => {
    const { joinAlbumForm: { id, name } } = getState();
    Storage.walkthroughCompleted();
    dispatch(Photos.loadGalleryImages());
    if(id && name) {
      dispatch(NavigationActions.navigate({ routeName: 'JoinAlbum' }));
    } else {
      dispatch(NavigationActions.navigate({routeName: 'App'}));
    }
  }
}

export function saveImage(imageUrl) {
  return (dispatch, getState) => {
    const { album: { id } } = getState();
    CameraRoll.saveToCameraRoll(imageUrl).then((uri) => {
      dispatch(Photos.loadGalleryImages());
    });
  }
}

export function loadAndDispatchState() {
  return (dispatch) => {
    return AsyncStorage.multiGet([PREVIEW_REEL_STORAGE, ALBUM_ID_STORAGE,
            ALBUM_NAME_STORAGE, AUTO_SHARE_STORAGE, WALKTHROUGH_FLAG_STORAGE,
            IDFV_STORAGE]).then((value) => {
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
      const idfv = getValue(value, IDFV_STORAGE);

      if(idfv == null) {
        dispatch(Settings.updateIDFV(DeviceInfo.getUniqueID(), true));
      } else {
        dispatch(Settings.updateIDFV(idfv));
      }

      if(albumId) {
        dispatch(Album.updateId(albumId));
        dispatch(Album.updateName(getValue(value, ALBUM_NAME_STORAGE)));
        if(previewReel) dispatch(Reel.loadPreviewReel(previewReel));
        if (autoShare) dispatch(Settings.updateAutoShare(autoShare));
        dispatch(Reel.updateCurrentIndex(CAMERA_INDEX));
        dispatch(joinChannel());
      }

      if(getValue(value, WALKTHROUGH_FLAG_STORAGE)) {
        dispatch(NavigationActions.navigate({routeName: 'App'}));
        dispatch(Photos.loadGalleryImages());
      } else {
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
