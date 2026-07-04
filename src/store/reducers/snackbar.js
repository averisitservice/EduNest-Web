import { createSlice } from '@reduxjs/toolkit';
import enums from 'src/utils/enums';

const initialState = {
  action: false,
  open: false,
  message: '',
  anchorOrigin: {
    vertical: 'top',
    horizontal: 'center',
  },
  variant: 'alert',
  alert: {
    color: 'primary',
    variant: 'filled',
  },
  transition: 'Fade',
  close: true,
  actionButton: false,
  type: null,
};

// ==============================|| SLICE - SNACKBAR ||============================== //

const snackbar = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    successSnackbar(state, action) {
      state.open = true;
      state.message = action.payload;
      state.type = enums.snackbar.type.success;
      state.alert = {
        color: 'success',
        variant: initialState.alert.variant,
      };
    },

    errorSnackbar(state, action) {
      state.open = true;
      state.message = action.payload;
      state.type = enums.snackbar.type.error;
      state.alert = {
        color: 'error',
        variant: initialState.alert.variant,
      };
    },

    infoSnackbar(state, action) {
      state.open = true;
      state.message = action.payload;
      state.type = enums.snackbar.type.info;
      state.alert = {
        color: 'info',
        variant: initialState.alert.variant,
      };
    },

    warningSnackbar(state, action) {
      state.open = true;
      state.message = action.payload;
      state.type = enums.snackbar.type.warning;
      state.alert = {
        color: 'warning',
        variant: initialState.alert.variant,
      };
    },

    closeSnackbar(state) {
      state.open = false;
    },
  },
});

export default snackbar.reducer;

export const snackbarReducerActions = snackbar.actions;
