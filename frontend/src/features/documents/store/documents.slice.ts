import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { extractErrorMessage } from '../../../shared/utils/error-message';
import {
  deleteDocument,
  fetchMyDocuments,
  uploadDocumentFile,
} from '../services/documents.service';
import type { VerificationDocument, DocumentType } from '../types/documents.types';

interface DocumentsState {
  items: VerificationDocument[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DocumentsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const loadDocuments = createAsyncThunk('documents/load', async (_: void, { rejectWithValue }) => {
  try {
    return await fetchMyDocuments();
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, 'No se pudieron cargar los documentos.'));
  }
});

export const uploadDoc = createAsyncThunk(
  'documents/upload',
  async ({ file, type }: { file: File; type: DocumentType }, { rejectWithValue }) => {
    try {
      return await uploadDocumentFile(file, type);
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, 'No se pudo subir el documento.'));
    }
  },
);

export const removeDoc = createAsyncThunk('documents/remove', async (id: string, { rejectWithValue }) => {
  try {
    await deleteDocument(id);
    return id;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, 'No se pudo eliminar el documento.'));
  }
});

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadDocuments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadDocuments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(loadDocuments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(uploadDoc.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(removeDoc.fulfilled, (state, action) => {
        state.items = state.items.filter((d) => d.id !== action.payload);
      });
  },
});

export const documentsReducer = documentsSlice.reducer;
