import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { extractErrorMessage } from '../../../shared/utils/error-message';
import { fetchMyAverageRating, fetchMyRatings, submitRating } from '../services/ratings.service';
import type { AverageRating, Rating, RatingInput } from '../types/ratings.types';

interface RatingsState {
  items: Rating[];
  average: AverageRating | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: RatingsState = {
  items: [],
  average: null,
  status: 'idle',
  error: null,
};

export const loadMyRatings = createAsyncThunk('ratings/loadMine', async (_: void, { rejectWithValue }) => {
  try {
    return await fetchMyRatings();
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, 'No se pudieron cargar las calificaciones.'));
  }
});

export const loadAverageRating = createAsyncThunk('ratings/loadAverage', async (_: void, { rejectWithValue }) => {
  try {
    return await fetchMyAverageRating();
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, 'No se pudo cargar el promedio.'));
  }
});

export const rateTrip = createAsyncThunk('ratings/submit', async (input: RatingInput, { rejectWithValue }) => {
  try {
    return await submitRating(input);
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, 'No se pudo calificar.'));
  }
});

const ratingsSlice = createSlice({
  name: 'ratings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadMyRatings.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadMyRatings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(loadMyRatings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(loadAverageRating.fulfilled, (state, action) => {
        state.average = action.payload;
      })
      .addCase(rateTrip.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      });
  },
});

export const ratingsReducer = ratingsSlice.reducer;
