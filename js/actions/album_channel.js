/*
 * These actions are separated from album here only to make them mockable in jest
 */
import { Socket } from 'phoenix';

import { SOCKET_URL } from '../constants';
/*
 * Below we deal with the current phoneix channel subscription so that we can
 *  have real-time album events come in
 */
 // socket and channel are global as the same instance needs to be accessed
 //  across both actions and placing them in redux state causes test issues
 //  because Socket cannot be properly mocked
const socket = new Socket(SOCKET_URL);
const CHANNEL_PREFACE = "album:";
const CHANNEL_PHOTO = "new:photo";
let channel = null;

export function joinChannel() {
  return (dispatch, getState) => {
    const { album: { id }, app: { senderId } } = getState();
    if(id != null) {
      socket.connect();
      channel = socket.channel(CHANNEL_PREFACE + id, {});
      channel.join();
      channel.on(CHANNEL_PHOTO, (msg) => {
        // all images are broadcast in channel, even own captured ones
        //  use senderId to make sure we do not duplicate save own photos
        //  through channel
        if(!(msg.sent_by === senderId)) {
          CameraRoll.saveToCameraRoll(msg.photo).then((uri) => {
            dispatch(addImage(uri));
            // flag the animation on the camera gallery button
            dispatch(App.flagImageReceivedFromChannel());
            dispatch(Gallery.loadGallery());
          });
        }
      });
    }
  }
}

export function leaveChannel() {
  return (dispatch) => {
    if(channel != null) channel.leave();
    if(socket != null) socket.disconnect();
  }
}
