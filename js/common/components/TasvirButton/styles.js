import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
  buttonContainer: {
    marginLeft: 20,
    marginRight: 20,
    overflow: 'hidden',
    borderRadius: 50,
    backgroundColor: '#48B2E2',
    alignSelf: 'stretch'
  },
  redButtonContainer: {
    marginLeft: 20,
    marginRight: 20,
    overflow: 'hidden',
    borderRadius: 50,
    backgroundColor: '#FF2C55',
    alignSelf: 'stretch'
  },
  disabledButtonContainer: {
    marginLeft: 20,
    marginRight: 20,
    overflow: 'hidden',
    borderRadius: 50,
    backgroundColor: '#9B9B9B',
    alignSelf: 'stretch'
  },
  button: {
    fontSize: 20,
    color: 'white',
    padding: 15,
    fontWeight: '500'
  },
  buttonSmall: {
    fontSize: 15,
    color: 'white',
    padding: 9,
    fontWeight: '400'
  },
  disabledButton: {
    fontSize: 20,
    color: 'white',
    padding: 15,
    fontWeight: '500'
  },
  disabledButtonSmall: {
    fontSize: 15,
    color: 'white',
    padding: 15,
    fontWeight: '400'
  }
});