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

class JoinAlbum extends Component {
  render() {
    const directions = "Do you want to join the album ''" + this.props.albumName + "''?";
    return (
      <View style={styles.page}>
        <TasvirDirections directions={directions} />
        <View style={styles.margin} />
        <TasvirButton
          onPress={() => this.props.joinAlbum()}
          disabled={false}
          text={'Yes'} />
        <View style={styles.margin} />
        <TasvirButton
          danger={true}
          onPress={() => this.props.rejectAlbum()}
          disabled={false}
          text={'No'} />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    albumName: state.joinAlbumForm.name
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    rejectAlbum: () => dispatch(Actions.JoinAlbumForm.rejectAlbum()),
    joinAlbum: () => dispatch(Actions.JoinAlbumForm.joinAlbum())
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(JoinAlbum);
