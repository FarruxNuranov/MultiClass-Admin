import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchTeacherScheduleApi } from "./teacherScheduleApi";

// 🔹 Получить расписание учителя
export const fetchTeacherScheduleThunk = createAsyncThunk(
  "teacherSchedule/fetch",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchTeacherScheduleApi();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const teacherScheduleSlice = createSlice({
  name: "teacherSchedule",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeacherScheduleThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherScheduleThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.data || [];
      })
      .addCase(fetchTeacherScheduleThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default teacherScheduleSlice.reducer;