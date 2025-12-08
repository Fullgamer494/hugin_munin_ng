-- 1. TABLAS DE USUARIOS Y ROLES
------------------------------------

CREATE TABLE rol(
    id_rol SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE usuario(
    id_usuario SERIAL PRIMARY KEY,
    id_rol INT NOT NULL REFERENCES rol(id_rol),
    nombre_usuario VARCHAR(100) NOT NULL UNIQUE,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(100) NOT NULL,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE permiso(
    id_permiso SERIAL PRIMARY KEY,
    nombre_permiso VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE rol_permiso(
    id_rol INT NOT NULL REFERENCES rol(id_rol),
    id_permiso INT NOT NULL REFERENCES permiso(id_permiso),
    PRIMARY KEY(id_rol, id_permiso)
);

-- 2. TABLAS DE ANIMALES Y REGISTROS
------------------------------------

CREATE TABLE especie(
    id_especie SERIAL PRIMARY KEY,
    genero VARCHAR(50) NOT NULL,
    especie VARCHAR(50) NOT NULL
);

CREATE TABLE especimen(
    id_especimen SERIAL PRIMARY KEY,
    num_inventario VARCHAR(20) NOT NULL UNIQUE,
    id_especie INT NOT NULL REFERENCES especie(id_especie),
    nombre_especimen VARCHAR(100) NOT NULL,
    activo BOOLEAN DEFAULT TRUE
);

-- REGISTRO DE BAJA
CREATE TABLE causa_baja(
    id_causa_baja SERIAL PRIMARY KEY,
    nombre_causa_baja VARCHAR(100)
);

CREATE TABLE registro_baja(
    id_registro_baja SERIAL PRIMARY KEY,
    id_especimen INT NOT NULL UNIQUE REFERENCES especimen(id_especimen),
    id_causa_baja INT NOT NULL REFERENCES causa_baja(id_causa_baja),
    id_responsable INT NOT NULL REFERENCES usuario(id_usuario),
    fecha_baja DATE,
    observacion TEXT
);

-- TRIGGER DE BAJA (PostgreSQL)
------------------------------------

-- Función para actualizar el estado del espécimen a inactivo (activo = FALSE)
CREATE OR REPLACE FUNCTION set_estado_baja_func()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE especimen
    SET activo = FALSE
    WHERE id_especimen = NEW.id_especimen;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Definición del Trigger
CREATE TRIGGER trg_set_estado_baja
AFTER INSERT ON registro_baja
FOR EACH ROW
EXECUTE FUNCTION set_estado_baja_func();


-- 3. TABLAS DE REPORTES Y TRASLADOS
------------------------------------

CREATE TABLE tipo_reporte(
    id_tipo_reporte SERIAL PRIMARY KEY,
    nombre_tipo_reporte VARCHAR(50)
);

CREATE TABLE reporte(
    id_reporte SERIAL PRIMARY KEY,
    id_tipo_reporte INT NOT NULL REFERENCES tipo_reporte(id_tipo_reporte),
    id_especimen INT NOT NULL REFERENCES especimen(id_especimen),
    id_responsable INT NOT NULL REFERENCES usuario(id_usuario),
    asunto VARCHAR(200) NOT NULL,
    fecha_reporte DATE,
    contenido TEXT NOT NULL
);

-- REPORTE TRASLADO (Reemplazo de ENUM con CHECK constraint)
CREATE TABLE reporte_traslado(
    id_reporte INT PRIMARY KEY REFERENCES reporte(id_reporte) ON DELETE CASCADE,
    area_origen VARCHAR(10) NOT NULL DEFAULT 'Externo'
        CHECK (area_origen IN ('Externo', 'Exhibición', 'Guardería', 'Cuarentena')),
    area_destino VARCHAR(10) NOT NULL
        CHECK (area_destino IN ('Exhibición', 'Guardería', 'Cuarentena')),
    ubicacion_origen VARCHAR(100) NOT NULL,
    ubicacion_destino VARCHAR(100) NOT NULL,
    motivo TEXT
);

-- REGISTRO DE ALTA
CREATE TABLE origen_alta(
    id_origen_alta SERIAL PRIMARY KEY,
    nombre_origen_alta VARCHAR(100) NOT NULL
);

CREATE TABLE registro_alta(
    id_registro_alta SERIAL PRIMARY KEY,
    id_especimen INT NOT NULL UNIQUE REFERENCES especimen(id_especimen),
    id_origen_alta INT NOT NULL REFERENCES origen_alta(id_origen_alta),
    id_responsable INT NOT NULL REFERENCES usuario(id_usuario),
    fecha_ingreso DATE,
    procedencia VARCHAR(100),
    observacion TEXT,
	id_reporte_traslado INT UNIQUE REFERENCES reporte(id_reporte)
);

-- 4. TRIGGERS DE PREVENCIÓN DE DEFUNCIÓN (PostgreSQL)
------------------------------------------------------

-- Función para prevenir múltiples reportes de defunción (id_tipo_reporte = 4)
CREATE OR REPLACE FUNCTION prevent_multiple_death_reports_func()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo aplicar la restricción para reportes de defunción (id_tipo_reporte = 4)
    IF NEW.id_tipo_reporte = 4 THEN
        -- Verificar si ya existe un reporte de defunción para este espécimen
        IF EXISTS (
            SELECT 1
            FROM reporte
            WHERE id_especimen = NEW.id_especimen
            AND id_tipo_reporte = 4
            -- Excluir el registro actual si es una actualización (UPDATE)
            AND (TG_OP = 'INSERT' OR id_reporte != NEW.id_reporte)
        ) THEN
            -- Lanzar error
            RAISE EXCEPTION 'Ya existe un reporte de defunción para este espécimen. No se pueden crear/actualizar reportes de defunción duplicados.';
        END IF;
    END IF;

    -- Si es una actualización, solo verificar si se está cambiando A defunción
    IF TG_OP = 'UPDATE' AND NEW.id_tipo_reporte = 4 AND OLD.id_tipo_reporte != 4 THEN
         IF EXISTS (
            SELECT 1
            FROM reporte
            WHERE id_especimen = NEW.id_especimen
            AND id_tipo_reporte = 4
            AND id_reporte != NEW.id_reporte
        ) THEN
            RAISE EXCEPTION 'Ya existe un reporte de defunción para este espécimen. No se pueden actualizar a defunción.';
        END IF;
    END IF;

    RETURN NEW; -- Continuar la operación
END;
$$ LANGUAGE plpgsql;

-- Definición del Trigger para INSERT y UPDATE
CREATE TRIGGER trg_prevent_multiple_death_reports
BEFORE INSERT OR UPDATE ON reporte
FOR EACH ROW
EXECUTE FUNCTION prevent_multiple_death_reports_func();