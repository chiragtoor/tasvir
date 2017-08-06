'use strict';

import React,{ Component } from "react";
import {
  Text
} from 'react-native';

import styles from './styles';

export default class TasvirDirections extends Component {
  render() {
    return (
      <Text style={styles.tasvirDirections}>
        {this.props.directions}
      </Text>
    );
  }
}

TasvirDirections.propTypes = {
  directions: React.PropTypes.string.isRequired
}
