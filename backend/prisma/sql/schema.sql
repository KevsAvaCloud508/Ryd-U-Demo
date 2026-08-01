-- =============================================================
-- Ryd-U-Demo · Esquema de base de datos (PostgreSQL)
-- Ejecutar conectado a la base de datos destino (ej. rydu_db).
-- Este script es re-ejecutable: elimina y vuelve a crear todo.
-- =============================================================

DROP TABLE IF EXISTS DocumentoVerificacion CASCADE;
DROP TABLE IF EXISTS Notificacion CASCADE;
DROP TABLE IF EXISTS Calificacion CASCADE;
DROP TABLE IF EXISTS SolicitudViaje CASCADE;
DROP TABLE IF EXISTS Viaje CASCADE;
DROP TABLE IF EXISTS Ruta CASCADE;
DROP TABLE IF EXISTS Vehiculo CASCADE;
DROP TABLE IF EXISTS UsuarioRol CASCADE;
DROP TABLE IF EXISTS Rol CASCADE;
DROP TABLE IF EXISTS Usuario CASCADE;
DROP TABLE IF EXISTS Actividad CASCADE;
DROP TABLE IF EXISTS Incidencia CASCADE;
DROP TABLE IF EXISTS UsuarioDashboard CASCADE;
DROP TYPE IF EXISTS tipo_doc CASCADE;
DROP TYPE IF EXISTS estado_documento CASCADE;
DROP TYPE IF EXISTS estado_solicitud CASCADE;
DROP TYPE IF EXISTS estado_viaje CASCADE;

CREATE TABLE Usuario (
  id_usuario UUID PRIMARY KEY,
  nombre varchar(100) NOT NULL,
  apellido_paterno varchar(100) NOT NULL,
  apellido_materno varchar(100),
  correo varchar(150) UNIQUE,
  telefono varchar(15),
  contraseña varchar(255) NOT NULL,
  foto_perfil text,
  estado BOOLEAN DEFAULT TRUE,
  fecha_registro TIMESTAMP DEFAULT NOW()
);

CREATE TABLE Rol (
  id_rol SERIAL PRIMARY KEY,
  nombre varchar(30) NOT NULL UNIQUE
);

-- Roles base requeridos por el módulo de auth (registro/inicio de sesión).
INSERT INTO Rol (nombre) VALUES ('Pasajero'), ('Conductor'), ('Administrador')
ON CONFLICT (nombre) DO NOTHING;

CREATE TABLE UsuarioRol (
  id_usuario UUID NOT NULL,
  id_rol INT NOT NULL,
PRIMARY KEY (id_usuario, id_rol),
CONSTRAINT FK_id_UsuarioRol FOREIGN KEY (id_usuario) REFERENCES Usuario (id_usuario),
CONSTRAINT FK_id_RolUsuario FOREIGN KEY (id_rol) REFERENCES Rol (id_rol)
);

CREATE TABLE Vehiculo (
  id_vehiculo UUID PRIMARY KEY ,
  id_usuario UUID NOT NULL,
  marca varchar(50) NOT NULL,
  modelo varchar(50) NOT NULL,
  color varchar(30) NOT NULL,
  placas varchar(15) NOT NULL UNIQUE,
  capacidad SMALLINT NOT NULL CHECK (capacidad > 1),
  año SMALLINT,
  verificado BOOLEAN DEFAULT FALSE,
CONSTRAINT FK_id_UsuarioVehiculo FOREIGN KEY (id_usuario) REFERENCES Usuario (id_usuario)
);

CREATE TABLE Ruta (
  id_ruta UUID PRIMARY KEY,
  origen varchar(200) NOT NULL,
  destino varchar(200) NOT NULL,
  descripcion TEXT,
  distancia DECIMAL(6,2) DEFAULT 0.00,
  tiempo_estimado INT DEFAULT 0
);

CREATE TYPE estado_viaje AS ENUM ('Pendiente', 'En Proceso', 'Terminado');
CREATE TYPE estado_solicitud AS ENUM ('Pendiente', 'Aceptado', 'Rechazado', 'Cancelado');
CREATE TYPE estado_documento AS ENUM ('Pendiente', 'Aceptado', 'Rechazado');

