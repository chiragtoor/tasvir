import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { Provider, connect } from 'react-redux';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { offline } from 'redux-offline';
import offlineConfig from 'redux-offline/lib/defaults';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { StackNavigator, addNavigationHelpers, NavigationActions } from 'react-navigation';
import branch from 'react-native-branch';
import request from 'superagent';
var Mixpanel = require('react-native-mixpanel');

/* Setup Mixpanel */
if(__DEV__) {
  Mixpanel.sharedInstanceWithToken('b167786a4d7866d010361cd98608f7e1');
} else {
  Mixpanel.sharedInstanceWithToken('4d4d1309c81c11d2c31adfe3b773a821');
}

/*
 * in order to be able to navigate from actions we need to hook
 *  up react-navigation and redux, to do that we need to set up our
 *  reducers here where we have access to TasvirNavigator, we need that
 *  in order to setup the navReducer
 * for that reason we include all reducer files individually here and use
 *  combineReducers here and not in a index.js file in the reducers directory
 *  like you normally see with redux, this way we avoid a extra package
 *  around our app state, we want our app state and nav to be at the same
 *  level in the reducer.
 */
import app from './reducers/app';
import album from './reducers/album';
import reel from './reducers/reel';
import gallery from './reducers/gallery';

import Splash from './screens/Splash';
import Main from './screens/Main';
import AlbumAction from './screens/AlbumAction';
import Walkthrough from './screens/Walkthrough';
import AlbumReel from './screens/AlbumReel';

import * as Actions from './actions';
import * as Storage from './storage';

import { WALKTHROUGH_FLAG_STORAGE, URL, ALBUMS_ENDPOINT, ROUTES } from './constants';

const loggerMiddleware = createLogger({
  predicate: (getState, action) => __DEV__
});

const TasvirNavigator = StackNavigator({
  Splash: { screen: Splash },
  Main: { screen: Main },
  AlbumAction: { screen: AlbumAction },
  Walkthrough: { screen: Walkthrough },
  AlbumReel: { screen: AlbumReel }
}, {
  // on iOS screens coming from bottom up look better, no effect on Android
  mode: 'modal',
  // no pages have any headers
  headerMode: 'none',
  navigationOptions: {
    // disable swipe back to last page ability, app uses swiping
    //  to navigate around so this could conflict and the user
    //  end up swiping back a page unexpectedly if they swipe
    //  quickly from the top down (like going from the menu back to camera)
    gesturesEnabled: false
  }
});

const initialNavState = TasvirNavigator.router.getStateForAction(
  TasvirNavigator.router.getActionForPathAndParams(ROUTES.SPLASH)
);

const navReducer = (state = initialNavState, action) => {
  const nextState = TasvirNavigator.router.getStateForAction(action, state);
  return nextState || state;
};

const appReducer = combineReducers({
  nav: navReducer,
  reel: reel,
  album: album,
  app: app,
  gallery: gallery
});

class NavWrapper extends React.Component {
  render() {
    return (
      <TasvirNavigator navigation={addNavigationHelpers({
        dispatch: this.props.dispatch,
        state: this.props.nav,
      })} />
    );
  }
}

const mapStateToProps = (state) => ({
  nav: state.nav
});

const AppWithNavigationState = connect(mapStateToProps)(NavWrapper);

const customConfig = {
  ...offlineConfig,
  effect: (effect, action) => {
    return request.post(URL + ALBUMS_ENDPOINT + '/' + effect.id + '/photo')
      .field('sent_by', effect.sent_by)
      .field('width', effect.width)
      .field('height', effect.height)
      .attach('photo', effect.photo);
  },
  persistOptions: { whitelist: ["offline"] }
};

const store = createStore(appReducer, {},
  compose(applyMiddleware(thunkMiddleware), offline(customConfig)));
// const store = createStore(appReducer, {}, compose(applyMiddleware(thunkMiddleware)));

// in order to persist the reel to state since actions fire before the change
//   and reducers are meant to be pure, no side-effects
store.subscribe(() => {
  const previewReel = store.getState().reel.previewReel;
  Storage.savePreviewReel(previewReel);
  const savedPhotos = store.getState().app.savedPhotos;
  Storage.saveDownloadedPhotos(savedPhotos);
  const albumImages = store.getState().album.images;
  Storage.saveAlbumImages(albumImages);
});

branch.subscribe(async ({error, params}) => {
  if (error) return;
  if (params['+clicked_branch_link']) {
    const albumId = params['album_id'];
    const albumName = params['album_name'];
    if(albumId && albumName && albumId != store.getState().album.id) {
      const walkthroughCompleted = await AsyncStorage.getItem(WALKTHROUGH_FLAG_STORAGE);
      if(walkthroughCompleted) {
        Mixpanel.track("Album Link Opened");
        store.dispatch(Actions.Album.joinAlbum(albumName, albumId));
      } else {
        Mixpanel.setOnce({"referredUser": true, "referringAlbumId": albumId, "referringAlbum": albumName});
        store.dispatch(Actions.App.setWalkthroughComplete(() => (dispatch) => {
          dispatch(NavigationActions.navigate({ routeName: ROUTES.MAIN }));
          dispatch(Actions.Album.joinAlbum(albumName, albumId));
        }));
      }
    }
  }
});

store.dispatch(Actions.loadAndDispatchState());

export default class Tasvir extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}
