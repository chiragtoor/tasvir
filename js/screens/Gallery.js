import React, {Component} from 'react';
import {View, ScrollView, Dimensions, StyleSheet, Image, Animated, TouchableOpacity,
        Text } from 'react-native';
import { connect } from 'react-redux';

import * as Actions from '../actions';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

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
        return [{...p[0], width: WIDTH, height: (WIDTH / p.aspectRatio)}];
      }
    });
  }

  render() {
    const photos = this.formatImages(this.props.galleryImages);
    return (
      <ScrollView style={{flex: 1, backgroundColor: "#48B2E2", height: HEIGHT, width: WIDTH, paddingTop: 10}}>
        {this.props.albumName ?
          <Text style={{paddingTop: 5, paddingBottom: 10, width: WIDTH, textAlign: 'center', color: "#FFF", textDecorationLine: 'underline', fontSize: 25, fontWeight: 'bold'}}>
            {this.props.albumName}
          </Text>
        :
          null
        }
        {photos.map((p, i) => {
          return (
            <View key={i} style={{flex: 1, flexDirection: 'row'}}>
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
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#48B2E2',
  }
});

const mapStateToProps = (state) => {
  return {
    albumName: state.album.name,
    galleryImages: (state.album.images.length > 0) ? state.album.images : state.gallery.images
  };
};
export default connect(mapStateToProps, null)(Gallery);
