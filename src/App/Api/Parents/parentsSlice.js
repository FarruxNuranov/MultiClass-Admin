import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchParentsAPI,
  fetchParentByIdAPI,
  createParentAPI,
  updateParentAPI,
  deleteParentAPI,
} from "./parentsApi";

/* ===================== Thunks ===================== */

// 🔹 Получить всех родителей
export const fetchParents = createAsyncThunk(
  "parents/fetchAll",
  async (
    { search = "", page = 1, limit = 100, branchId = "" } = {},
    { rejectWithValue }
  ) => {
    try {
      return await fetchParentsAPI({ search, page, limit, branchId });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Получить одного родителя
export const fetchParentById = createAsyncThunk(
  "parents/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return await fetchParentByIdAPI(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Создать нового родителя
export const createParent = createAsyncThunk(
  "parents/create",
  async (data, { rejectWithValue }) => {
    try {
      return await createParentAPI(data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Обновить данные родителя
export const updateParent = createAsyncThunk(
  "parents/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateParentAPI(id, data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Удалить родителя
export const deleteParent = createAsyncThunk(
  "parents/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteParentAPI(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ===================== Slice ===================== */

const parentsSlice = createSlice({
  name: "parents",
  initialState: {
    list: [],
    current: null,
    total: 0,
    limit: 100,
    page: 1,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* ---------- FETCH ALL ---------- */
      .addCase(fetchParents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParents.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload || {};

        // поддержка разных API структур
        const data = payload.data?.items || payload.data || [];
        state.list = Array.isArray(data) ? data : [];

        state.total =
          payload.total ??
          payload.meta?.total ??
          payload.count ??
          data.length;

        state.limit = payload.limit ?? payload.meta?.limit ?? 100;
        state.page = payload.page ?? 1;
      })
      .addCase(fetchParents.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Ma'lumotni olishda xatolik yuz berdi";
      })

      /* ---------- FETCH BY ID ---------- */
      .addCase(fetchParentById.fulfilled, (state, action) => {
        state.current = action.payload?.data || null;
      })

      /* ---------- CREATE ---------- */
      .addCase(createParent.fulfilled, (state, action) => {
        if (action.payload?.data) {
          state.list.push(action.payload.data);
          state.total += 1;
        }
      })

      /* ---------- UPDATE ---------- */
      .addCase(updateParent.fulfilled, (state, action) => {
        const updated = action.payload?.data;
        if (updated) {
          const idx = state.list.findIndex((p) => p._id === updated._id);
          if (idx !== -1) state.list[idx] = updated;
          if (state.current?._id === updated._id) state.current = updated;
        }
      })

      /* ---------- DELETE ---------- */
      .addCase(deleteParent.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p._id !== action.payload);
        state.total = Math.max(0, state.total - 1);
      });
  },
});

export default parentsSlice.reducer;