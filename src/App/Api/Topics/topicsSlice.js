// src/App/Api/Topics/topicsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchTopicsApi,
  fetchTopicByIdApi,
  fetchTopicByIdStudentApi,
  createTopicApi,
  updateTopicApi,
  deleteTopicApi,
} from "./topicsApi";

/* -------------------- Thunks -------------------- */

// 🔹 Получить все темы
export const fetchTopics = createAsyncThunk(
  "topics/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const res = await fetchTopicsApi(params);
      return res;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch topics");
    }
  }
);

// 🔹 Получить одну тему по id
export const fetchTopicById = createAsyncThunk(
  "topics/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetchTopicByIdApi(id);
      return res;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch topic");
    }
  }
);

// 🔹 Получить одну тему как студент
export const fetchTopicByIdStudent = createAsyncThunk(
  "topics/fetchByIdStudent",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetchTopicByIdStudentApi(id);
      return res;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch student topic");
    }
  }
);

// 🔹 Создать тему
export const createTopic = createAsyncThunk(
  "topics/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await createTopicApi(data);
      return res;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to create topic");
    }
  }
);

// 🔹 Обновить тему
export const updateTopic = createAsyncThunk(
  "topics/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await updateTopicApi(id, data);
      return res;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to update topic");
    }
  }
);

// 🔹 Удалить тему
export const deleteTopic = createAsyncThunk(
  "topics/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteTopicApi(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to delete topic");
    }
  }
);

/* -------------------- Slice -------------------- */

const topicsSlice = createSlice({
  name: "topics",
  initialState: {
    items: [], // список тем
    current: null, // выбранная тема
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrent: (s) => {
      s.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ---------- GET ALL ---------- */
      .addCase(fetchTopics.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchTopics.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload?.data || [];
      })
      .addCase(fetchTopics.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload || a.error.message;
      })

      /* ---------- GET ONE ---------- */
      .addCase(fetchTopicById.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchTopicById.fulfilled, (s, a) => {
        s.loading = false;
        s.current = a.payload?.data || null;
      })
      .addCase(fetchTopicById.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload || a.error.message;
      })

      /* ---------- GET ONE STUDENT ---------- */
      .addCase(fetchTopicByIdStudent.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchTopicByIdStudent.fulfilled, (s, a) => {
        s.loading = false;
        s.current = a.payload?.data || null;
      })
      .addCase(fetchTopicByIdStudent.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload || a.error.message;
      })

      /* ---------- CREATE ---------- */
      .addCase(createTopic.fulfilled, (s, a) => {
        if (a.payload?.data) {
          s.items.push(a.payload.data);
        }
      })

      /* ---------- UPDATE ---------- */
      .addCase(updateTopic.fulfilled, (s, a) => {
        const updated = a.payload?.data;
        if (updated) {
          const idx = s.items.findIndex((t) => t._id === updated._id);
          if (idx !== -1) s.items[idx] = updated;
          if (s.current?._id === updated._id) s.current = updated;
        }
      })

      /* ---------- DELETE ---------- */
      .addCase(deleteTopic.fulfilled, (s, a) => {
        s.items = s.items.filter((t) => t._id !== a.payload);
      });
  },
});

export const { clearCurrent } = topicsSlice.actions;
export default topicsSlice.reducer;