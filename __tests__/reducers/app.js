import * as Actions from '../../js/actions/app';
import reducer from '../../js/reducers/app';

describe('app_reducer', () => {
  const expectedInitialState = {
    autoShare: false,
    senderId: null,
    savedPhotos: [],
    imageReceivedFlag: false,
    albumFormState: Actions.APP_ALBUM_FORM_STATE_INIT
  };

  it('initial state is as expected', () => {
    expect(
      reducer(undefined, {})
    ).toEqual(expectedInitialState);
  });

  it('handles APP_UPDATE_AUTO_SHARE properly', () => {
    expect(
      reducer({}, {
        type: Actions.APP_UPDATE_AUTO_SHARE,
        autoShare: true
      })
    ).toEqual({
      ...expectedInitialState,
      autoShare: true
    });

    expect(
      reducer({ autoShare: true }, {
        type: Actions.APP_UPDATE_AUTO_SHARE,
        autoShare: false
      })
    ).toEqual({
      ...expectedInitialState,
      autoShare: false
    });
  });

  it('handles APP_UPDATE_SENDER_ID properly', () => {
    const senderId = "some sender id";
    expect(
      reducer({}, {
        type: Actions.APP_UPDATE_SENDER_ID,
        senderId
      })
    ).toEqual({
      ...expectedInitialState,
      senderId: senderId
    });
  });

  it('handles APP_LOAD_SAVED_PHOTOS properly', () => {
    const savedPhotos = ["4", "3", "1"];
    expect(
      reducer({}, {
        type: Actions.APP_LOAD_SAVED_PHOTOS,
        savedPhotos
      })
    ).toEqual({
      ...expectedInitialState,
      savedPhotos: savedPhotos
    });
  });

  it('handles APP_ADD_SAVED_PHOTO properly', () => {
    const savedPhotos = ["4", "3", "1"];
    const photo = "5";
    expect(
      reducer({ savedPhotos: savedPhotos }, {
        type: Actions.APP_ADD_SAVED_PHOTO,
        photo
      })
    ).toEqual({
      ...expectedInitialState,
      savedPhotos: [...savedPhotos, photo]
    });
  });

  it('handles APP_UPDATE_RECEIVED_IMAGE_FLAG properly', () => {
    expect(
      reducer({ imageReceivedFlag: true }, {
        type: Actions.APP_UPDATE_RECEIVED_IMAGE_FLAG,
        flag: false
      })
    ).toEqual({
      ...expectedInitialState,
      imageReceivedFlag: false
    });
  });

  it('handles APP_OPEN_ALBUM_FORM properly', () => {
    expect(
      reducer({ albumFormState: Actions.APP_ALBUM_FORM_STATE_INIT }, {
        type: Actions.APP_OPEN_ALBUM_FORM
      })
    ).toEqual({
      ...expectedInitialState,
      albumFormState: Actions.APP_ALBUM_FORM_STATE_OPEN
    });
  });

  it('handles APP_RESET_ALBUM_FORM properly', () => {
    expect(
      reducer({ albumFormState: Actions.APP_ALBUM_FORM_STATE_OPEN }, {
        type: Actions.APP_RESET_ALBUM_FORM
      })
    ).toEqual({
      ...expectedInitialState,
      albumFormState: Actions.APP_ALBUM_FORM_STATE_INIT
    });
  });
});