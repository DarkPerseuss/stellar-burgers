import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { setCookie, deleteCookie } from '../../utils/cookie';
import {
  getUserApi,
  loginUserApi,
  TLoginData,
  registerUserApi,
  updateUserApi,
  TRegisterData,
  logoutApi
} from '../../utils/burger-api';
import { TUser } from '../../utils/types';

type UserStore = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: UserStore = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null
};

export const registerUser = createAsyncThunk(
  'user/register',
  async (registerData: TRegisterData) => {
    const data = await registerUserApi(registerData);
    localStorage.setItem('refreshToken', data.refreshToken);
    setCookie('accessToken', data.accessToken);

    return data.user;
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (loginData: TLoginData) => {
    const data = await loginUserApi(loginData);

    localStorage.setItem('refreshToken', data.refreshToken);
    setCookie('accessToken', data.accessToken);

    return data.user;
  }
);

export const getUser = createAsyncThunk('user/getUser', async () => {
  const dataUser = await getUserApi();
  return dataUser.user;
});

export const updateUser = createAsyncThunk(
  'user/update',
  async (userData: Partial<TRegisterData>) => {
    const data = await updateUserApi(userData);
    return data.user;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
});

export const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {},
  selectors: {
    userSelector: (state) => state.user,
    userLoadingSelector: (state) => state.isLoading,
    userErrorSelector: (state) => state.error,
    authCheckedSelector: (state) => state.isAuthChecked
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.user = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.user = action.payload;
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.user = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.user = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthChecked = true;
      });
  }
});

export const {
  userSelector,
  userLoadingSelector,
  userErrorSelector,
  authCheckedSelector
} = userSlice.selectors;

export const userReducer = userSlice.reducer;
