'use strict';

import React,{ Component } from 'react';
import {
  Dimensions,
  Image,
  View,
} from 'react-native';

import styles from './styles';

/*
 * SplashScreen is the first thing shown and is what is used while
 *  we load the users authToken from storage. This allows us to navigate
 *  to the correct screen without showing the wrong one first, we show
 *  the SplashScreen by default and if there is no registered account
 *  navigate to the SignUp screen, otherwise navigate to the App.
 */
export default class Splash extends Component {
  render() {
    return (
      <View style={styles.page}>
        <Image style={styles.logo}
          source={require('../../../img/tasvir_logo.png')}/>
      </View>
    );
  }
}
