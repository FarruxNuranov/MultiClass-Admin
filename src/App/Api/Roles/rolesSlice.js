// src/App/Api/Roles/rolesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchRolesApi,
  fetchRoleByIdApi,
  createRoleApi,
  updateRoleApi,
  deleteRoleApi,
} from "./rolesApi";

// 🔹 Barcha rollarni olish
export const fetchRoles = createAsyncThunk("roles/fetchAll", async (params, thunkAPI) => {
  try {
    const res = await fetchRolesApi(params);
    // API sizda { data: { items, total } } formatda bo‘lishi mumkin
    return res?.data?.items || [];
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

// 🔹 Bitta rolni olish
export const fetchRoleById = createAsyncThunk("roles/fetchById", async (id, thunkAPI) => {
  try {
    const res = await fetchRoleByIdApi(id);
    return res?.data || res;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

// 🔹 Yangi rol yaratish
export const createRoleThunk = createAsyncThunk("roles/create", async (data, thunkAPI) => {
  try {
    const res = await createRoleApi(data);
    return res?.data || res;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

// 🔹 Rolni yangilash
export const updateRoleThunk = createAsyncThunk(
  "roles/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await updateRoleApi(id, data);
      return res?.data || res;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// 🔹 Rolni o‘chirish
export const deleteRoleThunk = createAsyncThunk("roles/delete", async (id, thunkAPI) => {
  try {
    await deleteRoleApi(id);
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

const rolesSlice = createSlice({
  name: "roles",
  initialState: {
    list: [],
    currentRole: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchRoleById.fulfilled, (state, action) => {
        state.currentRole = action.payload;
      })

      .addCase(createRoleThunk.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      .addCase(updateRoleThunk.fulfilled, (state, action) => {
        const index = state.list.findIndex((r) => r._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      })

      .addCase(deleteRoleThunk.fulfilled, (state, action) => {
        state.list = state.list.filter((r) => r._id !== action.payload);
      });
  },
});

export default rolesSlice.reducer;
