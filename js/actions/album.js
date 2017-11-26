import { CameraRoll, Image } from 'react-native';
import { NavigationActions } from 'react-navigation';

import * as TasvirApi from './tasvir_api';
import * as Gallery from './gallery';
import * as App from './app';
import * as Confirmation from './confirmation';
import * as Reel from './reel';
import * as Storage from '../storage';
import * as AlbumChannel from './album_channel';
import { saveImage } from './index';
import { ROUTES } from '../constants';

var RNFS = require('react-native-fs');
/*
 * Below actions deal with the state of the current ablum
 */
export const UPDATE_ALBUM_ID = 'album/UPDATE_ALBUM_ID';
export const UPDATE_ALBUM_NAME = 'album/UPDATE_ALBUM_NAME';
export const LOAD_LINK = 'album/LOAD_LINK';
export const LOAD_IMAGES = 'album/LOAD_IMAGES';
export const LOAD_ALBUM_DATE = 'album/LOAD_ALBUM_DATE';
export const ADD_IMAGE = 'album/ADD_IMAGE';
export const RESET_ALBUM = 'album/RESET_ALBUM';

export function updateId(id) {
  Storage.saveAlbumId(id);
  return { type: UPDATE_ALBUM_ID, id };
}

export function updateName(name) {
  Storage.saveAlbumName(name);
  return { type: UPDATE_ALBUM_NAME, name };
}

export function updateLink(link) {
  Storage.saveAlbumLink(link);
  return { type: LOAD_LINK, link };
}

export function updateAlbumDate(albumDate) {
  Storage.saveAlbumDate(albumDate);
  return { type: LOAD_ALBUM_DATE, albumDate };
}

export function loadImages(images) {
  Storage.saveAlbumImages(images);
  return { type: LOAD_IMAGES, images };
}

export function addImage(image) {
  return { type: ADD_IMAGE, image };
}

export function reset() {
  return (dispatch) => {
    dispatch(updateId(null));
    dispatch(updateName(null));
    dispatch(updateLink(null));
    dispatch(updateAlbumDate(null));
    dispatch(loadImages([]));
  }
}

/*
 * Below actions deal with the joining, closing, and re-opening confirmations
 *  for albums
 */
 export function closeAlbum() {
   return (dispatch) => {
     dispatch(_buildCopy("Close album"));
     dispatch(App.setConfirmationAcceptCopy("Yes, close the album"));
     dispatch(App.setConfirmationRejectCopy("No, keep it open"));
     dispatch(Confirmation.setConfirmationAcceptAction(
       () => confirmCloseAlbum()));
     dispatch(Confirmation.setConfirmationRejectAction(
       () => finishAlbumAction()));
     dispatch(NavigationActions.navigate({ routeName: ROUTES.ALBUM_ACTION }));
   }
 }

export function confirmCloseAlbum() {
  return (dispatch, getState) => {
    const { album: album, app: { albumHistory } } = getState();
    // add the current album to the history since it is closing
    const newHistory = [album, ...albumHistory];
    dispatch(App.setHistory(newHistory));
    // close the album with the utitlity method
    dispatch(_closeAlbum());
    dispatch(App.galleryListAlbums());
    dispatch(finishAlbumAction());
  }
}

export function openAlbum(album) {
  return (dispatch, getState) => {
    dispatch(_buildCopy("Re-open album", album.name));
    dispatch(App.setConfirmationAcceptCopy("Yes, re-open album"));
    dispatch(App.setConfirmationRejectCopy("No"));
    dispatch(Confirmation.setConfirmationAcceptAction(
      () => confirmOpenAlbum(album)));
    dispatch(Confirmation.setConfirmationRejectAction(
      () => finishAlbumAction()));
    dispatch(NavigationActions.navigate({ routeName: ROUTES.ALBUM_ACTION }));
  }
}

export function confirmOpenAlbum(openAlbum) {
  return (dispatch, getState) => {
    const { album: album } = getState();
    // remove the album being opened from the history
    var editableAlbumHistory = getState().app.albumHistory;
    editableAlbumHistory.splice(openAlbum.index, 1);
    dispatch(App.setHistory(editableAlbumHistory));
    // if currently in a album
    if(album.id != null) {
      // add the current album to the history since it is closing
      const newHistory = [album, ...editableAlbumHistory];
      dispatch(App.setHistory(newHistory));
      // close the album with the utitlity method
      dispatch(_closeAlbum());
    }
    // load the album being opened to the current album state
    dispatch(updateId(openAlbum.id));
    dispatch(updateName(openAlbum.name));
    dispatch(updateAlbumDate(openAlbum.albumDate));
    dispatch(loadImages(openAlbum.images));
    // load a new share link and any images added since album was closed via
    //  the API
    dispatch(TasvirApi.loadAlbum());
    dispatch(AlbumChannel.joinChannel());
    dispatch(finishAlbumAction());
  }
}

export function joinAlbum(name, id) {
  return (dispatch) => {
    dispatch(_buildCopy("Join album", name));
    dispatch(App.setConfirmationAcceptCopy("Yes, join album"));
    dispatch(App.setConfirmationRejectCopy("No"));
    dispatch(Confirmation.setConfirmationAcceptAction(
      () => confirmJoinAlbum(name, id)));
    dispatch(Confirmation.setConfirmationRejectAction(
      () => finishAlbumAction()));
    dispatch(NavigationActions.navigate({ routeName: ROUTES.ALBUM_ACTION }));
  }
}

export function confirmJoinAlbum(name, id) {
  return (dispatch, getState) => {
    const { album: album, app: { albumHistory } } = getState();
    // if currently in a album
    if(album.id != null) {
      // add the current album to the history since it is closing
      const newHistory = [album, ...albumHistory];
      dispatch(App.setHistory(newHistory));
      // close the album with the utitlity method
      dispatch(_closeAlbum());
    }
    // if album trying to join is from history, just open it
    for (var i = 0; i < albumHistory.length; i++) {
      if(id == albumHistory[i].id) {
        dispatch(confirmOpenAlbum(albumHistory[i]));
        return;
      }
    }
    dispatch(updateId(id));
    dispatch(updateName(name));
    dispatch(TasvirApi.loadAlbum());
    dispatch(AlbumChannel.joinChannel());
    dispatch(finishAlbumAction());
  }
}

export function finishAlbumAction() {
  return NavigationActions.back({});
}
// _closeAlbum is not directly called, it is used internally in other album
//  actions to handle closing of the current album, which is done on all album
//  action accepts
export function _closeAlbum() {
  return (dispatch, getState) => {
    const { reel: { previewReel } } = getState();
    dispatch(reset());
    dispatch(AlbumChannel.leaveChannel());
     previewReel.forEach((image) => {
       dispatch(saveImage(image));
     });
     dispatch(Reel.reset());
  }
}

export function _buildCopy(preface, actionAlbumName = null) {
  return (dispatch, getState) => {
    const { album: { name }, reel: { previewReel } } = getState();
    const previewReelLength = getState().reel.previewReel.length;
    const albumName = actionAlbumName ?
      actionAlbumName : getState().album.name;
    if(previewReelLength > 0) {
      dispatch(App.setConfirmationCopy(preface +
        " '" + albumName + "'? You have " + previewReelLength +
        " photos to preview, these will be saved to your phone."));
    } else {
      dispatch(App.setConfirmationCopy(preface + " '" + albumName + "'?"));
    }
  }
}
