import { NavigationActions } from 'react-navigation';
import * as Storage from '../storage';

export const UPDATE_ALBUM_ID = 'album/UPDATE_ALBUM_ID';
export const UPDATE_ALBUM_NAME = 'album/UPDATE_ALBUM_NAME';

export function updateId(id) {
  return { type: UPDATE_ALBUM_ID, id };
}

export function updateName(name) {
  return { type: UPDATE_ALBUM_NAME, name };
}

export function keepAlbumOpen() {
  return (dispatch) => {
    dispatch(NavigationActions.navigate({ routeName: 'App' }));
  }
}

export function closeAlbum() {
  return (dispatch) => {
    dispatch(updateId(null));
    Storage.saveAlbumId(null);
    dispatch(updateName(null));
    Storage.saveAlbumName(null);
    dispatch(NavigationActions.navigate({ routeName: 'App' }));
  }
}

export function attemptCloseAlbum() {
  return (dispatch) => {
  dispatch(NavigationActions.navigate({ routeName: 'CloseAlbum' }));
  }
}
