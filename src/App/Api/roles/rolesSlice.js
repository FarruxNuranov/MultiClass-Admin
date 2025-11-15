// src/features/roles/rolesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRolesByTenantApi, createRoleApi } from "./rolesApi";

// GET ALL BY TENANT
export const getRolesByTenant = createAsyncThunk(
  "roles/getByTenant",
  async ({ tenantId, search }, { rejectWithValue }) => {
    try {
      const data = await getRolesByTenantApi({ tenantId, search });
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// CREATE ROLE
export const createRole = createAsyncThunk(
  "roles/createRole",
  async ({ title, tenantId }, { rejectWithValue }) => {
    try {
      const data = await createRoleApi({ title, tenantId });
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const rolesSlice = createSlice({
  name: "roles",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getRolesByTenant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRolesByTenant.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(getRolesByTenant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load roles";
      })

      // CREATE ROLE
      .addCase(createRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create role";
      });
  },
});

export default rolesSlice.reducer;