CREATE TABLE Viaje (
  id_viaje UUID PRIMARY KEY,
  id_conductor UUID NOT NULL,
  id_vehiculo UUID NOT NULL,
  id_ruta UUID NOT NULL,
  fecha DATE NOT NULL,
  hora_salida TIME NOT NULL,
  lugares_disponibles SMALLINT NOT NULL CHECK (lugares_disponibles >= 0),
  costo DECIMAL(8,2) DEFAULT 0.00 CHECK (costo >= 0),
  estado estado_viaje DEFAULT 'Pendiente',
CONSTRAINT FK_id_ConductorViaje FOREIGN KEY (id_conductor) REFERENCES Usuario (id_usuario),
CONSTRAINT FK_id_VehiculoViaje FOREIGN KEY (id_vehiculo) REFERENCES Vehiculo (id_vehiculo),
CONSTRAINT FK_id_RutaViaje FOREIGN KEY (id_ruta) REFERENCES Ruta (id_ruta)
);

CREATE TABLE SolicitudViaje (
  id_solicitud UUID PRIMARY KEY,
  id_viaje UUID NOT NULL,
  id_pasajero UUID NOT NULL,
  fecha_solicitud TIMESTAMP DEFAULT NOW(),
  estado estado_solicitud DEFAULT 'Pendiente',
CONSTRAINT FK_id_ViajeSolicitudViaje FOREIGN KEY (id_viaje) REFERENCES Viaje (id_viaje),
CONSTRAINT FK_id_PasajeroSolicitudViaje FOREIGN KEY (id_pasajero) REFERENCES Usuario (id_usuario)
);

CREATE TABLE Calificacion (
  id_calificacion UUID PRIMARY KEY,
  id_viaje UUID NOT NULL,
  id_emisor UUID NOT NULL,
  id_receptor UUID NOT NULL,
  puntuacion SMALLINT CONSTRAINT cal_punt_chk CHECK (puntuacion BETWEEN 1 AND 5),
  fecha_solicitud TIMESTAMP DEFAULT NOW(),
CONSTRAINT FK_id_ViajeCalificacion FOREIGN KEY (id_viaje) REFERENCES Viaje (id_viaje),
CONSTRAINT FK_id_EmisorCalificacion FOREIGN KEY (id_emisor) REFERENCES Usuario (id_usuario),
CONSTRAINT FK_id_ReceptorCalificacion FOREIGN KEY (id_receptor) REFERENCES Usuario (id_usuario)
);

CREATE TABLE Notificacion (
  id_notificacion UUID PRIMARY KEY,
  id_usuario UUID NOT NULL,
  titulo varchar(100) NOT NULL,
  mensaje TEXT NOT NULL,
  leida BOOLEAN DEFAULT FALSE,
  fecha_solicitud TIMESTAMP DEFAULT NOW(),
CONSTRAINT FK_id_UsuarioNotificacion FOREIGN KEY (id_usuario) REFERENCES Usuario (id_usuario)
);

CREATE TYPE tipo_doc AS ENUM ('INE', 'Licencia Conduccion', 'Credencial Estudiante', 'Poliza Vigente');

CREATE TABLE DocumentoVerificacion (
  id_documento UUID PRIMARY KEY,
  id_usuario UUID NOT NULL,
  tipo_documento tipo_doc NOT NULL,
  url_archivo TEXT NOT NULL,
  estado estado_documento DEFAULT 'Pendiente',
  observaciones TEXT,
  fecha_subida TIMESTAMP DEFAULT NOW(),
CONSTRAINT FK_id_UsuarioDocumentoVerificacion FOREIGN KEY (id_usuario) REFERENCES Usuario (id_usuario)
);

-- =============================================================
-- Tablas del Dashboard de Métricas / Incidencias (solo demo)
-- =============================================================

CREATE TABLE Incidencia (
  id_incidencia INT PRIMARY KEY,
  titulo varchar(200) NOT NULL,
  descripcion TEXT NOT NULL,
  categoria varchar(30) NOT NULL,
  prioridad varchar(15) NOT NULL,
  estado varchar(15) NOT NULL,
  creado varchar(15) NOT NULL,
  created_at TIMESTAMP(6) DEFAULT NOW(),
  updated_at TIMESTAMP(6) DEFAULT NOW()
);

CREATE TABLE Actividad (
  id_actividad SERIAL PRIMARY KEY,
  texto TEXT NOT NULL,
  hora varchar(255) NOT NULL,
  icono varchar(10) DEFAULT '📝',
  created_at TIMESTAMP(6) DEFAULT NOW()
);

CREATE TABLE UsuarioDashboard (
  id_usuario INT PRIMARY KEY,
  nombre varchar(100) NOT NULL,
  correo varchar(150) NOT NULL,
  rol varchar(20) NOT NULL,
  estado varchar(10) NOT NULL,
  registro varchar(15) NOT NULL
);
