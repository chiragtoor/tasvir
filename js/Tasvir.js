import React, { Component } from 'react';
import { Linking } from 'react-native';
import { Provider, connect } from 'react-redux';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { StackNavigator, addNavigationHelpers } from 'react-navigation';

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

import Splash from './screens/Splash';
import App from './screens/App';
import CloseAlbum from './screens/CloseAlbum';
import JoinAlbum from './screens/JoinAlbum';
import Walkthrough from './screens/Walkthrough';

import { loadAndDispatchState } from './actions';
import * as Storage from './storage';

const loggerMiddleware = createLogger({
  predicate: (getState, action) => __DEV__
});

const TasvirNavigator = StackNavigator({
  App: {screen: App },
  Splash: {screen: Splash},
  CloseAlbum: {screen: CloseAlbum},
  JoinAlbum: {screen: JoinAlbum},
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
  settings: settings
});

class NavWrapper extends React.Component {

  // componentDidMount() {
  //   Linking.addEventListener('url', this.handleOpenURL);
  // }
  //
  // componentWillUnmount() {
  //   Linking.removeEventListener('url', this.handleOpenURL);
  // }
  //
  // handleOpenURL = (event) => {
  //   const path = event.url.replace(/.*?:\/\//g, '').match(/\/([^\/]+)\/?$/)[1];
  //   const parts = path.split('?name=');
  //   const albumId = parts[0];
  //   const albumName = parts[1];
  //
  //   console.log("HANDLE OPEN URL");
  //   console.log("albumId: ", albumId);
  //   console.log("albumName: ", albumName);
  //
  //   console.log("DISPATCH");
  //
  //   this.props.dispatch(joinAlbumUpdateId(albumId);
  //   this.props.joinAlbumUpdateName(albumName);
  //   this.props.attemptJoinAlbum();
  // }

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
  const savedPhotos = store.getState().album.savedPhotos;
  Storage.saveDownloadedPhotos(savedPhotos);
})

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
