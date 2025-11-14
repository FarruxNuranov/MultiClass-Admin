// src/App/Api/Sciences/sciencesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createScienceApi,
  fetchSciencesApi,
  updateScienceApi,
  deleteScienceApi,
} from "./sciencesApi";

// 🔹 Thunks
export const fetchSciences = createAsyncThunk(
  "sciences/fetchSciences",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchSciencesApi();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createScience = createAsyncThunk(
  "sciences/createScience",
  async (data, { rejectWithValue }) => {
    try {
      return await createScienceApi(data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateScience = createAsyncThunk(
  "sciences/updateScience",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateScienceApi(id, data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteScience = createAsyncThunk(
  "sciences/deleteScience",
  async (id, { rejectWithValue }) => {
    try {
      return await deleteScienceApi(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Slice
const sciencesSlice = createSlice({
  name: "sciences",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchSciences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSciences.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.data || [];
      })
      .addCase(fetchSciences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createScience.fulfilled, (state, action) => {
        if (action.payload?.data) {
          state.items.push(action.payload.data);
        }
      })

      // Update
      .addCase(updateScience.fulfilled, (state, action) => {
        if (action.payload?.data) {
          const updated = action.payload.data;
          const idx = state.items.findIndex((s) => s._id === updated._id);
          if (idx !== -1) {
            state.items[idx] = updated;
          }
        }
      })

      // Delete
      .addCase(deleteScience.fulfilled, (state, action) => {
        const deletedId = action.payload?.data?._id || action.meta.arg;
        state.items = state.items.filter((s) => s._id !== deletedId);
      });
  },
});

export default sciencesSlice.reducer;