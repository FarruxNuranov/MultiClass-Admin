import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAttendanceApi,
  fetchAttendanceByClassApi,
} from "./attendanceApi";

/* -------------------- Thunks -------------------- */

// 🔹 Получить все записи (с фильтрами class, date, page, limit)
export const fetchAttendance = createAsyncThunk(
  "attendance/fetchAll",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const res = await fetchAttendanceApi(filters);
      return res;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Получить записи по конкретному классу
export const fetchAttendanceByClass = createAsyncThunk(
  "attendance/fetchByClass",
  async (classId, { rejectWithValue }) => {
    try {
      const res = await fetchAttendanceByClassApi(classId);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* -------------------- Slice -------------------- */

const attendanceSlice = createSlice({
  name: "attendance",
  initialState: {
    list: [], // общий список (AttendancePage)
    classList: [], // записи конкретного класса (SingleAttendancePage)
    total: 0,
    page: 1,
    limit: 10,
    loading: false,
    error: null,
  },
  reducers: {
    clearClassList: (state) => {
      state.classList = [];
    },
  },
  extraReducers: (builder) => {
    builder
      /* ---------- Fetch All ---------- */
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.data || [];
        state.total = action.payload?.total || state.list.length;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.limit || 10;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Xatolik yuz berdi";
      })

      /* ---------- Fetch By Class ---------- */
      .addCase(fetchAttendanceByClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceByClass.fulfilled, (state, action) => {
        state.loading = false;
        state.classList = action.payload || [];
      })
      .addCase(fetchAttendanceByClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Xatolik yuz berdi";
      });
  },
});

export const { clearClassList } = attendanceSlice.actions;
export default attendanceSlice.reducer;