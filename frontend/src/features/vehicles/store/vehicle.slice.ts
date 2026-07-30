import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { extractErrorMessage } from '../../../shared/utils/error-message';
import {
  createVehicleRequest,
  deleteVehicleRequest,
  fetchMyVehicles,
  updateVehicleRequest,
} from '../services/vehicle.service';
import type { Vehicle, VehicleInput } from '../types/vehicle.types';

interface VehicleState {
  items: Vehicle[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: VehicleState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchVehicles = createAsyncThunk('vehicles/fetchAll', async (_: void, { rejectWithValue }) => {
  try {
    return await fetchMyVehicles();
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, 'No se pudieron cargar tus vehículos.'));
  }
});

export const addVehicle = createAsyncThunk('vehicles/add', async (input: VehicleInput, { rejectWithValue }) => {
  try {
    return await createVehicleRequest(input);
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, 'No se pudo registrar el vehículo.'));
  }
});

export const editVehicle = createAsyncThunk(
  'vehicles/edit',
  async ({ id, input }: { id: string; input: Partial<VehicleInput> }, { rejectWithValue }) => {
    try {
      return await updateVehicleRequest(id, input);
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, 'No se pudo actualizar el vehículo.'));
    }
  },
);

export const removeVehicle = createAsyncThunk('vehicles/remove', async (id: string, { rejectWithValue }) => {
  try {
    await deleteVehicleRequest(id);
    return id;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, 'No se pudo eliminar el vehículo.'));
  }
});

const vehicleSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicles.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(addVehicle.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(editVehicle.fulfilled, (state, action) => {
        const index = state.items.findIndex((vehicle) => vehicle.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(removeVehicle.fulfilled, (state, action) => {
        state.items = state.items.filter((vehicle) => vehicle.id !== action.payload);
      });
  },
});

export const vehicleReducer = vehicleSlice.reducer;
