import { createSlice } from "@reduxjs/toolkit";
import * as actions from "./asyncActions";
export const appSlice = createSlice({
  name: "app",
  initialState: {
    categories: null,
    isLoading: false,
  },
  reducers: {},
  // code logic xử lí async action
  extraReducers: (builder) => {
    // category
    // builder.addCase(actions.getCategories.pending, (state) => {
    //   state.isLoading = true;
    // });

    builder.addCase(actions.getCategories.fulfilled, (state, action) => {
      state.isLoading = false;
      state.categories = action.payload;
    });

    builder.addCase(actions.getCategories.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload.message;
    });
  },
});

export default appSlice.reducer;
