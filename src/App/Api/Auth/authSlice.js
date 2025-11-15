import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUserApi } from "./authApi";

// AsyncThunk login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ phone, password }, { rejectWithValue }) => {
    try {
      const result = await loginUserApi({ phone, password });

      if (result.type === "roleSelection") {
        return { requiresRoleSelection: true, accounts: result.accounts || [] };
      }

      const { token } = result;
      if (token) localStorage.setItem("token", token);

      return { token, requiresRoleSelection: false };
    } catch (err) {
      return rejectWithValue(err.message || "Login failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token") || null,
    roles: [],
    loading: false,
    error: null,
    requiresRoleSelection: false,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.roles = [];
      state.requiresRoleSelection = false;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        const { token, accounts, requiresRoleSelection } = action.payload;

        state.token = token;
        state.requiresRoleSelection = requiresRoleSelection || false;

        if (accounts) {
          state.roles = accounts;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Xatolik yuz berdi.";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
