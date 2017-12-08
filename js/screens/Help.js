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
  renderCameraHelp() {
    return (
      <View style={styles.page}>
        <Text style={styles.font}>
          Swipe left to manage your albums and view all images
        </Text>
        <Text style={styles.font}>
          Swipe up to get to the menu and create an album
        </Text>
        <Text style={styles.font}>
          Swipe right to preview your pictures before they are shared
        </Text>
        <Text style={styles.font}>
          Not in any album? Tasvir will work just like your normal camera and save all photos to your phone
        </Text>
        <TasvirButton
          secondary={true}
          onPress={() => this.props.dismiss()}
          text={'Okay'} />
      </View>
    );
  }

  renderAllImagesHelp() {
    return (
      <View style={styles.page}>
        <Text style={styles.font}>
          This page will show all images from your device photo gallery
        </Text>
        <Text style={styles.font}>
          Add any image to your album with the <FontAwesome style={{color: "#FFFFFF"}}>{Icons.plus}</FontAwesome> button
        </Text>
        <Text style={styles.font}>
          Images already in the album will be marked <FontAwesome style={{color: "#FFFFFF"}}>{Icons.check}</FontAwesome>
        </Text>
        <TasvirButton
          secondary={true}
          onPress={() => this.props.dismiss()}
          text={'Okay'} />
      </View>
    );
  }

  renderPreviewHelp() {
    return (
      <View style={styles.page}>
        <Text style={styles.font}>
          Add the image to the album with  <FontAwesome style={{color: "#FFFFFF"}}>{Icons.plus}</FontAwesome>
        </Text>
        <Text style={styles.font}>
          Save the image to only your phone (do not add to album) with  <FontAwesome style={{color: "#FFFFFF"}}>{Icons.download}</FontAwesome>
        </Text>
        <Text style={styles.font}>
          Delete the image with delete  <FontAwesome style={{color: "#FFFFFF"}}>{Icons.trash}</FontAwesome>
        </Text>
        <TasvirButton
          secondary={true}
          onPress={() => this.props.dismiss()}
          text={'Okay'} />
      </View>
    );
  }

  render() {
    var content = null;
    switch(this.props.helpScreenState) {
      case App.CAMERA_HELP_SCREEN:
        content = this.renderCameraHelp();
        break;
      case App.ALL_IMAGES_HELP_SCREEN:
        content = this.renderAllImagesHelp();
        break;
      case App.PREVIEW_HELP_SCREEN:
        content = this.renderPreviewHelp();
        break;
      default:
        content = null;
        break;
    }

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image style={styles.logo}
            source={LOGO}/>
        </View>
        {content}
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

const mapStateToProps = (state) => {
  return {
    helpScreenState: state.app.helpScreenState
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dismiss: () => dispatch(App.dismiss())
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Help);
