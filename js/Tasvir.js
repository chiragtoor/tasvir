import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { Provider, connect } from 'react-redux';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { StackNavigator, addNavigationHelpers } from 'react-navigation';
import branch from 'react-native-branch';

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
import album from './reducers/album';
import albumForm from './reducers/album_form';
import joinAlbumForm from './reducers/join_album_form';
import reel from './reducers/reel';
import settings from './reducers/settings';
import photos from './reducers/photos';

import Splash from './screens/Splash';
import App from './screens/App';
import AlbumAction from './screens/AlbumAction';
import Walkthrough from './screens/Walkthrough';

import { loadAndDispatchState } from './actions';
import * as JoinAlbumForm from './actions/join_album_form';
import * as Storage from './storage';

import { WALKTHROUGH_FLAG_STORAGE } from './constants';

const loggerMiddleware = createLogger({
  predicate: (getState, action) => __DEV__
});

const TasvirNavigator = StackNavigator({
  App: {screen: App },
  Splash: {screen: Splash},
  CloseAlbum: {screen: AlbumAction},
  JoinAlbum: {screen: AlbumAction},
  Walkthrough: {screen: Walkthrough}
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
  TasvirNavigator.router.getActionForPathAndParams('Splash')
);

const navReducer = (state = initialNavState, action) => {
  const nextState = TasvirNavigator.router.getStateForAction(action, state);
  return nextState || state;
};

const appReducer = combineReducers({
  nav: navReducer,
  reel: reel,
  album: album,
  albumForm: albumForm,
  joinAlbumForm: joinAlbumForm,
  settings: settings,
  photos: photos
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

configureStore = (initialState) => {
  const enhancer = compose(
    applyMiddleware(
      thunkMiddleware,
      // loggerMiddleware
    )
  );
  return createStore(appReducer, initialState, enhancer);
}

const store = configureStore({});

// in order to persist the reel to state since actions fire before the change
//   and reducers are meant to be pure, no side-effects
store.subscribe(() => {
  const previewReel = store.getState().reel.previewReel;
  Storage.savePreviewReel(previewReel);
  const savedPhotoIds = store.getState().photos.savedPhotoIds;
  Storage.saveDownloadedPhotos(savedPhotoIds);
});

branch.subscribe(async ({error, params}) => {
  if (error) return;
  if (params['+clicked_branch_link']) {
    const albumId = params['album_id'];
    const albumName = params['album_name'];
    if(albumId && albumName) {
      store.dispatch(JoinAlbumForm.updateId(albumId));
      store.dispatch(JoinAlbumForm.updateName(albumName));
      const walkthroughCompleted = await AsyncStorage.getItem(WALKTHROUGH_FLAG_STORAGE);
      if(walkthroughCompleted) {
        store.dispatch(JoinAlbumForm.attemptJoinAlbum());
      }
    }
  }
});

store.dispatch(loadAndDispatchState());

export default class Tasvir extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}
