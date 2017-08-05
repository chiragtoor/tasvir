import * as Actions from '../../js/actions/settings';
import reducer from '../../js/reducers/settings';

describe('settings_reducer', () => {
  it('initial state is as expected', () => {
    expect(
      reducer(undefined, {})
    ).toEqual({
      autoShare: false
    });
  });

  it('handles UPDATE_SETTINGS_AUTO_SHARE properly', () => {
    expect(
      reducer({}, {
        type: Actions.UPDATE_SETTINGS_AUTO_SHARE,
        autoShare: true
      })
    ).toEqual({
      autoShare: true
    });

    expect(
      reducer({ autoShare: true }, {
        type: Actions.UPDATE_SETTINGS_AUTO_SHARE,
        autoShare: false
      })
    ).toEqual({
      autoShare: false
    });
  });
});
