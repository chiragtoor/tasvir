import * as Actions from '../../js/actions/album_form';

describe('album_form_actions', () => {
  it('updateName() dispatches UPDATE_ALBUM_NAME', () => {
    const name = "Test Album";
    const expectedAction = {
      type: Actions.UPDATE_ALBUM_NAME,
      name
    }
    expect(Actions.updateName(name)).toEqual(expectedAction);
  });

  it('reset() dispatches RESET_ALBUM_FORM', () => {
    const expectedAction = {
      type: Actions.RESET_ALBUM_FORM
    }
    expect(Actions.reset()).toEqual(expectedAction);
  });

  it('initAlbumForm() dispatches UPDATE_ALBUM_FORM_STATE', () => {
    const expectedAction = {
      type: Actions.UPDATE_ALBUM_FORM_STATE,
      state: Actions.FORM_STATE
    }
    expect(Actions.initAlbumForm()).toEqual(expectedAction);
  });
});
