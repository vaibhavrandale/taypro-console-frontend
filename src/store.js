// import { legacy_createStore as createStore } from 'redux'

// const initialState = {
//   sidebarShow: true,
//   theme: 'light',
// }

// const changeState = (state = initialState, { type, ...rest }) => {
//   switch (type) {
//     case 'set':
//       return { ...state, ...rest }
//     default:
//       return state
//   }
// }

// const store = createStore(changeState)
// export default store

import { legacy_createStore as createStore } from 'redux';

const initialState = {
  sidebarShow: true,
  theme: 'light',
  roleRoutes: {
    'Master Admin': '/master-admin/dashboard',
    'Master User': '/master-admin/dashboard',
    'Project Admin': '/project-admin/dashboard',
    'Project Engineer': '/project-admin/dashboard',
    'Service Admin': '/service-admin/dashboard',
    'Service User': '/service-admin/dashboard',
    'Site Technician': '/service-admin/dashboard',
    'Client Admin': '/client-admin/dashboard',
    'Client Technician': '/client-admin/dashboard',
  },
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
