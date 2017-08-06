import { StyleSheet, Dimensions } from 'react-native';

export default styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1
  },
  swiper: {
    backgroundColor: "#48B2E2"
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  menu: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  menuHeader: {
    height: 100,
    width: Dimensions.get('window').width,
    backgroundColor: "#48B2E2",
    justifyContent: 'center',
    alignItems: 'center'
  },
  margin: {
    height: 50,
    width: 50
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '600',
    marginTop: 5
  },
  menuOptions: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10
  },
  menuOptionDivider: {
    height: 1,
    backgroundColor: '#EFEFEF',
    marginTop: 10,
    marginBottom: 10
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#EFEFEF',
    marginTop: 10
  },
  groupNameInput: {
    flex: 1,
    height: 50,
    fontSize: 20,
    textAlign: 'center'
  },
  createGroupMenu: {
    width: Dimensions.get('window').width,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textView: {
    width: Dimensions.get('window').width,
  },
  noGroupMenu: {
    width: Dimensions.get('window').width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginLeft: 20,
    marginRight: 20,
    alignItems: 'center'
  },
  textInputLine: {
    height: 1,
    backgroundColor: '#EFEFEF',
    marginLeft: 20,
    marginRight: 20,
  },
  groupNameInput: {
    flex: 1,
    height: 30,
    fontSize: 20
  },
  captureBorder: {
    borderRadius: 30,
    height: 60,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#FFFFFF"
  },
  captureButton: {
    borderRadius: 25,
    height: 50,
    width: 50,
    backgroundColor: "#48B2E2"
  },
  groupName: {
    fontSize: 20,
    color: '#4A4A4A'
  },
  groupNameContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10
  },
  groupOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10
  }
});
