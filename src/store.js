import { legacy_createStore as createStore } from 'redux';

const initialState = {
  sidebarShow: true,
  theme: 'light',
};

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest };
    default:
      return state;
  }
};

const store = createStore(changeState);
export default store;

// 2nd
// import { legacy_createStore as createStore } from 'redux';

// const initialState = {
//   sidebarShow: true,
//   theme: 'light',
//   roleRoutes: {
//     'Master Admin': '/master-admin/dashboard',
//     'Master User': '/master-admin/dashboard',
//     'Project Admin': '/project-admin/dashboard',
//     'Project Engineer': '/project-admin/dashboard',
//     'Service Admin': '/service-admin/dashboard',
//     'Service User': '/service-admin/dashboard',
//     'Site Technician': '/service-admin/dashboard',
//     'Client Admin': '/client-admin/dashboard',
//     'Client Technician': '/client-admin/dashboard',
//   },
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

// 3rd

// import { legacy_createStore as createStore } from 'redux';

// const initialState = {
//   sidebarShow: true,
//   theme: 'light',
//   userInfo: JSON.parse(localStorage.getItem('loggedInUser')) || null, // store user info
// };

// const reducer = (state = initialState, action) => {
//   switch (action.type) {
//     case 'set':
//       return { ...state, ...action.payload };
//     case 'USER_LOGIN':
//       return { ...state, userInfo: action.payload };
//     case 'USER_LOGOUT':
//       return { ...state, userInfo: null };
//     default:
//       return state;
//   }
// };

// const store = createStore(reducer);
// export default store; // Ensure we are exporting the store as default
