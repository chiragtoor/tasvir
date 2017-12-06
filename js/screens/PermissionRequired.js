'use strict';

import React,{ Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  Image,
  View,
  Text
} from 'react-native';
import { connect } from 'react-redux';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import Permissions from 'react-native-permissions';
var Mixpanel = require('react-native-mixpanel');

import * as App from '../actions/app';

import TasvirButton from '../components/TasvirButton';

const LOGO = require('../../img/tasvir_logo.png');

class PermissionRequired extends Component {
  okay = () => {
    Mixpanel.track("Opened Settings for Permissions");
    Permissions.openSettings();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image style={styles.logo}
            source={LOGO}/>
        </View>
        <View style={styles.page}>
          <Text style={styles.font}>
            For Tasvir to work it needs access to both your Camera and Photos.
          </Text>
          <Text style={styles.font}>
            None of your photos are sent anywhere unless you say so, and the Camera access is only so you can easily take pictures for the albums your sharing with.
          </Text>
          <Text style={styles.font}>
            Please allow access to these permissions in your settings to continue.
          </Text>
          <TasvirButton
            secondary={true}
            onPress={() => this.okay()}
            text={'Okay'} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  page: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#48B2E2',
    paddingLeft: 20,
    paddingRight: 20
  },
  logo: {
    width: 200,
    resizeMode: 'contain',
    marginTop: 10
  },
  header: {
    height: 100,
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    backgroundColor: '#48B2E2',
    alignItems: 'center'
  },
  font: {
    textAlign: 'center',
    fontSize: 20,
    color: '#FFFFFF'
  }
});

const mapDispatchToProps = (dispatch) => {
  return {
    completeWalkthrough: () => dispatch(App.completeWalkthrough()),
    permissionDenied: () => dispatch(App.permissionDenied())
  };
};
export default connect(null, mapDispatchToProps)(PermissionRequired);
