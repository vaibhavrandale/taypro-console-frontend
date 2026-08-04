// import { legacy_createStore as createStore } from "redux";

// localStorage.removeItem("theme");
// localStorage.setItem("theme", "dark");

// // Get userInfo from localStorage
// const initialState = {
//   theme: "dark",
//   userInfo: localStorage.getItem("userInfo")
//     ? JSON.parse(localStorage.getItem("userInfo"))
//     : null,
//   authtoken: localStorage.getItem("authtoken")
//     ? JSON.parse(localStorage.getItem("authtoken"))
//     : null,
//   robots: localStorage.getItem("robots")
//     ? JSON.parse(localStorage.getItem("robots"))
//     : null,
//   gateways: localStorage.getItem("gateways")
//     ? JSON.parse(localStorage.getItem("gateways"))
//     : null,
// };

// // Reducer function
// const reducer = (state = initialState, action) => {
//   switch (action.type) {
//     case "EMP_SIGNIN":
//       return { ...state, userInfo: action.payload, authtoken: action.token };

//     case "EMP_SIGNOUT":
//       localStorage.removeItem("userInfo");
//       localStorage.removeItem("authtoken");
//       localStorage.removeItem("robots");
//       localStorage.removeItem("gateways");
//       return {
//         ...state,
//         userInfo: action.payload,
//         authtoken: action.token,
//       };

//     case "set":
//       return { ...state, ...action.payload };

//     default:
//       return state;
//   }
// };

// // Create Redux store
// const store = createStore(reducer);

// export default store;

import { legacy_createStore as createStore } from "redux";
import { connectSocket, disconnectSocket } from "./components/Socket";

localStorage.removeItem("theme");
localStorage.setItem("theme", "dark");

// Auth token = HttpOnly cookie (set by /auth/sign-in).
// userInfo = Redux only (Login.js) — not localStorage.
const initialState = {
  theme: "dark",
  userInfo: null,
  robots: localStorage.getItem("robots")
    ? JSON.parse(localStorage.getItem("robots"))
    : null,
  gateways: localStorage.getItem("gateways")
    ? JSON.parse(localStorage.getItem("gateways"))
    : null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "EMP_SIGNIN":
      // Cookie already set by sign-in; open authenticated socket
      queueMicrotask(() => connectSocket());
      return {
        ...state,
        userInfo: action.payload,
      };

    case "EMP_SIGNOUT":
      localStorage.removeItem("robots");
      localStorage.removeItem("gateways");
      queueMicrotask(() => disconnectSocket());
      return {
        ...state,
        userInfo: null,
        robots: null,
        gateways: null,
      };

    case "set":
      return { ...state, ...action.payload };

    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;
