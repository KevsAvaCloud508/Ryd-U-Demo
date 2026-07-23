import { createApp } from './app.js';
import { env } from './config/env.js';

/**
 * Punto de entrada del backend: crea la app y comienza a escuchar peticiones.
 */
const app = createApp();

app.listen(env.port, () => {
  console.log(`Ryd-U API escuchando en http://localhost:${env.port} (${env.nodeEnv})`);
});
