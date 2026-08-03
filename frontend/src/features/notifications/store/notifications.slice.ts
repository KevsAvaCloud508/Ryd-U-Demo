import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { extractErrorMessage } from '../../../shared/utils/error-message';
import { isDemoMode } from '../../../shared/utils/token-storage';
import { fetchNotifications, fetchUnreadNotifications, markAllAsRead, markAsRead } from '../services/notifications.service';
import type { Notification } from '../types/notifications.types';

interface NotificationsState {
  items: Notification[];
  unreadCount: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: NotificationsState = {
  items: [],
  unreadCount: 0,
  status: 'idle',
  error: null,
};

export const loadNotifications = createAsyncThunk('notifications/loadAll', async (_: void, { rejectWithValue }) => {
  // En modo demo el backend rechaza el token mock; no hay notificaciones previas.
  if (isDemoMode()) return [];
  try {
    return await fetchNotifications();
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, 'No se pudieron cargar las notificaciones.'));
  }
});

export const loadUnreadCount = createAsyncThunk('notifications/unreadCount', async (_: void, { rejectWithValue }) => {
  if (isDemoMode()) return [];
  try {
    return await fetchUnreadNotifications();
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, 'No se pudieron cargar las notificaciones no leídas.'));
  }
});

export const readNotification = createAsyncThunk('notifications/read', async (id: string, { rejectWithValue }) => {
  if (isDemoMode()) {
    return {
      id,
      userId: 'demo-user',
      isRead: true,
      type: 'Documento',
      title: '',
      message: '',
      createdAt: new Date().toISOString(),
      requestedAt: new Date().toISOString(),
    } as Notification;
  }
  try {
    return await markAsRead(id);
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, 'No se pudo marcar como leída.'));
  }
});

export const readAll = createAsyncThunk('notifications/readAll', async (_: void, { rejectWithValue }) => {
  if (isDemoMode()) return;
  try {
    await markAllAsRead();
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, 'No se pudieron marcar como leídas.'));
  }
});

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadNotifications.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.unreadCount = action.payload.filter((n) => !n.isRead).length;
      })
      .addCase(loadNotifications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(loadUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload.length;
      })
      .addCase(readNotification.fulfilled, (state, action) => {
        const index = state.items.findIndex((n) => n.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      })
      .addCase(readAll.fulfilled, (state) => {
        state.items = state.items.map((n) => ({ ...n, isRead: true }));
        state.unreadCount = 0;
      });
  },
});

export const notificationsReducer = notificationsSlice.reducer;
