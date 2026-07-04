// third-party
import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
  lookupData: [],
  defaultPaymentMethod: {},
  paymentMethod: {},
  isAppDataInitialized: false,
};

// ==============================|| SLICE - MENU ||============================== //

const AppReducer = createSlice({
  name: 'AppReducer',
  initialState: initialState,
  reducers: {
    setDefaultPaymentMethod(state, action) {
      const { defaultPaymentMethod } = action.payload;
      state.defaultPaymentMethod = defaultPaymentMethod;
    },
    setPaymentMethod(state, action) {
      state.paymentMethod = action.payload;
    },
    setLookupData(state, action) {
      const { lookupData } = action.payload;
      state.lookupData = lookupData;
    },
    setIsAppDataInitialized(state, action) {
      state.isAppDataInitialized = action.payload;
    },
  },
});
export default AppReducer;

export const {
  setDefaultPaymentMethod,
  setPaymentMethod,
  setLookupData,
  setIsAppDataInitialized,
} = AppReducer.actions;
