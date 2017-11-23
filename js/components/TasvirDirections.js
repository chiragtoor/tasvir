'use strict';

import React,{ Component } from "react";
import {
  Text,
  StyleSheet
} from 'react-native';

export default class TasvirDirections extends Component {
  render() {
    return (
      <Text style={styles.tasvirDirections}>
        {this.props.directions}
      </Text>
    );
  }
}

// TasvirDirections.propTypes = {
//   directions: React.PropTypes.string.isRequired
// }

const styles = StyleSheet.create({
  tasvirDirections: {
    fontSize: 22,
    color: '#4A4A4A',
    fontWeight: '400',
    marginTop: 20,
    textAlign: 'center'
  }
});
