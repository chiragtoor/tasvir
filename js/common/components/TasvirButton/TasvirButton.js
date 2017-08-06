'use strict';

import React,{ Component } from "react";
import Button from 'react-native-button';

import styles from './styles';

export default class TasvirButton extends Component {
  render() {
    const buttonStyle = this.props.sizeSmall ? styles.buttonSmall : styles.button;
    const buttonDisabledStyle = this.props.sizeSmall ? styles.disabledButtonSmall : styles.disabledButton;
    let buttonContainer = styles.buttonContainer;
    if(this.props.danger) {
      buttonContainer = styles.redButtonContainer;
    } else if(this.props.disabled) {
      buttonContainer = styles.disabledButtonContainer;
    }
    return (
      <Button
        containerStyle={buttonContainer}
        style={buttonStyle}
        styleDisabled={buttonDisabledStyle}
        onPress={this.props.onPress}
        disabled={this.props.disabled}>
        {this.props.text}
      </Button>
    );
  }
}

TasvirButton.getDefaultProps = {
  disabled: false,
  sizeSmall: false,
  danger: false
}

TasvirButton.propTypes = {
  onPress: React.PropTypes.func.isRequired,
  text: React.PropTypes.string.isRequired,
  disabled: React.PropTypes.bool,
  sizeSmall: React.PropTypes.bool,
  danger: React.PropTypes.bool
}
