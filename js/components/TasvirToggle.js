'use strict';

import React,{ Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Switch
} from 'react-native';

export default class TasvirToggle extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.message}>
            {this.props.message}
          </Text>
          <Text style={styles.explanation}>
            {this.props.explanation}
          </Text>
        </View>
        <View style={styles.toggle}>
          <Switch
            onValueChange={this.props.toggle}
            onTintColor="#48B2E2"
            value={this.props.value} />
        </View>
      </View>
    );
  }
}

TasvirToggle.propTypes = {
  value: React.PropTypes.bool.isRequired,
  toggle: React.PropTypes.func.isRequired,
  message: React.PropTypes.string.isRequired,
  explanation: React.PropTypes.string.isRequired
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  row: {
    flex: 1
  },
  message: {
    fontSize: 24,
    color: '#4A4A4A',
    fontWeight: '300'
  },
  explanation: {
    fontSize: 12,
    color: '#9B9B9B'
  },
  toggle: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
