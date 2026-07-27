import { configureStore } from '@reduxjs/toolkit';

import { authReducer } from '../features/auth/store/auth.slice';
import { tripsReducer } from '../features/trips/store/trips.slice';
import { requestsReducer } from '../features/requests/store/requests.slice';
import { documentsReducer } from '../features/documents/store/documents.slice';
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
    trips: tripsReducer,
    requests: requestsReducer,
    documents: documentsReducer,
    ratings: ratingsReducer,
    notifications: notificationsReducer,
  },
});

// Tipos derivados del store para usar en hooks tipados (useSelector / useDispatch).
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
