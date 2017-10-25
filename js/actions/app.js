/*
 * app.js holds application UI and misc state related actions
 */
import { NavigationActions } from 'react-navigation';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { leaveChannel } from '../actions';
import { CLOSE_ALBUM_ROUTE } from '../constants';
import * as Storage from '../storage';
import * as Album from './album';

export const APP_UPDATE_AUTO_SHARE = 'app/APP_UPDATE_AUTO_SHARE';
export const APP_UPDATE_SENDER_ID = 'app/APP_UPDATE_SENDER_ID';
export const APP_LOAD_SAVED_PHOTOS = 'app/APP_LOAD_SAVED_PHOTOS';
export const APP_ADD_SAVED_PHOTO = 'app/APP_ADD_SAVED_PHOTO';
export const APP_UPDATE_RECEIVED_IMAGE_FLAG = 'app/APP_UPDATE_RECEIVED_IMAGE_FLAG';
export const APP_OPEN_ALBUM_FORM = 'app/APP_OPEN_ALBUM_FORM';
export const APP_RESET_ALBUM_FORM = 'app/APP_RESET_ALBUM_FORM';
// form states for the album form
export const APP_ALBUM_FORM_STATE_INIT = 0;
export const APP_ALBUM_FORM_STATE_OPEN = 1;

export function updateAutoShare(autoShare) {
  Storage.saveAutoShare(autoShare);
  return { type: APP_UPDATE_AUTO_SHARE, autoShare };
}

export function updateSenderId(senderId, persist = false) {
  if (persist) {
    Storage.saveSenderId(senderId);
  }
  return { type: APP_UPDATE_SENDER_ID, senderId };
}

export function loadSavedPhotos(savedPhotos) {
  return {type: APP_LOAD_SAVED_PHOTOS, savedPhotos};
}

export function addSavedPhoto(photo) {
  return {type: APP_ADD_SAVED_PHOTO, photo };
}

export function flagImageReceivedFromChannel() {
  return { type: APP_UPDATE_RECEIVED_IMAGE_FLAG, flag: true };
}

export function acknowledgeFlagImageReceivedFromChannel() {
  return { type: APP_UPDATE_RECEIVED_IMAGE_FLAG, flag: false };
}

export function openAlbumForm() {
  return { type: APP_OPEN_ALBUM_FORM };
}

export function resetAlbumForm() {
  return { type: APP_RESET_ALBUM_FORM };
}

export function closeAlbum() {
  return (dispatch) => {
    dispatch(NavigationActions.navigate({ routeName: CLOSE_ALBUM_ROUTE }));
  }
}

export function confirmCloseAlbum() {
  return (dispatch) => {
    dispatch(Album.reset());
    Storage.saveAlbumId(null);
    Storage.saveAlbumName(null);
    Storage.saveAlbumLink(null);
    dispatch(leaveChannel());
    dispatch(NavigationActions.back({}));
  }
}

export function cancelCloseAlbum() {
  return (dispatch) => {
    dispatch(NavigationActions.back({}));
  }
}
