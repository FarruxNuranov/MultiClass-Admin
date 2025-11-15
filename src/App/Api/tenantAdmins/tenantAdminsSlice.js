// src/features/tenantAdmins/tenantAdminsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTenantAdminsApi, createTenantAdminApi } from "./tenantAdminsApi";

// GET ALL TENANT-ADMINS
export const getTenantAdmins = createAsyncThunk(
  "tenantAdmins/getAll",
  async ({ tenantId, search }, { rejectWithValue }) => {
    try {
      const data = await getTenantAdminsApi({ tenantId, search });
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// CREATE TENANT ADMIN
export const createTenantAdmin = createAsyncThunk(
  "tenantAdmins/create",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await createTenantAdminApi(payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const tenantAdminsSlice = createSlice({
  name: "tenantAdmins",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      // GET ALL
      .addCase(getTenantAdmins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTenantAdmins.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(getTenantAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load tenant admins";
      })

      // CREATE TENANT ADMIN
      .addCase(createTenantAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTenantAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createTenantAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create tenant admin";
      });
  },
});

export default tenantAdminsSlice.reducer;
