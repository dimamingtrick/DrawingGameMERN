import { useState } from "react";

export default function todoListPageHook(initialState) {
  const [state, setState] = useState(initialState);
  const updateState = newState => {
    setState({ ...state, ...newState });
  };
  return [state, updateState];
}
