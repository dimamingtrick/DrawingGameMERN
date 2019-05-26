import { useState } from "react";

/**
 * Custom hook for UserProfile page to edit profile fields
 * Get api function as a parameter to update data;
 */
const initialState = {
  editing: false,
  loading: false,
  data: {},
  errors: {},
};

const useProfileState = updateFunction => {
  const [state, setUpdatedState] = useState(initialState);

  const handleField = e => {
    setUpdatedState({
      ...state,
      data: {
        ...state.data,
        [e.target.name]: e.target.value,
      },
      errors: {
        ...state.errors,
        ...(state.errors[e.target.name] ? { [e.target.name]: "" } : {}),
      },
    });
  };

  const toggleEditState = () => {
    setUpdatedState({ ...state, editing: !state.editing });
  };

  const updateData = () => {
    setUpdatedState({ ...state, loading: true });
    updateFunction({ data: state.data }).then(
      () => {
        setUpdatedState({ ...state, editing: false, loading: false });
      },
      errors => {
        setUpdatedState({ ...state, loading: false, errors });
      }
    );
  };

  const closeEditForm = () => {
    setUpdatedState(initialState);
  };

  return [state, handleField, toggleEditState, updateData, closeEditForm];
};

export default useProfileState;
