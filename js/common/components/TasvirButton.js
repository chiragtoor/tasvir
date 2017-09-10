'use strict';

import React,{ Component } from "react";
import Button from 'react-native-button';
import { StyleSheet } from 'react-native';

export default class TasvirButton extends Component {
  render() {
    return (
      <Button
        containerStyle={this.props.secondary ? styles.secondaryButtonContainer : styles.buttonContainer}
        style={styles.button}
        onPress={this.props.onPress}>
        {this.props.text}
      </Button>
    );
  }
}

TasvirButton.getDefaultProps = {
  secondary: false
}

TasvirButton.propTypes = {
  onPress: React.PropTypes.func.isRequired,
  text: React.PropTypes.string.isRequired,
  secondary: React.PropTypes.bool
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginLeft: 20,
    marginRight: 20,
    overflow: 'hidden',
    borderRadius: 50,
    backgroundColor: '#48B2E2',
    alignSelf: 'stretch'
  },
  secondaryButtonContainer: {
    marginLeft: 20,
    marginRight: 20,
    overflow: 'hidden',
    borderRadius: 50,
    backgroundColor: '#FF2C55',
    alignSelf: 'stretch'
  },
  button: {
    fontSize: 20,
    color: 'white',
    padding: 15,
    fontWeight: '500'
  }
});
