import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchLessonPlans,
  createLessonPlan,
  updateLessonPlan,
  deleteLessonPlan,
} from "./lessonPlansApi";

// 🔹 Получение всех Lesson Plans
export const fetchLessonPlansThunk = createAsyncThunk(
  "lessonPlans/fetchLessonPlans",
  async (classId, { rejectWithValue }) => {
    try {
      return await fetchLessonPlans(classId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Создание Lesson Plan
export const createLessonPlanThunk = createAsyncThunk(
  "lessonPlans/createLessonPlan",
  async (payload, { rejectWithValue }) => {
    try {
      return await createLessonPlan(payload);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Обновление Lesson Plan
export const updateLessonPlanThunk = createAsyncThunk(
  "lessonPlans/updateLessonPlan",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await updateLessonPlan(id, payload);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Удаление Lesson Plan
export const deleteLessonPlanThunk = createAsyncThunk(
  "lessonPlans/deleteLessonPlan",
  async (id, { rejectWithValue }) => {
    try {
      return await deleteLessonPlan(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ---------------- SLICE ----------------
const lessonPlansSlice = createSlice({
  name: "lessonPlans",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔹 Fetch
      .addCase(fetchLessonPlansThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLessonPlansThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchLessonPlansThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Create
      .addCase(createLessonPlanThunk.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      // 🔹 Update
      .addCase(updateLessonPlanThunk.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item._id === action.payload._id
        );
        if (index !== -1) state.items[index] = action.payload;
      })

      // 🔹 Delete
      .addCase(deleteLessonPlanThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

export default lessonPlansSlice.reducer;