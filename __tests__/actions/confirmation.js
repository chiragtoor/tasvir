import * as Actions from '../../js/actions/confirmation';

describe('confirmation_actions', () => {
  it('setConfirmationAcceptAction() dispatches CONFIRMATION_SET_CONFIRMATION_ACCEPT', () => {
    const accept = (() => true);
    const expectedAction = {
      type: Actions.CONFIRMATION_SET_CONFIRMATION_ACCEPT,
      accept
    }
    expect(Actions.setConfirmationAcceptAction(accept)).toEqual(expectedAction);
  });

  it('setConfirmationRejectAction() dispatches CONFIRMATION_SET_CONFIRMATION_REJECT', () => {
    const reject = (() => false);
    const expectedAction = {
      type: Actions.CONFIRMATION_SET_CONFIRMATION_REJECT,
      reject
    }
    expect(Actions.setConfirmationRejectAction(reject)).toEqual(expectedAction);
  });
});
