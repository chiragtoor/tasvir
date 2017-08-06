import { NavigationActions } from 'react-navigation';
import { AsyncStorage } from 'react-native';

import { PREVIEW_REEL_STORAGE, ALBUM_ID_STORAGE, ALBUM_NAME_STORAGE,
         AUTO_SHARE_STORAGE } from '../constants';

import * as Reel from './reel';
import * as Album from './album';
import * as Settings from './settings';

import * as Storage from '../storage';

export {Reel as Reel,
        Album as Album,
        Settings as Settings};

export const NAVIGATE = 'Navigation/NAVIGATE';

export function loadAndDispatchState() {
  return (dispatch) => {
    return AsyncStorage.multiGet([PREVIEW_REEL_STORAGE, ALBUM_ID_STORAGE,
            ALBUM_NAME_STORAGE, AUTO_SHARE_STORAGE]).then((value) => {
      const getValue = (arr, key) => {
        for (var i = 0; i < arr.length; i++) {
          if(arr[i][0] === key) {
            return JSON.parse(arr[i][1]);
          }
        }
        return null;
      };

      const albumId = getValue(value, ALBUM_ID_STORAGE);
      const autoShare = getValue(value, AUTO_SHARE_STORAGE);

      if(albumId) {
        dispatch(Album.updateId(albumId));
        dispatch(Album.updateName(getValue(value, ALBUM_NAME_STORAGE)));
        dispatch(PreviewReel.loadPreviewReel(getValue(value, PREVIEW_REEL_STORAGE)));
        if (autoShare) dispatch(Settings.updateAutoShare(autoShare));
        dispatch(PreviewReel.updateCurrentIndex(0));
      }

      dispatch(NavigationActions.navigate({routeName: 'App'}));
    }).catch((error) => {
      console.error(error);
    });
  }
}
