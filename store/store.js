import { configureStore } from '@reduxjs/toolkit';
import productSliceReducer from './slices/productSlice';
import userSliceReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    product: productSliceReducer,
    user: userSliceReducer,
  },
});
