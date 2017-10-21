import * as Storage from '../storage';

export const UPDATE_SETTINGS_AUTO_SHARE = 'settings/UPDATE_SETTINGS_AUTO_SHARE';
export const UPDATE_SETTINGS_IDFV = 'settings/UPDATE_SETTINGS_IDFV';

export function updateAutoShare(autoShare) {
  Storage.saveAutoShare(autoShare);
  return { type: UPDATE_SETTINGS_AUTO_SHARE, autoShare };
}

export function updateIDFV(idfv, persist = false) {
  if (persist) {
    Storage.saveIDFV(idfv);
  }
  return { type: UPDATE_SETTINGS_IDFV, idfv };
}
