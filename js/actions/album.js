import { NavigationActions } from 'react-navigation';
import { leaveChannel } from '../actions';
import * as Storage from '../storage';

export const UPDATE_ALBUM_ID = 'album/UPDATE_ALBUM_ID';
export const UPDATE_ALBUM_NAME = 'album/UPDATE_ALBUM_NAME';
export const LOAD_LINK = 'album/LOAD_LINK';
export const UPDATE_CHANNEL_IMAGE = 'album/UPDATE_CHANNEL_IMAGE';
export const RESET_ALBUM = 'album/RESET_ALBUM';

export function updateLatestChannelImage(id) {
  return { type: UPDATE_CHANNEL_IMAGE, id };
}

export function updateId(id) {
  return { type: UPDATE_ALBUM_ID, id };
}

export function updateName(name) {
  return { type: UPDATE_ALBUM_NAME, name };
}

export function updateLink(link) {
  return { type: LOAD_LINK, link };
}

export function reset() {
  return { type: RESET_ALBUM };
}

export function keepAlbumOpen() {
  return (dispatch) => {
    return dispatch(NavigationActions.navigate({ routeName: 'App' }));
  }
}

export function closeAlbum() {
  return (dispatch) => {
    dispatch(reset());
    Storage.saveAlbumId(null);
    Storage.saveAlbumName(null);
    Storage.saveAlbumLink(null);
    dispatch(leaveChannel());
    dispatch(NavigationActions.back({}));
  }
}

export function attemptCloseAlbum() {
  return (dispatch) => {
    return dispatch(NavigationActions.navigate({ routeName: 'CloseAlbum' }));
  }
}
