'use strict';

import React,{ Component } from 'react';
import {
  Dimensions,
  Image,
  View,
  StyleSheet
} from 'react-native';
import { connect } from 'react-redux';

import * as Actions from '../actions';

import TasvirButton from '../components/TasvirButton';
import TasvirDirections from '../components/TasvirDirections';

class CloseAlbum extends Component {
  constructor(props) {
    super(props);

    this.state = {
      closeAlbum: props.navigation.state.routeName === 'CloseAlbum'
    }
  }
  render() {
    const directions = this.state.closeAlbum ?
      "Are you sure you want to close the album ''" + this.props.albumName + "''?"
      : "Do you want to join the album ''" + this.props.joinAlbumName + "''?";
    return (
      <View style={styles.page}>
        <TasvirDirections directions={directions} />
        <View style={styles.margin} />
        <TasvirButton
          onPress={() => this.state.closeAlbum ? this.props.keepAlbumOpen() : this.props.joinAlbum()}
          disabled={false}
          text={this.state.closeAlbum ? 'Keep Album Open': 'Yes'} />
        <View style={styles.margin} />
        <TasvirButton
          secondary={true}
          onPress={() => this.state.closeAlbum ? this.props.closeAlbum() : this.props.rejectAlbum()}
          disabled={false}
          text={this.state.closeAlbum ? 'Close Album' : 'No'} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20
  },
  margin: {
    height: 50,
    width: 50
  }
});

const mapStateToProps = (state) => {
  return {
    albumName: state.album.name,
    joinAlbumName: state.joinAlbumForm.name
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    keepAlbumOpen: () => dispatch(Actions.Album.keepAlbumOpen()),
    closeAlbum: () => dispatch(Actions.Album.closeAlbum()),
    rejectAlbum: () => dispatch(Actions.JoinAlbumForm.rejectAlbum()),
    joinAlbum: () => dispatch(Actions.JoinAlbumForm.joinAlbum())
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CloseAlbum);
