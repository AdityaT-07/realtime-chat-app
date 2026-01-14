import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice.js'
import chatReducer from './slices/authSlice.js'

const store = configureStore({
  reducer: {
    auth : authReducer,
    chat : chatReducer,
  },
});

export default store;
