'use strict';

import React,{ Component } from "react";
import {TouchableOpacity, View} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import styles from './styles';

export default class TasvirIconButton extends Component {
  render() {
    let content = <View style={this.props.sizeLarge ? styles.buttonLarge : styles.button}>
                    {this.props.content}
                  </View>;
    if(this.props.customButton) {
      content = this.props.content;
    }
    return (
      <TouchableOpacity onPress={() => this.props.onPress()}>
        <View style={this.props.sizeLarge ? styles.buttonBorderLarge : styles.buttonBorder}>
          {content}
        </View>
      </TouchableOpacity>
    );
  }
}

TasvirIconButton.getDefaultProps = {
  sizeLarge: false
}

TasvirIconButton.propTypes = {
  onPress: React.PropTypes.func.isRequired,
  content: React.PropTypes.element,
  sizeLarge: React.PropTypes.bool
}
