import { configureStore } from '@reduxjs/toolkit';

/**
 *
 * Configuración inicial todavía no hay slices ni reducers.
 */
export const store = configureStore({
  reducer: {},
});

// Tipos derivados del store para usar en hooks tipados (useSelector / useDispatch).
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
