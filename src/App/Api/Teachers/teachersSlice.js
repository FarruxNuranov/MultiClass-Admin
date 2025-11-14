import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchTeachersApi,
  createTeacherApi,
  fetchTeacherByIdApi,
  updateTeacherApi,
  deleteTeacherApi,
} from "./teachersApi.js";

/* ============================================================
   🔹 THUNKS
============================================================ */

// 🔸 Barcha xodimlarni olish (filtrlar bilan)
export const fetchTeachers = createAsyncThunk(
  "employees/fetchAll",
  async (
    { roles = "", classId = "", branch = "", search = "", page = 1, limit = 100 } = {},
    { rejectWithValue }
  ) => {
    try {
      return await fetchTeachersApi({ roles, classId, branch, search, page, limit });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔸 Bitta xodimni olish
export const fetchTeacherById = createAsyncThunk(
  "employees/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return await fetchTeacherByIdApi(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔸 Yangi xodim yaratish
export const createTeacher = createAsyncThunk(
  "employees/create",
  async (data, { rejectWithValue }) => {
    try {
      return await createTeacherApi(data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔸 Xodimni yangilash
export const updateTeacher = createAsyncThunk(
  "employees/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateTeacherApi(id, data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔸 Xodimni o‘chirish
export const deleteTeacher = createAsyncThunk(
  "employees/delete",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const ok = await deleteTeacherApi(id);
      if (ok) dispatch(fetchTeachers());
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ============================================================
   🔹 SLICE
============================================================ */
const employeesSlice = createSlice({
  name: "employees",
  initialState: {
    list: [],
    total: 0,
    totalPrice: 0,
    stats: {},
    page: 1,
    limit: 100,
    current: null,
    loading: false,
    error: null,
    filters: {
      search: "",
      roles: "",
      classId: "",
      branch: "",
    },
  },
  reducers: {
    setEmployeeSearch(state, action) { state.filters.search = action.payload; },
    setEmployeeRole(state, action) { state.filters.roles = action.payload; },
    setEmployeeClass(state, action) { state.filters.classId = action.payload; },
    setEmployeeBranch(state, action) { state.filters.branch = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeachers.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.loading = false;
        const res = action.payload?.data || {};
        state.list = res.items || [];
        state.total = res.total || 0;
        state.totalPrice = res.stats.totalSalary || 0;
        state.stats = res.stats || {};
        state.page = res.page || 1;
        state.limit = res.limit || 100;
      })
      .addCase(fetchTeachers.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchTeacherById.fulfilled, (state, action) => { state.current = action.payload?.data || null; })

      .addCase(createTeacher.fulfilled, (state, action) => {
        const created = action.payload?.data;
        if (created) state.list.unshift(created);
      })

      .addCase(updateTeacher.fulfilled, (state, action) => {
        const updated = action.payload?.data;
        if (updated) {
          const idx = state.list.findIndex((e) => e._id === updated._id);
          if (idx !== -1) state.list[idx] = updated;
          if (state.current?._id === updated._id) state.current = updated;
        }
      })

      .addCase(deleteTeacher.fulfilled, (state, action) => {
        state.list = state.list.filter((e) => e._id !== action.payload);
      });
  },
});

export const { setEmployeeSearch, setEmployeeRole, setEmployeeClass, setEmployeeBranch } = employeesSlice.actions;
export default employeesSlice.reducer;