import * as Actions from '../../js/actions/settings';
import reducer from '../../js/reducers/settings';

describe('settings_reducer', () => {

  const expectedInitialState = {
    autoShare: false,
    idfv: null
  };

  it('initial state is as expected', () => {
    expect(
      reducer(undefined, {})
    ).toEqual(expectedInitialState);
  });

  it('handles UPDATE_SETTINGS_AUTO_SHARE properly', () => {
    expect(
      reducer({}, {
        type: Actions.UPDATE_SETTINGS_AUTO_SHARE,
        autoShare: true
      })
    ).toEqual({
      ...expectedInitialState,
      autoShare: true
    });

    expect(
      reducer({ autoShare: true }, {
        type: Actions.UPDATE_SETTINGS_AUTO_SHARE,
        autoShare: false
      })
    ).toEqual({
      ...expectedInitialState,
      autoShare: false
    });
  });

  it('handles UPDATE_SETTINGS_IDFV properly', () => {
    const idfv = "some idfv";
    expect(
      reducer({}, {
        type: Actions.UPDATE_SETTINGS_IDFV,
        idfv
      })
    ).toEqual({
      ...expectedInitialState,
      idfv: idfv
    });
  })
});
