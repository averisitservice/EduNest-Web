// third-party
import { createSlice } from '@reduxjs/toolkit';
import utils from 'src/utils/utils';

// initial state
const initialState = {
  loggedInTeacher: null,
  sessionToken: null,
  refreshToken: null,
  tenantDetail: {},
  isLoggedIn: false,
};

// ==============================|| SLICE - MENU ||============================== //

const AuthReducer = createSlice({
  name: 'AuthReducer',
  initialState: initialState,
  reducers: {
    login(state, action) {
      const { teacher, token } = action.payload;
      state.loggedInTeacher = teacher;
      state.sessionToken = token.session;
      state.refreshToken = token.refresh;
      state.isLoggedIn = true;
      utils.setTokensToStorage(token);
      localStorage.setItem("Teacher", JSON.stringify(teacher));
    },

    setTokens(state, action) {
      const { token } = action.payload;

      if (token) {
        state.sessionToken = token?.session;
        if (token?.refresh != null) {
          state.refreshToken = token.refresh;
        }
      } else {
        state.isLoading = false;
      }
    },
    setAuthDetail(state, action) {
      const { user, token } = action.payload;

      state.sessionToken = token.session;
      if (token.refresh) {
        state.refreshToken = token.refresh;
      }

      if (user) {
        state.user = user;
      }
    },
    setTenantDetail(state, action) {
      state.tenantDetail = action.payload;
    },
    logout(state) {
      state.refreshToken = null;
      state.sessionToken = null;
      state.loggedInTeacher = null;
      state.tenantDetail = {};
      utils.removeItem("tenant");
      utils.removeItem("Tokens");
      localStorage.removeItem("Teacher");
    }
  },
});

export default AuthReducer;

export const { login, logout, setTokens, setAuthDetail, setTenantDetail } = AuthReducer.actions;
