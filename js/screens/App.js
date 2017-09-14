import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  StyleSheet
} from 'react-native';
import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';
import { Socket } from 'phoenix';
import branch from 'react-native-branch';

import ImageScreen from './ImageScreen';
import Menu from './Menu';
import { URL_BASE } from '../constants';

import TasvirCamera from './TasvirCamera';
import Gallery from './Gallery';

import * as Actions from '../actions';

const SCREEN_WIDTH = Dimensions.get('window').width;

class App extends Component {

  connectSocket = () => {
    // connect to album web socket
    let socket = new Socket((URL_BASE + "socket"), {
      logger: ((kind, msg, data) => { console.log(`${kind}: ${msg}`, data) })
    });

    socket.connect();

    var chan = socket.channel("album:" + this.props.albumId, {});
    chan.join();

    chan.on("new:photo", msg => {
      this.props.saveImage(msg.photo, msg.id);
    });
  }

  componentDidMount() {
    this.scrollTo(1);
    if(this.props.albumId) this.connectSocket();
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
    this.ref.scrollTo({x: (SCREEN_WIDTH * page), y: 0, animated: animated});
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
                const page =  Math.floor(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
                this.props.updateCurrentIndex(page);
              }
            }}>
            <Gallery key={'GALLERY'} />
            <TasvirCamera
              key={'CAMERA'}
              goToPreview={() => this.scrollTo(2)}
              goToGallery={() => this.scrollTo(0)} />
              {this.props.previewReel.map((image, imageIndex) => {
                // because previewReel is rendered after the gallery and camera, +2 to the index
                //  so we scrollTo the correct position in the onFinish action callback
                const currentPage = imageIndex + 2;
                return (
                  <ImageScreen
                    key={image}
                    data={image}
                    goToCamera={() => this.scrollTo(1)}
                    onFinish={() => {
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1
  },
  swiper: {
    backgroundColor: "#48B2E2"
  }
});

const mapStateToProps = (state) => {
  return {
    // album state
    albumId: state.album.id,
    // reel state
    previewReel: state.reel.previewReel,
    currentIndex: state.reel.currentIndex
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateCurrentIndex: (index) => dispatch(Actions.Reel.updateCurrentIndex(index)),
    removeImage: (index) => dispatch(Actions.Reel.removeImage(index)),
    joinAlbumUpdateName: (name) => dispatch(Actions.JoinAlbumForm.updateName(name)),
    joinAlbumUpdateId: (id) => dispatch(Actions.JoinAlbumForm.updateId(id)),
    attemptJoinAlbum: () => dispatch(Actions.JoinAlbumForm.attemptJoinAlbum()),
    saveImage: (photo, photoId) => dispatch(Actions.saveImage(photo, photoId))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
