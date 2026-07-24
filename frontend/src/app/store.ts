import { configureStore } from '@reduxjs/toolkit';

import { authReducer } from '../features/auth/store/auth.slice';

/**
 * Store global de Redux Toolkit.
 *
 * Cada feature registra su propio reducer en el objeto `reducer`.
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// Tipos derivados del store para usar en hooks tipados (useSelector / useDispatch).
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
