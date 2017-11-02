import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { Provider, connect } from 'react-redux';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { offline } from 'redux-offline';
import offlineConfig from 'redux-offline/lib/defaults';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { StackNavigator, addNavigationHelpers } from 'react-navigation';
import branch from 'react-native-branch';
import BackgroundFetch from "react-native-background-fetch";
import request from 'superagent';

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
import AlbumList from './screens/AlbumList';

import { loadAndDispatchState, App } from './actions';
import * as Storage from './storage';

import { WALKTHROUGH_FLAG_STORAGE, URL, ALBUMS_ENDPOINT, ROUTES } from './constants';

const loggerMiddleware = createLogger({
  predicate: (getState, action) => __DEV__
});

const TasvirNavigator = StackNavigator({
  Main: {screen: Main },
  Splash: {screen: Splash},
  CloseAlbum: {screen: AlbumAction},
  JoinAlbum: {screen: AlbumAction},
  Walkthrough: {screen: Walkthrough},
  AlbumList: {screen: AlbumList}
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
      .attach('photo', effect.photo);
  }
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
});

branch.subscribe(async ({error, params}) => {
  if (error) return;
  if (params['+clicked_branch_link']) {
    const albumId = params['album_id'];
    const albumName = params['album_name'];
    if(albumId && albumName) {
      const walkthroughCompleted = await AsyncStorage.getItem(WALKTHROUGH_FLAG_STORAGE);
      if(walkthroughCompleted) {
        store.dispatch(App.joinAlbum(albumName, albumId));
      } else {
        store.dispatch(App.setWalkthroughComplete(() => App.joinAlbum(albumName, albumId)));
      }
    }
  }
});

store.dispatch(loadAndDispatchState());

export default class Tasvir extends React.Component {

  // componentDidMount() {
  //   BackgroundFetch.configure({
  //     stopOnTerminate: false
  //   }, function() {
  //     console.log("[Tasvir] Received background-fetch event");
  //
  //     // To signal completion of your task to iOS, you must call #finish!
  //     // If you fail to do this, iOS can kill your app.
  //     BackgroundFetch.finish();
  //   }, function(error) {
  //     console.log("[Tasvir] RNBackgroundFetch failed to start");
  //   });
  // }

  render() {
    return (
      <Provider store={store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}
