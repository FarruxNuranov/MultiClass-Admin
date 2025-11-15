// src/features/profile/profileSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getMyProfileApi,
  updatePasswordApi,
  updateProfileApi,
} from "./profileApi";

/* ======================================================
   1) GET MY PROFILE
====================================================== */
export const getMyProfile = createAsyncThunk(
  "profile/getMyProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await getMyProfileApi();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ======================================================
   2) UPDATE PASSWORD
====================================================== */
export const updatePassword = createAsyncThunk(
  "profile/updatePassword",
  async (payload, { rejectWithValue }) => {
    try {
      return await updatePasswordApi(payload);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ======================================================
   3) UPDATE PROFILE
====================================================== */
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (payload, { rejectWithValue }) => {
    try {
      return await updateProfileApi(payload);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ======================================================
   SLICE
====================================================== */
const profileSlice = createSlice({
  name: "profile",
  initialState: {
    me: null,
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      /* ------------------------------------------
          GET PROFILE
      ------------------------------------------- */
      .addCase(getMyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.me = action.payload;
      })
      .addCase(getMyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ------------------------------------------
          UPDATE PASSWORD
      ------------------------------------------- */
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ------------------------------------------
          UPDATE PROFILE
      ------------------------------------------- */
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.me = action.payload; // updated profile
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default profileSlice.reducer;
