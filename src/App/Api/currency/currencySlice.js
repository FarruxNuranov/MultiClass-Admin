import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCurrencyApi, updateCurrencyApi } from "./currencyApi";

// 🔹 Valyuta kursini olish
export const fetchCurrency = createAsyncThunk(
  "currency/fetch",
  async (_, thunkAPI) => {
    try {
      const res = await fetchCurrencyApi();
      // API format: { data: { rate: 12065 } }
      return res?.data?.rate ?? null;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// 🔹 Valyuta kursini yangilash
export const updateCurrency = createAsyncThunk(
  "currency/update",
  async (rate, thunkAPI) => {
    try {
      const res = await updateCurrencyApi(rate);
      // API format: { data: { rate: 12345 } }
      return res?.data?.rate ?? rate;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const currencySlice = createSlice({
  name: "currency",
  initialState: {
    rate: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchCurrency.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrency.fulfilled, (state, action) => {
        state.loading = false;
        state.rate = action.payload;
      })
      .addCase(fetchCurrency.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateCurrency.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCurrency.fulfilled, (state, action) => {
        state.loading = false;
        state.rate = action.payload;
      })
      .addCase(updateCurrency.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default currencySlice.reducer;
