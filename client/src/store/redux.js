import { configureStore } from "@reduxjs/toolkit";
import appSlice from "./app/appSlice";
import productSlice from "./product/productSlice.js";
export const store = configureStore({
  reducer: {
    app: appSlice,
    products: productSlice,
  },
});
