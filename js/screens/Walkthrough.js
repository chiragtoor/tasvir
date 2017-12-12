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

class Walkthrough extends Component {

  done = () => {
    Permissions.request('photo').then(response => {
      if(response === 'authorized') {
        Permissions.request('camera').then(response => {
          if(response === 'authorized') {
            this.props.completeWalkthrough();
          } else {
            Mixpanel.track("Camera Permission Rejected");
            this.props.permissionDenied();
          }
        });
      } else {
        Mixpanel.track("Photo Permission Rejected");
        Permissions.request('camera').then(response => {
          if(response === 'authorized') {
            this.props.permissionDenied();
          } else {
            Mixpanel.track("Camera Permission Rejected");
            this.props.permissionDenied();
          }
        });
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image style={styles.logo}
            source={LOGO}/>
        </View>
        <View style={styles.page}>
          <View>
            <Text style={styles.font}>
              Welcome to Tasvir!
            </Text>
            <Text style={styles.font}>
              The easiest way to share your photos, just create an album and share a link!
            </Text>
          </View>
          <Text style={styles.font}>
            Manage your albums and images to the left. Preview photos before they are shared to the right.
          </Text>
          <Text style={styles.font}>
            Swipe up to get to the menu and create an album.
          </Text>
          <Text style={styles.font}>
            Hit the <FontAwesome style={{color: "#FFFFFF"}}>{Icons.question}</FontAwesome> anytime for help.
          </Text>
          <TasvirButton
            secondary={true}
            onPress={() => this.done()}
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
export default connect(null, mapDispatchToProps)(Walkthrough);
