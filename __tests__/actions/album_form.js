import * as Actions from '../../js/actions/album_form';

describe('album_form_actions', () => {
  it('correctly creates UPDATE_ALBUM_NAME action', () => {
    const name = "Test Album";
    const expectedAction = {
      type: Actions.UPDATE_ALBUM_NAME,
      name
    }
    expect(Actions.updateName(name)).toEqual(expectedAction);
  });
});
