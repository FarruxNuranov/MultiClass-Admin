import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createAssignmentApi } from "./assignmentsApi";

// 🔹 Thunk для загрузки решения
export const createAssignmentThunk = createAsyncThunk(
  "assignments/create",
  async ({ homeworkId, files }, { rejectWithValue }) => {
    try {
      const res = await createAssignmentApi({ homeworkId, files });
      return res.data; // backend вернет { _id, homework, files, ... }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState: {
    items: [], // список загруженных решений (если надо)
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAssignmentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAssignmentThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload); // добавляем новое решение
      })
      .addCase(createAssignmentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Xatolik yuz berdi";
      });
  },
});

export default assignmentsSlice.reducer;