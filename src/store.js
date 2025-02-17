// 1st
// import { legacy_createStore as createStore } from 'redux';

// const initialState = {
//   sidebarShow: true,
//   theme: 'light',
// };

// const changeState = (state = initialState, { type, ...rest }) => {
//   switch (type) {
//     case 'set':
//       return { ...state, ...rest };
//     default:
//       return state;
//   }
// };

// const store = createStore(changeState);
// export default store;

// working

import { legacy_createStore as createStore } from 'redux';

// Get userInfo from localStorage
const initialState = {
  // sidebarShow: true,
  theme: 'light',
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
  authtoken: localStorage.getItem('authtoken')
    ? JSON.parse(localStorage.getItem('authtoken'))
    : null,
};

// Reducer function
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'EMP_SIGNIN':
      return { ...state, userInfo: action.payload };

    case 'EMP_SIGNOUT':
      localStorage.removeItem('userInfo'); // Remove from localStorage
      return { ...state, userInfo: null };

    case 'set':
      return { ...state, ...action.payload };

    default:
      return state;
  }
};

// Create Redux store
const store = createStore(reducer);

export default store;
