import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login as loginApi, createUser as createUserApi, getUserById } from '../../services/authService';
import type { LoginRequest, CreateUserRequest } from '../../types/models';

interface AuthState {
  userId: number | null;
  userName: string | null;
  userEmail: string | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
}

function loadFromStorage(): Partial<AuthState> {
  const userId = localStorage.getItem('smartstock_userId');
  const userName = localStorage.getItem('smartstock_userName');
  const userEmail = localStorage.getItem('smartstock_userEmail');
  if (userId) {
    return {
      userId: Number(userId),
      userName,
      userEmail,
      isLoggedIn: true,
    };
  }
  return { isLoggedIn: false };
}

const initialState: AuthState = {
  userId: null,
  userName: null,
  userEmail: null,
  isLoggedIn: false,
  loading: false,
  error: null,
  ...loadFromStorage(),
};

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (data: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await loginApi(data);
      const user = await getUserById(response.user_id);
      return { userId: response.user_id, name: user.name, email: user.email };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (data: CreateUserRequest, { rejectWithValue }) => {
    try {
      await createUserApi(data);
      const loginResponse = await loginApi({ email: data.email, password: data.password });
      return { userId: loginResponse.user_id, name: data.name, email: data.email };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.userId = null;
      state.userName = null;
      state.userEmail = null;
      state.isLoggedIn = false;
      state.error = null;
      localStorage.removeItem('smartstock_userId');
      localStorage.removeItem('smartstock_userName');
      localStorage.removeItem('smartstock_userEmail');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.userId = action.payload.userId;
        state.userName = action.payload.name;
        state.userEmail = action.payload.email;
        state.isLoggedIn = true;
        localStorage.setItem('smartstock_userId', String(action.payload.userId));
        localStorage.setItem('smartstock_userName', action.payload.name);
        localStorage.setItem('smartstock_userEmail', action.payload.email);
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.userId = action.payload.userId;
        state.userName = action.payload.name;
        state.userEmail = action.payload.email;
        state.isLoggedIn = true;
        localStorage.setItem('smartstock_userId', String(action.payload.userId));
        localStorage.setItem('smartstock_userName', action.payload.name);
        localStorage.setItem('smartstock_userEmail', action.payload.email);
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
