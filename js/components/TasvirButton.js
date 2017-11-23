import React,{ Component } from "react";
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

export default class TasvirButton extends Component {
  render() {
    return (
      <TouchableOpacity
        style={this.props.secondary ? styles.secondaryButton : styles.button}
        onPress={this.props.onPress}>
        <Text style={styles.text}>{this.props.text}</Text>
      </TouchableOpacity>
    );
  }
}

TasvirButton.getDefaultProps = {
  secondary: false
}

// TasvirButton.propTypes = {
//   onPress: React.PropTypes.func.isRequired,
//   text: React.PropTypes.string.isRequired,
//   secondary: React.PropTypes.bool
// }

const styles = StyleSheet.create({
  button: {
    marginLeft: 20,
    marginRight: 20,
    overflow: 'hidden',
    borderRadius: 50,
    backgroundColor: '#48B2E2',
    alignSelf: 'stretch'
  },
  secondaryButton: {
    marginLeft: 20,
    marginRight: 20,
    overflow: 'hidden',
    borderRadius: 50,
    backgroundColor: '#FF2C55',
    alignSelf: 'stretch'
  },
  text: {
    fontSize: 20,
    color: 'white',
    padding: 15,
    fontWeight: '500',
    textAlign: 'center'
  }
});
