import { CameraRoll } from 'react-native';
import { NavigationActions } from 'react-navigation';

import * as Album from './album';
import * as Gallery from './gallery';
import * as App from './app';
import * as Reel from './reel';

import * as Storage from '../storage';
import { URL, ALBUMS_ENDPOINT } from '../../js/constants';

import { saveImage } from '../actions';

function getHeaders() {
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
}

export function createAlbum() {
  return (dispatch, getState) => {
    const { album: { name } } = getState();
    return fetch(URL + ALBUMS_ENDPOINT, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        album: {
          name: name
        }
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.success) {
        Storage.saveAlbumName(name);
        dispatch(Album.updateId(responseJson.album));
        Storage.saveAlbumId(responseJson.album);
        dispatch(Album.updateLink(responseJson.link));
        Storage.saveAlbumLink(responseJson.link);
        dispatch(Album.updateAlbumDate(responseJson.album_date));
        Storage.saveAlbumDate(responseJson.album_date);
        dispatch(App.resetAlbumForm());
        dispatch(Album.joinChannel());
      } else {
        dispatch(App.resetAlbumForm());
      }
    })
    .catch((error) => {
      console.error(error);
      // something went wrong
      dispatch(App.resetAlbumForm());
    });
  }
}

export function loadAlbum() {
  return (dispatch, getState) => {
    const {album: { id }, app: { senderId, savedPhotos } } = getState();

    return fetch(URL + ALBUMS_ENDPOINT + "/" +  id)
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.success) {
        dispatch(Album.updateLink(responseJson.link));
        for(var i = 0; i < responseJson.photos.length; i++) {
          const photo = responseJson.photos[i];
          // do not want to save own captured pictures or previously saved images,
          //  both these cases will be duplicates in the camera roll
          if(!(senderId === photo.sent_by || savedPhotos.includes(photo.id))) {
            dispatch(saveImage(photo.photo, false));
            dispatch(App.addSavedPhoto(photo.id));
          }
        }
        return dispatch(Gallery.loadGallery());;
      }
    });
  }
}

export function uploadImage(image) {
  return (dispatch, getState) => {
    const { album: { id }, app: { senderId } } = getState();

    dispatch(saveImage(image));

    console.log("ACTION UPLOAD IMAGE");

    const file = {
      uri: image,
      name: 'photo.jpg',
      type : 'image/jpg'
    }

    dispatch({type: 'NO_REDUCER_STUB_UPLOAD_IMAGE', meta: { offline: {
      effect: { photo: file, sent_by: senderId, id: id },
      commit: { type: 'NO_REDUCER_STUB_IMAGE_UPLOADED', meta: {  } },
    }}});

  }
}
