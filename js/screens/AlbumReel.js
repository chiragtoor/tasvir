import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import ImageScreen from './ImageScreen';

import * as Actions from '../actions';
const SCREEN_WIDTH = Dimensions.get('window').width;

class AlbumReel extends Component {
  componentDidMount() {
    this.ref.scrollTo({x: (SCREEN_WIDTH * this.props.currentIndex), y: 0, animated: false});
  }

  render() {
    console.log(this.props.images);
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
    currentIndex: state.app.albumReelIndex,
    images: state.app.albumReelImages
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    closeReel: () => dispatch(Actions.App.closeAlbumReel())
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AlbumReel);
