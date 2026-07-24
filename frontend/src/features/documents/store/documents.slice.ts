import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { extractErrorMessage } from '../../../shared/utils/error-message';
import { fetchMyDocuments, uploadDocumentFile, deleteDocument as deleteDocumentService } from '../services/documents.service';
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

export const loadDocuments = createAsyncThunk('documents/loadAll', async (_: void, { rejectWithValue }) => {
  try {
    return await fetchMyDocuments();
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, 'No se pudieron cargar los documentos.'));
  }
});

export const uploadDoc = createAsyncThunk('documents/upload', async (input: { type: DocumentType; file: File }, { rejectWithValue }) => {
  try {
    return await uploadDocumentFile(input.type, input.file);
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, 'No se pudo subir el documento.'));
  }
});

export const removeDoc = createAsyncThunk('documents/delete', async (documentId: string, { rejectWithValue }) => {
  try {
    await deleteDocumentService(documentId);
    return documentId;
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
        const index = state.items.findIndex((d) => d.type === action.payload.type);
        if (index !== -1) {
          state.items[index] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(removeDoc.fulfilled, (state, action) => {
        state.items = state.items.filter((d) => d.id !== action.payload);
      });
  },
});

export const documentsReducer = documentsSlice.reducer;
