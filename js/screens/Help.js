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

import * as App from '../actions/app';

import TasvirButton from '../components/TasvirButton';

const LOGO = require('../../img/tasvir_logo.png');

class Help extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image style={styles.logo}
            source={LOGO}/>
        </View>
        <View style={styles.page}>
          <Text style={styles.font}>
            Swipe left to view all your albums and images.
          </Text>
          <Text style={styles.font}>
            Swipe right to preview your picturs: share to album (<FontAwesome style={{color: "#FFFFFF"}}>{Icons.cloudUpload}</FontAwesome>), save for yourself (<FontAwesome style={{color: "#FFFFFF"}}>{Icons.download}</FontAwesome>), or delete (<FontAwesome style={{color: "#FFFFFF"}}>{Icons.trash}</FontAwesome>).
          </Text>
          <Text style={styles.font}>
            Swipe up to get to the menu and create an album.
          </Text>
            <View>
              <Text style={styles.font}>
                Share an album link and your friends will have access to all the pictures in that album.
              </Text>
              <Text style={styles.font}>
                They can even add their own images.
              </Text>
            </View>
          <TasvirButton
            secondary={true}
            onPress={() => this.props.dismissHelp()}
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
    dismissHelp: () => dispatch(App.dismissHelp())
  };
};
export default connect(null, mapDispatchToProps)(Help);
