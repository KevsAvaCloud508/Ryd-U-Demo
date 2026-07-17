import { configureStore } from '@reduxjs/toolkit';

/**
 * Store global de Redux Toolkit.
 *
 * Configuración inicial únicamente: todavía no hay slices ni reducers de negocio.
 * Cada feature registrará su propio reducer en el objeto `reducer` más adelante.
 */
export const store = configureStore({
  reducer: {
    // ejemplo: auth: authReducer,
  },
});

// Tipos derivados del store para usar en hooks tipados (useSelector / useDispatch).
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
