import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchSmsTemplatesApi,
  fetchSmsTemplateByIdApi,
  createSmsTemplateApi,
  updateSmsTemplateApi,
  deleteSmsTemplateApi,
  fetchSmsLogsApi,
  sendBulkSmsApi,
} from "./smsApi";

// 🔹 Fetch all SMS templates
export const fetchSmsTemplates = createAsyncThunk(
  "smsTemplates/fetchAll",
  async (params, thunkAPI) => {
    try {
      const res = await fetchSmsTemplatesApi(params);
      return res?.data?.items || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// 🔹 Fetch by ID
export const fetchSmsTemplateById = createAsyncThunk(
  "smsTemplates/fetchById",
  async (id, thunkAPI) => {
    try {
      const res = await fetchSmsTemplateByIdApi(id);
      return res?.data || res;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// 🔹 Create SMS template
export const createSmsTemplateThunk = createAsyncThunk(
  "smsTemplates/create",
  async (data, thunkAPI) => {
    try {
      const res = await createSmsTemplateApi(data);
      return res?.data || res;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// 🔹 Update SMS template
export const updateSmsTemplateThunk = createAsyncThunk(
  "smsTemplates/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await updateSmsTemplateApi(id, data);
      return res?.data || res;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// 🔹 Delete SMS template
export const deleteSmsTemplateThunk = createAsyncThunk(
  "smsTemplates/delete",
  async (id, thunkAPI) => {
    try {
      await deleteSmsTemplateApi(id);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// 🔹 Yangi qo‘shildi: SMS loglarini olish
export const fetchSmsLogsThunk = createAsyncThunk(
  "smsLogs/fetchAll",
  async (params, thunkAPI) => {
    try {
      const res = await fetchSmsLogsApi(params);
      return res?.data?.items || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// 🔹 Yangi qo‘shildi: Bulk SMS yuborish
export const sendBulkSmsThunk = createAsyncThunk(
  "sms/sendBulk",
  async (data, thunkAPI) => {
    try {
      const res = await sendBulkSmsApi(data);
      return res?.data || res;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const smsTemplatesSlice = createSlice({
  name: "smsTemplates",
  initialState: {
    list: [],
    current: null,
    logs: [], // 🔹 SMS loglari uchun yangi state
    loading: false,
    error: null,
    sendingBulk: false, // 🔹 bulk SMS yuborish loading
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get all SMS templates
      .addCase(fetchSmsTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSmsTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchSmsTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createSmsTemplateThunk.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })

      // Update
      .addCase(updateSmsTemplateThunk.fulfilled, (state, action) => {
        const index = state.list.findIndex((s) => s._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      })

      // Delete
      .addCase(deleteSmsTemplateThunk.fulfilled, (state, action) => {
        state.list = state.list.filter((s) => s._id !== action.payload);
      })

      // 🔹 SMS loglari
      .addCase(fetchSmsLogsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSmsLogsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload;
      })
      .addCase(fetchSmsLogsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Bulk SMS yuborish
      .addCase(sendBulkSmsThunk.pending, (state) => {
        state.sendingBulk = true;
        state.error = null;
      })
      .addCase(sendBulkSmsThunk.fulfilled, (state) => {
        state.sendingBulk = false;
      })
      .addCase(sendBulkSmsThunk.rejected, (state, action) => {
        state.sendingBulk = false;
        state.error = action.payload;
      });
  },
});

export default smsTemplatesSlice.reducer;
