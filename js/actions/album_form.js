export const UPDATE_ALBUM_NAME = 'UPDATE_ALBUM_NAME';
export const RESET_ALBUM_FORM = 'RESET_ALBUM_FORM';

export function updateName(name) {
  return { type: UPDATE_ALBUM_NAME, name };
}

export function reset() {
  return { type: RESET_ALBUM_FORM };
}
