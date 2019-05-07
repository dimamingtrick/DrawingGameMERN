const chatReducer = (state = {}, action) => {
  switch (action.type) {
    case "login":
      return {
        ggwp: "Yeah boi",
      };

    default:
      return state;
  }
};

export default chatReducer;
