import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchTenantsApi,
  fetchTenantByIdApi,
  createTenantApi,
  updateTenantApi,
  deleteTenantApi,
  seedAdminApi,
} from "./tenantsApi";

/* ============================================================
   THUNKS
============================================================ */

/* 1) GET ALL TENANTS */
export const fetchTenants = createAsyncThunk(
  "tenants/fetchAll",
  async (search = "", { rejectWithValue }) => {
    try {
      return await fetchTenantsApi(search);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* 2) CREATE TENANT */
export const createTenant = createAsyncThunk(
  "tenants/create",
  async (data, { rejectWithValue }) => {
    try {
      return await createTenantApi(data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* 3) GET TENANT BY ID */
export const fetchTenantById = createAsyncThunk(
  "tenants/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return await fetchTenantByIdApi(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* 4) UPDATE TENANT */
export const updateTenant = createAsyncThunk(
  "tenants/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateTenantApi(id, data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* 5) DELETE TENANT */
export const deleteTenant = createAsyncThunk(
  "tenants/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteTenantApi(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* 6) SEED ADMIN (create admin for a tenant) */
export const seedAdmin = createAsyncThunk(
  "tenants/seedAdmin",
  async ({ id, adminData }, { rejectWithValue }) => {
    try {
      return await seedAdminApi(id, adminData);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ============================================================
   SLICE
============================================================ */

const tenantsSlice = createSlice({
  name: "tenants",
  initialState: {
    list: [],
    current: null,
    loading: false,
    error: null,
    seedAdminStatus: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      /* -------------------------------------------------------
         GET ALL
      -------------------------------------------------------*/
      .addCase(fetchTenants.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTenants.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.data || [];
      })
      .addCase(fetchTenants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* -------------------------------------------------------
         CREATE
      -------------------------------------------------------*/
      .addCase(createTenant.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTenant.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data) {
          state.list.push(action.payload.data);
        }
      })
      .addCase(createTenant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* -------------------------------------------------------
         GET BY ID
      -------------------------------------------------------*/
      .addCase(fetchTenantById.pending, (state) => {
        state.loading = true;
        state.current = null;
      })
      .addCase(fetchTenantById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload?.data || null;
      })
      .addCase(fetchTenantById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* -------------------------------------------------------
         UPDATE
      -------------------------------------------------------*/
      .addCase(updateTenant.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTenant.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload?.data;

        if (updated) {
          const idx = state.list.findIndex((t) => t._id === updated._id);
          if (idx !== -1) state.list[idx] = updated;
          if (state.current?._id === updated._id) {
            state.current = updated;
          }
        }
      })
      .addCase(updateTenant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* -------------------------------------------------------
         DELETE
      -------------------------------------------------------*/
      .addCase(deleteTenant.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTenant.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((t) => t._id !== action.payload);
      })
      .addCase(deleteTenant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* -------------------------------------------------------
         SEED ADMIN
      -------------------------------------------------------*/
      .addCase(seedAdmin.pending, (state) => {
        state.seedAdminStatus = "loading";
      })
      .addCase(seedAdmin.fulfilled, (state) => {
        state.seedAdminStatus = "success";
      })
      .addCase(seedAdmin.rejected, (state, action) => {
        state.seedAdminStatus = "error";
        state.error = action.payload;
      });
  },
});

export default tenantsSlice.reducer;
