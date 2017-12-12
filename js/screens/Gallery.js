import React, {Component} from 'react';
import {View, ScrollView, Dimensions, StyleSheet, Image, Animated, TouchableOpacity,
        Text } from 'react-native';
import { connect } from 'react-redux';
import FontAwesome, { Icons } from 'react-native-fontawesome';
var RNFS = require('react-native-fs');

import * as Actions from '../actions';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const LOGO = require('../../img/tasvir_logo.png');

class Gallery extends Component {
  renderImage = (image, appendDir = true) => {
    if (image) {
      const imageAspectRatio = (image.width / image.height);
      if(imageAspectRatio > 1) {
        return (
          <Image
            style={{
              width:  ((WIDTH * 0.3) * 0.8),
              height:  (((WIDTH * 0.3) * 0.8) / imageAspectRatio),
              borderColor: "#48B2E2",
              borderWidth: 2
            }}
            source={{uri: image.uri}}
            resizeMode='contain' />
        );
      } else {
        return (
          <Image
            style={{
              width:  (80 * imageAspectRatio),
              height:  80,
              borderColor: "#48B2E2",
              borderWidth: 2
            }}
            source={{uri: image.uri}}
            resizeMode='contain' />
        );
      }
    } else {
      return (null);
    }
  }

  renderAlbumTile = (album, index) => {
    return (
      <View key={index}>
        <TouchableOpacity onPress={() => this.props.viewAlbum({index: index, ...album})} style={{height: 100, backgroundColor: "#FFF", flexDirection: 'row'}}>
          <View style={{height: 100, width: (WIDTH * 0.3), alignItems: 'center', justifyContent: 'center'}}>
            {album.image ? this.renderImage(album.image) : null}
          </View>
          <View style={{height: 100, width: (WIDTH * 0.7)}}>
            <View style={{height: 50, width: (WIDTH * 0.7), alignItems: 'flex-start', justifyContent: 'flex-end', marginBottom: 2, marginLeft: 15}}>
              <Text style={styles.message}>
                {album.name}
              </Text>
            </View>
            <View style={styles.albumDivider} />
            <View style={{height: 50, width: (WIDTH * 0.7), alignItems: 'flex-start', justifyContent: 'flex-start', marginTop: 2, marginLeft: 15}}>
              <Text style={styles.explanation}>
                {album.albumDate + " - " + album.photoCount + " Photos"}
              </Text>
              {index == -1 ?
                <Text style={styles.currentAlbum}>
                  {"Currently Active"}
                </Text>
              :
                null
              }
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.menuDivider} />
      </View>
    );
  }

  formatAlbum = (album) => {
    const image = album.images[0];
    return {
      name: album.name,
      id: album.id,
      startDate: album.albumDate,
      photoCount: album.images.length,
      image: image ? {
        uri: image.uri,
        width: image.width,
        height: image.height,
        aspectRatio: (image.width / image.height)
      } : null,
      images: album.images,
      ...album
    }
  }

  render() {
    const albums = this.props.albumHistory.map((album) => this.formatAlbum(album));
    const currentAlbum = this.props.currentAlbum ? this.formatAlbum(this.props.currentAlbum) : null;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image style={styles.logo}
            source={LOGO}/>
        </View>
        <ScrollView style={{backgroundColor: "#E8E8EE"}}>
          { currentAlbum ? this.renderAlbumTile(currentAlbum, -1) : null }
          <View key={"ALL"}>
            <TouchableOpacity onPress={() => this.props.viewAllImages()} style={{height: 100, backgroundColor: "#FFF", flexDirection: 'row'}}>
              <View style={{height: 100, width: (WIDTH * 0.3), alignItems: 'center', justifyContent: 'center'}}>
                {this.renderImage(this.props.allImagesShow, false)}
              </View>
              <View style={{height: 100, width: (WIDTH * 0.7)}}>
                <View style={{height: 100, width: (WIDTH * 0.7), alignItems: 'flex-start', justifyContent: 'center', marginBottom: 2, marginLeft: 15}}>
                  <Text style={styles.message}>
                    {"All Images"}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
          </View>
          { albums.map((album, index) => this.renderAlbumTile(album, index)) }
        </ScrollView>
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
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#EFEFEF'
  },
  albumDivider: {
    height: 1,
    backgroundColor: '#EFEFEF',
    marginLeft: 15,
    marginRight: 15
  },
  message: {
    fontSize: 24,
    color: '#4A4A4A',
    fontWeight: '300'
  },
  explanation: {
    fontSize: 12,
    color: '#9B9B9B'
  },
  currentAlbum: {
    fontSize: 12,
    color: '#48B2E2'
  }
});

const mapDispatchToProps = (dispatch) => {
  return {
    viewAlbum: (album) => dispatch(Actions.App.galleryViewAlbum(album)),
    openAlbum: (album) => dispatch(Actions.Album.openAlbum(album)),
    loadMoreGallery: () => dispatch(Actions.Gallery.loadMoreGallery()),
    viewAllImages: () => dispatch(Actions.App.viewAllImages())
  };
};

const mapStateToProps = (state) => {
  return {
    currentAlbum: state.album.id ? state.album : null,
    currentAlbumId: state.album.id ? state.album.id : null,
    viewingAlbum: state.gallery.viewingAlbum,
    albumHistory: state.app.albumHistory,
    allImages: state.gallery.images,
    allImagesShow: state.gallery.buttonImage
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Gallery);
