import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  Dimensions,
  Image,
  Switch,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Animated,
  Share,
  CameraRoll
} from 'react-native';
var RNFS = require('react-native-fs');
import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';

import { Socket } from 'phoenix';

import FontAwesome, { Icons } from 'react-native-fontawesome';
import branch from 'react-native-branch';

import ImageScreen from './ImageScreen';
import Menu from './Menu';
import { URL_BASE, POST_ACTION_SCROLL } from '../../constants';

import TasvirToggle from './TasvirToggle';
import TasvirButton from '../../common/components/TasvirButton';
import TasvirDirections from '../../common/components/TasvirDirections';
import TasvirIconButton from '../../common/components/TasvirIconButton';
import TasvirCamera from './TasvirCamera';
import Gallery from './Gallery';

import * as Actions from '../../actions';

import styles from './styles';

import Button from 'react-native-button';
const w = Dimensions.get('window').width;

class App extends Component {

  connectSocket = (albumId) => {
    // connect to album web socket
    let socket = new Socket((URL_BASE + "socket"), {
      logger: ((kind, msg, data) => { console.log(`${kind}: ${msg}`, data) })
    });

    socket.connect();

    var chan = socket.channel("album:" + albumId, {});
    chan.join();

    chan.on("new:photo", msg => {
      this.props.saveImage(msg.photo, msg.id);
    });
  }

  componentDidMount() {
    this.scrollTo(1);
    if(this.props.albumId) {
      this.connectSocket(this.props.albumId);
    }
    branch.getLatestReferringParams().then((params) => {
        const albumId = params['album_id'];
        const albumName = params['album_name'];
        if(albumId && albumName && albumId !== this.props.albumId) {
          this.props.joinAlbumUpdateId(albumId);
          this.props.joinAlbumUpdateName(albumName);
          this.props.attemptJoinAlbum();
        }

      });
  }

  scrollTo = (page, animated = true) => {
    this.ref.scrollTo({x: (w * page), y: 0, animated: animated});
  }

  addImage = (image) => {
    if(this.props.autoShare) {
      this.props.uploadImage((RNFS.DocumentDirectoryPath + '/' + image));
    } else {
      this.props.addToReel(image);
    }
  }

  takePicture = (data) => {
    if(this.props.albumId) {
      const path = data.path.split('/Documents/');
      this.addImage(path[1]);
    } else {
      this.props.saveImage(data.path, "NO_ALBUM");
    }
  }

  render() {
    const hasPreviewReel = this.props.previewReel.length > 0;
    const hasGallery = this.props.galleryImages.length > 0;
    return (
      <View style={styles.container}>
        <Swiper
          style={styles.swiper}
          horizontal={false}
          loop={false}
          vertical={true}
          showsPagination={false}
          index={0}
          scrollEnabled={this.props.currentIndex == 1}>
          <ScrollView
            style={styles.scrollContainer}
            ref={(ref) => this.ref = ref}
            horizontal={true}
            pagingEnabled={true}
            contentOffset={{x: 0, y: 0}}
            showHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              if(this.scrollPageProg) {
                this.scrollPageProg();
                this.scrollPageProg = null;
              } else {
                const page =  Math.floor(event.nativeEvent.contentOffset.x / w);
                this.props.updateCurrentIndex(page);
              }
            }}>
            <Gallery key={'GALLERY'} savedPhotos={this.props.galleryImages} />
            <TasvirCamera
              key={'CAMERA'}
              preview={hasPreviewReel ? this.props.previewReel[0] : null}
              previewCount={this.props.previewReel.length}
              gallery={hasGallery ? (this.props.galleryImages[0].node.image.uri) : null}
              goToPreview={() => this.scrollTo(2)}
              goToGallery={() => this.scrollTo(0)}
              takePicture={this.takePicture} />
              {this.props.previewReel.map((image, imageIndex) => {
                // because previewReel is rendered after the gallery and camera, +2 to the index
                //  so we scrollTo the correct position in the onFinish action callback
                const currentPage = imageIndex + 2;
                return (
                  <ImageScreen
                    key={image}
                    data={image}
                    goToCamera={() => this.scrollTo(1)}
                    onFinish={(action) => {
                      if(action == 0) {
                        this.props.uploadImage(RNFS.DocumentDirectoryPath + '/' + image);
                      } else if(action == 2) {
                        this.props.saveImage(RNFS.DocumentDirectoryPath + '/' + image, "NO_ALBUM");
                      }

                      this.scrollPageProg = () => {
                        this.props.removeImage(imageIndex);
                        if(imageIndex == (this.props.previewReel.length - 1)) {
                          this.props.updateCurrentIndex(this.props.currentIndex - 1);
                          this.scrollTo(currentPage - 1, false);
                        } else {
                          this.scrollTo(currentPage, false);
                        }
                      };
                      if(imageIndex == (this.props.previewReel.length - 1)) {
                        this.scrollTo(currentPage - 1);
                      } else {
                        this.scrollTo(currentPage + 1);
                      }
                    }}/>
                );
              })}
          </ScrollView>
          <Menu />
        </Swiper>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    // album state
    albumId: state.album.id,
    // reel state
    previewReel: state.reel.previewReel,
    viewPagerLocked: state.reel.viewPagerLocked,
    currentIndex: state.reel.currentIndex,
    // settings state
    autoShare: state.settings.autoShare,
    // photos state
    galleryImages: state.photos.galleryImages
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    addToReel: (image) => dispatch(Actions.Reel.addImage(image)),
    updateCurrentIndex: (index) => dispatch(Actions.Reel.updateCurrentIndex(index)),
    removeImage: (index) => dispatch(Actions.Reel.removeImage(index)),
    uploadImage: (image) => dispatch(Actions.TasvirApi.uploadImage(image)),
    joinAlbumUpdateName: (name) => dispatch(Actions.JoinAlbumForm.updateName(name)),
    joinAlbumUpdateId: (id) => dispatch(Actions.JoinAlbumForm.updateId(id)),
    attemptJoinAlbum: () => dispatch(Actions.JoinAlbumForm.attemptJoinAlbum()),
    saveImage: (photo, photoId) => dispatch(Actions.saveImage(photo, photoId))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
