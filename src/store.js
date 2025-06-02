import { legacy_createStore as createStore } from "redux";

localStorage.removeItem("theme");
localStorage.setItem("theme", "dark");

// Get userInfo from localStorage
const initialState = {
  theme: "dark",
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
  authtoken: localStorage.getItem("authtoken")
    ? JSON.parse(localStorage.getItem("authtoken"))
    : null,
};

// Reducer function
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "EMP_SIGNIN":
      return { ...state, userInfo: action.payload, authtoken: action.token };

    case "EMP_SIGNOUT":
      localStorage.removeItem("userInfo");
      localStorage.removeItem("authtoken");
      return { ...state, userInfo: action.payload, authtoken: action.token };

    case "set":
      return { ...state, ...action.payload };

    default:
      return state;
  }
};

// Create Redux store
const store = createStore(reducer);

export default store;
