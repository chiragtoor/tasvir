import * as Actions from '../../js/actions/album';
import reducer from '../../js/reducers/album';

describe('album_reducer', () => {
  it('initial state is as expected', () => {
    expect(
      reducer(undefined, {})
    ).toEqual({
      name: null,
      id: null
    });
  });

  it('handles UPDATE_ALBUM_NAME properly', () => {
    const NAME = "Test Album";
    expect(
      reducer({}, {
        type: Actions.UPDATE_ALBUM_NAME,
        name: NAME
      })
    ).toEqual({
      name: NAME,
      id: null
    });

    const NEW_ALBUM = "Other Test Album";
    expect(
      reducer({ name: NAME }, {
        type: Actions.UPDATE_ALBUM_NAME,
        name: NEW_ALBUM
      })
    ).toEqual({
      name: NEW_ALBUM,
      id: null
    });
  });

  it('handles UPDATE_ALBUM_ID properly', () => {
    const ID = "wyGqL7omNdR6DlKqe54r1yPb0VqD6MQx72B80nEmOJ4KRzkLgRkvWwVdeNlo1GpbXy3PrA9ja5QWw8GpBkzX3M2nx9AjOaEJMx2m";
    expect(
      reducer({}, {
        type: Actions.UPDATE_ALBUM_ID,
        id: ID
      })
    ).toEqual({
      name: null,
      id: ID
    });

    const NEW_ID = "e89j8wXnRzD635AB4Ne10dxEjK6KDMWaLNokjX9p1JAzO38egyxYwRmqV7BGPlbEnydQ052x4rkaqbWVmo9Q2r7JLPGpylMOEodQ";
    expect(
      reducer({ id: ID }, {
        type: Actions.UPDATE_ALBUM_ID,
        id: NEW_ID
      })
    ).toEqual({
      name: null,
      id: NEW_ID
    });
  });
});
