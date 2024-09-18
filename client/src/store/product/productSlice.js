import { createSlice } from "@reduxjs/toolkit";
import { getNewProducts } from "./asyncActions";

export const produceSlice = createSlice({
  name: "product",
  initialState: {
    newProducts: null,
    errorMessage: "",
  },
  reducers: {},
  // code logic xử lí async action
  extraReducers: (builder) => {
    builder.addCase(getNewProducts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.newProducts = action.payload;
    });

    builder.addCase(getNewProducts.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload.message;
    });
  },
});

export default produceSlice.reducer;
