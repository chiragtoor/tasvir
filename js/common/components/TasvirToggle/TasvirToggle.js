'use strict';

import React,{ Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Switch
} from 'react-native';

import styles from './styles';

export default class TasvirToggle extends Component {
  render() {
    return (
      <View style={styles.optionsView}>
        <View style={styles.optionsTextView}>
          <Text style={styles.optionsMainText}>
            {this.props.mainText}
          </Text>
          <Text style={styles.optionsExplanationText}>
            {this.props.explanationText}
          </Text>
        </View>
        <View style={styles.optionToggleView}>
          <Switch
            onValueChange={this.props.toggleChange}
            onTintColor="#48B2E2"
            value={this.props.toggle} />
        </View>
      </View>
    );
  }
}

TasvirToggle.propTypes = {
  toggleChange: React.PropTypes.func.isRequired,
  explanationText: React.PropTypes.string.isRequired,
  mainText: React.PropTypes.string.isRequired
}
