import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import FontAwesome, { Icons } from 'react-native-fontawesome';
var Mixpanel = require('react-native-mixpanel');

import ImageScreen from './ImageScreen';

import * as Actions from '../actions';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

class AlbumReel extends Component {
  componentDidMount() {
    Mixpanel.track("Viewing Album Reel");
    this.ref.scrollTo({x: (SCREEN_WIDTH * this.props.currentIndex), y: 0, animated: false});
  }

  renderTag = (image) => {
    if(this.props.isFullGallery && this.props.inAlbum) {
      if(this.props.currentAlbumImages.includes(image.uri)) {
        return (
          <View style={{width: SCREEN_WIDTH, height: 30, position: 'absolute', left: 0, top: (SCREEN_HEIGHT - 30), alignItems: "center", justifyContent: "center"}}>
            <Text style={{color: "#48B2E2", fontSize: 18, fontWeight: 'bold',
                          backgroundColor: "#00000000", textShadowColor: "#FFF",
                          textShadowRadius: 2}}>In current Album</Text>
          </View>
        );
      } else {
        return (
          <TouchableOpacity
            style={{width: SCREEN_WIDTH, height: 50, position: 'absolute', left: 0, top: (SCREEN_HEIGHT - 50), backgroundColor: "#FF2C55", alignItems: "center", justifyContent: "center"}}
            onPress={() => this.addToAlbum()}>
            <Text style={{color: "#FFF", fontSize: 18, fontWeight: 'bold'}}>Add To Album</Text>
          </TouchableOpacity>
        );
      }
    }
  }

  addToAblum = () => {
    Mixpanel.track("Added to Album from Gallery Images");
    this.props.addToAblum(image);
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollContainer}
          ref={(ref) => this.ref = ref}
          horizontal={true}
          pagingEnabled={true}
          contentOffset={{x: 0, y: 0}}
          showHorizontalScrollIndicator={false}>
          {this.props.images.map((image, imageIndex) => {
            return (
              <View key={imageIndex} style={styles.page}>
                <Image source={{uri: image.uri}} style={styles.image} resizeMode='contain' />
                <View style={{position: 'absolute', left: 0, top: 0, marginLeft: 10, marginTop: 19}}>
                  <TouchableOpacity onPress={() => this.props.closeReel()}>
                    <View style={{borderRadius: 19, height: 38, width: 38, alignItems: 'center', justifyContent: 'center', backgroundColor: "#FFFFFF"}}>
                      <View style={{alignItems: 'center',justifyContent: 'center',borderRadius: 16, height: 32,width: 32,backgroundColor: "#FF2C55"}}>
                        <FontAwesome style={{color: "#FFFFFF"}}>{Icons.times}</FontAwesome>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
                {this.renderTag(image)}
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: "#000"
  }
});

const mapStateToProps = (state) => {
  return {
    currentAlbumImages: state.album.images.map((image) => image.uri),
    inAlbum: state.album.id !== null,
    currentIndex: state.app.albumReelIndex,
    images: state.app.albumReelImages,
    isFullGallery: state.gallery.viewingAlbum ? state.gallery.viewingAlbum.fullGallery : false
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    closeReel: () => dispatch(Actions.App.closeAlbumReel()),
    addToAblum: (image) => dispatch(Actions.TasvirApi.uploadImage(image, false))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AlbumReel);
