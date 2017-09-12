import * as Actions from '../../js/actions/settings';

describe('settings_actions', () => {
  it('correctly creates UPDATE_SETTINGS_AUTO_SHARE action', () => {
    expect(Actions.updateAutoShare(true)).toEqual({
      type: Actions.UPDATE_SETTINGS_AUTO_SHARE,
      autoShare: true
    });
    expect(Actions.updateAutoShare(false)).toEqual({
      type: Actions.UPDATE_SETTINGS_AUTO_SHARE,
      autoShare: false
    });
  });
});
