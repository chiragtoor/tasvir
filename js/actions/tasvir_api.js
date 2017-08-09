import { NavigationActions } from 'react-navigation';
import request from 'superagent';

import * as AlbumForm from './album_form';
import * as Album from './album';
import * as Reel from './reel';

import * as Storage from '../storage';
import { URL, ALBUMS_ENDPOINT } from '../../js/constants';

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

export function uploadImage(image) {
  return (dispatch, getState) => {
    const { album: { id } } = getState();

    const file = {
      uri: image,
      name: 'photo.jpg',
      type : 'image/jpg'
    }

    request.post(URL + ALBUMS_ENDPOINT + '/' + id + '/photo')
      .attach('photo', file)
      .end((err, res) => {
        if(err == null) {
          console.log("UPLOADED")
        } else {
          console.log(err);
          console.log(res);
        }
      });
  }
}