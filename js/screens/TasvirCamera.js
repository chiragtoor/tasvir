import React, {Component} from 'react';
import {View, Text, Dimensions, StyleSheet, Image, Animated, TouchableOpacity, ImageBackground } from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import Camera from 'react-native-camera';
import { connect } from 'react-redux';
var RNFS = require('react-native-fs');

import * as Actions from '../actions';

import TasvirIconButton from '../components/TasvirIconButton';

class TasvirCamera extends Component {

  constructor(props) {
    super(props);

    this.state = {
      galleryAnim: new Animated.Value(0),
      captureFadeAnim: new Animated.Value(0),
      cameraType: Camera.constants.Type.back
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.imageReceivedFlag) {
      this.props.acknowledgeFlagImageReceivedFromChannel();
      this.animateGallery();
    }
  }

  flipCamera = () => {
    if(this.state.cameraType === Camera.constants.Type.back) {
      this.setState({cameraType: Camera.constants.Type.front});
    } else {
      this.setState({cameraType: Camera.constants.Type.back});
    }
  }

  animateGallery = () => {
    Animated.timing(
      this.state.galleryAnim, { toValue: 1, duration: 500 }
    ).start(() => {
      Animated.timing(
        this.state.galleryAnim, { toValue: 0, duration: 500 }
      ).start();
    });
  }

  animateCapture = () => {
    Animated.timing(
      this.state.captureFadeAnim, { toValue: 1, duration: 100 }
    ).start(() => {
      Animated.timing(
        this.state.captureFadeAnim, { toValue: 0, duration: 100 }
      ).start();
    });
  }

  capture = () => {
    this.animateCapture();
    this.camera.capture()
      .then((data) => {
        Image.getSize(data.path, (width, height) => {
          this.props.capture(data.path.split('/Documents/')[1], width, height);
        })
      }).catch(err => console.error(err));
  }

  render() {
    const hasPreviewReel = this.props.previewReel.length > 0;
    let galleryStyle = {position: 'absolute', left: 2, top: 2, transform: [{scale: this.state.galleryAnim}]};
    return (
      <View
        style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          type={this.state.cameraType}
          style={styles.preview}
          captureTarget={Camera.constants.CaptureTarget.disk}
          captureAudio={false}
          keepAwake={true}
          mirrorImage={true}
          onFocusChanged={() => null}
          zoomChanged={() => null}
          aspect={Camera.constants.Aspect.fill}>
          <View style={{position: 'absolute', flex: 1, width: Dimensions.get('window').width, height: Dimensions.get('window').height, justifyContent: 'space-between', paddingTop: 20, paddingBottom: 20}}>
            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
              <View style={{flex: 1, alignItems: 'flex-start', paddingLeft: 20}}>
                <TasvirIconButton
                  onPress={() => this.flipCamera()}
                  content={<Image style={{flex: 1, width: 20, resizeMode: 'contain'}} source={require('../../img/camera_flip_icon.png')}/>} />
              </View>
              <View style={{flex: 1, alignItems: 'flex-end', paddingRight: 20}}>
                <TasvirIconButton
                  onPress={() => this.props.goToHelp()}
                  content={<FontAwesome style={{color: "#FFFFFF", fontSize: 18}}>{Icons.question}</FontAwesome>} />
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 1, alignItems: 'flex-start', paddingLeft: 20}}>
                {this.props.latestImage ?
                  <View style={{width: 38, height: 38}}>
                    <TasvirIconButton
                      style={{zIndex: 0}}
                      onPress={this.props.goToGallery}
                      content={<ImageBackground
                                  style={styles.imageButton}
                                  imageStyle={styles.imageButton}
                                  source={{uri: this.props.latestImage.uri}}>
                                  <View style={styles.imageButtonText}>
                                    <FontAwesome style={{color: "#FFFFFF"}}>{Icons.th}</FontAwesome>
                                  </View>
                                </ImageBackground>} />
                    <Animated.View style={galleryStyle}>
                      <View style={{borderRadius: 17, height: 34, width: 34, backgroundColor: "#48B2E2"}} />
                    </Animated.View>
                  </View>
                :
                  null
                }
              </View>
              <View style={{flex: 1, alignItems: 'center'}}>
                <TasvirIconButton
                  onPress={this.capture}
                  content={null}
                  sizeLarge={true} />
              </View>
              <View style={{flex: 1, alignItems: 'flex-end', paddingRight: 20}}>
                {hasPreviewReel ?
                  <TasvirIconButton
                    onPress={this.props.goToPreview}
                    content={<ImageBackground
                                style={styles.imageButton}
                                imageStyle={styles.imageButton}
                                source={{uri: (RNFS.DocumentDirectoryPath + '/' + this.props.previewReel[0].uri)}}>
                                <View style={styles.imageButtonText}>
                                  <Text style={{color: '#FFFFFF', fontWeight: 'bold'}}>{this.props.previewReel.length}</Text>
                                </View>
                              </ImageBackground>}/>
                :
                  null
                }
              </View>
            </View>
          </View>
        </Camera>
        <Animated.View
          pointerEvents="none"
          style={{opacity: this.state.captureFadeAnim, position: 'absolute', width: Dimensions.get('window').width, height: Dimensions.get('window').height, borderWidth: 7, borderColor: "#48B2E2"}} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
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
  imageButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    height: 32,
    width: 32
  },
  imageButtonText: {
    height: 32,
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0)'
  }
});

const mapStateToProps = (state) => {
  return {
  albumId: state.album.id,
  // reel state
  previewReel: state.reel.previewReel,
  autoShare: state.app.autoShare,
  // photos state
  latestImage: state.gallery.buttonImage,
  imageReceivedFlag: state.app.imageReceivedFlag
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    addToReel: (image) => dispatch(Actions.Reel.addImage(image)),
    uploadImage: (image) => dispatch(Actions.TasvirApi.uploadImage(image)),
    saveImage: (photo) => dispatch(Actions.saveImage(photo)),
    acknowledgeFlagImageReceivedFromChannel: () => dispatch(Actions.App.acknowledgeFlagImageReceivedFromChannel()),
    capture: (uri, width, height) => dispatch(Actions.App.capture(uri, width, height)),
    goToHelp: () => dispatch(Actions.App.goToCameraHelp())
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(TasvirCamera);
