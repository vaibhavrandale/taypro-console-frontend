const initialAuthState = {
  theme: 'light',
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
};

// Auth Reducer
const authReducer = (state = initialAuthState, action) => {
  switch (action.type) {
    case 'EMP_SIGNIN':
      return { ...state, userInfo: action.payload };

    case 'EMP_SIGNOUT':
      localStorage.removeItem('userInfo');
      return { ...state, userInfo: null };

    default:
      return state;
  }
};

export default authReducer;
