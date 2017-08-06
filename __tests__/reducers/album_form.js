import * as Actions from '../../js/actions/album_form';
import reducer from '../../js/reducers/album_form';

describe('album_form_reducer', () => {
  it('initial state is as expected', () => {
    expect(
      reducer(undefined, {})
    ).toEqual({
      name: ""
    });
  });

  it('handles UPDATE_ALBUM_NAME properly', () => {
    const name = "Test Album";
    expect(
      reducer({}, {
        type: Actions.UPDATE_ALBUM_NAME,
        name
      })
    ).toEqual({
      name: name
    });

    expect(
      reducer({name: "Old Album"}, {
        type: Actions.UPDATE_ALBUM_NAME,
        name
      })
    ).toEqual({
      name: name
    });
  });
});
