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

class Walkthrough extends Component {

  constructor(props) {
    super(props);

    this.state = {
      page: 1
    }
  }

  renderPageOne() {
    return (
      <View style={styles.page}>
        <View>
          <Text style={styles.font}>
            Welcome to Tasvir!
          </Text>
          <Text style={styles.font}>
            The easiest way to share your photos
          </Text>
        </View>
        <Text style={styles.font}>
          Just create an album and share the link with your friends, they will have access to all the photos you take.
        </Text>
        <Text style={styles.font}>
          Friends can add to your album as well, just download the app from the shared link!
        </Text>
        <TasvirButton
          secondary={true}
          onPress={() => this.setState({page: 2})}
          text={'Okay'} />
      </View>
    );
  }

  renderPageTwo() {
    return (
      <View style={styles.page}>
        <Text style={styles.font}>
          Preview your picturs to the right of the camera, from there share (<FontAwesome style={{color: "#FFFFFF"}}>{Icons.cloudUpload}</FontAwesome>), keep to yourself (<FontAwesome style={{color: "#FFFFFF"}}>{Icons.download}</FontAwesome>), or delete (<FontAwesome style={{color: "#FFFFFF"}}>{Icons.trash}</FontAwesome>).
        </Text>
        <Text style={styles.font}>
          View your gallery of images to the left of the camera.
        </Text>
        <Text style={styles.font}>
          Swipe the camera up to get to the menu.
        </Text>
        <TasvirButton
          secondary={true}
          onPress={() => this.setState({page: 3})}
          text={'Okay'} />
      </View>
    );
  }

  renderPageThree() {
    return (
      <View style={styles.page}>
        <Text style={styles.font}>
          Please allow access to your camera and pictures to manage your albums.
        </Text>
        <TasvirButton
          secondary={true}
          onPress={() => this.done()}
          text={'Done'} />
      </View>
    );
  }

  done = () => {
    Permissions.request('photo')
    .then(response => {
      if(response === 'authorized') {
        Permissions.request('camera')
        .then(response => {
          if(response === 'authorized') {
            this.props.completeWalkthrough();
          }
        });
      }
    });
  }

  render() {
    let content = this.renderPageOne();
    if(this.state.page == 2) {
      content = this.renderPageTwo();
    } else if(this.state.page == 3) {
      content = this.renderPageThree();
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

const mapDispatchToProps = (dispatch) => {
  return {
    completeWalkthrough: () => dispatch(App.completeWalkthrough())
  };
};
export default connect(null, mapDispatchToProps)(Walkthrough);
