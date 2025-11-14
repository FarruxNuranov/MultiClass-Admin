// src/App/Api/News/newsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchNewsApi,
  fetchNewsByIdApi,
  createNewsApi,
  updateNewsApi,
  deleteNewsApi,
} from "./newsApi";

// Thunks
export const fetchNews = createAsyncThunk("news/fetchAll", async () => {
  return await fetchNewsApi();
});

export const fetchNewsById = createAsyncThunk("news/fetchById", async (id) => {
  return await fetchNewsByIdApi(id);
});

export const createNews = createAsyncThunk("news/create", async (data) => {
  return await createNewsApi(data);
});

export const updateNews = createAsyncThunk("news/update", async ({ id, data }) => {
  return await updateNewsApi(id, data);
});

export const deleteNews = createAsyncThunk("news/delete", async (id) => {
  await deleteNewsApi(id);
  return id;
});

// Slice
const newsSlice = createSlice({
  name: "news",
  initialState: {
    list: [],
    current: null, // ⚡️ вместо single
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // All
      .addCase(fetchNews.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchNews.fulfilled, (s, a) => {
        s.loading = false;
        s.list = a.payload.data || [];
      })
      .addCase(fetchNews.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message;
      })

      // One
      .addCase(fetchNewsById.fulfilled, (s, a) => {
        s.current = a.payload.data || null; // ⚡️ теперь будет current
      })

      // Create
      .addCase(createNews.fulfilled, (s, a) => {
        if (a.payload?.data) s.list.push(a.payload.data);
      })

      // Update
      .addCase(updateNews.fulfilled, (s, a) => {
        const updated = a.payload.data;
        const idx = s.list.findIndex((n) => n._id === updated._id);
        if (idx !== -1) s.list[idx] = updated;
        if (s.current?._id === updated._id) s.current = updated; // ⚡️ обновляем current
      })

      // Delete
      .addCase(deleteNews.fulfilled, (s, a) => {
        s.list = s.list.filter((n) => n._id !== a.payload);
      });
  },
});

export default newsSlice.reducer;