import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchSchedulesApi, updateScheduleApi } from "./schedulesApi";

// 🔹 Получить расписание только по ID класса
export const fetchSchedulesThunk = createAsyncThunk(
  "schedules/fetchByClass",
  async ({ classId }, { rejectWithValue }) => {
    try {
      return await fetchSchedulesApi(classId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Обновить расписание по ID
export const updateScheduleThunk = createAsyncThunk(
  "schedules/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateScheduleApi(id, data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const schedulesSlice = createSlice({
  name: "schedules",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET /schedules?class=...
      .addCase(fetchSchedulesThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSchedulesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.data || [];
        state.error = null;
      })
      .addCase(fetchSchedulesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // PUT /schedules/:id
      .addCase(updateScheduleThunk.fulfilled, (state, action) => {
        const updated = action.payload?.data;
        if (updated) {
          const idx = state.items.findIndex((s) => s._id === updated._id);
          if (idx !== -1) {
            state.items[idx] = updated;
          }
        }
      });
  },
});

export default schedulesSlice.reducer;