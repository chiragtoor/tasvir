import * as Actions from '../../js/actions/reel';

describe('reel_actions', () => {
  it('updateCurrentIndex() dispatches UPDATE_CURRENT_INDEX', () => {
    const currentIndex = 4;
    const expectedAction = {
      type: Actions.UPDATE_CURRENT_INDEX,
      currentIndex
    }
    expect(Actions.updateCurrentIndex(currentIndex)).toEqual(expectedAction);
  });

  it('loadPreviewReel() dispatches LOAD_PREVIEW_REEL', () => {
    const previewReel = [0, 1, 2];
    const expectedAction = {
      type: Actions.LOAD_PREVIEW_REEL,
      previewReel
    }
    expect(Actions.loadPreviewReel(previewReel)).toEqual(expectedAction);
  });

  it('addImage() dispatches REEL_ADD_IMAGE', () => {
    const image = "some image";
    const expectedAction = {
      type: Actions.REEL_ADD_IMAGE,
      image
    }
    expect(Actions.addImage(image)).toEqual(expectedAction);
  });

  it('removeImage() dispatches REEL_REMOVE_IMAGE', () => {
    const index = 2;
    const expectedAction = {
      type: Actions.REEL_REMOVE_IMAGE,
      index
    }
    expect(Actions.removeImage(index)).toEqual(expectedAction);
  });
});
