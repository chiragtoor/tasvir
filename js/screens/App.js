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

import TasvirCamera from './TasvirCamera';
import Gallery from './Gallery';
import ImageScreen from './ImageScreen';
import Menu from './Menu';

import * as Actions from '../actions';
import { URL_BASE } from '../constants';

const SCREEN_WIDTH = Dimensions.get('window').width;

class App extends Component {
  componentDidMount() {
    this.scrollTo(Actions.CAMERA_INDEX);
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
              goToPreview={() => this.scrollTo(Actions.PREVIEW_REEL_INDEX)}
              goToGallery={() => this.scrollTo(Actions.GALLERY_INDEX)} />
              {this.props.previewReel.map((image, imageIndex) => {
                // because previewReel is rendered after the gallery and camera, +2 to the index
                //  so we scrollTo the correct position in the onFinish action callback
                const currentPage = imageIndex + Actions.PREVIEW_REEL_INDEX;
                return (
                  <ImageScreen
                    key={image}
                    data={image}
                    goToCamera={() => this.scrollTo(Actions.CAMERA_INDEX)}
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
    removeImage: (index) => dispatch(Actions.Reel.removeImage(index))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
