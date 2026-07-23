import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { tokenStorage } from '../../../shared/utils/token-storage';
import { extractErrorMessage } from '../../../shared/utils/error-message';
import type { AuthUser } from '../../../shared/types/auth';
import { fetchCurrentUser, loginRequest, registerRequest } from '../services/auth.service';
import type { LoginPayload, RegisterPayload } from '../types/auth.types';

interface AuthState {
  user: AuthUser | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  // Distingue "aún no sabemos si hay sesión" de "ya se intentó restaurarla al cargar la app".
  isInitializing: boolean;
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
  isInitializing: true,
};

export const registerUser = createAsyncThunk('auth/register', async (payload: RegisterPayload, { rejectWithValue }) => {
  try {
    return await registerRequest(payload);
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, 'No se pudo completar el registro.'));
  }
});

export const loginUser = createAsyncThunk('auth/login', async (payload: LoginPayload, { rejectWithValue }) => {
  try {
    return await loginRequest(payload);
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, 'No se pudo iniciar sesión.'));
  }
});

// Se ejecuta una vez al montar la app: si hay un token guardado, valida la sesión contra la API.
export const restoreSession = createAsyncThunk('auth/restoreSession', async (_: void, { rejectWithValue }) => {
  const token = tokenStorage.get();
  if (!token) {
    return null;
  }
  try {
    return await fetchCurrentUser();
  } catch (error) {
    tokenStorage.clear();
    return rejectWithValue(extractErrorMessage(error, 'La sesión ya no es válida.'));
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      tokenStorage.clear();
      state.user = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<{ user: AuthUser; token: string }>) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        tokenStorage.set(action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) ?? 'No se pudo completar el registro.';
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ user: AuthUser; token: string }>) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        tokenStorage.set(action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) ?? 'No se pudo iniciar sesión.';
      })
      .addCase(restoreSession.pending, (state) => {
        state.isInitializing = true;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.isInitializing = false;
        state.user = action.payload;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.isInitializing = false;
        state.user = null;
      });
  },
});

export const { logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
