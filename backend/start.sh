#!/bin/sh
# =============================================================
# Ryd-U-Demo · Script de arranque del backend (Docker)
# 1. Aplica el esquema de BD (idempotente) para que funcione
#    incluso si el volumen de Postgres ya existía sin tablas.
# 2. Ejecuta el seed (idempotente) para tener usuarios demo.
# 3. Inicia el servidor compilado.
# =============================================================
set -e

echo "==> [start.sh] Aplicando esquema de base de datos (prisma db push)..."
npx prisma db push --skip-generate

echo "==> [start.sh] Sembrando datos demo (idempotente)..."
npm run prisma:seed || echo "==> [start.sh] Seed omitido, se continúa con el arranque."

echo "==> [start.sh] Iniciando servidor..."
npm start
