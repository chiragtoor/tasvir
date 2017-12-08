import React, {Component} from 'react';
import {View, FlatList, Dimensions, StyleSheet, Image, Animated, TouchableOpacity,
        Text, CameraRoll } from 'react-native';
import { connect } from 'react-redux';
import FontAwesome, { Icons } from 'react-native-fontawesome';
var Mixpanel = require('react-native-mixpanel');

import * as Actions from '../actions';
import { formatImages } from '../utils/photos';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const LOGO = require('../../img/tasvir_logo.png');

class ViewAllImages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      images: [],
      cursor: null
    }
  }

  componentDidMount() {
    this.loadImages();
  }

  loadImages = () => {
    const currentImages = this.state.images;
    const params = this.state.cursor ? {
      first: 20,
      assetType: 'Photos',
      after: this.state.cursor
    } : {
      first: 20,
      assetType: 'Photos'
    };
    CameraRoll.getPhotos(params).then(roll => {
      const images = roll.edges.map((data) => {
        const image = data.node.image;
        return {
          uri: image.uri,
          width: image.width,
          height: image.height,
          aspectRatio: (image.width / image.height)
        }
      });
      if(roll.page_info.has_next_page) {
        this.setState({
          images: [...currentImages, ...images],
          cursor: roll.page_info.end_cursor
        });
      } else {
        this.setState({
          images: [...currentImages, ...images],
          cursor: null
        });
      }
    });
  }

  checkScroll = ({layoutMeasurement, contentOffset, contentSize}) => {
    if(layoutMeasurement.height + contentOffset.y >= contentSize.height - 200) {
      if(this.state.cursor !== null) {
        this.loadImages();
      }
    }
  }

  addToAlbum = (image) => {
    Mixpanel.track("Added to Album from Gallery Images");
    this.props.addToAblum(image);
  }

  renderImage = (image) => {
    var renderTag = false;
    if(this.props.inAlbum && !this.props.currentAlbumImages.includes(image.uri)) {
      renderTag = true;
    }
    return (
      <TouchableOpacity onPress={() => false}>
        <Image
          style={{
            width:  image.displayWidth,
            height:  image.displayHeight,
            borderColor: "#48B2E2",
            borderWidth: 2
          }}
          source={{uri: image.uri}}
          resizeMode='contain' />
        {renderTag ?
          <View style={{position: 'absolute', top: 2, left: 2, width: (image.displayWidth - 2), height: (image.displayHeight - 2), justifyContent: 'flex-end', paddingRight: 10, paddingBottom: 10}}>
            <TouchableOpacity style={{alignItems: 'flex-end'}} onPress={() => this.addToAlbum(image)}>
              <View style={{borderRadius: 19, height: 38, width: 38, alignItems: 'center', justifyContent: 'center', backgroundColor: "#FFFFFF"}}>
                <View style={{alignItems: 'center',justifyContent: 'center',borderRadius: 16, height: 32,width: 32,backgroundColor: "#48B2E2"}}>
                  <FontAwesome style={{color: "#FFFFFF"}}>{Icons.plus}</FontAwesome>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        :
        <View style={{position: 'absolute', top: 2, left: 2, width: (image.displayWidth - 2), height: (image.displayHeight - 2), justifyContent: 'flex-end', paddingRight: 10, paddingBottom: 10}}>
          <TouchableOpacity style={{alignItems: 'flex-end'}} onPress={() => this.addToAlbum(image)}>
            <FontAwesome style={{color: "#48B2E2"}}>{Icons.check}</FontAwesome>
          </TouchableOpacity>
        </View>
        }
      </TouchableOpacity>
    )
  }

  renderItem = (data, i) => {
    return (
      <View key={i} style={{flex: 1, flexDirection: 'row', width: WIDTH}}>
        {this.renderImage(data.item[0])}
        {data.item[1] != null ?
          this.renderImage(data.item[1])
        :
          false
        }
      </View>
    );
  }

  render() {
    const formattedImages = formatImages(this.state.images, WIDTH);
    return (
      <View style={{flex: 1, backgroundColor: "#48B2E2", paddingTop: 19}}>
        <View style={{flexDirection: 'row', alignItems: 'center', paddingLeft: 10, paddingRight: 10, marginBottom: 5}}>
          <TouchableOpacity onPress={() => this.props.dismiss()} style={{alignItems: 'flex-start'}}>
            <View style={{borderRadius: 19, height: 38, width: 38, alignItems: 'center', justifyContent: 'center', backgroundColor: "#FFFFFF"}}>
              <View style={{alignItems: 'center', justifyContent: 'center', borderRadius: 16, height: 32,width: 32,backgroundColor: "#FF2C55"}}>
                <FontAwesome style={{color: "#FFFFFF"}}>{Icons.times}</FontAwesome>
              </View>
            </View>
          </TouchableOpacity>
          <Text style={this.props.inAlbum ? styles.centerRightButton : styles.centerNoRightButton}>
            All Images
          </Text>
          {this.props.inAlbum ?
            <TouchableOpacity onPress={() => this.props.help()} style={{alignItems: 'flex-end'}}>
              <View style={{borderRadius: 19, height: 38, width: 38, alignItems: 'center', justifyContent: 'center', backgroundColor: "#FFFFFF"}}>
                <View style={{alignItems: 'center', justifyContent: 'center', borderRadius: 16, height: 32,width: 32,backgroundColor: "#48B2E2"}}>
                  <FontAwesome style={{color: "#FFFFFF"}}>{Icons.question}</FontAwesome>
                </View>
              </View>
            </TouchableOpacity>
          :
            null
          }
        </View>
        <FlatList
          style={{flex: 1}}
          onScroll={({nativeEvent}) => this.checkScroll(nativeEvent)}
          data={formattedImages}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centerNoRightButton: {
    flex: 1,
    textAlign: 'center',
    paddingRight: 38,
    alignItems: 'center',
    color: "#FFF",
    textDecorationLine: 'underline',
    fontSize: 25,
    fontWeight: 'bold'
  },
  centerRightButton: {
    flex: 1,
    textAlign: 'center',
    alignItems: 'center',
    color: "#FFF",
    textDecorationLine: 'underline',
    fontSize: 25,
    fontWeight: 'bold'
  }
});

const mapDispatchToProps = (dispatch) => {
  return {
    dismiss: () => dispatch(Actions.App.dismiss()),
    addToAblum: (image) => dispatch(Actions.TasvirApi.uploadImage(image, false)),
    help: () => dispatch(Actions.App.goToAllImagesHelp())
  };
};

const mapStateToProps = (state) => {
  return {
    inAlbum: state.album.id !== null,
    currentAlbumImages: state.album.images.map((image) => image.uri)
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ViewAllImages);
