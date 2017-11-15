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

  constructor(props) {
    super(props);

    this.state = {
      inListMode: props.albumName == null,
    }
  }

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
    const photos = this.formatImages(this.props.galleryImages);
    return (
      <View style={{flex: 1, backgroundColor: "#48B2E2", paddingTop: 19}}>
        {this.props.albumName ?
          <View style={{flexDirection: 'row', alignItems: 'center', paddingLeft: 10, paddingRight: 10}}>
            <TouchableOpacity onPress={() => this.setState({inListMode: true})} style={{alignItems: 'flex-start'}}>
              <View style={{borderRadius: 19, height: 38, width: 38, alignItems: 'center', justifyContent: 'center', backgroundColor: "#FFFFFF"}}>
                <View style={{alignItems: 'center',justifyContent: 'center',borderRadius: 16, height: 32,width: 32,backgroundColor: "#FF2C55"}}>
                  <FontAwesome style={{color: "#FFFFFF"}}>{Icons.times}</FontAwesome>
                </View>
              </View>
            </TouchableOpacity>
            <Text style={{flex: 1, textAlign: 'center', paddingRight: 38, alignItems: 'center', color: "#FFF", textDecorationLine: 'underline', fontSize: 25, fontWeight: 'bold'}}>
              {this.props.albumName}
            </Text>
          </View>
        :
          null
        }
        <ScrollView style={{flex: 1}}>
          {photos.map((p, i) => {
            return (
              <View key={i} style={{flex: 1, flexDirection: 'row', width: WIDTH}}>
                <Image
                  style={{
                    width:  p[0].width,
                    height:  p[0].height,
                    borderColor: "#48B2E2",
                    borderWidth: 5
                  }}
                  source={{uri: p[0].image}}
                  resizeMode='contain' />
                {p[1] != null ?
                  <Image
                    style={{
                      width:  p[1].width,
                      height:  p[1].height,
                      borderColor: "#48B2E2",
                      borderWidth: 5
                    }}
                    source={{uri: p[1].image}}
                    resizeMode='contain' />
                :
                  false
                }
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  }

  renderAlbumTile = (album, index) => {
    return (
      <View key={index}>
        <TouchableOpacity onPress={() => this.setState({inListMode: false})} style={{height: 100, backgroundColor: "#FFF", flexDirection: 'row'}}>
          <View style={{height: 100, width: (WIDTH * 0.3), alignItems: 'center', justifyContent: 'center'}}>
            {album.image.aspectRatio > 1 ?
              <Image
                style={{
                  width:  ((WIDTH * 0.3) * 0.8),
                  height:  (((WIDTH * 0.3) * 0.8) / album.image.aspectRatio),
                  borderColor: "#48B2E2",
                  borderWidth: 2
                }}
                source={{uri: album.image.uri}}
                resizeMode='contain' />
            :
              <Image
                style={{
                  width:  (80 * album.image.aspectRatio),
                  height:  80,
                  borderColor: "#48B2E2",
                  borderWidth: 2
                }}
                source={{uri: album.image.uri}}
                resizeMode='contain' />
            }
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
                {album.startDate + " - " + album.photoCount + " Photos"}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.menuDivider} />
      </View>
    );
  }

  renderAlbumList = () => {
    const albums = this.props.albumHistory.map((album) => {
      const image = album.images[0];
      return {
        name: album.name,
        id: album.id,
        startDate: album.albumDate,
        photoCount: album.images.length,
        image: {
          uri: image ? image.uri : "",
          width: image ? image.width : 0,
          height: image ? image.height : 0,
          aspectRatio: image ? (image.width / image.height) : 1
        }
      }
    })
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image style={styles.logo}
            source={LOGO}/>
        </View>
        <ScrollView style={{backgroundColor: "#E8E8EE"}}>
          { albums.map((album, index) => this.renderAlbumTile(album, index + 1)) }
        </ScrollView>
      </View>
    );
  }

  render() {
    if(this.state.inListMode) {
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
  }
});

const mapStateToProps = (state) => {
  return {
    albumName: state.album.name,
    galleryImages: (state.album.images.length > 0) ? state.album.images : state.gallery.images,
    albumHistory: state.app.albumHistory
  };
};
export default connect(mapStateToProps, null)(Gallery);
