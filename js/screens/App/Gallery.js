import React, {Component} from 'react';
import {View, ScrollView, Dimensions, StyleSheet, Image, Animated, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';

import * as Actions from '../../actions';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

class Gallery extends Component {

  formatImages = (arr) => {
    return arr.map((p) => {
      return {
        image: p.node.image.uri,
        width: p.node.image.width,
        height: p.node.image.height,
        aspectRatio: (p.node.image.width / p.node.image.height)
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
      <ScrollView style={{flex: 1, backgroundColor: "#48B2E2", height: HEIGHT, width: WIDTH}}>
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
  galleryImages: state.photos.galleryImages
  };
};
export default connect(mapStateToProps, null)(Gallery);
