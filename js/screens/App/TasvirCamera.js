import React, {Component} from 'react';
import {View, Text, Dimensions, StyleSheet, Image, Animated, TouchableOpacity} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import Camera from 'react-native-camera';
var RNFS = require('react-native-fs');
import TasvirIconButton from '../../common/components/TasvirIconButton';

export default class TasvirCamera extends Component {

  constructor(props) {
    super(props);

    this.state = {
      captureFadeAnim: new Animated.Value(0),
      cameraType: Camera.constants.Type.back,
      savedPhotos: []
    }
  }

  flipCamera = () => {
    if(this.state.cameraType === Camera.constants.Type.back) {
      this.setState({cameraType: Camera.constants.Type.front});
    } else {
      this.setState({cameraType: Camera.constants.Type.back});
    }
  }

  takePicture = () => {
    Animated.timing(
      this.state.captureFadeAnim, { toValue: 1, duration: 100 }
    ).start(() => {
      Animated.timing(
        this.state.captureFadeAnim, { toValue: 0, duration: 100 }
      ).start();
    });
    this.camera.capture()
      .then((data) => {
        this.props.takePicture(data);
      })
      .catch(err => console.error(err));
  }

  render() {
    console.log("AJIT: RENDERING TASIVR_CAMERA");
    console.log("AJIT: ", this.props.gallery);
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
                  content={<Image style={{flex: 1, width: 20, resizeMode: 'contain'}} source={require('../../../img/camera_flip_icon.png')}/>} />
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 1, alignItems: 'flex-start', paddingLeft: 20}}>
                {this.props.gallery ?
                  <TasvirIconButton
                    onPress={this.props.goToGallery}
                    content={<Image
                                style={styles.imageButton}
                                source={{uri: this.props.gallery}}>
                                <View style={styles.imageButtonText}>
                                  <FontAwesome style={{color: "#FFFFFF"}}>{Icons.th}</FontAwesome>
                                </View>
                              </Image>} />
                :
                  null
                }
              </View>
              <View style={{flex: 1, alignItems: 'center'}}>
                <TasvirIconButton
                  onPress={this.takePicture}
                  content={null}
                  sizeLarge={true} />
              </View>
              <View style={{flex: 1, alignItems: 'flex-end', paddingRight: 20}}>
                {this.props.preview ?
                  <TasvirIconButton
                    onPress={this.props.goToPreview}
                    content={<Image
                                style={styles.imageButton}
                                source={{uri: (RNFS.DocumentDirectoryPath + '/' + this.props.preview)}}>
                                <View style={styles.imageButtonText}>
                                  <Text style={{color: '#FFFFFF', fontWeight: 'bold'}}>{this.props.previewCount}</Text>
                                </View>
                              </Image>} />
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
