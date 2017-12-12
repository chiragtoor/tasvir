import React, { Component } from 'react';
import {
  View,
  ScrollView,
  FlatList,
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

class AlbumImage extends Component {
  componentDidMount() {
    Mixpanel.track("Viewing Album Image");
  }

  addToAlbum = (image) => {
    Mixpanel.track("Added to Album from Images");
    this.props.addToAblum(image);
  }

  renderTag = (image) => {
    if(this.props.isFullGallery && this.props.inAlbum) {
      if(this.props.currentAlbumImages.includes(image.uri)) {
        return (
          <View style={{width: SCREEN_WIDTH, height: 30, position: 'absolute', left: 0, top: (SCREEN_HEIGHT - 30), alignItems: "center", justifyContent: "center"}}>
            <Text style={{color: "#48B2E2", fontSize: 18, fontWeight: 'bold',
                          backgroundColor: "#00000000", textShadowColor: "#FFF",
                          textShadowRadius: 2}}>In Current Album</Text>
          </View>
        );
      } else {
        return (
          <TouchableOpacity
            style={{width: SCREEN_WIDTH, height: 50, position: 'absolute', left: 0, top: (SCREEN_HEIGHT - 50), backgroundColor: "#FF2C55", alignItems: "center", justifyContent: "center"}}
            onPress={() => this.addToAlbum(image)}>
            <Text style={{color: "#FFF", fontSize: 18, fontWeight: 'bold'}}>Add To Album</Text>
          </TouchableOpacity>
        );
      }
    }
  }

  renderItem = (data) => {
    return (
      <View style={styles.page}>
        <Image source={{uri: data.item.uri}} style={styles.image} resizeMode='contain' />
        <View style={{position: 'absolute', left: 0, top: 0, marginLeft: 10, marginTop: 19}}>
          <TouchableOpacity onPress={() => this.props.closeReel()}>
            <View style={{borderRadius: 19, height: 38, width: 38, alignItems: 'center', justifyContent: 'center', backgroundColor: "#FFFFFF"}}>
              <View style={{alignItems: 'center',justifyContent: 'center',borderRadius: 16, height: 32,width: 32,backgroundColor: "#FF2C55"}}>
                <FontAwesome style={{color: "#FFFFFF"}}>{Icons.times}</FontAwesome>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderTag = (image) => {
    if(this.props.inAlbum && this.props.viewingAllImages) {
      if(!this.props.currentAlbumImages.includes(image.uri)) {
        return (
          <View style={{justifyContent: 'flex-end', paddingRight: 10, paddingBottom: 10, alignItems: 'flex-end'}}>
            <TouchableOpacity style={{alignItems: 'flex-end'}} onPress={() => this.addToAlbum(image)}>
              <View style={{borderRadius: 19, height: 38, width: 38, alignItems: 'center', justifyContent: 'center', backgroundColor: "#FFFFFF"}}>
                <View style={{alignItems: 'center',justifyContent: 'center',borderRadius: 16, height: 32,width: 32,backgroundColor: "#48B2E2"}}>
                  <FontAwesome style={{color: "#FFFFFF"}}>{Icons.plus}</FontAwesome>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        );
      } else {
        return (
          <View style={{justifyContent: 'flex-end', alignItems: 'flex-end', paddingRight: 10, paddingBottom: 10}}>
            <FontAwesome style={{color: "#48B2E2"}}>{Icons.check}</FontAwesome>
          </View>
        );
      }
    } else {
      return (null);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={{uri: this.props.image.uri}} style={styles.image} resizeMode='contain' />
        <View style={{position: 'absolute', left: 0, top: 0, width: SCREEN_WIDTH, height: SCREEN_HEIGHT, justifyContent: 'space-between', paddingLeft: 10, paddingTop: 19}}>
          <TouchableOpacity onPress={() => this.props.dismiss()}>
            <View style={{borderRadius: 19, height: 38, width: 38, alignItems: 'center', justifyContent: 'center', backgroundColor: "#FFFFFF"}}>
              <View style={{alignItems: 'center',justifyContent: 'center',borderRadius: 16, height: 32,width: 32,backgroundColor: "#FF2C55"}}>
                <FontAwesome style={{color: "#FFFFFF"}}>{Icons.times}</FontAwesome>
              </View>
            </View>
          </TouchableOpacity>
          {this.renderTag(this.props.image)}
        </View>
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
    image: state.app.albumImage,
    viewingAllImages: state.app.viewingAllImages
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    dismiss: () => dispatch(Actions.App.dismiss()),
    addToAblum: (image) => dispatch(Actions.TasvirApi.uploadImage(image, false))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AlbumImage);
