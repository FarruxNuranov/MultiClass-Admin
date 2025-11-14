import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUserApi } from "./authApi";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ phone, password, role }, { rejectWithValue }) => {
    try {
      const result = await loginUserApi({ phone, password, role });

      if (result.type === "roleSelection") {
        return { requiresRoleSelection: true, accounts: result.accounts };
      }

      const { user, token } = result;

      if (token) localStorage.setItem("token", token);
      if (user?.role) localStorage.setItem("role", user.role.title);
      if (user?.class?._id) localStorage.setItem("classId", user.class._id);

      return { user, token, requiresRoleSelection: false };
    } catch (err) {
      return rejectWithValue(err.message || "Login failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    roles: [],
    token: localStorage.getItem("token") || null,
    role: localStorage.getItem("role") || null,
    classId: localStorage.getItem("classId") || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.classId = null;
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("classId");
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
        const { user, token, requiresRoleSelection } = action.payload;
        if (action.payload.accounts) {
          state.roles = [];
          state.roles.push(...action.payload.accounts);
        }
        if (!requiresRoleSelection) {
          state.user = user || null;
          state.token = token || null;
          state.role = user?.role?.title || null;
          state.classId = user?.class?._id || null;

          if (state.role) localStorage.setItem("role", state.role);
          if (state.classId) localStorage.setItem("classId", state.classId);
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