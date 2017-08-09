export const UPDATE_ALBUM_NAME = 'UPDATE_ALBUM_NAME';
export const RESET_ALBUM_FORM = 'RESET_ALBUM_FORM';


export const UPDATE_ALBUM_FORM_STATE = 'UPDATE_ALBUM_FORM_STATE';
export const INIT_STATE = 'INIT_STATE';
export const FORM_STATE = 'FORM_STATE';

export function updateName(name) {
  return { type: UPDATE_ALBUM_NAME, name };
}

export function reset() {
  return { type: RESET_ALBUM_FORM };
}

export function initAlbumForm() {
  return { type: UPDATE_ALBUM_FORM_STATE, state: FORM_STATE };
}
