import * as Actions from '../../js/actions/album';

describe('group_actions', () => {
  it('correctly creates UPDATE_ALBUM_ID action', () => {
    const ALBUM_ID = "wyGqL7omNdR6DlKqe54r1yPb0VqD6MQx72B80nEmOJ4KRzkLgRkvWwVdeNlo1GpbXy3PrA9ja5QWw8GpBkzX3M2nx9AjOaEJMx2m";
    const expectedAction = {
      type: Actions.UPDATE_ALBUM_ID,
      id: ALBUM_ID
    }
    expect(Actions.updateId(ALBUM_ID)).toEqual(expectedAction);
  });

  it('correctly creates UPDATE_ALBUM_NAME action', () => {
    const ALBUM_NAME = "Test Album";
    const expectedAction = {
      type: Actions.UPDATE_ALBUM_NAME,
      name: ALBUM_NAME
    }
    expect(Actions.updateName(ALBUM_NAME)).toEqual(expectedAction);
  });
});
