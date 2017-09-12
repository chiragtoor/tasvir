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

  constructor(props) {
    super(props);

    this.state = {
      savedPhotos: []
    }

    CameraRoll.getPhotos({
      first: 9,
      assetType: 'Photos'
    }).then(r => {
      console.log(r.edges[0].node.image.uri);
      this.setState({ savedPhotos: r.edges })
    })
  }

  reloadImages = () => {
    CameraRoll.getPhotos({
      first: 9,
      assetType: 'Photos'
    }).then(r => {
      this.setState({ savedPhotos: r.edges })
    })
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
      this.reloadImages();
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
      this.reloadImages();
    } else {
      this.props.addToReel(image);
    }
  }

  takePicture = (data) => {
    if(this.props.albumId) {
      const path = data.path.split('/Documents/');
      this.addImage(path[1]);
    } else {
      this.props.saveImage(data.path, "NO_ALBUM").then((uri) => {
        console.log("IMAGE TAKEN");
        console.log(uri);
        this.reloadImages();
      });
    }
  }

  renderPages = () => {
    return this.props.previewReel.map((data, index) => {
      if(index == 0) {
        return(
          <Gallery key={data.key} savedPhotos={this.state.savedPhotos} />
        );
      } else if(data.isImage) {
        return (
          <ImageScreen
            key={data.key}
            data={data.image}
            goToCamera={() => this.scrollTo(1)}
            saveToDevice={() => {
              this.props.saveImage(RNFS.DocumentDirectoryPath + '/' + data.image, "NO_ALBUM").then(() => {
                this.reloadImages();
              });
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
            onFinish={(action) => {
              if(action) {
                this.props.uploadImage(RNFS.DocumentDirectoryPath + '/' + data.image).then(() => {
                  this.reloadImages();
                });
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
        const hasPreviewReel = (this.props.previewReel.length - 2) > 0;
        const hasGallery = this.state.savedPhotos.length > 0;
        return (
          <TasvirCamera
            key={data.key}
            preview={hasPreviewReel ? this.props.previewReel[2].image : null}
            previewCount={this.props.previewReel.length - 2}
            gallery={hasGallery ? (this.state.savedPhotos[0].node.image.uri) : null}
            goToPreview={() => this.scrollTo(2)}
            goToGallery={() => this.scrollTo(0)}
            takePicture={this.takePicture} />
        );
      }
    });
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
          text={'Share Album'} />
        <View style={styles.margin} />
        <TasvirButton
          secondary={true}
          onPress={() => this.props.attemptCloseAlbum()}
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
            {this.renderPages()}
          </ScrollView>
          <View style={styles.menu}>
            <View style={styles.menuHeader}>
              <Image style={{width: 200, resizeMode: 'contain', marginTop: 10}}
                source={require('../../../img/tasvir_logo.png')}/>
            </View>
            <View style={styles.menuOptions}>
              <TasvirToggle
                value={this.props.autoShare}
                toggle={(value) => this.props.toggleAutoShare(value)}
                message={'Auto Share'}
                explanation={'Automatically share pictures on capture'} />
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
