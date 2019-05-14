import { useState } from "react";

/**
 * Custom hook for UserProfile page to edit profile fields
 * Get api function as a parameter to update data;
 */
const useProfileState = updateFunction => {
  const [state, setUpdatedState] = useState({
    editing: false,
    loading: false,
    data: {},
    errors: {}
  });

  const handleField = e => {
    setUpdatedState({
      ...state,
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
    setUpdatedState({ ...state, editing: !state.editing });
  };

  const updateData = () => {
    setUpdatedState({ ...state, loading: true });
    updateFunction({ data: state.data, errors: {} }).then(
      () => {
        setUpdatedState({ ...state, editing: false, loading: false });
      },
      errors => {
        setUpdatedState({ ...state, loading: false, errors });
      }
    );
  };

  return [state, handleField, toggleEditState, updateData];
};

export default useProfileState;
