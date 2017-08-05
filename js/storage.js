import { AsyncStorage } from 'react-native';

import { AUTO_SHARE_STORAGE } from './constants';

function persist(key, value) {
  AsyncStorage.setItem(key, JSON.stringify(value));
}

export function saveAutoShare(autoShare) {
  persist(AUTO_SHARE_STORAGE, autoShare);
}
