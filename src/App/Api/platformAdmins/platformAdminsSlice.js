// src/features/platformAdmins/platformAdminsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getPlatformAdminsApi,
  createPlatformAdminApi,
  getPlatformAdminByIdApi,
  updatePlatformAdminApi,
  deletePlatformAdminApi,
  changePlatformAdminPasswordApi,
} from "./platformAdminsApi";

/* ======================================================
   1) GET ALL
====================================================== */
export const getPlatformAdmins = createAsyncThunk(
  "platformAdmins/getAll",
  async (search, { rejectWithValue }) => {
    try {
      return await getPlatformAdminsApi(search);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ======================================================
   2) CREATE ADMIN
====================================================== */
export const createPlatformAdmin = createAsyncThunk(
  "platformAdmins/create",
  async (payload, { rejectWithValue }) => {
    try {
      return await createPlatformAdminApi(payload);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ======================================================
   3) GET ADMIN BY ID
====================================================== */
export const getPlatformAdminById = createAsyncThunk(
  "platformAdmins/getById",
  async (id, { rejectWithValue }) => {
    try {
      return await getPlatformAdminByIdApi(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ======================================================
   4) UPDATE ADMIN
====================================================== */
export const updatePlatformAdmin = createAsyncThunk(
  "platformAdmins/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await updatePlatformAdminApi(id, payload);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ======================================================
   5) DELETE ADMIN
====================================================== */
export const deletePlatformAdmin = createAsyncThunk(
  "platformAdmins/delete",
  async (id, { rejectWithValue }) => {
    try {
      return await deletePlatformAdminApi(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ======================================================
   6) CHANGE PASSWORD
====================================================== */
export const changePlatformAdminPassword = createAsyncThunk(
  "platformAdmins/changePassword",
  async (payload, { rejectWithValue }) => {
    try {
      return await changePlatformAdminPasswordApi(payload);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ======================================================
   SLICE
====================================================== */

const platformAdminsSlice = createSlice({
  name: "platformAdmins",
  initialState: {
    list: [],
    currentAdmin: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      /* ------------------------------------------
          GET ALL
      ------------------------------------------- */
      .addCase(getPlatformAdmins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPlatformAdmins.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(getPlatformAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ------------------------------------------
          CREATE
      ------------------------------------------- */
      .addCase(createPlatformAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPlatformAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createPlatformAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ------------------------------------------
          GET BY ID
      ------------------------------------------- */
      .addCase(getPlatformAdminById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPlatformAdminById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAdmin = action.payload;
      })
      .addCase(getPlatformAdminById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ------------------------------------------
          UPDATE
      ------------------------------------------- */
      .addCase(updatePlatformAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePlatformAdmin.fulfilled, (state, action) => {
        state.loading = false;

        state.list = state.list.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      })
      .addCase(updatePlatformAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ------------------------------------------
          DELETE
      ------------------------------------------- */
      .addCase(deletePlatformAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePlatformAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((x) => x._id !== action.meta.arg);
      })
      .addCase(deletePlatformAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ------------------------------------------
          CHANGE PASSWORD
      ------------------------------------------- */
      .addCase(changePlatformAdminPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePlatformAdminPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePlatformAdminPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default platformAdminsSlice.reducer;
