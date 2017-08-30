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
  Share
} from 'react-native';
var RNFS = require('react-native-fs');
import { connect } from 'react-redux';
import Camera from 'react-native-camera';
import Swiper from 'react-native-swiper';

import { Socket } from 'phoenix';

import ImageScreen from './ImageScreen';
import { URL_BASE, POST_ACTION_SCROLL } from '../../constants';

import TasvirToggle from '../../common/components/TasvirToggle';
import TasvirButton from '../../common/components/TasvirButton';
import TasvirDirections from '../../common/components/TasvirDirections';
import TasvirIconButton from '../../common/components/TasvirIconButton';

import * as Actions from '../../actions';

import styles from './styles';

import Button from 'react-native-button';
const w = Dimensions.get('window').width;

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      captureFadeAnim: new Animated.Value(0),
      cameraType: Camera.constants.Type.back
    }
  }

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
    this.scrollTo(0);
    if(this.props.albumId) {
      this.connectSocket(this.props.albumId);
    }
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

  takePicture = () => {
    Animated.timing(
      this.state.captureFadeAnim, { toValue: 1, duration: 100 }
    ).start(() => {
      Animated.timing(
        this.state.captureFadeAnim, { toValue: 0, duration: 100 }
      ).start();
    });
    this.camera.capture()
      .then((data) => {
        if(this.props.albumId) {
          const path = data.path.split('/Documents/');
          this.addImage(path[1]);
        } else {
          this.props.saveImage(data.path, "NO_ALBUM");
        }
      })
      .catch(err => console.error(err));
  }

  flipCamera = () => {
    if(this.state.cameraType === Camera.constants.Type.back) {
      this.setState({cameraType: Camera.constants.Type.front});
    } else {
      this.setState({cameraType: Camera.constants.Type.back});
    }
  }

  renderPages = () => {
    return this.props.previewReel.map((data, index) => {
      if(data.isImage) {
        return (
          <ImageScreen
            key={data.key}
            data={data.image}
            goToCamera={() => this.scrollTo(0)}
            saveToDevice={() => {
              this.props.saveImage(RNFS.DocumentDirectoryPath + '/' + data.image, "NO_ALBUM");
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
            }}
            onSwipeStart={() => this.props.lockViewPager()}
            onSwipeEnd={() => this.props.unlockViewPager()}
            onFinish={(action) => {
              if(action) {
                this.props.uploadImage(RNFS.DocumentDirectoryPath + '/' + data.image);
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
        const previewCount = this.props.previewReel.length - 1;
        return (
          <View
            key={data.key}
            style={styles.container}>
            <Camera
              ref={(cam) => {
                this.camera = cam;
              }}
              type={this.state.cameraType}
              style={styles.preview}
              captureTarget={Camera.constants.CaptureTarget.disk}
              captureAudio={false}
              keepAwake={true}
              mirrorImage={true}
              onFocusChanged={() => null}
              zoomChanged={() => null}
              aspect={Camera.constants.Aspect.fill}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 1, alignItems: 'flex-start', paddingLeft: 20}}>
                  <TouchableOpacity onPress={() => this.flipCamera()}>
                    <View style={styles.onPreviewButtonBorder}>
                      <View style={styles.onPreviewButton}>
                        <Image style={{flex: 1, width: 20, resizeMode: 'contain'}} source={require('../../../img/camera_flip_icon.png')}/>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{flex: 1, alignItems: 'center', marginBottom: 30}}>
                  <TasvirIconButton
                    onPress={this.takePicture}
                    content={null}
                    sizeLarge={true} />
                </View>
                <View style={{flex: 1, alignItems: 'flex-end', paddingRight: 20}}>
                  {previewCount > 0 ?
                    <TasvirIconButton
                      onPress={() => this.scrollTo(1)}
                      content={<Image
                                  style={styles.imageButton}
                                  source={{uri: (RNFS.DocumentDirectoryPath + '/' + this.props.previewReel[1].image)}}>
                                  <View style={styles.imageButtonText}>
                                    <Text style={{color: '#FFFFFF', fontWeight: 'bold'}}>{previewCount}</Text>
                                  </View>
                                </Image>} />
                  :
                    null
                  }
                </View>
              </View>
            </Camera>
            <Animated.View
              pointerEvents="none"
              style={{opacity: this.state.captureFadeAnim, position: 'absolute', width: Dimensions.get('window').width, height: Dimensions.get('window').height, borderWidth: 7, borderColor: "#48B2E2"}} />
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
    Share.share({url: this.props.albumLink,
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
    albumLink: state.album.link,
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
    saveImage: (photo, photoId) => dispatch(Actions.saveImage(photo, photoId))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
