import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchStudentsApi,
  fetchStudentByIdApi,
  createStudentApi,
  updateStudentApi,
  deleteStudentApi,
} from "./studentsApi";

/* -------------------- Thunks -------------------- */

// 🔹 Все студенты (с пагинацией и фильтрацией)
export const fetchStudents = createAsyncThunk(
  "students/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await fetchStudentsApi(params);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Один студент
export const fetchStudentById = createAsyncThunk(
  "students/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return await fetchStudentByIdApi(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Создать студента
export const createStudent = createAsyncThunk(
  "students/create",
  async (data, { rejectWithValue }) => {
    try {
      return await createStudentApi(data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Обновить студента
export const updateStudent = createAsyncThunk(
  "students/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateStudentApi(id, data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Удалить студента
export const deleteStudent = createAsyncThunk(
  "students/delete",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const ok = await deleteStudentApi(id);
      if (ok) dispatch(fetchStudents());
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* -------------------- Slice -------------------- */

const studentsSlice = createSlice({
  name: "students",
  initialState: {
    list: [],
    total: 0,
    page: 1,
    limit: 100,
    current: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* ---------- Fetch All ---------- */
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.data || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.limit || 100;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------- Fetch By ID ---------- */
      .addCase(fetchStudentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload?.data || null;
      })
      .addCase(fetchStudentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------- Create ---------- */
      .addCase(createStudent.fulfilled, (state, action) => {
        if (action.payload?.data) {
          state.list.push(action.payload.data);
        }
      })

      /* ---------- Update ---------- */
      .addCase(updateStudent.fulfilled, (state, action) => {
        const updated = action.payload?.data;
        if (updated) {
          const idx = state.list.findIndex((s) => s._id === updated._id);
          if (idx !== -1) state.list[idx] = updated;
          if (state.current?._id === updated._id) state.current = updated;
        }
      })

      /* ---------- Delete ---------- */
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.list = state.list.filter((s) => s._id !== action.payload);
      });
  },
});

export default studentsSlice.reducer;