import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { isDemoMode } from '../../../shared/utils/token-storage';
import { extractErrorMessage } from '../../../shared/utils/error-message';
import { DEMO_TRIPS } from '../demo-data';
import {
  createTripRequest,
  deleteTripRequest,
  fetchMyTripsAsDriver,
  fetchTripById,
  fetchTrips,
  updateTripRequest,
} from '../services/trips.service';
import type { Trip, TripInput, TripSearchParams } from '../types/trips.types';

interface TripsState {
  items: Trip[];
  currentTrip: Trip | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TripsState = {
  items: [],
  currentTrip: null,
  status: 'idle',
  error: null,
};

export const searchTrips = createAsyncThunk('trips/search', async (params: TripSearchParams | undefined, { rejectWithValue }) => {
  try {
    // En modo demo el backend rechaza el token mock; se filtran los viajes demo en el cliente.
    if (isDemoMode()) {
      let items = DEMO_TRIPS;
      if (params?.origin) items = items.filter((t) => t.route.origin.toLowerCase().includes(params.origin!.toLowerCase()));
      if (params?.destination)
        items = items.filter((t) => t.route.destination.toLowerCase().includes(params.destination!.toLowerCase()));
      if (params?.date) items = items.filter((t) => t.date.startsWith(params.date!));
      return items;
    }
    return await fetchTrips(params);
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, 'No se pudieron buscar viajes.'));
  }
});

export const loadMyTrips = createAsyncThunk('trips/loadMine', async (_: void, { rejectWithValue }) => {
  try {
    return await fetchMyTripsAsDriver();
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, 'No se pudieron cargar tus viajes.'));
  }
});

export const loadTripById = createAsyncThunk('trips/loadById', async (id: string, { rejectWithValue }) => {
  try {
    return await fetchTripById(id);
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, 'No se pudo cargar el viaje.'));
  }
});

export const createTrip = createAsyncThunk('trips/create', async (input: TripInput, { rejectWithValue }) => {
  try {
    return await createTripRequest(input);
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, 'No se pudo crear el viaje.'));
  }
});

export const updateTrip = createAsyncThunk(
  'trips/update',
  async ({ id, input }: { id: string; input: Partial<TripInput & { status: string }> }, { rejectWithValue }) => {
    try {
      return await updateTripRequest(id, input);
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, 'No se pudo actualizar el viaje.'));
    }
  },
);

export const removeTrip = createAsyncThunk('trips/remove', async (id: string, { rejectWithValue }) => {
  try {
    await deleteTripRequest(id);
    return id;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, 'No se pudo eliminar el viaje.'));
  }
});

const tripsSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    clearCurrentTrip(state) {
      state.currentTrip = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchTrips.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(searchTrips.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(searchTrips.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(loadMyTrips.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(loadTripById.fulfilled, (state, action) => {
        state.currentTrip = action.payload;
      })
      .addCase(createTrip.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateTrip.fulfilled, (state, action) => {
        const index = state.items.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
        if (state.currentTrip?.id === action.payload.id) state.currentTrip = action.payload;
      })
      .addCase(removeTrip.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
      });
  },
});

export const { clearCurrentTrip } = tripsSlice.actions;
export const tripsReducer = tripsSlice.reducer;
