import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchTariffsApi,
  createTariffApi,
  fetchTariffByIdApi,
  updateTariffApi,
  deleteTariffApi,
} from "./tariffsApi";

/* ======================================================
   🔹 Thunks
====================================================== */

// Get all tariffs
export const fetchTariffs = createAsyncThunk(
  "tariffs/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await fetchTariffsApi(params);
      return res; // { data, meta }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Get one tariff by ID
export const fetchTariffById = createAsyncThunk(
  "tariffs/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetchTariffByIdApi(id);
      return res?.data || res;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Create tariff
export const createTariff = createAsyncThunk(
  "tariffs/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await createTariffApi(data);
      return res?.data || res;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Update tariff
export const updateTariff = createAsyncThunk(
  "tariffs/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await updateTariffApi(id, data);
      return res?.data || res;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Delete tariff
export const deleteTariff = createAsyncThunk(
  "tariffs/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteTariffApi(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ======================================================
   🔹 Slice
====================================================== */
const tariffsSlice = createSlice({
  name: "tariffs",
  initialState: {
    list: [],
    current: null,
    meta: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchTariffs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTariffs.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.data?.items || [];
        state.meta = {
          total: action.payload?.data?.total || 0,
          page: action.payload?.data?.page || 1,
          limit: action.payload?.data?.limit || 10,
        };
      })
      .addCase(fetchTariffs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch by ID
      .addCase(fetchTariffById.fulfilled, (state, action) => {
        state.current = action.payload;
      })

      // Create
      .addCase(createTariff.fulfilled, (state, action) => {
        if (action.payload) state.list.push(action.payload);
      })

      // Update
      .addCase(updateTariff.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.list.findIndex((t) => t._id === updated._id);
        if (idx !== -1) state.list[idx] = updated;
        if (state.current?._id === updated._id) state.current = updated;
      })

      // Delete
      .addCase(deleteTariff.fulfilled, (state, action) => {
        state.list = state.list.filter((t) => t._id !== action.payload);
      });
  },
});

export default tariffsSlice.reducer;
