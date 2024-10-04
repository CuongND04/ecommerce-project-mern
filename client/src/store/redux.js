import { configureStore } from "@reduxjs/toolkit";
import appSlice from "./app/appSlice";
import productSlice from "./product/productSlice.js";
import { persistReducer, persistStore } from 'redux-persist';
import userSlice from './user/userSlice';
import storage from 'redux-persist/lib/storage';

const commonConfig = {
  storage
};

const userConfig = {
  ...commonConfig,
  whitelist: ['isLoggedIn', 'token', 'current'],
  key: 'shop/user',
};

export const store = configureStore({
  reducer: {
    app: appSlice,
    products: productSlice,
    user: persistReducer(userConfig, userSlice)
  },
});

export const persistor = persistStore(store);