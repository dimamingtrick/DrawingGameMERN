import { useState } from "react";

const mainStateHook = initialState => {
  const [state, setState] = useState(initialState);
  const updateState = newState => {
    setState({ ...state, ...newState });
  };
  return [state, updateState];
};

export default mainStateHook;
