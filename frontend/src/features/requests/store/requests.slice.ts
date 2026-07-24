import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { extractErrorMessage } from '../../../shared/utils/error-message';
import {
  cancelRequest,
  createRequest,
  fetchMyRequests,
  fetchTripRequests,
  updateRequestStatus,
} from '../services/requests.service';
import type { TripRequest, TripRequestInput, UpdateRequestStatusInput } from '../types/requests.types';

interface RequestsState {
  items: TripRequest[];
  tripRequests: TripRequest[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: RequestsState = {
  items: [],
  tripRequests: [],
  status: 'idle',
  error: null,
};

export const loadMyRequests = createAsyncThunk('requests/loadMine', async (_: void, { rejectWithValue }) => {
  try {
    return await fetchMyRequests();
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, 'No se pudieron cargar las solicitudes.'));
  }
});

export const loadTripRequests = createAsyncThunk('requests/loadByTrip', async (tripId: string, { rejectWithValue }) => {
  try {
    return await fetchTripRequests(tripId);
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, 'No se pudieron cargar las solicitudes del viaje.'));
  }
});

export const sendRequest = createAsyncThunk('requests/send', async (input: TripRequestInput, { rejectWithValue }) => {
  try {
    return await createRequest(input);
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, 'No se pudo enviar la solicitud.'));
  }
});

export const acceptOrReject = createAsyncThunk(
  'requests/updateStatus',
  async ({ id, input }: { id: string; input: UpdateRequestStatusInput }, { rejectWithValue }) => {
    try {
      return await updateRequestStatus(id, input);
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, 'No se pudo actualizar la solicitud.'));
    }
  },
);

export const cancelMyRequest = createAsyncThunk('requests/cancel', async (id: string, { rejectWithValue }) => {
  try {
    return await cancelRequest(id);
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, 'No se pudo cancelar la solicitud.'));
  }
});

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadMyRequests.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadMyRequests.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(loadMyRequests.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(loadTripRequests.fulfilled, (state, action) => {
        state.tripRequests = action.payload;
      })
      .addCase(sendRequest.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(acceptOrReject.fulfilled, (state, action) => {
        const index = state.items.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
        const tripIndex = state.tripRequests.findIndex((r) => r.id === action.payload.id);
        if (tripIndex !== -1) state.tripRequests[tripIndex] = action.payload;
      })
      .addCase(cancelMyRequest.fulfilled, (state, action) => {
        const index = state.items.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      });
  },
});

export const requestsReducer = requestsSlice.reducer;
