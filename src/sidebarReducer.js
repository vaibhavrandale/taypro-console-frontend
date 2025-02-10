const initialSidebarState = {
  sidebarShow: true,
  sidebarUnfoldable: false,
};

// Sidebar Reducer
const sidebarReducer = (state = initialSidebarState, action) => {
  switch (action.type) {
    case 'SET_SIDEBAR_SHOW':
      return { ...state, sidebarShow: action.payload };

    case 'SET_SIDEBAR_UNFOLDABLE':
      return { ...state, sidebarUnfoldable: action.payload };

    default:
      return state;
  }
};

export default sidebarReducer;
