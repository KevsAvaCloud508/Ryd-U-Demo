import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { MOCK_TOKEN_PREFIX, tokenStorage } from '../../../shared/utils/token-storage';
import { extractErrorMessage } from '../../../shared/utils/error-message';
import type { AuthUser, Role } from '../../../shared/types/auth';
import { fetchCurrentUser, loginRequest, registerRequest, updateProfileRequest } from '../services/auth.service';
import type { LoginPayload, RegisterPayload, UpdateProfilePayload } from '../types/auth.types';

// ── Mock user DB (modo demo, sin backend) ──────────────────────────
const MOCK_USERS: Record<string, { id: string; firstName: string; lastNamePaternal: string; role: Role }> = {
  'conductor@alumnos.upa.edu.mx': {
    id: 'mock-driver-001',
    firstName: 'Carlos',
    lastNamePaternal: 'Vega',
    role: 'DRIVER',
  },
  'pasajero@alumnos.upa.edu.mx': {
    id: 'mock-passenger-001',
    firstName: 'María',
    lastNamePaternal: 'García',
    role: 'STUDENT',
  },
  'admin@alumnos.upa.edu.mx': {
    id: 'mock-admin-001',
    firstName: 'Admin',
    lastNamePaternal: 'RydU',
    role: 'DRIVER',
  },
};

function buildMockUser(email: string): AuthUser | null {
  const mock = MOCK_USERS[email.toLowerCase()];
  if (!mock) return null;
  return {
    id: mock.id,
    firstName: mock.firstName,
    lastNamePaternal: mock.lastNamePaternal,
    lastNameMaternal: null,
    fullName: `${mock.firstName} ${mock.lastNamePaternal}`,
    email,
    phone: null,
    photoUrl: null,
    role: mock.role,
  };
}

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
  // ── Modo demo: restaurar sesión mock desde localStorage ──
  if (token.startsWith(MOCK_TOKEN_PREFIX)) {
    const email = localStorage.getItem('rydu_mock_email');
    if (email) {
      const user = buildMockUser(email);
      if (user) return user;
    }
    tokenStorage.clear();
    return null;
  }
  // ── Modo real: validar contra la API ──
  try {
    return await fetchCurrentUser();
  } catch (error) {
    tokenStorage.clear();
    return rejectWithValue(extractErrorMessage(error, 'La sesión ya no es válida.'));
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (payload: UpdateProfilePayload, { rejectWithValue }) => {
  try {
    return await updateProfileRequest(payload);
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, 'No se pudo actualizar el perfil.'));
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      tokenStorage.clear();
      localStorage.removeItem('rydu_mock_email');
      state.user = null;
      state.status = 'idle';
      state.error = null;
    },
    /**
     * mockLogin — inicia sesión en modo demo sin llamar al backend.
     * Crea un usuario ficticio según el email y el rol, guarda un token
     * mock y almacena el email para restaurar la sesión al recargar.
     */
    mockLogin(state, action: PayloadAction<{ email: string; role: Role }>) {
      const { email, role } = action.payload;
      const user = buildMockUser(email);
      if (!user) {
        state.error = 'Usuario de prueba no encontrado.';
        state.status = 'failed';
        return;
      }
      // Forzar el rol al que el usuario seleccionó (por si el mock tiene otro)
      user.role = role;
      const mockToken = `${MOCK_TOKEN_PREFIX}${Date.now()}_${role}`;
      tokenStorage.set(mockToken);
      localStorage.setItem('rydu_mock_email', email);
      state.user = user;
      state.status = 'succeeded';
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
      })
      .addCase(updateProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) ?? 'No se pudo actualizar el perfil.';
      });
  },
});

export const { logout, mockLogin } = authSlice.actions;
export const authReducer = authSlice.reducer;
