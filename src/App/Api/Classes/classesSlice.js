import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchClassesApi,
  fetchTeacherClassesApi,
  createClassApi,
  updateClassApi,
  deleteClassApi,
} from "./classesApi";

// 🔹 Получить все классы (с фильтром branch)
export const fetchClasses = createAsyncThunk(
  "classes/fetchAll",
  async ({ branch = "", search = "" } = {}, { rejectWithValue }) => {
    try {
      return await fetchClassesApi({ branch, search });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Получить только классы текущего учителя
export const fetchTeacherClasses = createAsyncThunk(
  "classes/fetchTeacher",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchTeacherClassesApi();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Создать класс
export const createClass = createAsyncThunk(
  "classes/create",
  async (data, { rejectWithValue }) => {
    try {
      return await createClassApi(data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Обновить класс
export const updateClass = createAsyncThunk(
  "classes/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateClassApi(id, data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Удалить класс
export const deleteClass = createAsyncThunk(
  "classes/delete",
  async (id, { rejectWithValue }) => {
    try {
      return await deleteClassApi(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ✅ Slice
const classesSlice = createSlice({
  name: "classes",
  initialState: {
    items: [],
    loading: false,
    error: null,
    filters: {
      branch: localStorage.getItem("branchId") || "",
      search: "",
    },
  },
  reducers: {
    setClassesBranch(state, action) {
      state.filters.branch = action.payload;
      localStorage.setItem("branchId", action.payload);
    },
    setClassesSearch(state, action) {
      state.filters.search = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
          
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.data || [];
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchTeacherClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.data || [];
      })

      .addCase(createClass.fulfilled, (state, action) => {
        if (action.payload?.data) state.items.push(action.payload.data);
      })

      .addCase(updateClass.fulfilled, (state, action) => {
        const updated = action.payload?.data;
        if (!updated) return;
        const idx = state.items.findIndex((c) => c._id === updated._id);
        if (idx !== -1) state.items[idx] = updated;
      })

      .addCase(deleteClass.fulfilled, (state, action) => {
        const deletedId = action.meta.arg;
        state.items = state.items.filter((c) => c._id !== deletedId);
      });
  },
});

export const { setClassesBranch, setClassesSearch } = classesSlice.actions;
export default classesSlice.reducer;