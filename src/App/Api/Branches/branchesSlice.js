import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchBranchesApi,
  fetchBranchByIdApi,
  createBranchApi,
  updateBranchApi,
  deleteBranchApi,
} from "./branchesApi";

/* -------------------- Thunks -------------------- */

// 🔹 Get all branches
export const fetchBranches = createAsyncThunk(
  "branches/fetchAll",
  async ({ page = 1, limit = 10, search = "" } = {}, { rejectWithValue }) => {
    try {
      return await fetchBranchesApi({ page, limit, search });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Get single branch
export const fetchBranchById = createAsyncThunk(
  "branches/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return await fetchBranchByIdApi(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Create branch
export const createBranch = createAsyncThunk(
  "branches/create",
  async (data, { rejectWithValue }) => {
    try {
      return await createBranchApi(data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Update branch
export const updateBranch = createAsyncThunk(
  "branches/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateBranchApi(id, data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Delete branch
export const deleteBranch = createAsyncThunk(
  "branches/delete",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const ok = await deleteBranchApi(id);
      if (ok) dispatch(fetchBranches());
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* -------------------- Slice -------------------- */

const branchesSlice = createSlice({
  name: "branches",
  initialState: {
    list: [],
    current: null,
    loading: false,
    error: null,
    filters: {
      page: 1,
      limit: 10,
      search: "",
    },
  },
  reducers: {
    setBranchSearch(state, action) {
      state.filters.search = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBranches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload?.data;
      
        // 🔹 To‘g‘ri massivni olish
        state.list = Array.isArray(data?.items) ? data.items : [];
      
        // Agar xohlasangiz totalni ham saqlab qo‘yish mumkin
        state.total = data?.total || 0;
      })
      .addCase(fetchBranches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchBranchById.fulfilled, (state, action) => {
        state.current = action.payload?.data || null;
      })
      .addCase(createBranch.fulfilled, (state, action) => {
        if (action.payload?.data) state.list.push(action.payload.data);
      })
      .addCase(updateBranch.fulfilled, (state, action) => {
        const updated = action.payload?.data;
        if (updated) {
          const idx = state.list.findIndex((b) => b._id === updated._id);
          if (idx !== -1) state.list[idx] = updated;
          if (state.current?._id === updated._id) state.current = updated;
        }
      })
      .addCase(deleteBranch.fulfilled, (state, action) => {
        state.list = state.list.filter((b) => b._id !== action.payload);
      });
  },
});

export const { setBranchSearch } = branchesSlice.actions;
export default branchesSlice.reducer;
