import React from "react";

// helloの画面表示部分
export type Props = {
  // props の型定義
  isVisible: boolean;
  onChangeVisibility: Function;
};

export default function Hello(props: Props) {
  const { isVisible, onChangeVisibility } = props;
  return (
    <div>
      {isVisible && <div>Hello!</div>}
      <button type="button" onClick={() => onChangeVisibility()}>
        {isVisible ? "hide" : "show"}
      </button>
    </div>
  );
}
