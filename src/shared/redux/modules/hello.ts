/**
 * Action types
 * 仕様書
 */
const HELLO_CHANGE_VISIBILITY = "redux-pluto/hello/visibility/change"; // 表示・非表示を切り替える Action の type

type ChangeVisibility = {
  type: typeof HELLO_CHANGE_VISIBILITY;
};

type Action = ChangeVisibility;

/**
 * Action creators
 * 仕様書発行
 */
export function changeVisibility() {
  return {
    type: HELLO_CHANGE_VISIBILITY,
  };
}

/**
 * Initial state
 */
// module 内で管理する state の型
export type State = {
  isVisible: boolean;
};

// store に展開される初期値
const INITIAL_STATE = {
  isVisible: true,
};

/**
 * Reducer
 * 製造工程
 */
export default function(state: State = INITIAL_STATE, action: Action): State {
  switch (action.type) {
    case HELLO_CHANGE_VISIBILITY: {
      return {
        ...state,
        isVisible: !state.isVisible,
      };
    }
    default: {
      return state;
    }
  }
}
