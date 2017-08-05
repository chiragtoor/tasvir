import * as Actions from '../../js/actions/settings';

describe('settings_actions', () => {
  it('correctly creates UPDATE_SETTINGS_AUTO_SHARE action', () => {
    const expectedAction = {
      type: Actions.UPDATE_SETTINGS_AUTO_SHARE,
      autoShare: true
    }
    expect(Actions.updateAutoShare(true)).toEqual(expectedAction);
  });
});
