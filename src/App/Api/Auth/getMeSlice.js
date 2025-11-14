import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getMeApi } from "./getMeApi";

export const fetchMeThunk = createAsyncThunk(
  "getMe/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const user = await getMeApi();
      return user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const getMeSlice = createSlice({
  name: "getMe",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMeThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMeThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchMeThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default getMeSlice.reducer;