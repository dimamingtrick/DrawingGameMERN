import { useState } from "react";

const profileHooks = updateFunction => {
  const [state, setUpdatedState] = useState({
    editing: false,
    loading: false,
    data: {},
    errors: {}
  });

  const setState = newState => {
    setUpdatedState({ ...state, ...newState });
  };

  const handleField = e => {
    setState({
      data: {
        ...state.data,
        [e.target.name]: e.target.value
      },
      errors: {
        ...state.errors,
        ...(state.errors[e.target.name] ? { [e.target.name]: "" } : {})
      }
    });
  };

  const toggleEditState = () => {
    setState({ editing: !state.editing });
  };

  const updateData = () => {
    setState({ loading: true });
    updateFunction({ data: state.data, errors: {} }).then(
      () => {
        setState({ editing: false, loading: false });
      },
      errors => {
        setState({ loading: false, errors });
      }
    );
  };

  return [state, handleField, toggleEditState, updateData];
};

export default profileHooks;
