const initialState = {
  isLoggedIn: localStorage.getItem("token") ? true : false,
  user: {},
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "AUTH_SUCCESS":
      return {
        isLoggedIn: true,
        user: action.user,
      };

    case "REGISTRATION_SUCCESS":
      return {
        isLoggedIn: true,
        user: action.user,
      };

    case "login":
      return {
        ggwp: "Yeah boi",
      };

    case "LOGOUT":
      // return initialState;
      return {
        isLoggedIn: false,
        user: {},
      };

    default:
      return state;
  }
};

export default authReducer;
