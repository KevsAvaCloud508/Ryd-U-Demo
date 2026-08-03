import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { extractErrorMessage } from '../../../shared/utils/error-message';
import { isDemoMode } from '../../../shared/utils/token-storage';
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

// ── Persistencia del modo demo ─────────────────────────────────────
// En modo demo no hay backend, así que los documentos se guardan en
// localStorage por usuario (email mock) para que el flujo de verificación
// sea real: sin los 2 documentos no hay acceso, y al subirlos se conservan
// aunque se recargue la página.
const DEMO_DOCS_PREFIX = 'rydu_demo_documents_';

function demoDocsKey(): string {
  const email = localStorage.getItem('rydu_mock_email') ?? 'demo';
  return `${DEMO_DOCS_PREFIX}${email}`;
}

function readDemoDocs(): VerificationDocument[] {
  try {
    const raw = localStorage.getItem(demoDocsKey());
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as VerificationDocument[]) : [];
  } catch {
    return [];
  }
}

function writeDemoDocs(docs: VerificationDocument[]): void {
  localStorage.setItem(demoDocsKey(), JSON.stringify(docs));
}

function demoDocument(type: DocumentType, file: File): VerificationDocument {
  return {
    id: `demo-${Date.now()}-${Math.round(Math.random() * 1e6)}`,
    userId: 'demo-user',
    type,
    fileUrl: URL.createObjectURL(file),
    status: 'Pendiente',
    notes: null,
    uploadedAt: new Date().toISOString(),
  };
}

export const loadDocuments = createAsyncThunk('documents/loadAll', async (_: void, { rejectWithValue }) => {
  // En modo demo se devuelven los documentos persistidos en localStorage.
  if (isDemoMode()) return readDemoDocs();
  try {
    return await fetchMyDocuments();
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, 'No se pudieron cargar los documentos.'));
  }
});

export const uploadDoc = createAsyncThunk('documents/upload', async (input: { type: DocumentType; file: File }, { rejectWithValue }) => {
  // En modo demo se simula la subida en el cliente y se persiste.
  if (isDemoMode()) {
    try {
      const doc = demoDocument(input.type, input.file);
      const next = readDemoDocs().filter((d) => d.type !== doc.type).concat(doc);
      writeDemoDocs(next);
      return doc;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, 'No se pudo subir el documento.'));
    }
  }
  try {
    return await uploadDocumentFile(input.type, input.file);
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, 'No se pudo subir el documento.'));
  }
});

export const removeDoc = createAsyncThunk('documents/delete', async (documentId: string, { rejectWithValue }) => {
  if (isDemoMode()) {
    try {
      const next = readDemoDocs().filter((d) => d.id !== documentId);
      writeDemoDocs(next);
      return documentId;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, 'No se pudo eliminar el documento.'));
    }
  }
  try {
    await deleteDocumentService(documentId);
    return documentId;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, 'No se pudo eliminar el documento.'));
  }
});

// En modo demo, al enviar los documentos para revisión se marcan como
// Aceptados (aprobación instantánea) y se persisten, otorgando acceso
// completo a la app. En modo real es un no-op: la aprobación la hace la
// plataforma por otro medio.
export const approveDemoDocuments = createAsyncThunk(
  'documents/approveDemo',
  async (_: void, { getState, rejectWithValue }) => {
    if (!isDemoMode()) return null;
    try {
      const state = getState() as { documents: DocumentsState };
      const approved = state.documents.items.map((d) => ({ ...d, status: 'Aceptado' as const }));
      writeDemoDocs(approved);
      return approved;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, 'No se pudieron aprobar los documentos.'));
    }
  },
);

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
      })
      .addCase(approveDemoDocuments.fulfilled, (state, action) => {
        if (action.payload) state.items = action.payload;
      });
  },
});

export const documentsReducer = documentsSlice.reducer;
