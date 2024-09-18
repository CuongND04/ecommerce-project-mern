import { createAsyncThunk } from "@reduxjs/toolkit";
import * as apis from "../../apis";

// định nghĩa một cái action
export const getCategories = createAsyncThunk(
  "app/categories",
  async (data, { rejectWithValue }) => {
    const response = await apis.apiGetCategories();
    if (!response.success) {
      return rejectWithValue(response);
    }
    return response.data; // payload
  }
);
