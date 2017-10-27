/*
 * These actions are separated from app here only to make them mockable in jest
 */
export const CONFIRMATION_SET_CONFIRMATION_ACCEPT = 'confirmation/CONFIRMATION_SET_CONFIRMATION_ACCEPT';
export const CONFIRMATION_SET_CONFIRMATION_REJECT = 'confirmation/CONFIRMATION_SET_CONFIRMATION_REJECT';

export function setConfirmationAcceptAction(fun) {
  return { type: CONFIRMATION_SET_CONFIRMATION_ACCEPT, accept: fun };
}

export function setConfirmationRejectAction(fun) {
  return { type: CONFIRMATION_SET_CONFIRMATION_REJECT, reject: fun };
}
