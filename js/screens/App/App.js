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
        this.reloadImages();
      });
    }
  }

  renderPages = () => {
    return this.props.previewReel.map((data, index) => {
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
    });
  }

  render() {
    const hasPreviewReel = this.props.previewReel.length > 0;
    const hasGallery = this.state.savedPhotos.length > 0;
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
            <Gallery key={'GALLERY'} savedPhotos={this.state.savedPhotos} />
            <TasvirCamera
              key={'CAMERA'}
              preview={hasPreviewReel ? this.props.previewReel[0].image : null}
              previewCount={this.props.previewReel.length}
              gallery={hasGallery ? (this.state.savedPhotos[0].node.image.uri) : null}
              goToPreview={() => this.scrollTo(2)}
              goToGallery={() => this.scrollTo(0)}
              takePicture={this.takePicture} />
            {this.renderPages()}
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
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    addToReel: (image) => dispatch(Actions.Reel.addToReel(image)),
    updateCurrentIndex: (index) => dispatch(Actions.Reel.updateCurrentIndex(index)),
    removeFromReel: (index, scrollCallback) => dispatch(Actions.Reel.removeFromReel(index, scrollCallback)),
    uploadImage: (image) => dispatch(Actions.TasvirApi.uploadImage(image)),
    joinAlbumUpdateName: (name) => dispatch(Actions.JoinAlbumForm.updateName(name)),
    joinAlbumUpdateId: (id) => dispatch(Actions.JoinAlbumForm.updateId(id)),
    attemptJoinAlbum: () => dispatch(Actions.JoinAlbumForm.attemptJoinAlbum()),
    saveImage: (photo, photoId) => dispatch(Actions.saveImage(photo, photoId))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
