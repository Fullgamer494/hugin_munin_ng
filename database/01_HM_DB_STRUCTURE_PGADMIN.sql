SET timezone = 'America/Mexico_City';

-- Tabla de roles
CREATE TABLE rol(
    id_rol SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE
);

COMMENT ON TABLE rol IS 'Roles del sistema (Administrador, Biólogo, Veterinario, Patólogo, Cuidador)';

-- Tabla de usuarios
CREATE TABLE usuario(
    id_usuario SERIAL PRIMARY KEY,
    
    id_rol INT NOT NULL,
    CONSTRAINT fk_usuario_rol FOREIGN KEY(id_rol) REFERENCES rol(id_rol) ON DELETE RESTRICT,
    
    nombre_usuario VARCHAR(100) NOT NULL UNIQUE,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso TIMESTAMP
);

COMMENT ON TABLE usuario IS 'Usuarios del sistema con credenciales y rol asignado';
COMMENT ON COLUMN usuario.contrasena IS 'Contraseña hasheada (bcrypt recomendado)';

-- Índices para usuario
CREATE INDEX idx_usuario_rol ON usuario(id_rol);
CREATE INDEX idx_usuario_activo ON usuario(activo) WHERE activo = TRUE;
CREATE INDEX idx_usuario_correo ON usuario(correo);

-- Tabla de permisos
CREATE TABLE permiso(
    id_permiso SERIAL PRIMARY KEY,
    nombre_permiso VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);

COMMENT ON TABLE permiso IS 'Catálogo de permisos granulares del sistema';

-- Tabla intermedia rol-permiso (muchos a muchos)
CREATE TABLE rol_permiso(
    id_rol INT NOT NULL,
    id_permiso INT NOT NULL,
    
    PRIMARY KEY(id_rol, id_permiso),
    
    CONSTRAINT fk_rol_permiso_rol FOREIGN KEY(id_rol) REFERENCES rol(id_rol) ON DELETE CASCADE,
    CONSTRAINT fk_rol_permiso_permiso FOREIGN KEY(id_permiso) REFERENCES permiso(id_permiso) ON DELETE CASCADE
);

COMMENT ON TABLE rol_permiso IS 'Matriz de permisos asignados a cada rol (RBAC)';

-- Índices para rol_permiso
CREATE INDEX idx_rol_permiso_rol ON rol_permiso(id_rol);
CREATE INDEX idx_rol_permiso_permiso ON rol_permiso(id_permiso);


-- =====================================================
-- SECCIÓN 2: TABLAS DE ANIMALES
-- =====================================================

-- Tabla de especies
CREATE TABLE especie(
    id_especie SERIAL PRIMARY KEY,
    genero VARCHAR(50) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    nombre_comun VARCHAR(100),
    
    CONSTRAINT uq_genero_especie UNIQUE(genero, especie)
);

COMMENT ON TABLE especie IS 'Catálogo de especies (nomenclatura binomial: género + especie)';
COMMENT ON COLUMN especie.genero IS 'Género taxonómico (ej: Panthera)';
COMMENT ON COLUMN especie.especie IS 'Especie taxonómica (ej: leo)';

-- Índice para búsquedas por especie
CREATE INDEX idx_especie_genero ON especie(genero);
CREATE INDEX idx_especie_nombre_comun ON especie(nombre_comun);

