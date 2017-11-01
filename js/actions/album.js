import { CameraRoll } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Socket } from 'phoenix';

import * as TasvirApi from './tasvir_api';
import * as Gallery from './gallery';
import * as App from './app';
import { SOCKET_URL } from '../constants';

export const UPDATE_ALBUM_ID = 'album/UPDATE_ALBUM_ID';
export const UPDATE_ALBUM_NAME = 'album/UPDATE_ALBUM_NAME';
export const LOAD_LINK = 'album/LOAD_LINK';
export const RESET_ALBUM = 'album/RESET_ALBUM';
export const SET_HISTORY = 'album/SET_HISTORY';

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

export function setHistory(history) {
  return { type: SET_HISTORY, history };
}

export function openAlbum(index) {
  return (dispatch, getState) => {
    let { album: { history } } = getState();
    const album = history[index];
    dispatch(reset());
    dispatch(updateId(album.id));
    dispatch(updateName(album.name));
    dispatch(TasvirApi.loadAlbum());
    history.splice(index, 1);
    dispatch(setHistory(history));
  }
}

const socket = new Socket(SOCKET_URL);
let chan = null;

export function joinChannel() {
  return (dispatch, getState) => {
    const { album: { id }, app: { senderId } } = getState();
    if(id != null) {
      socket.connect();
      chan = socket.channel("album:" + id, {});

      chan.join();
      chan.on("new:photo", msg => {
        if(!(msg.sent_by === senderId)) {
          CameraRoll.saveToCameraRoll(msg.photo).then((uri) => {
            dispatch(App.flagImageReceivedFromChannel());
            dispatch(Gallery.loadGallery());
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
