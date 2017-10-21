import { CameraRoll } from 'react-native';
import { NavigationActions } from 'react-navigation';
import request from 'superagent';

import * as AlbumForm from './album_form';
import * as Album from './album';
import * as Photos from './photos';
import * as Reel from './reel';

import * as Storage from '../storage';
import { URL, ALBUMS_ENDPOINT } from '../../js/constants';

import { saveImage, joinChannel } from '../actions';

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
        dispatch(joinChannel());
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
    const {album: { id }, settings: { idfv }, photos: {savedPhotoIds} } = getState();

    fetch(URL + ALBUMS_ENDPOINT + "/" +  id)
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.success) {
        dispatch(Album.updateLink(responseJson.link));
        for(var i = 0; i < responseJson.photos.length; i++) {
          const photo = responseJson.photos[i];
          // do not want to save own captured pictures or previously saved images,
          //  both these cases will be duplicates in the camera roll
          if(!(idfv === photo.sent_by || savedPhotoIds.includes(photo.id))) {
            CameraRoll.saveToCameraRoll(photo.photo);
            dispatch(Photos.addSavedPhoto(photo.id));
          }
        }
        dispatch(Photos.loadGalleryImages());
      }
    });
  }
}

export function uploadImage(image) {
  return (dispatch, getState) => {
    const { album: { id }, settings: { idfv } } = getState();

    const file = {
      uri: image,
      name: 'photo.jpg',
      type : 'image/jpg'
    }

    dispatch(saveImage(image));
    return request.post(URL + ALBUMS_ENDPOINT + '/' + id + '/photo')
      .field('sent_by', idfv)
      .attach('photo', file)
      .then((response) => response.body)
      .then((responseJson) => {
        if(!(responseJson.success)) {
          console.error("ERROR UPLOADING IMAGE");
        }
      })
  }
}
