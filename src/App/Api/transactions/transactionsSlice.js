import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchTransactionsApi,
  fetchTransactionByIdApi,
  createTransactionApi,
  updateTransactionApi,
  deleteTransactionApi,
  fetchTransactionStatsApi,
  fetchStudentsBalanceApi, // 🟢 Yangi API funksiyasini import qilish
} from "./transactionsApi";

// === Get all
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchAll",
  async (params, thunkAPI) => {
    try {
      const res = await fetchTransactionsApi(params);
      return res?.data || {};
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// === Get Students Balance 🟢 YANGI ASYNC THUNK
export const fetchStudentsBalance = createAsyncThunk(
  "transactions/fetchStudentsBalance",
  async (params, thunkAPI) => {
    try {
      const res = await fetchStudentsBalanceApi(params);
      return res?.data || {};
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// === Get by ID
export const fetchTransactionById = createAsyncThunk(
  "transactions/fetchById",
  async (id, thunkAPI) => {
    try {
      const res = await fetchTransactionByIdApi(id);
      return res?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// === Create
export const createTransaction = createAsyncThunk(
  "transactions/create",
  async (data, thunkAPI) => {
    try {
      const res = await createTransactionApi(data);
      // ✅ Yangi transaction yaratilgach, stats-ni qayta chaqirish
      thunkAPI.dispatch(fetchTransactionStats());
      return res?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// === Update
export const updateTransaction = createAsyncThunk(
  "transactions/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await updateTransactionApi(id, data);
      // ✅ Yangilashdan keyin stats-ni qayta chaqirish
      thunkAPI.dispatch(fetchTransactionStats());
      return res?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// === Delete
export const deleteTransaction = createAsyncThunk(
  "transactions/delete",
  async (id, thunkAPI) => {
    try {
      await deleteTransactionApi(id);
      // ✅ O‘chirishdan keyin stats-ni qayta chaqirish
      thunkAPI.dispatch(fetchTransactionStats());
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// === Stats
export const fetchTransactionStats = createAsyncThunk(
  "transactions/fetchStats",
  async (params, thunkAPI) => {
    try {
      const res = await fetchTransactionStatsApi(params);
      return res?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const transactionsSlice = createSlice({
  name: "transactions",
  initialState: {
    list: [],
    total: 0,
    current: null,
    stats: null,
    loading: false,
    balanceLoading: false,
    studentsBalanceList: [],
    studentsBalanceTotal: 0,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // === Get all
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.items || [];
        state.total = action.payload.total || 0;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🟢 Get Students Balance
      .addCase(fetchStudentsBalance.pending, (state) => {
        state.balanceLoading = true;
      })
      .addCase(fetchStudentsBalance.fulfilled, (state, action) => {
        state.balanceLoading = false;
        state.studentsBalanceList = action.payload.items || [];
        state.studentsBalanceTotal = action.payload.total || 0;
      })
      .addCase(fetchStudentsBalance.rejected, (state, action) => {
        state.balanceLoading = false;
        state.error = action.payload;
      })

      // === Get by ID
      .addCase(fetchTransactionById.fulfilled, (state, action) => {
        state.current = action.payload;
      })

      // === Create
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })

      // === Update
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const index = state.list.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      })

      // === Delete
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.list = state.list.filter((t) => t._id !== action.payload);
      })

      // === Stats
      .addCase(fetchTransactionStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export default transactionsSlice.reducer;