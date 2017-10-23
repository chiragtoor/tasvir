import * as Actions from '../../js/actions/album_form';
import reducer from '../../js/reducers/album_form';

describe('album_form_reducer', () => {

  const expectedInitialState = {
    name: "",
    formState: Actions.INIT_STATE
  };

  it('initial state is as expected', () => {
    expect(
      reducer(undefined, {})
    ).toEqual(expectedInitialState);
  });

  it('handles UPDATE_ALBUM_NAME properly', () => {
    const name = "Test Album";
    expect(
      reducer({}, {
        type: Actions.UPDATE_ALBUM_NAME,
        name
      })
    ).toEqual({
      ...expectedInitialState,
      name: name
    });
  });

  it('handles UPDATE_ALBUM_FORM_STATE properly', () => {
    expect(
      reducer({formState: Actions.INIT_STATE}, {
        type: Actions.UPDATE_ALBUM_FORM_STATE,
        state: Actions.FORM_STATE
      })
    ).toEqual({
      ...expectedInitialState,
      formState: Actions.FORM_STATE
    });
  });

  it('handles RESET_ALBUM_FORM properly', () => {
    expect(
      reducer({formState: Actions.FORM_STATE, name: "Album"}, {
        type: Actions.RESET_ALBUM_FORM
      })
    ).toEqual({
      ...expectedInitialState
    });
  });
});
