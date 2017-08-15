import React, {Component} from 'react';
import {View, Text, Dimensions, StyleSheet, Image, Animated} from 'react-native';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

export default class OtherScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      pan: new Animated.ValueXY(),
      scale: new Animated.Value(1)
    }
  }

  onSwipeUp(gestureState) {
    console.log("UP SWIPE");
    Animated.timing(
      this.state.pan,
      {toValue: {x:0, y: -1 * Dimensions.get('window').height}, duration: 250}
    ).start(() => {
      this.props.onFinish(true);
    });
  }

  onSwipeDown(gestureState) {
    console.log("DOWN SWIPE");
    Animated.timing(
      this.state.pan,
      {toValue: {x:0, y: Dimensions.get('window').height}, duration: 250}
    ).start(() => {
      this.props.onFinish(false);
    });
  }

  onSwipeLeft(gestureState) {
    console.log("LEFT SWIPE");
  }

  onSwipeRight(gestureState) {
    console.log("RIGHT SWIPE");
  }

  onSwipe(gestureName, gestureState) {
    const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
    this.setState({gestureName: gestureName});
    switch (gestureName) {
      case SWIPE_UP:
        break;
      case SWIPE_DOWN:
        break;
      case SWIPE_LEFT:
        break;
      case SWIPE_RIGHT:
        break;
    }
  }

  render() {

    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 100
    };

    let {pan, scale} = this.state;
    let [translateX, translateY] = [pan.x, pan.y];
    let rotate = '0deg';
    let imageStyle = {transform: [{translateY}, {rotate}, {scale}]};

    return (
      <GestureRecognizer
        onSwipe={(direction, state) => this.onSwipe(direction, state)}
        onSwipeUp={(state) => this.onSwipeUp(state)}
        onSwipeDown={(state) => this.onSwipeDown(state)}
        onSwipeLeft={(state) => this.onSwipeLeft(state)}
        onSwipeRight={(state) => this.onSwipeRight(state)}
        config={config}
        style={{
          flex: 1,
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
          backgroundColor: this.state.backgroundColor
        }}>
          <Animated.View style={imageStyle}>
            <Image source={{uri: this.props.data}} style={styles.page} resizeMode='contain' />
          </Animated.View>
      </GestureRecognizer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#48B2E2',
  },
  page: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
});
