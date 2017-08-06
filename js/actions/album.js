export const UPDATE_ALBUM_ID = 'album/UPDATE_ALBUM_ID';
export const UPDATE_ALBUM_NAME = 'album/UPDATE_ALBUM_NAME';

export function updateId(id) {
  return { type: UPDATE_ALBUM_ID, id };
}

export function updateName(name) {
  return { type: UPDATE_ALBUM_NAME, name };
}
