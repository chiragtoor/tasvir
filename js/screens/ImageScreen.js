import React, {Component} from 'react';
import {View, Text, Dimensions, StyleSheet, Image, Animated, TouchableOpacity} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { connect } from 'react-redux';
var RNFS = require('react-native-fs');
var Mixpanel = require('react-native-mixpanel');

import * as Actions from '../actions';

import TasvirIconButton from '../components/TasvirIconButton';

class ImageScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      pan: new Animated.ValueXY(),
      scale: new Animated.Value(1),
      backIcon: null
    }
  }

  shareAction = () => {
    this.setState({
      backIcon: <FontAwesome style={{color: "#FFFFFF", fontSize: 60}}>{Icons.plus}</FontAwesome>
    });
    Animated.timing(
      this.state.pan,
      {toValue: {x:0, y: -1 * Dimensions.get('window').height}, duration: 250}
    ).start(() => {
      this.props.uploadImage(this.props.image);
      this.props.onFinish();
      Mixpanel.track("Preview Image Shared");
    });
  }

  deleteAction = () => {
    this.setState({
      backIcon: <FontAwesome style={{color: "#FFFFFF", fontSize: 60}}>{Icons.trash}</FontAwesome>
    });
    Animated.timing(
      this.state.pan,
      {toValue: {x:0, y: Dimensions.get('window').height}, duration: 250}
    ).start(() => {
      this.props.onFinish();
      Mixpanel.track("Preview Image Deleted");
    });
  }

  downloadAction = () => {
    this.setState({
      backIcon: <FontAwesome style={{color: "#FFFFFF", fontSize: 60}}>{Icons.download}</FontAwesome>
    });
    Animated.timing(
      this.state.scale,
      {toValue: 0, duration: 250}
    ).start(() => {
      this.props.saveImage(this.props.image);
      this.props.onFinish();
      Mixpanel.track("Preview Image Saved");
    });
  }

  render() {
    let {pan, scale} = this.state;
    let [translateX, translateY] = [pan.x, pan.y];
    let rotate = '0deg';
    let imageStyle = {transform: [{translateY}, {rotate}, {scale}], backgroundColor: "#000000"};

    return (
      <View style={styles.container}>
        <View style={{position: 'absolute', flex: 1, width: Dimensions.get('window').width, height: Dimensions.get('window').height, justifyContent: 'center', alignItems: 'center'}}>
          {this.state.backIcon}
        </View>
        <Animated.View style={imageStyle}>
          <Image source={{uri: (RNFS.DocumentDirectoryPath + '/' + this.props.image.uri)}} style={styles.page} resizeMode='contain' />
        </Animated.View>
        <View style={{position: 'absolute', flex: 1, width: Dimensions.get('window').width, height: Dimensions.get('window').height, justifyContent: 'space-between', paddingTop: 20, paddingBottom: 20}}>
          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
            <View style={{flex: 1, alignItems: 'flex-start', paddingLeft: 20}}>
              <TasvirIconButton
                onPress={this.props.goToCamera}
                content={<FontAwesome style={{color: "#FFFFFF"}}>{Icons.camera}</FontAwesome>} />
            </View>
            <View style={{flex: 1, alignItems: 'flex-end', paddingRight: 20}}>
              <TasvirIconButton
                onPress={() => this.props.help()}
                content={<FontAwesome style={{color: "#FFFFFF"}}>{Icons.question}</FontAwesome>} />
            </View>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 1, alignItems: 'flex-start', paddingLeft: 20}}>
              <TasvirIconButton
                onPress={this.deleteAction}
                content={<FontAwesome style={{color: "#FFFFFF"}}>{Icons.trash}</FontAwesome>} />
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
              <TasvirIconButton
                onPress={this.downloadAction}
                content={<FontAwesome style={{color: "#FFFFFF"}}>{Icons.download}</FontAwesome>} />
            </View>
            <View style={{flex: 1, alignItems: 'flex-end', paddingRight: 20}}>
              <TasvirIconButton
                onPress={this.shareAction}
                content={<FontAwesome style={{color: "#FFFFFF"}}>{Icons.plus}</FontAwesome>} />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#48B2E2',
  },
  page: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  onPreviewButtonBorder: {
    borderRadius: 19,
    height: 38,
    width: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#FFFFFF"
  },
  onPreviewButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    height: 32,
    width: 32,
    backgroundColor: "#48B2E2"
  },
  deleteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    height: 32,
    width: 32,
    backgroundColor: "#FF2C55"
  }
});

const mapDispatchToProps = (dispatch) => {
  return {
    uploadImage: (image) => dispatch(Actions.TasvirApi.uploadImage(image)),
    saveImage: (photo) => dispatch(Actions.saveImage(photo)),
    help: () => dispatch(Actions.App.goToPreviewHelp())
  };
};
export default connect(null, mapDispatchToProps)(ImageScreen);
