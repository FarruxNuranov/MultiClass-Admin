// src/App/Api/homework/homeworkSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchHomeworkByIdApi,
  fetchHomeworkByTopicApi,
  fetchMyHomeworkApi,
  updateHomeworkGradeApi,
} from "./homeworkApi";

/* ======================================================
   🧩 Thunks
====================================================== */

// 🔹 Получить список по topicId (с пагинацией)
export const fetchHomeworkByTopic = createAsyncThunk(
  "homework/fetchByTopic",
  async ({ topicId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const res = await fetchHomeworkByTopicApi(topicId, page, limit);
      return res; // возвращаем весь ответ { data, meta }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Получить список "моих домашних заданий" (для студента)
export const fetchMyHomework = createAsyncThunk(
  "homework/fetchMy",
  async ({ page = 1, limit = 100 } = {}, { rejectWithValue }) => {
    try {
      const res = await fetchMyHomeworkApi(page, limit);
      return res; // { data, meta }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Получить домашку по ID
export const fetchHomeworkById = createAsyncThunk(
  "homework/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetchHomeworkByIdApi(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Обновить оценку
export const updateHomeworkGrade = createAsyncThunk(
  "homework/updateGrade",
  async ({ id, mark }, { rejectWithValue }) => {
    try {
      const res = await updateHomeworkGradeApi(id, mark);
      return res.data; // { _id, mark, ... }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ======================================================
   🧾 Slice
====================================================== */
const homeworkSlice = createSlice({
  name: "homework",
  initialState: {
    items: [],        // список по topicId
    myItems: [],      // список моих домашних заданий
    current: null,    // текущая домашка (по ID)
    meta: null,       // пагинация: { total, page, limit }
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* ---------- 🧩 fetchHomeworkByTopic ---------- */
      .addCase(fetchHomeworkByTopic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeworkByTopic.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        state.meta = action.payload.meta || null;
      })
      .addCase(fetchHomeworkByTopic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load homework list";
      })

      /* ---------- 🎓 fetchMyHomework ---------- */
      .addCase(fetchMyHomework.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyHomework.fulfilled, (state, action) => {
        state.loading = false;
        state.myItems = action.payload.data || [];
        state.meta = action.payload.meta || null;
      })
      .addCase(fetchMyHomework.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load my homework";
      })

      /* ---------- 🧮 updateHomeworkGrade ---------- */
      .addCase(updateHomeworkGrade.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.items.findIndex((hw) => hw._id === updated._id);
        if (idx !== -1) {
          state.items[idx] = { ...state.items[idx], mark: updated.mark };
        }
      })

      /* ---------- 📄 fetchHomeworkById ---------- */
      .addCase(fetchHomeworkById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.current = null;
      })
      .addCase(fetchHomeworkById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchHomeworkById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load homework by id";
      });
  },
});

export default homeworkSlice.reducer;