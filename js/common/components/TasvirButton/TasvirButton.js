'use strict';

import React,{ Component } from "react";
import Button from 'react-native-button';

import styles from './styles';

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
