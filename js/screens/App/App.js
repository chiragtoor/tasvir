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
  Share
} from 'react-native';
import { connect } from 'react-redux';
import Camera from 'react-native-camera';
import Swiper from 'react-native-swiper';

import { Socket } from 'phoenix';

import ImageScreen from './ImageScreen';
import { URL_BASE, POST_ACTION_SCROLL } from '../../constants';

import TasvirToggle from '../../common/components/TasvirToggle';
import TasvirButton from '../../common/components/TasvirButton';
import TasvirDirections from '../../common/components/TasvirDirections';

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
      console.log("GOT NEW PHOTO");
      const photo = msg.photo;
      console.log(photo);
      const photoId = msg.id;
      console.log(photoId);
      Actions.saveImage(photo);
      this.props.addSavedPhoto(photoId);
    });
  }

  componentDidMount() {
    Linking.addEventListener('url', this.handleOpenURL);
    this.scrollTo(0);
    if(this.props.albumId) {
      this.connectSocket(this.props.albumId);
    }
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURL);
  }

  handleOpenURL = (event) => {
    const path = event.url.replace(/.*?:\/\//g, '').match(/\/([^\/]+)\/?$/)[1];
    const parts = path.split('?name=');
    const albumId = parts[0];
    const albumName = parts[1];
    console.log("albumId: ", albumId);
    console.log("albumName: ", albumName);

    this.props.joinAlbumUpdateId(albumId);
    this.props.joinAlbumUpdateName(albumName);
    this.props.attemptJoinAlbum();
  }

  scrollTo = (page, animated = true) => {
    this.ref.scrollTo({x: (w * page), y: 0, animated: animated});
  }

  addImage = (image) => {
    if(this.props.autoShare) {
      this.props.uploadImage(image);
    } else {
      this.props.addToReel(image);
    }
  }

  takePicture = () => {
    this.camera.capture()
      .then((data) => this.addImage(data.path))
      .catch(err => console.error(err));
  }

  renderPages = () => {
    return this.props.previewReel.map((data, index) => {
      if(data.isImage) {
        return (
          <ImageScreen
            key={data.key}
            data={data.image}
            onSwipeStart={() => this.props.lockViewPager()}
            onSwipeEnd={() => this.props.unlockViewPager()}
            onFinish={(action) => {
              if(action) {
                this.props.uploadImage(data.image);
              }
              this.scrollPageProg = () => {
                this.props.removeFromReel(index, (index) => {
                  this.scrollTo(index, false);
                });
              };
              if(data.postAction == POST_ACTION_SCROLL.LEFT) {
                this.scrollTo(index - 1);
              } else {
                this.scrollTo(index + 1);
              }
            }}/>
        );
      } else {
        return (
          <View
            key={data.key}
            style={styles.container}>
            <Camera
              ref={(cam) => {
                this.camera = cam;
              }}
              style={styles.preview}
              captureTarget={Camera.constants.CaptureTarget.disk}
              captureAudio={false}
              aspect={Camera.constants.Aspect.fill}>
              <TouchableOpacity onPress={this.takePicture} style={{marginBottom: 30}}>
                <View style={styles.captureBorder}>
                  <View style={styles.captureButton} />
                </View>
              </TouchableOpacity>
            </Camera>
          </View>
        );
      }
    });
  }

  _onMomentumScrollEnd = (e, {index}, context) => {
    if(index == 0) {
      this.props.unlockViewPager();
    } else {
      this.props.lockViewPager();
    }
  }

  createAlbumForm = () => {
    return (
      <View style={styles.createGroupMenu}>
        <View style={styles.menuDivider} />
        <View style={styles.textView}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.groupNameInput}
              onChangeText={(text) => this.props.albumFormUpdateName(text)}
              placeholder={'Enter a name for the album'}
              value={this.props.albumFormName} />
            <Button
              onPress={() => this.props.resetAlbumForm()}>
              <Image style={{flex: 1, width: 20, resizeMode: 'contain'}} source={require('../../../img/cancel_blue.png')}/>
            </Button>
          </View>
          <View style={styles.textInputLine} />
        </View>
        <TasvirButton
          onPress={() => this.props.createAlbum()}
          disabled={this.props.groupFormName === ""}
          text={'Done'} />
        <View style={styles.menuDivider} />
      </View>
    );
  }

  createAlbumMenu = () => {
    return (
      <View style={styles.createGroupMenu}>
        <View style={styles.menuDivider} />
        <TasvirButton
          onPress={() => this.props.startAlbumForm()}
          disabled={false}
          text={'Create New Album'} />
        <View style={styles.menuDivider} />
      </View>
    );
  }

  albumMenu = () => {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <TasvirDirections directions={"Current Album: " + this.props.albumName} />
        <View style={styles.margin} />
        <TasvirButton
          onPress={() => this.shareAlbum()}
          disabled={this.props.groupFormName === ""}
          text={'Share Album'} />
        <View style={styles.margin} />
        <TasvirButton
          danger={true}
          onPress={() => this.props.attemptCloseAlbum()}
          disabled={false}
          text={'Close Album'} />
      </View>
    )
  }

  shareAlbum = () => {
    Share.share({url: (URL_BASE + "albums/" + this.props.albumId + "?name=" + this.props.albumName),
      title: ("Get pictures for: " + this.props.albumName)}, {});
  }

  render() {
    return (
      <View style={styles.container}>
        <Swiper
          style={styles.swiper}
          horizontal={false}
          loop={false}
          vertical={true}
          showsPagination={false}
          index={0}
          scrollEnabled={!this.props.swiperLocked}
          onMomentumScrollEnd={this._onMomentumScrollEnd}>
          <ScrollView
            style={styles.scrollContainer}
            ref={(ref) => this.ref = ref}
            horizontal={true}
            pagingEnabled={true}
            contentOffset={{x: 0, y: 0}}
            showHorizontalScrollIndicator={false}
            scrollEnabled={!this.props.viewPagerLocked}
            onMomentumScrollEnd={(event) => {
              if(this.scrollPageProg) {
                this.scrollPageProg();
                this.scrollPageProg = null;
              } else {
                const page =  Math.floor(event.nativeEvent.contentOffset.x / w);
                this.props.updateCurrentIndex(page);
              }
            }}>
            {this.renderPages()}
          </ScrollView>
          <View style={styles.menu}>
            <View style={styles.menuHeader}>
              <Image style={{width: 200, resizeMode: 'contain', marginTop: 10}}
                source={require('../../../img/tasvir_logo.png')}/>
            </View>
            <View style={styles.menuOptions}>
              <TasvirToggle
                toggle={this.props.autoShare}
                toggleChange={(value) => this.props.toggleAutoShare(value)}
                mainText={'Auto Share'}
                explanationText={'Automatically share pictures on capture'} />
            </View>
            <View style={styles.menuDivider} />
            {this.props.albumId == null ?
              this.props.formState == Actions.AlbumForm.INIT_STATE ? this.createAlbumMenu() : this.createAlbumForm()
            :
              this.albumMenu()
            }
          </View>
        </Swiper>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    // album state
    albumName: state.album.name,
    albumId: state.album.id,
    // settings state
    autoShare: state.settings.autoShare,
    // reel state
    previewReel: state.reel.previewReel,
    viewPagerLocked: state.reel.viewPagerLocked,
    swiperLocked: state.reel.swiperLocked,
    currentIndex: state.reel.currentIndex,
    // album form state
    formState: state.albumForm.formState
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    addToReel: (image) => dispatch(Actions.Reel.addToReel(image)),
    updateCurrentIndex: (index) => dispatch(Actions.Reel.updateCurrentIndex(index)),
    removeFromReel: (index, scrollCallback) => dispatch(Actions.Reel.removeFromReel(index, scrollCallback)),
    toggleAutoShare: (boolean) => dispatch(Actions.Settings.updateAutoShare(boolean)),
    updateMainPage: (page) => dispatch(Actions.Reel.updateMainPage(page)),
    lockViewPager: () => dispatch(Actions.Reel.lockViewPager()),
    unlockViewPager: () => dispatch(Actions.Reel.unlockViewPager()),
    albumFormUpdateName: (name) => dispatch(Actions.AlbumForm.updateName(name)),
    resetAlbumForm: () => dispatch(Actions.AlbumForm.reset()),
    createAlbum: () => dispatch(Actions.TasvirApi.createAlbum()),
    attemptCloseAlbum: () => dispatch(Actions.Album.attemptCloseAlbum()),
    uploadImage: (image) => dispatch(Actions.TasvirApi.uploadImage(image)),
    joinAlbumUpdateName: (name) => dispatch(Actions.JoinAlbumForm.updateName(name)),
    joinAlbumUpdateId: (id) => dispatch(Actions.JoinAlbumForm.updateId(id)),
    attemptJoinAlbum: () => dispatch(Actions.JoinAlbumForm.attemptJoinAlbum()),
    startAlbumForm: () => dispatch(Actions.AlbumForm.initAlbumForm()),
    addSavedPhoto: (photoId) => dispatch(Actions.Album.addSavedPhoto(photoId))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
