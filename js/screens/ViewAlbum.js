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

class ViewAlbum extends Component {
  renderImage = (image, index) => {
    return (
      <TouchableOpacity onPress={() => this.props.viewAlbumReel(index, this.props.viewingAlbum.images)}>
        <Image
          style={{
            width:  image.displayWidth,
            height:  image.displayHeight,
            borderColor: "#48B2E2",
            borderWidth: 2
          }}
          source={{uri: image.uri}}
          resizeMode='contain' />
      </TouchableOpacity>
    )
  }
  renderItem = (data) => {
    return (
      <View style={{flex: 1, flexDirection: 'row', width: WIDTH}}>
        {this.renderImage(data.item[0], (data.index * 2))}
        {data.item[1] != null ?
          this.renderImage(data.item[0], (data.index * 2 + 1))
        :
          false
        }
      </View>
    );
  }

  render() {
    const images = this.props.viewingAlbum.images.map((image) => {
      return {
        ...image,
        width: image.width,
        height: image.height,
        aspectRatio: (image.width / image.height)
      }
    })
    const formattedImages = formatImages(images, WIDTH);
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
            {this.props.viewingAlbum.name}
          </Text>
        </View>
        <FlatList
          style={{flex: 1}}
          data={formattedImages}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index} />
        {this.props.currentAlbumId !== this.props.viewingAlbum.id ?
          <TouchableOpacity onPress={() => this.props.openAlbum(this.props.viewingAlbum)} style={{backgroundColor: "#FF2C55", width: WIDTH, height: 55, borderTopWidth: 5, borderColor: "#48B2E2", alignItems: "center", justifyContent: "center"}}>
            <Text style={{color: "#FFF", fontSize: 18, fontWeight: 'bold'}}>Re-Open Album</Text>
          </TouchableOpacity>
        :
          null
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
});

const mapDispatchToProps = (dispatch) => {
  return {
    dismiss: () => dispatch(Actions.App.dismiss()),
    viewAlbumReel: (index, images) => dispatch(Actions.App.viewAlbumReel(index, images)),
    openAlbum: (album) => dispatch(Actions.Album.openAlbum(album))
  };
};

const mapStateToProps = (state) => {
  return {
    currentAlbumId: state.album.id ? state.album.id : null,
    viewingAlbum: state.gallery.viewingAlbum
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ViewAlbum);
