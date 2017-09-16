import { NavigationActions } from 'react-navigation';
import { joinChannel } from '../actions';
import * as Storage from '../storage';
import * as Album from './album';
import * as TasvirApi from './tasvir_api';

export const UPDATE_ALBUM_ID = 'join_album_form/UPDATE_ALBUM_ID';
export const UPDATE_ALBUM_NAME = 'join_album_form/UPDATE_ALBUM_NAME';

export function updateId(id) {
  return { type: UPDATE_ALBUM_ID, id };
}

export function updateName(name) {
  return { type: UPDATE_ALBUM_NAME, name };
}

export function rejectAlbum() {
  return (dispatch) => {
    dispatch(NavigationActions.navigate({ routeName: 'App' }));
  }
}

export function joinAlbum() {
  return (dispatch, getState) => {
    const { joinAlbumForm: { name, id } } = getState();
    dispatch(Album.updateId(id));
    Storage.saveAlbumId(id);
    dispatch(Album.updateName(name));
    Storage.saveAlbumName(name);
    dispatch(TasvirApi.loadAlbum());
    dispatch(joinChannel());
    dispatch(NavigationActions.navigate({ routeName: 'App' }));
  }
}

export function attemptJoinAlbum() {
  return (dispatch) => {
    dispatch(NavigationActions.navigate({ routeName: 'JoinAlbum' }));
  }
}
