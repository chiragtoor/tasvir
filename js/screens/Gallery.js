import React, {Component} from 'react';
import {View, ScrollView, Dimensions, StyleSheet, Image, Animated, TouchableOpacity,
        Text } from 'react-native';
import { connect } from 'react-redux';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import * as Actions from '../actions';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const LOGO = require('../../img/tasvir_logo.png');

class Gallery extends Component {
  formatImages = (arr) => {
    return arr.map((p) => {
      return {
        image: p.uri,
        width: p.width,
        height: p.height,
        aspectRatio: (p.width / p.height)
      }
    }).reduce(function(result, value, index, array) {
      if (index % 2 === 0)
        result.push(array.slice(index, index + 2));
      return result;
    }, []).map((p) => {
      if(p[0] != null && p[1] != null) {
        const totalAR = p[0].aspectRatio + p[1].aspectRatio;
        const widthOne = (p[0].aspectRatio / totalAR) * WIDTH;
        const widthTwo = (p[1].aspectRatio / totalAR) * WIDTH;
        return [{...p[0], width: widthOne, height: (widthOne / p[0].aspectRatio)},
                {...p[1], width: widthTwo, height: (widthTwo / p[1].aspectRatio)}];
      } else {
        return [{...p[0], width: (WIDTH / 2), height: ((WIDTH / 2) / p[0].aspectRatio)}];
      }
    });
  }

  renderImages = () => {
    var images = this.props.viewingAlbum.images;
    if(this.props.viewingAlbum.id === this.props.currentAlbumId) {
      images = this.props.currentAlbum.images;
    }

    const photos = this.formatImages(images);
    console.log(photos);

    return (
      <View style={{flex: 1, backgroundColor: "#48B2E2", paddingTop: 19}}>
        {this.props.viewingAlbum ?
          <View style={{flexDirection: 'row', alignItems: 'center', paddingLeft: 10, paddingRight: 10, marginBottom: 5}}>
            <TouchableOpacity onPress={() => this.props.listAlbums()} style={{alignItems: 'flex-start'}}>
              <View style={{borderRadius: 19, height: 38, width: 38, alignItems: 'center', justifyContent: 'center', backgroundColor: "#FFFFFF"}}>
                <View style={{alignItems: 'center',justifyContent: 'center',borderRadius: 16, height: 32,width: 32,backgroundColor: "#FF2C55"}}>
                  <FontAwesome style={{color: "#FFFFFF"}}>{Icons.times}</FontAwesome>
                </View>
              </View>
            </TouchableOpacity>
            <Text style={{flex: 1, textAlign: 'center', paddingRight: 38, alignItems: 'center', color: "#FFF", textDecorationLine: 'underline', fontSize: 25, fontWeight: 'bold'}}>
              {this.props.viewingAlbum.name}
            </Text>
          </View>
        :
          null
        }
        <ScrollView style={{flex: 1, width: WIDTH}}>
          {photos.map((p, i) => {
            return (
              <View key={i} style={{flex: 1, flexDirection: 'row', width: WIDTH}}>
                <TouchableOpacity onPress={() => this.props.viewAlbumReel((i * 2), images)}>
                  <Image
                    style={{
                      width:  p[0].width,
                      height:  p[0].height,
                      borderColor: "#48B2E2",
                      borderWidth: 5
                    }}
                    source={{uri: p[0].image}}
                    resizeMode='contain' />
                </TouchableOpacity>
                {p[1] != null ?
                  <TouchableOpacity onPress={() => this.props.viewAlbumReel((i * 2) + 1, images)}>
                    <Image
                      style={{
                        width:  p[1].width,
                        height:  p[1].height,
                        borderColor: "#48B2E2",
                        borderWidth: 5
                      }}
                      source={{uri: p[1].image}}
                      resizeMode='contain' />
                  </TouchableOpacity>
                :
                  false
                }
              </View>
            );
          })}
        </ScrollView>
        {this.props.viewingAlbum.id && (this.props.currentAlbumId != this.props.viewingAlbum.id) ?
          <TouchableOpacity onPress={() => this.props.openAlbum(this.props.viewingAlbum)} style={{backgroundColor: "#FF2C55", width: WIDTH, height: 50, borderTopWidth: 5, borderColor: "#48B2E2", alignItems: "center", justifyContent: "center"}}>
            <Text style={{color: "#FFF", fontSize: 18, fontWeight: 'bold'}}>Open Album</Text>
          </TouchableOpacity>
        :
          null
        }
      </View>
    );
  }

  renderImage = (image) => {
    if (image && image.aspectRatio > 1) {
      return (
        <Image
          style={{
            width:  ((WIDTH * 0.3) * 0.8),
            height:  (((WIDTH * 0.3) * 0.8) / image.aspectRatio),
            borderColor: "#48B2E2",
            borderWidth: 2
          }}
          source={{uri: image.uri}}
          resizeMode='contain' />
      );
    } else if(image) {
      return (
        <Image
          style={{
            width:  (80 * image.aspectRatio),
            height:  80,
            borderColor: "#48B2E2",
            borderWidth: 2
          }}
          source={{uri: image.uri}}
          resizeMode='contain' />
      );
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

  renderAlbumList = () => {
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
          { albums.map((album, index) => this.renderAlbumTile(album, index)) }
          <View key={"ALL"}>
            <TouchableOpacity onPress={() => this.props.viewAlbum({name: "All Images", images: this.props.allImages})} style={{height: 100, backgroundColor: "#FFF", flexDirection: 'row'}}>
              <View style={{height: 100, width: (WIDTH * 0.3), alignItems: 'center', justifyContent: 'center'}}>
                {this.renderImage(this.props.allImagesShow)}
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
        </ScrollView>
      </View>
    );
  }

  render() {
    if(this.props.inListMode) {
      return this.renderAlbumList();
    } else {
      return this.renderImages();
    }
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
    listAlbums: () => dispatch(Actions.App.galleryListAlbums()),
    openAlbum: (album) => dispatch(Actions.Album.openAlbum(album)),
    viewAlbumReel: (index, images) => dispatch(Actions.App.viewAlbumReel(index, images))
  };
};

const mapStateToProps = (state) => {
  return {
    inListMode: state.app.galleryState == Actions.App.APP_GALLERY_STATE_LIST,
    currentAlbum: state.album.id ? state.album : null,
    currentAlbumId: state.album.id ? state.album.id : null,
    viewingAlbum: state.gallery.viewingAlbum,
    albumHistory: state.app.albumHistory,
    allImages: state.gallery.images,
    allImagesShow: state.gallery.buttonImage
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Gallery);
