import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Image,
  PanResponder,
  Animated
} from 'react-native';

const ACTION_LIMIT = 50;

export default class ImageScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      pan: new Animated.ValueXY(),
      scale: new Animated.Value(1)
    }
  }

  isMovingVertically = (e, gestureState) => {
    const {vy, dx} = gestureState;
    if(Math.abs(vy) > 0.3 && Math.abs(dx) < 80) {
      // notify of swiper start
      this.props.onSwipeStart();
      return true;
    } else {
      return false;
    }
  }

  _handleShouldSetPanResponder(evt, gestureState) {
    return evt.nativeEvent.touches.length === 1 && !(Math.abs(gestureState.dx) < 5  && Math.abs(gestureState.dy) < 5);
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: this.isMovingVertically,
      onMoveShouldSetPanResponderCapture: this.isMovingVertically,
      onPanResponderGrand: (e, gestureState) => {
        // set the initial value to the current state
        this.state.pan.setOffset({x: this.state.pan.x._value, y: this.state.pan.y._valye});
        this.state.pan.setValue({x: 0, y:0});
      },
      // when we drag/pan the object, set the delegate to the states pan position
      onPanResponderMove: Animated.event([
        null, {dx: this.state.pan.x, dy: this.state.pan.y},
      ]),
      onPanResponderRelease: (e, {moveY, y0, vy, dy}) => {
        if(dy < 0 && Math.abs(dy) > ACTION_LIMIT) {
          Animated.timing(
            this.state.pan,
            {toValue: {x:0, y: -1 * Dimensions.get('window').height}, duration: 250}
          ).start(() => {
            this.props.onSwipeEnd();
            this.props.onFinish(true);
          });
        } else if(Math.abs(dy) > ACTION_LIMIT) {
          // move down
          Animated.timing(
            this.state.pan,
            {toValue: {x:0, y: Dimensions.get('window').height}, duration: 250}
          ).start(() => {
            this.props.onSwipeEnd();
            this.props.onFinish(false);
          });
        } else {
          // move back to position
          Animated.timing(
            this.state.pan,
            {toValue: {x:0, y: 0}, duration: 250}
          ).start(() => {
            this.props.onSwipeEnd();
          });
        }
      }
    });
  }

  render() {
    let {pan, scale} = this.state;
    let [translateX, translateY] = [pan.x, pan.y];
    let rotate = '0deg';
    let imageStyle = {transform: [{translateY}, {rotate}, {scale}]};
    return (
      <View style={styles.container}>
        <Animated.View style={imageStyle} {...this._panResponder.panHandlers}>
          <Image source={{uri: this.props.data}} style={styles.page} resizeMode='contain' />
        </Animated.View>
      </View>
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
