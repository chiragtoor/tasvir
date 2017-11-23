'use strict';

import React,{ Component } from "react";
import { TouchableOpacity, View, StyleSheet } from 'react-native';

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

// TasvirIconButton.propTypes = {
//   onPress: React.PropTypes.func.isRequired,
//   content: React.PropTypes.element,
//   sizeLarge: React.PropTypes.bool
// }

const styles = StyleSheet.create({
  buttonBorder: {
    borderRadius: 19,
    height: 38,
    width: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#FFFFFF"
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    height: 32,
    width: 32,
    backgroundColor: "#48B2E2"
  },
  icon: {
    color: "#FFFFFF"
  },
  buttonBorderLarge: {
    borderRadius: 30,
    height: 60,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#FFFFFF"
  },
  buttonLarge: {
    borderRadius: 25,
    height: 50,
    width: 50,
    backgroundColor: "#48B2E2"
  },
});
