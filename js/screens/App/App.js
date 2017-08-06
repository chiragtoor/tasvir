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
    // connect to gorup web socket
    let socket = new Socket((URL_BASE + "socket"), {
      logger: ((kind, msg, data) => { console.log(`${kind}: ${msg}`, data) })
    });

    socket.connect();

    var chan = socket.channel("album:" + albumId, {});
    chan.join();

    chan.on("new:photo", msg => {
      const photo = msg.photo;
      this.addGroupImage(photo);
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
    this.props.addToReel(image);
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
                // this.props.uploadImage(data.image);
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
              <Text style={{backgroundColor: '#fff', color: '#000', padding: 10, margin: 40}} onPress={this.addGroupImage}>[REMOVE]</Text>
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

  createAlbumMenu = () => {
    return (
      <View style={styles.createGroupMenu}>
        <View style={styles.menuDivider} />
        <View style={styles.textView}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.groupNameInput}
              onChangeText={(text) => this.props.groupFormUpdateName(text)}
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
          text={'Create Album'} />
        <View style={styles.menuDivider} />
      </View>
    );
  }

  albumMenu = () => {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <TasvirButton
          onPress={() => this.props.createAlbum()}
          disabled={this.props.groupFormName === ""}
          text={'Share Album'} />
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Swiper
          style={styles.swiper}
          horizontal={false}
          loop={false}
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
              <Text style={styles.userName}>
                {this.props.userName}
              </Text>
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
              this.createAlbumMenu()
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
    currentIndex: state.reel.currentIndex
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
    unlockViewPager: () => dispatch(Actions.Reel.unlockViewPager())
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