-- Tabla de especímenes (individuos)
CREATE TABLE especimen(
    id_especimen SERIAL PRIMARY KEY,
    num_inventario VARCHAR(20) NOT NULL UNIQUE,
    
    id_especie INT NOT NULL,
    CONSTRAINT fk_especimen_especie FOREIGN KEY(id_especie) REFERENCES especie(id_especie) ON DELETE RESTRICT,
    
    nombre_especimen VARCHAR(100) NOT NULL,
    sexo CHAR(1) CHECK (sexo IN ('M', 'F', 'I')),
    fecha_nacimiento DATE,
    activo BOOLEAN DEFAULT TRUE,
    
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE especimen IS 'Especímenes individuales (animales) en el zoológico';
COMMENT ON COLUMN especimen.num_inventario IS 'Número de inventario único del ejemplar';
COMMENT ON COLUMN especimen.sexo IS 'M=Macho, F=Hembra, I=Indeterminado';
COMMENT ON COLUMN especimen.activo IS 'FALSE si el animal fue dado de baja';

-- Índices para especimen
CREATE INDEX idx_especimen_especie ON especimen(id_especie);
CREATE INDEX idx_especimen_activo ON especimen(activo) WHERE activo = TRUE;
CREATE INDEX idx_especimen_num_inventario ON especimen(num_inventario);


-- =====================================================
-- SECCIÓN 3: REGISTRO DE ALTAS
-- =====================================================

-- Catálogo de orígenes de alta
CREATE TABLE origen_alta(
    id_origen_alta SERIAL PRIMARY KEY,
    nombre_origen_alta VARCHAR(100) NOT NULL UNIQUE
);

COMMENT ON TABLE origen_alta IS 'Catálogo de procedencias de ingreso (Donación, Rescate, Incautado, etc.)';

-- Tabla de registros de alta
CREATE TABLE registro_alta(
    id_registro_alta SERIAL PRIMARY KEY,
    
    id_especimen INT NOT NULL UNIQUE,
    CONSTRAINT fk_alta_especimen FOREIGN KEY(id_especimen) REFERENCES especimen(id_especimen) ON DELETE CASCADE,
    
    id_origen_alta INT NOT NULL,
    CONSTRAINT fk_alta_origen FOREIGN KEY(id_origen_alta) REFERENCES origen_alta(id_origen_alta) ON DELETE RESTRICT,
    
    id_responsable INT NOT NULL,
    CONSTRAINT fk_alta_responsable FOREIGN KEY(id_responsable) REFERENCES usuario(id_usuario) ON DELETE RESTRICT,
    
    fecha_ingreso DATE NOT NULL DEFAULT CURRENT_DATE,
    procedencia VARCHAR(200),
    observacion TEXT,
    
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE registro_alta IS 'Registro de ingreso de especímenes al zoológico';

-- Índices para registro_alta
CREATE INDEX idx_alta_especimen ON registro_alta(id_especimen);
CREATE INDEX idx_alta_fecha ON registro_alta(fecha_ingreso);
CREATE INDEX idx_alta_responsable ON registro_alta(id_responsable);


-- =====================================================
-- SECCIÓN 4: REGISTRO DE BAJAS
-- =====================================================

-- Catálogo de causas de baja
CREATE TABLE causa_baja(
    id_causa_baja SERIAL PRIMARY KEY,
    nombre_causa_baja VARCHAR(100) NOT NULL UNIQUE
);

COMMENT ON TABLE causa_baja IS 'Catálogo de causas de baja (Deceso, Traslado, Liberación, etc.)';

-- Tabla de registros de baja
CREATE TABLE registro_baja(
    id_registro_baja SERIAL PRIMARY KEY,
    
    id_especimen INT NOT NULL UNIQUE,
    CONSTRAINT fk_baja_especimen FOREIGN KEY(id_especimen) REFERENCES especimen(id_especimen) ON DELETE CASCADE,
    
    id_causa_baja INT NOT NULL,
    CONSTRAINT fk_baja_causa FOREIGN KEY(id_causa_baja) REFERENCES causa_baja(id_causa_baja) ON DELETE RESTRICT,
    
    id_responsable INT NOT NULL,
    CONSTRAINT fk_baja_responsable FOREIGN KEY(id_responsable) REFERENCES usuario(id_usuario) ON DELETE RESTRICT,
    
    fecha_baja DATE NOT NULL DEFAULT CURRENT_DATE,
    observacion TEXT,
    
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE registro_baja IS 'Registro de salida de especímenes del zoológico';

-- Índices para registro_baja
CREATE INDEX idx_baja_especimen ON registro_baja(id_especimen);
CREATE INDEX idx_baja_fecha ON registro_baja(fecha_baja);
CREATE INDEX idx_baja_causa ON registro_baja(id_causa_baja);

-- Función para trigger de baja
CREATE OR REPLACE FUNCTION set_especimen_inactivo()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE especimen
    SET activo = FALSE
    WHERE id_especimen = NEW.id_especimen;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION set_especimen_inactivo IS 'Marca automáticamente un espécimen como inactivo al registrar su baja';

-- Trigger para desactivar especimen al registrar baja
CREATE TRIGGER trg_set_estado_baja
AFTER INSERT ON registro_baja
FOR EACH ROW
EXECUTE FUNCTION set_especimen_inactivo();


-- =====================================================
-- SECCIÓN 5: SISTEMA DE REPORTES
-- =====================================================

-- Catálogo de tipos de reporte
CREATE TABLE tipo_reporte(
    id_tipo_reporte SERIAL PRIMARY KEY,
    nombre_tipo_reporte VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT
);

COMMENT ON TABLE tipo_reporte IS 'Catálogo de tipos de reportes (Clínico, Conductual, Alimenticio, Defunción, Traslado)';

-- Tabla padre de reportes
CREATE TABLE reporte(
    id_reporte SERIAL PRIMARY KEY,

    id_tipo_reporte INT NOT NULL,
    CONSTRAINT fk_reporte_tipo FOREIGN KEY(id_tipo_reporte) REFERENCES tipo_reporte(id_tipo_reporte) ON DELETE RESTRICT,
    
    id_especimen INT NOT NULL,
    CONSTRAINT fk_reporte_especimen FOREIGN KEY(id_especimen) REFERENCES especimen(id_especimen) ON DELETE CASCADE,
    
    id_responsable INT NOT NULL,
    CONSTRAINT fk_reporte_responsable FOREIGN KEY(id_responsable) REFERENCES usuario(id_usuario) ON DELETE RESTRICT,
    
    asunto VARCHAR(200) NOT NULL,
    fecha_reporte DATE NOT NULL DEFAULT CURRENT_DATE,
    contenido TEXT NOT NULL,
    
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP
);

COMMENT ON TABLE reporte IS 'Tabla padre para todos los tipos de reportes del sistema';

-- Índices para reporte
CREATE INDEX idx_reporte_tipo ON reporte(id_tipo_reporte);
CREATE INDEX idx_reporte_especimen ON reporte(id_especimen);
CREATE INDEX idx_reporte_fecha ON reporte(fecha_reporte DESC);
CREATE INDEX idx_reporte_responsable ON reporte(id_responsable);

-- =====================================================
-- SECCIÓN 6: TABLAS HIJAS DE REPORTES
-- =====================================================

-- Tabla hija: Reporte de Traslado
CREATE TABLE reporte_traslado(
    id_reporte INT PRIMARY KEY,
    
    CONSTRAINT fk_reporte_traslado FOREIGN KEY(id_reporte) REFERENCES reporte(id_reporte) ON DELETE CASCADE,
    
    area_origen VARCHAR(20) CHECK (area_origen IN ('Externo', 'Exhibición', 'Guardería', 'Cuarentena')) NOT NULL DEFAULT 'Externo',
    area_destino VARCHAR(20) CHECK (area_destino IN ('Exhibición', 'Guardería', 'Cuarentena')) NOT NULL,
    ubicacion_origen VARCHAR(100) NOT NULL,
    ubicacion_destino VARCHAR(100) NOT NULL,
    motivo TEXT
);

COMMENT ON TABLE reporte_traslado IS 'Reporte especializado para traslados de especímenes entre áreas';

-- Tabla hija: Reporte Clínico
CREATE TABLE reporte_clinico(
    id_reporte INT PRIMARY KEY,
    
    CONSTRAINT fk_reporte_clinico FOREIGN KEY(id_reporte) REFERENCES reporte(id_reporte) ON DELETE CASCADE,
    
    diagnostico TEXT NOT NULL,
    tratamiento TEXT,
    medicamentos TEXT,
    dosis VARCHAR(100),
    frecuencia_tratamiento VARCHAR(100),
    fecha_proximo_control DATE,
    estado_salud VARCHAR(20) CHECK (estado_salud IN ('Crítico', 'Grave', 'Estable', 'Bueno', 'Excelente'))
);

COMMENT ON TABLE reporte_clinico IS 'Reporte especializado para consultas veterinarias y tratamientos médicos';

-- Tabla hija: Reporte Conductual
CREATE TABLE reporte_conductual(
    id_reporte INT PRIMARY KEY,
    
    CONSTRAINT fk_reporte_conductual FOREIGN KEY(id_reporte) REFERENCES reporte(id_reporte) ON DELETE CASCADE,
    
    comportamiento_observado TEXT NOT NULL,
    frecuencia VARCHAR(50),
    duracion_minutos INT,
    contexto TEXT,
    interacciones_sociales TEXT,
    recomendaciones TEXT,
    
    CONSTRAINT chk_duracion_positiva CHECK (duracion_minutos IS NULL OR duracion_minutos >= 0)
);

COMMENT ON TABLE reporte_conductual IS 'Reporte especializado para observaciones etológicas y de comportamiento';

-- Tabla hija: Reporte Alimenticio
CREATE TABLE reporte_alimenticio(
    id_reporte INT PRIMARY KEY,
    
    CONSTRAINT fk_reporte_alimenticio FOREIGN KEY(id_reporte) REFERENCES reporte(id_reporte) ON DELETE CASCADE,
    
    tipo_alimento VARCHAR(200) NOT NULL,
    cantidad VARCHAR(100),
    unidad_medida VARCHAR(50),
    consumo_observado VARCHAR(20) CHECK (consumo_observado IN ('Total', 'Parcial', 'Mínimo', 'Nulo')),
    apetito VARCHAR(20) CHECK (apetito IN ('Excelente', 'Normal', 'Reducido', 'Ausente')),
    cambios_dieta TEXT,
    observaciones_conducta_alimentaria TEXT
);

COMMENT ON TABLE reporte_alimenticio IS 'Reporte especializado para registro de alimentación y consumo';

-- Tabla hija: Reporte de Defunción
CREATE TABLE reporte_defuncion(
    id_reporte INT PRIMARY KEY,
    
    CONSTRAINT fk_reporte_defuncion FOREIGN KEY(id_reporte) REFERENCES reporte(id_reporte) ON DELETE CASCADE,
    
    fecha_defuncion TIMESTAMP NOT NULL,
    causa_muerte TEXT NOT NULL,
    sintomas_previos TEXT,
    necropsia_realizada BOOLEAN DEFAULT FALSE,
    resultado_necropsia TEXT,
    diagnostico_final TEXT,
    medidas_preventivas TEXT
);

COMMENT ON TABLE reporte_defuncion IS 'Reporte especializado para registro de defunciones y análisis post-mortem';

-- Índices para tablas hijas
CREATE INDEX idx_reporte_clinico_estado ON reporte_clinico(estado_salud);
CREATE INDEX idx_reporte_defuncion_fecha ON reporte_defuncion(fecha_defuncion DESC);


-- =====================================================
-- SECCIÓN 7: TRIGGERS DE VALIDACIÓN
-- =====================================================

-- Función para prevenir múltiples reportes de defunción
CREATE OR REPLACE FUNCTION prevent_multiple_death_reports()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo aplicar para reportes de defunción (id_tipo_reporte = 4)
    IF NEW.id_tipo_reporte = 4 THEN
        IF EXISTS (
            SELECT 1 
            FROM reporte 
            WHERE id_especimen = NEW.id_especimen 
              AND id_tipo_reporte = 4
        ) THEN
            RAISE EXCEPTION 'Ya existe un reporte de defunción para este espécimen (ID: %). No se pueden crear reportes de defunción duplicados.', NEW.id_especimen;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION prevent_multiple_death_reports IS 'Previene la creación de múltiples reportes de defunción para el mismo espécimen';

-- Trigger para INSERT
CREATE TRIGGER trg_prevent_multiple_death_reports_insert
BEFORE INSERT ON reporte
FOR EACH ROW
EXECUTE FUNCTION prevent_multiple_death_reports();

-- Función para prevenir cambios a defunción si ya existe uno
CREATE OR REPLACE FUNCTION prevent_death_report_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo aplicar si se está cambiando A defunción
    IF NEW.id_tipo_reporte = 4 AND OLD.id_tipo_reporte != 4 THEN
        IF EXISTS (
            SELECT 1 
            FROM reporte 
            WHERE id_especimen = NEW.id_especimen 
              AND id_tipo_reporte = 4
              AND id_reporte != NEW.id_reporte
        ) THEN
            RAISE EXCEPTION 'Ya existe un reporte de defunción para este espécimen (ID: %). No se pueden crear reportes de defunción duplicados.', NEW.id_especimen;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION prevent_death_report_update IS 'Previene actualizar un reporte a tipo defunción si ya existe uno para el espécimen';

-- Trigger para UPDATE
CREATE TRIGGER trg_prevent_multiple_death_reports_update
BEFORE UPDATE ON reporte
FOR EACH ROW
EXECUTE FUNCTION prevent_death_report_update();


-- =====================================================
-- SECCIÓN 8: FUNCIÓN DE ACTUALIZACIÓN DE TIMESTAMP
-- =====================================================

-- Función genérica para actualizar fecha de modificación
CREATE OR REPLACE FUNCTION update_modified_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_modificacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_modified_timestamp IS 'Actualiza automáticamente el campo fecha_modificacion';

-- Aplicar trigger a reporte
CREATE TRIGGER trg_reporte_modified
BEFORE UPDATE ON reporte
FOR EACH ROW
EXECUTE FUNCTION update_modified_timestamp();


-- =====================================================
-- SECCIÓN 9: VISTAS BÁSICAS
-- =====================================================

-- Vista: Especímenes con información completa
CREATE OR REPLACE VIEW v_especimenes_completo AS
SELECT 
    e.id_especimen,
    e.num_inventario,
    e.nombre_especimen,
    e.sexo,
    e.fecha_nacimiento,
    EXTRACT(YEAR FROM AGE(CURRENT_DATE, e.fecha_nacimiento)) AS edad_años,
    e.activo,
    esp.genero,
    esp.especie,
    esp.nombre_comun,
    CONCAT(esp.genero, ' ', esp.especie) AS nombre_cientifico,
    ra.fecha_ingreso,
    oa.nombre_origen_alta AS origen,
    u.nombre_usuario AS responsable_alta
FROM especimen e
JOIN especie esp ON e.id_especie = esp.id_especie
LEFT JOIN registro_alta ra ON e.id_especimen = ra.id_especimen
LEFT JOIN origen_alta oa ON ra.id_origen_alta = oa.id_origen_alta
LEFT JOIN usuario u ON ra.id_responsable = u.id_usuario;

COMMENT ON VIEW v_especimenes_completo IS 'Vista consolidada con información completa de especímenes';


-- Vista: Reportes con información de tipo y responsable
CREATE OR REPLACE VIEW v_reportes_completo AS
SELECT 
    r.id_reporte,
    r.asunto,
    r.fecha_reporte,
    r.contenido,
    tr.nombre_tipo_reporte AS tipo_reporte,
    e.num_inventario,
    e.nombre_especimen,
    CONCAT(esp.genero, ' ', esp.especie) AS especie,
    u.nombre_usuario AS responsable,
    r.fecha_creacion
FROM reporte r
JOIN tipo_reporte tr ON r.id_tipo_reporte = tr.id_tipo_reporte
JOIN especimen e ON r.id_especimen = e.id_especimen
JOIN especie esp ON e.id_especie = esp.id_especie
JOIN usuario u ON r.id_responsable = u.id_usuario
ORDER BY r.fecha_reporte DESC;

COMMENT ON VIEW v_reportes_completo IS 'Vista consolidada de reportes con información relacionada';


-- =====================================================
-- FIN DEL SCRIPT DE ESTRUCTURA
-- =====================================================

-- Verificar creación de tablas
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Mensaje de finalización
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'ESTRUCTURA DE BASE DE DATOS CREADA EXITOSAMENTE';
    RAISE NOTICE 'Motor: PostgreSQL 17.7.1';
    RAISE NOTICE 'Base de datos: hugin_munin';
    RAISE NOTICE '========================================';
END $$;