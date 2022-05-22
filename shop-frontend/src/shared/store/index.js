import { configureStore } from '@reduxjs/toolkit';
import modalReducer from './modal-slice';

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  reducer: {
    modal: modalReducer,
  },
});
