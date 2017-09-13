import { CameraRoll } from 'react-native';
import { NavigationActions } from 'react-navigation';
import request from 'superagent';

import * as AlbumForm from './album_form';
import * as Album from './album';
import * as Photos from './photos';
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
    const { albumForm: { name } } = getState();
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
        dispatch(Album.updateName(name));
        Storage.saveAlbumName(name);
        dispatch(Album.updateId(responseJson.album));
        Storage.saveAlbumId(responseJson.album);
        dispatch(Album.updateLink(responseJson.link));
        Storage.saveAlbumLink(responseJson.link);
        dispatch(AlbumForm.reset());
      } else {
        dispatch(AlbumForm.reset());
      }
    })
    .catch((error) => {
      console.error(error);
      // something went wrong
      dispatch(AlbumForm.reset());
    });
  }
}

export function loadAlbum() {
  return (dispatch, getState) => {
    const {album: {id}, photos: {savedPhotoIds}} = getState();

    fetch(URL + ALBUMS_ENDPOINT + "/" +  id)
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.success) {
        dispatch(Album.updateLink(responseJson.link));
        for(var i = 0; i < responseJson.photos.length; i++) {
          const photo = responseJson.photos[i];
          if(!(savedPhotoIds.includes(photo.id))) {
            CameraRoll.saveToCameraRoll(photo.photo);
            dispatch(Photos.addSavedPhoto(photo.id));
          }
        }
      }
    });
  }
}

export function uploadImage(image) {
  return (dispatch, getState) => {
    const { album: { id } } = getState();

    const file = {
      uri: image,
      name: 'photo.jpg',
      type : 'image/jpg'
    }

    return request.post(URL + ALBUMS_ENDPOINT + '/' + id + '/photo')
      .attach('photo', file)
      .then((response) => response.body)
      .then((responseJson) => {
        if(responseJson.success) {
          console.log("UPLOADED IMAGE: ", responseJson.id);
          dispatch(saveImage(image, responseJson.id));
        } else {
          console.error("ERROR UPLOADING IMAGE");
        }
      })
  }
}
