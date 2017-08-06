import React, { Component } from 'react';
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
import previewReel from './reducers/preview_reel';
import settings from './reducers/settings';

import Splash from './screens/Splash';
import App from './screens/App';

import { loadAndDispatchState } from './actions';
import * as Storage from './storage';

const loggerMiddleware = createLogger({
  predicate: (getState, action) => __DEV__
});

const TasvirNavigator = StackNavigator({
  App: {screen: App },
  Splash: {screen: Splash}
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
  previewReel: previewReel,
  album: album,
  settings: settings
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