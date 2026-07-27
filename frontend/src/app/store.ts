import { configureStore } from '@reduxjs/toolkit';

import { authReducer } from '../features/auth/store/auth.slice';
import { requestsReducer } from '../features/requests/store/requests.slice';
import { ratingsReducer } from '../features/ratings/store/ratings.slice';
import { notificationsReducer } from '../features/notifications/store/notifications.slice';

/**
 * Store global de Redux Toolkit.
 *
 * Cada feature registra su propio reducer en el objeto `reducer`.
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    requests: requestsReducer,
    ratings: ratingsReducer,
    notifications: notificationsReducer,
  },
});

// Tipos derivados del store para usar en hooks tipados (useSelector / useDispatch).
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
