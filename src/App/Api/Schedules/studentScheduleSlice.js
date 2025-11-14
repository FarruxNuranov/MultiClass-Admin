import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchMyStudentScheduleApi } from "./studentScheduleApi";

// 🔹 Получить расписание текущего студента (по токену)
export const fetchMyStudentScheduleThunk = createAsyncThunk(
  "studentSchedule/fetchMySchedule",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchMyStudentScheduleApi();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const studentScheduleSlice = createSlice({
  name: "studentSchedule",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET /schedules/my/student
      .addCase(fetchMyStudentScheduleThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyStudentScheduleThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.data || [];
        state.error = null;
      })
      .addCase(fetchMyStudentScheduleThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default studentScheduleSlice.reducer;