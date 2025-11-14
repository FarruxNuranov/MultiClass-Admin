// src/App/Api/dashboardSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchDashboardStatistics } from "./dashboardApi";

// 🟢 Async thunk: dashboard statistikani olish
export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchStats",
  async (_, thunkAPI) => {
    try {
      const res = await fetchDashboardStatistics();
      return res?.data || res; // server qaytaradigan formatga qarab
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    data: null,        // statistika ma'lumotlari
    loading: false,    // yuklanmoqda
    error: null,       // xatolik bo‘lsa
  },
  reducers: {
    // xohlasangiz qo‘shimcha reducers qo‘shishingiz mumkin
    clearDashboard: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Server bilan bog‘lanishda xatolik";
      });
  },
});

export const { clearDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
