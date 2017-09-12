'use strict';

import React,{ Component } from 'react';
import {
  Dimensions,
  Image,
  View,
  StyleSheet
} from 'react-native';
import { connect } from 'react-redux';

import * as Actions from '../../actions';

import TasvirButton from '../../common/components/TasvirButton';
import TasvirDirections from '../../common/components/TasvirDirections';

class CloseAlbum extends Component {
  constructor(props) {
    super(props);

    console.log("CLOSE ALBUM");
    console.log(props);
  }
  render() {
    const directions = this.props.closeAlbum ?
      "Are you sure you want to close the album ''" + this.props.albumName + "''?"
      : "Do you want to join the album ''" + this.props.albumName + "''?";
    return (
      <View style={styles.page}>
        <TasvirDirections directions={directions} />
        <View style={styles.margin} />
        <TasvirButton
          onPress={() => this.props.closeAlbum ? this.props.keepAlbumOpen() : this.props.joinAlbum()}
          disabled={false}
          text={this.props.closeAlbum ? 'Keep Album Open': 'Yes'} />
        <View style={styles.margin} />
        <TasvirButton
          secondary={true}
          onPress={() => this.props.closeAlbum ? this.props.closeAlbum() : this.props.rejectAlbum()}
          disabled={false}
          text={this.props.closeAlbum ? 'Close Album' : 'No'} />
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
    closeAlbum: state.album.closeAlbum
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
