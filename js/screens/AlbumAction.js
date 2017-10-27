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

class AlbumAction extends Component {
  render() {
    return (
      <View style={styles.page}>
        <TasvirDirections directions={this.props.copy} />
        <View style={styles.margin} />
        <TasvirButton
          onPress={() => this.props.reject()}
          disabled={false}
          text={this.props.rejectCopy} />
        <View style={styles.margin} />
        <TasvirButton
          secondary={true}
          onPress={() => this.props.accept()}
          disabled={false}
          text={this.props.acceptCopy} />
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
    copy: state.app.confirmationCopy,
    acceptCopy: state.app.confirmationAcceptCopy,
    rejectCopy: state.app.confirmationRejectCopy
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    accept: () => dispatch(Actions.App.confirmationAccept()),
    reject: () => dispatch(Actions.App.confirmationReject())
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AlbumAction);
