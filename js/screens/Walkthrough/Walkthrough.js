'use strict';

import React,{ Component } from 'react';
import {
  Dimensions,
  Image,
  View,
  Text
} from 'react-native';
import { connect } from 'react-redux';

import * as Actions from '../../actions';

import styles from './styles';

import TasvirButton from '../../common/components/TasvirButton';

class Walkthrough extends Component {

  constructor(props) {
    super(props);

    this.state = {
      page: 1
    }
  }

  renderPageOne() {
    return (
      <View style={styles.page}>
        <View>
          <Text style={{textAlign: 'center', fontSize: 30, color: '#FFFFFF'}}>
            Welcome to Tasvir!
          </Text>
          <Text style={{textAlign: 'center', fontSize: 20, color: '#FFFFFF'}}>
            The easiest way to share your photos
          </Text>
        </View>
        <Text style={{textAlign: 'center', fontSize: 20, color: '#FFFFFF'}}>
          Just create an album and share the link with your friends, they will have access to all the photos you take.
        </Text>
        <TasvirButton
          danger={true}
          onPress={() => this.setState({page: 2})}
          disabled={false}
          text={'Okay'} />
      </View>
    );
  }

  renderPageTwo() {
    return (
      <View style={styles.page}>
        <Text style={{textAlign: 'center', fontSize: 20, color: '#FFFFFF'}}>
          Preview your picturs to the right of the camera, simply swipe them up or down to share or delete.
        </Text>
        <Text style={{textAlign: 'center', fontSize: 20, color: '#FFFFFF'}}>
          Swipe the camera up to get to the menu.
        </Text>
        <TasvirButton
          danger={true}
          onPress={() => this.props.completeWalkthrough()}
          disabled={false}
          text={'Done'} />
      </View>
    );
  }

  render() {
    let content = this.renderPageOne();
    if(this.state.page == 2) {
      content = this.renderPageTwo();
    }
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image style={{width: 200, resizeMode: 'contain', marginTop: 10}}
            source={require('../../../img/tasvir_logo.png')}/>
        </View>
        {content}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return { };
};
const mapDispatchToProps = (dispatch) => {
  return {
    completeWalkthrough: () => dispatch(Actions.completeWalkthrough())
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Walkthrough);
