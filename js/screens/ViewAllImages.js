import React, {Component} from 'react';
import {View, FlatList, Dimensions, StyleSheet, Image, Animated, TouchableOpacity,
        Text, CameraRoll } from 'react-native';
import { connect } from 'react-redux';
import FontAwesome, { Icons } from 'react-native-fontawesome';

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

  renderItem = (data, i) => {
    return (
      <View key={i} style={{flex: 1, flexDirection: 'row', width: WIDTH}}>
        <TouchableOpacity onPress={() => false}>
          <Image
            style={{
              width:  data.item[0].width,
              height:  data.item[0].height,
              borderColor: "#48B2E2",
              borderWidth: 5
            }}
            source={{uri: data.item[0].uri}}
            resizeMode='contain' />
        </TouchableOpacity>
        {data.item[1] != null ?
          <TouchableOpacity onPress={() => false}>
            <Image
              style={{
                width:  data.item[1].width,
                height:  data.item[1].height,
                borderColor: "#48B2E2",
                borderWidth: 5
              }}
              source={{uri: data.item[1].uri}}
              resizeMode='contain' />
          </TouchableOpacity>
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
          <Text style={{flex: 1, textAlign: 'center', paddingRight: 38, alignItems: 'center', color: "#FFF", textDecorationLine: 'underline', fontSize: 25, fontWeight: 'bold'}}>
            All Images
          </Text>
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
});

const mapDispatchToProps = (dispatch) => {
  return {
    dismiss: () => dispatch(Actions.App.dismiss())
  };
};

const mapStateToProps = (state) => {
  return { };
};
export default connect(mapStateToProps, mapDispatchToProps)(ViewAllImages);
