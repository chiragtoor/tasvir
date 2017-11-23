/*
 * app.js holds application UI and misc state related actions
 */
import { NavigationActions } from 'react-navigation';
import thunk from 'redux-thunk';

import * as Actions from '../actions';
import { ROUTES } from '../constants';
import * as TasvirApi from './tasvir_api';
import * as Storage from '../storage';
import * as Album from './album';
import * as Confirmation from './confirmation';
import * as Gallery from './gallery';
import * as Reel from './reel';

export const APP_UPDATE_AUTO_SHARE = 'app/APP_UPDATE_AUTO_SHARE';
export const APP_UPDATE_SENDER_ID = 'app/APP_UPDATE_SENDER_ID';
export const APP_LOAD_SAVED_PHOTOS = 'app/APP_LOAD_SAVED_PHOTOS';
export const APP_ADD_SAVED_PHOTO = 'app/APP_ADD_SAVED_PHOTO';
export const APP_UPDATE_RECEIVED_IMAGE_FLAG = 'app/APP_UPDATE_RECEIVED_IMAGE_FLAG';
export const APP_OPEN_ALBUM_FORM = 'app/APP_OPEN_ALBUM_FORM';
export const APP_RESET_ALBUM_FORM = 'app/APP_RESET_ALBUM_FORM';
export const APP_SET_CONFIRMATION_ACCEPT = 'app/APP_SET_CONFIRMATION_ACCEPT';
export const APP_SET_CONFIRMATION_REJECT = 'app/APP_SET_CONFIRMATION_REJECT';
export const APP_SET_CONFIRMATION_COPY = 'app/APP_SET_CONFIRMATION_COPY';
export const APP_SET_CONFIRMATION_ACCEPT_COPY = 'app/APP_SET_CONFIRMATION_ACCEPT_COPY';
export const APP_SET_CONFIRMATION_REJECT_COPY = 'app/APP_SET_CONFIRMATION_REJECT_COPY';
export const APP_SET_WALKTHROUGH_COMPLETE = 'app/APP_SET_WALKTHROUGH_COMPLETE';
export const SET_HISTORY = 'app/SET_HISTORY';
export const SET_GALLERY_STATE = 'app/SET_GALLERY_STATE';
export const SET_ALBUM_REEL_INDEX = 'app/SET_ALBUM_REEL_INDEX';
export const SET_ALBUM_REEL_IMAGES = 'app/SET_ALBUM_REEL_IMAGES';
// form states for the album form
export const APP_ALBUM_FORM_STATE_INIT = 0;
export const APP_ALBUM_FORM_STATE_OPEN = 1;
// states for the gallery
export const APP_GALLERY_STATE_LIST = 0;
export const APP_GALLERY_STATE_IMAGES = 1;

export function updateAutoShare(autoShare) {
  Storage.saveAutoShare(autoShare);
  return { type: APP_UPDATE_AUTO_SHARE, autoShare };
}

export function updateSenderId(senderId) {
  Storage.saveSenderId(senderId);
  return { type: APP_UPDATE_SENDER_ID, senderId };
}

export function setHistory(history) {
  Storage.saveAlbumHistory(history);
  return { type: SET_HISTORY, history };
}

export function loadSavedPhotos(savedPhotos) {
  return {type: APP_LOAD_SAVED_PHOTOS, savedPhotos};
}

export function addSavedPhoto(photo) {
  return {type: APP_ADD_SAVED_PHOTO, photo };
}

export function openAlbumForm() {
  return { type: APP_OPEN_ALBUM_FORM };
}

export function resetAlbumForm() {
  return { type: APP_RESET_ALBUM_FORM };
}

export function flagImageReceivedFromChannel() {
  return { type: APP_UPDATE_RECEIVED_IMAGE_FLAG, flag: true };
}

export function acknowledgeFlagImageReceivedFromChannel() {
  return { type: APP_UPDATE_RECEIVED_IMAGE_FLAG, flag: false };
}

export function setConfirmationCopy(copy) {
  return { type: APP_SET_CONFIRMATION_COPY, copy };
}

export function setConfirmationAcceptCopy(copy) {
  return { type: APP_SET_CONFIRMATION_ACCEPT_COPY, copy };
}

export function setConfirmationRejectCopy(copy) {
  return { type: APP_SET_CONFIRMATION_REJECT_COPY, copy };
}

export function confirmationAccept() {
  return (dispatch, getState) => {
    const { app: { confirmationAccept } } = getState();
    dispatch(confirmationAccept());
  }
}

export function confirmationReject() {
  return (dispatch, getState) => {
    const { app: { confirmationReject } } = getState();
    dispatch(confirmationReject());
  }
}

export function closeAlbumReel() {
  return (dispatch) => {
    dispatch(NavigationActions.back({}));
  }
}

export const DEFAULT_WALKTHROUGH_COMPLETE = () => NavigationActions.navigate({ routeName: ROUTES.MAIN });
export function setWalkthroughComplete(complete) {
  return { type: APP_SET_WALKTHROUGH_COMPLETE, complete };
}

export function completeWalkthrough() {
  return (dispatch, getState) => {
    const { app: { onCompleteWalkthrough } } = getState();
    dispatch(Gallery.loadGallery());
    Storage.walkthroughCompleted();
    dispatch(onCompleteWalkthrough());
  }
}

export function galleryListAlbums() {
  return { type: SET_GALLERY_STATE, state: APP_GALLERY_STATE_LIST };
}

export function galleryViewAlbum(album) {
  return (dispatch) => {
    dispatch(Gallery.viewAlbum(album));
    dispatch({ type: SET_GALLERY_STATE, state: APP_GALLERY_STATE_IMAGES });
  }
}

export function viewAlbumReel(index, images) {
  return (dispatch) => {
    dispatch({ type: SET_ALBUM_REEL_INDEX, index });
    dispatch({ type: SET_ALBUM_REEL_IMAGES, images });
    dispatch(NavigationActions.navigate({ routeName: ROUTES.ALBUM_REEL }));
  }
}
