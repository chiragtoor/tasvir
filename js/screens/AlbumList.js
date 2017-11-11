'use strict';

import React,{ Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  Image,
  View,
  Text,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';

import * as App from '../actions/app';

import TasvirButton from '../components/TasvirButton';

const LOGO = require('../../img/tasvir_logo.png');
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const ALBUMS = [
  {
    name: "New York Trip 2017",
    photoCount: 67,
    startDate: "2017-09-16",
    image: {
      uri: "assets-library://asset/asset.JPG?id=ED7AC36B-A150-4C38-BB8C-B6D696F4F2ED&ext=JPG",
      width: 3000,
      height: 2002,
      aspectRatio: (3000/2002)
    }
  },
  {
    name: "Tasvir Launch",
    photoCount: 23,
    startDate: "2017-06-23",
    image: {
      uri: "assets-library://asset/asset.JPG?id=99D53A1F-FEEF-40E1-8BB3-7DD55A43C8B7&ext=JPG",
      width: 1668,
      height: 2500,
      aspectRatio: (1668/2500)
    }
  },
  {
    name: "First Album",
    photoCount: 198,
    startDate: "2016-09-05",
    image: {
      uri: "assets-library://asset/asset.JPG?id=B84E8479-475C-4727-A4A4-B77AA9980897&ext=JPG",
      width: 4288,
      height: 2848,
      aspectRatio: (4288/2848)
    }
  }
];

class AlbumList extends Component {
  render() {
    const albums = this.props.albumHistory.map((album) => {
      const image = album.images[0];
      return {
        name: album.name,
        id: album.id,
        startDate: "DATE",
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
        <ScrollView>
          {albums.map((album, index) => {
            return (
              <View key={index}>
                <TouchableOpacity style={{height: 100, backgroundColor: "#FFF", flexDirection: 'row'}}>
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
          })}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
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
    // album state
    albumHistory: state.album.history
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AlbumList);
