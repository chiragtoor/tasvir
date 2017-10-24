import * as Actions from '../../js/actions/reel';
import reducer from '../../js/reducers/reel';

import {BASE_REEL, POST_ACTION_SCROLL} from '../../js/constants';

describe('reel_reducer', () => {

  const expectedInitialState = {
    previewReel: [],
    currentIndex: 1
  };

  it('initial state is as expected', () => {
    expect(
      reducer(undefined, {})
    ).toEqual(expectedInitialState);
  });

  it('handles LOAD_PREVIEW_REEL properly', () => {
    const previewReel = [1, 2, 3];
    expect(
      reducer({}, {
        type: Actions.LOAD_PREVIEW_REEL,
        previewReel
      })
    ).toEqual(
      {
        ...expectedInitialState,
        previewReel: previewReel
      }
    );
  });

  it('handles REEL_ADD_IMAGE properly', () => {
    const previewReel = [1, 2, 3];
    expect(
      reducer({
        previewReel: previewReel
      }, {
        type: Actions.REEL_ADD_IMAGE,
        image: 4
      })
    ).toEqual(
      {
        ...expectedInitialState,
        previewReel: [4, 1, 2, 3]
      }
    );
  });

  it('handles REEL_REMOVE_IMAGE properly', () => {
    const previewReel = [1, 2, 3, 4];
    expect(
      reducer({
        previewReel: previewReel
      }, {
        type: Actions.REEL_REMOVE_IMAGE,
        index: 1
      })
    ).toEqual(
      {
        ...expectedInitialState,
        previewReel: [1, 3, 4]
      }
    );
  });

  it('handles UPDATE_CURRENT_INDEX properly', () => {
    const currentIndex = 3;
    expect(
      reducer({ currentIndex: 1 }, {
        type: Actions.UPDATE_CURRENT_INDEX,
        currentIndex
      })
    ).toEqual(
      {
        ...expectedInitialState,
        currentIndex: currentIndex
      }
    );
  });
});
