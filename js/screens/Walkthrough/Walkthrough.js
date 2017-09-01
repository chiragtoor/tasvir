'use strict';

import React,{ Component } from 'react';
import {
  Dimensions,
  Image,
  View,
  Text
} from 'react-native';
import { connect } from 'react-redux';
import FontAwesome, { Icons } from 'react-native-fontawesome';
const Permissions = require('react-native-permissions');

import * as Actions from '../../actions';

import styles from './styles';

import TasvirButton from '../../common/components/TasvirButton';

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
          <Text style={{textAlign: 'center', fontSize: 30, color: '#FFFFFF'}}>
            Welcome to Tasvir!
          </Text>
          <Text style={{textAlign: 'center', fontSize: 20, color: '#FFFFFF'}}>
            The easiest way to share your photos
          </Text>
        </View>
        <Text style={{textAlign: 'center', fontSize: 20, color: '#FFFFFF'}}>
          Just create an album and share the link with your friends, they will have access to all the photos you take.
        </Text>
        <TasvirButton
          secondary={true}
          onPress={() => this.setState({page: 2})}
          disabled={false}
          text={'Okay'} />
      </View>
    );
  }

  renderPageTwo() {
    return (
      <View style={styles.page}>
        <Text style={{textAlign: 'center', fontSize: 20, color: '#FFFFFF'}}>
          Preview your picturs to the right of the camera, from there share (<FontAwesome style={{color: "#FFFFFF"}}>{Icons.cloudUpload}</FontAwesome>), keep to yourself (<FontAwesome style={{color: "#FFFFFF"}}>{Icons.download}</FontAwesome>), or delete (<FontAwesome style={{color: "#FFFFFF"}}>{Icons.trash}</FontAwesome>).
        </Text>
        <Text style={{textAlign: 'center', fontSize: 20, color: '#FFFFFF'}}>
          Swipe the camera up to get to the menu.
        </Text>
        <TasvirButton
          secondary={true}
          onPress={() => this.setState({page: 3})}
          disabled={false}
          text={'Okay'} />
      </View>
    );
  }

  renderPageThree() {
    return (
      <View style={styles.page}>
        <Text style={{textAlign: 'center', fontSize: 20, color: '#FFFFFF'}}>
          Please allow access to your camera and pictures to manage your albums.
        </Text>
        <TasvirButton
          secondary={true}
          onPress={() => this.done()}
          disabled={false}
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
          <Image style={{width: 200, resizeMode: 'contain', marginTop: 10}}
            source={require('../../../img/tasvir_logo.png')}/>
        </View>
        {content}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return { };
};
const mapDispatchToProps = (dispatch) => {
  return {
    completeWalkthrough: () => dispatch(Actions.completeWalkthrough())
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Walkthrough);
