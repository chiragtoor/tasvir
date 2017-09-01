'use strict';

import React,{ Component } from 'react';
import {
  Dimensions,
  Image,
  View,
} from 'react-native';
import { connect } from 'react-redux';

import * as Actions from '../../actions';

import styles from './styles';

import TasvirButton from '../../common/components/TasvirButton';
import TasvirDirections from '../../common/components/TasvirDirections';

class CloseAlbum extends Component {
  render() {
    const directions = "Are you sure you want to close the album ''" + this.props.albumName + "''?";
    return (
      <View style={styles.page}>
        <TasvirDirections directions={directions} />
        <View style={styles.margin} />
        <TasvirButton
          onPress={() => this.props.keepAlbumOpen()}
          disabled={false}
          text={'Keep Album Open'} />
        <View style={styles.margin} />
        <TasvirButton
          secondary={true}
          onPress={() => this.props.closeAlbum()}
          disabled={false}
          text={'Close Album'} />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    albumName: state.album.name
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    keepAlbumOpen: () => dispatch(Actions.Album.keepAlbumOpen()),
    closeAlbum: () => dispatch(Actions.Album.closeAlbum())
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CloseAlbum);
