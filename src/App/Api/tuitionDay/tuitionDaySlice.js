import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTuitionDayApi, putTuitionDayApi } from "./tuitionDayApi";

// 🔹 GET
export const fetchTuitionDay = createAsyncThunk(
  "tuition/fetchDay",
  async (_, thunkAPI) => {
    try {
      const res = await getTuitionDayApi();
      return res?.data?.day ?? res?.data?.data?.day ?? null;
    } catch (err) {
      console.error(" GET error:", err);
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// 🔹 PUT
export const updateTuitionDay = createAsyncThunk(
  "tuition/updateDay",
  async (data, thunkAPI) => {
    try {
      const res = await putTuitionDayApi(data);
      return res?.data?.day ?? data.day;
    } catch (err) {
      console.error(" PUT error:", err);
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const tuitionSlice = createSlice({
  name: "tuition",
  initialState: {
    day: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(fetchTuitionDay.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTuitionDay.fulfilled, (state, action) => {
        state.loading = false;
        state.day = action.payload;
      })
      .addCase(fetchTuitionDay.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // PUT
      .addCase(updateTuitionDay.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTuitionDay.fulfilled, (state, action) => {
        state.loading = false;
        state.day = action.payload;
      })
      .addCase(updateTuitionDay.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default tuitionSlice.reducer;
