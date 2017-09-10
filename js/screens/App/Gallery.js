import React, {Component} from 'react';
import {View, ScrollView, Dimensions, StyleSheet, Image, Animated, TouchableOpacity} from 'react-native';

export default class Gallery extends Component {

  render() {
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    return (
      <ScrollView style={{flex: 1, backgroundColor: "#48B2E2", height: height, width: width}}>
        {this.props.savedPhotos.map((p, i) => {
          return (
            <Image
              key={i}
              style={{
                width: width,
                height: width
              }}
              source={{uri: p.node.image.uri}}
              resizeMode='contain' />
            )
          })
        }
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
