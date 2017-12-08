import { CameraRoll, Image } from 'react-native';
import { NavigationActions } from 'react-navigation';
var Mixpanel = require('react-native-mixpanel');

import * as Album from './album';
import * as AlbumChannel from './album_channel';
import * as Gallery from './gallery';
import * as App from './app';
import * as Reel from './reel';

import * as Storage from '../storage';
import { URL, ALBUMS_ENDPOINT,
         UPLOAD_ACTION, COMMIT_ACTION } from '../../js/constants';

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
    Mixpanel.trackWithProperties("Creating Album", {"albumName": name});
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
        Mixpanel.trackWithProperties("Created Album", {"albumId": responseJson.album, "albumName": name});
        dispatch(Album.updateLink(responseJson.link));
        Storage.saveAlbumLink(responseJson.link);
        dispatch(Album.updateAlbumDate(responseJson.album_date));
        Storage.saveAlbumDate(responseJson.album_date);
        dispatch(App.resetAlbumForm());
        dispatch(AlbumChannel.joinChannel());
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
  return async (dispatch, getState) => {
    const {album: { id, name }, app: { senderId, savedPhotos } } = getState();
    const response = await fetch(URL + ALBUMS_ENDPOINT + "/" +  id);
    const responseJson = await response.json();
    if(responseJson.success) {
      dispatch(Album.updateLink(responseJson.link));
      dispatch(Album.updateAlbumDate(responseJson.album_date));
      for(var i = 0; i < responseJson.photos.length; i++) {
        const apiPhoto = responseJson.photos[i];
        // do not want to save own captured pictures or previously saved images,
        //  both these cases will be duplicates in the camera roll
        if(!(senderId === apiPhoto.sent_by || savedPhotos.includes(apiPhoto.id))) {
          const photo = { uri: apiPhoto.photo, ...apiPhoto };
          const newUri = await dispatch(saveImage(photo, false));
          const newPhoto = {...photo, uri: newUri};
          dispatch(Album.addImage(newPhoto));
          dispatch(App.addSavedPhoto(photo.id));
          Mixpanel.trackWithProperties("Image Loaded via API", {
            "albumId": id, "albumName": name,
            "photoId": photo.id
          });
        }
      }
      dispatch(Gallery.loadGallery());
    }
  }
}

export function uploadImage(image, saveFlag = true) {
  return async (dispatch, getState) => {
    const { album: { id }, app: { senderId, autoShare } } = getState();

      let newImage = image;
      if(saveFlag) {
        const newUri = await dispatch(saveImage(image));
        newImage = {...image, uri: newUri};
      } else {
        dispatch(Gallery.setGalleryButtonImage(newImage));
      }
      console.log("ADDING IMAGE: ", image);
      dispatch(Album.addImage(newImage));

      Mixpanel.trackWithProperties("Uploading Image", {"albumId": id, "autoShared": autoShare});

      const file = {
        uri: newImage.uri,
        name: 'photo.jpg',
        type : 'image/jpg'
      };
      dispatch({type: UPLOAD_ACTION,
                meta: {
                  offline: {
                    effect: { photo: file,
                              sent_by: senderId,
                              id: id,
                              width: newImage.width,
                              height: newImage.height },
                    commit: { type: COMMIT_ACTION,
                              meta: {  }
                    },
                  }
                }
              });
  }
}
