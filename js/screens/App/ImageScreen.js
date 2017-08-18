import React, {Component} from 'react';
import {View, Text, Dimensions, StyleSheet, Image, Animated, TouchableOpacity} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
var RNFS = require('react-native-fs');

export default class ImageScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      pan: new Animated.ValueXY(),
      scale: new Animated.Value(1)
    }
  }

  shareAction = () => {
    Animated.timing(
      this.state.pan,
      {toValue: {x:0, y: -1 * Dimensions.get('window').height}, duration: 250}
    ).start(() => {
      this.props.onFinish(true);
    });
  }

  deleteAction = () => {
    Animated.timing(
      this.state.pan,
      {toValue: {x:0, y: Dimensions.get('window').height}, duration: 250}
    ).start(() => {
      this.props.onFinish(false);
    });
  }

  render() {
    let {pan, scale} = this.state;
    let [translateX, translateY] = [pan.x, pan.y];
    let rotate = '0deg';
    let imageStyle = {transform: [{translateY}, {rotate}, {scale}]};

    return (
      <View style={styles.container}>
        <Animated.View style={imageStyle}>
          <Image source={{uri: (RNFS.DocumentDirectoryPath + '/' + this.props.data)}} style={styles.page} resizeMode='contain' />
        </Animated.View>
        <View style={{position: 'absolute', flex: 1, width: Dimensions.get('window').width, height: Dimensions.get('window').height, justifyContent: 'flex-end', paddingLeft: 20, paddingBottom: 20}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 1, alignItems: 'flex-start', paddingLeft: 20}}>
              <TouchableOpacity onPress={() => this.deleteAction()}>
                <View style={styles.onPreviewButtonBorder}>
                  <View style={styles.deleteButton}>
                    <FontAwesome style={{color: "#FFFFFF"}}>{Icons.trash}</FontAwesome>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
              <TouchableOpacity onPress={() => this.props.goToCamera()}>
                <View style={styles.onPreviewButtonBorder}>
                  <View style={styles.onPreviewButton}>
                    <FontAwesome style={{color: "#FFFFFF"}}>{Icons.camera}</FontAwesome>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{flex: 1, alignItems: 'flex-end', paddingRight: 20}}>
              <TouchableOpacity onPress={() => this.shareAction()}>
                <View style={styles.onPreviewButtonBorder}>
                  <View style={styles.onPreviewButton}>
                    <FontAwesome style={{color: "#FFFFFF"}}>{Icons.cloudUpload}</FontAwesome>
                  </View>
                </View>
              </TouchableOpacity>
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
