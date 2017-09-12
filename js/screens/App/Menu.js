import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  Dimensions,
  Image,
  TextInput,
  StyleSheet,
  Share
} from 'react-native';
import { connect } from 'react-redux';
import Button from 'react-native-button';

import TasvirToggle from './TasvirToggle';
import TasvirButton from '../../common/components/TasvirButton';
import TasvirDirections from '../../common/components/TasvirDirections';

import * as Actions from '../../actions';

import styles from './styles';

class Menu extends Component {

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

  render() {
    return (
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
    // album form state
    formState: state.albumForm.formState
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    toggleAutoShare: (boolean) => dispatch(Actions.Settings.updateAutoShare(boolean)),
    albumFormUpdateName: (name) => dispatch(Actions.AlbumForm.updateName(name)),
    resetAlbumForm: () => dispatch(Actions.AlbumForm.reset()),
    createAlbum: () => dispatch(Actions.TasvirApi.createAlbum()),
    attemptCloseAlbum: () => dispatch(Actions.Album.attemptCloseAlbum()),
    startAlbumForm: () => dispatch(Actions.AlbumForm.initAlbumForm())
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Menu);
