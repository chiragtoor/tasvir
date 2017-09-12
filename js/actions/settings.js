import * as Storage from '../storage';

export const UPDATE_SETTINGS_AUTO_SHARE = 'settings/UPDATE_SETTINGS_AUTO_SHARE';

export function updateAutoShare(autoShare) {
  Storage.saveAutoShare(autoShare);
  return { type: UPDATE_SETTINGS_AUTO_SHARE, autoShare };
}
