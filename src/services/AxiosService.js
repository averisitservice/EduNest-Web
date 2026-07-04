import axios from 'axios';
import _, { isNull } from 'lodash';
import { toast } from 'sonner';

import { jwtDecode } from 'jwt-decode';
import { store } from '../store';
import { logout, setTokens } from '../store/reducers/authReducer';
import constants from '../utils/constants.js';
import enums from '../utils/enums';
import utils from '../utils/utils';
import apiService from './ApiService';

const { getState, dispatch } = store;

// defaults
const baseUrl = import.meta.env.VITE_SERVER_URL;
axios.defaults.baseURL = baseUrl;

// request interceptor
axios.interceptors.request.use(
  async (config) => {
    const { AuthReducer } = getState();
    //set header if url is our api due to s3 gives error of bad request reason is token
    if (AuthReducer.sessionToken && !config.url.includes('amazonaws.com')) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${AuthReducer.sessionToken}`,
      };
    }
    return config;
  },
  (errors) => {
    return Promise.reject(errors);
  }
);

// Response interceptor
axios.interceptors.response.use(
  async (response) => {
    const { data, status } = response;
    if (_.isNil(data) && status !== enums.ApiResult.ValidationError) {
      return { data, status };
    }
    return { data: data.data };
  },
  async (errors) => {    
    const originalRequest = errors.config;

    if (
      errors.status === enums.ApiResult.ValidationError ||
      errors.status === enums.ApiResult.BadRequest ||
      errors.status === enums.ApiResult.NotFound
    ) {
      const validationErrors = errors.response.data.errors;
      return { data: errors.response.data.data ? errors.response.data.data : null, errors: validationErrors };
    }
    if (errors.status === enums.ApiResult.Forbidden) {
      const errorMessage = errors.response.data.errors[0];
      toast.error(errorMessage && errorMessage.msg);
      return { data: null, errors: errorMessage };
    }

    if (errors && errors.status === enums.ApiResult.AccessDenied && !originalRequest._retry) {
      originalRequest._retry = true;
      const isTokenUpdated = await refreshTokens();

      if (isTokenUpdated) {
        return await axios(originalRequest);
      } else {
        dispatch(logout());
        toast.error(constants.defaultErrorMessage);
        return { data: null };
      }
    }

    toast.error(constants.defaultErrorMessage);
    return { data: null };
  }
);

// refresh token
async function refreshTokens() {
  const { AuthReducer } = getState();

  let { sessionToken, refreshToken } = AuthReducer;

  if (isNull(sessionToken) || isNull(refreshToken)) {
    return false;
  }

  // todo:: changes refresh code according new axios service
  const { userId } = jwtDecode(sessionToken);
  const { data } = await apiService.renewSessionAsync({ userId, refreshToken });
  if (data && data?.token?.session) {
    refreshToken = data?.token?.refresh;
    utils.setTokensToStorage({ refresh: refreshToken, session: data?.token?.session });
    dispatch(setTokens({ token: { refresh: refreshToken, session: data?.token?.session } }));
    return true;
  }

  return false;
}