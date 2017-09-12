'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  View,
} from 'react-native';

const LOGO = require('../../img/tasvir_logo.png');

/*
 * SplashScreen is the first screen shown on app load and is what is used while
 *  we load the app state from storage
 */
export default class Splash extends Component {
  render() {
    return (
      <View style={styles.page}>
        <Image style={styles.logo}
          source={LOGO}/>
      </View>
    );
  }
}

Splash.getDefaultProps = { }

Splash.propTypes = { }

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#48B2E2'
  },
  logo: {
    width: 250,
    height: 100,
    resizeMode: 'contain'
  }
});
