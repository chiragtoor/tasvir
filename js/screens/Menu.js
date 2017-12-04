import React, { Component } from 'react';
import {
  View,
  Dimensions,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Share
} from 'react-native';
import { connect } from 'react-redux';
var Mixpanel = require('react-native-mixpanel');

import TasvirToggle from '../components/TasvirToggle';
import TasvirButton from '../components/TasvirButton';
import TasvirDirections from '../components/TasvirDirections';

import * as Actions from '../actions';

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
    Mixpanel.trackWithProperties("Share Dialog", {"albumId": this.props.albumId, "albumName": this.props.albumName});
    Share.share({url: this.props.albumLink,
      title: ("Get pictures for: " + this.props.albumName)}, {}).then((response) => {
        if(response.action === 'sharedAction') {
          Mixpanel.trackWithProperties("Shared Link", {"albumId": this.props.albumId, "albumName": this.props.albumName});
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
            <TouchableOpacity
              onPress={() => this.props.resetAlbumForm()}>
              <Image style={{flex: 1, width: 20, resizeMode: 'contain'}} source={require('../../img/cancel_blue.png')}/>
            </TouchableOpacity>
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

  autoShareToggle = (autoShare) => {
    this.props.toggleAutoShare(autoShare);
    Mixpanel.track("AutoShare Toggled");
    Mixpanel.set({"autoSharing": autoShare});
  }

  render() {
    return (
      <View style={styles.menu}>
        <View style={styles.menuHeader}>
          <Image style={{width: 200, resizeMode: 'contain', marginTop: 10}}
            source={require('../../img/tasvir_logo.png')}/>
        </View>
        <View style={styles.menuOptions}>
          <TasvirToggle
            value={this.props.autoShare}
            toggle={(value) => this.autoShareToggle(value)}
            message={'Auto Share'}
            explanation={'Automatically share pictures on capture'} />
        </View>
        <View style={styles.menuDivider} />
        {this.props.albumId == null ?
          this.props.formState == Actions.App.APP_ALBUM_FORM_STATE_INIT ? this.createAlbumMenu() : this.createAlbumForm()
        :
          this.albumMenu()
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  menuHeader: {
    height: 100,
    backgroundColor: "#48B2E2",
    justifyContent: 'center',
    alignItems: 'center'
  },
  margin: {
    height: 50,
    width: 50
  },
  menuOptions: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#EFEFEF',
    marginTop: 10
  },
  groupNameInput: {
    flex: 1,
    height: 50,
    fontSize: 20,
    textAlign: 'center'
  },
  createGroupMenu: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textView: {
    width: Dimensions.get('window').width,
  },
  inputContainer: {
    flexDirection: 'row',
    marginLeft: 20,
    marginRight: 20,
    alignItems: 'center'
  },
  textInputLine: {
    height: 1,
    backgroundColor: '#EFEFEF',
    marginLeft: 20,
    marginRight: 20,
  },
  groupNameInput: {
    flex: 1,
    height: 30,
    fontSize: 20
  },
  groupName: {
    fontSize: 20,
    color: '#4A4A4A'
  }
});


const mapStateToProps = (state) => {
  return {
    // album state
    albumName: state.album.name,
    albumId: state.album.id,
    albumLink: state.album.link,
    // app state
    autoShare: state.app.autoShare,
    // album form state
    formState: state.app.albumFormState
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    toggleAutoShare: (boolean) => dispatch(Actions.App.updateAutoShare(boolean)),
    albumFormUpdateName: (name) => dispatch(Actions.Album.updateName(name)),
    resetAlbumForm: () => dispatch(Actions.App.resetAlbumForm()),
    createAlbum: () => dispatch(Actions.TasvirApi.createAlbum()),
    attemptCloseAlbum: () => dispatch(Actions.Album.closeAlbum()),
    startAlbumForm: () => dispatch(Actions.App.openAlbumForm())
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Menu);
