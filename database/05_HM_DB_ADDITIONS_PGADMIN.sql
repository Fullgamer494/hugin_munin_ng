-- =====================================================
-- 1. HISTORIAL GENÉTICO (REQ-VII)
-- =====================================================

-- Tabla para relaciones parentales
CREATE TABLE relacion_parental(
    id_relacion_parental SERIAL PRIMARY KEY,
    
    id_especimen_hijo INT NOT NULL,
    CONSTRAINT fk_hijo FOREIGN KEY(id_especimen_hijo) REFERENCES especimen(id_especimen) ON DELETE CASCADE,
    
    id_especimen_padre INT,
    CONSTRAINT fk_padre FOREIGN KEY(id_especimen_padre) REFERENCES especimen(id_especimen) ON DELETE SET NULL,
    
    id_especimen_madre INT,
    CONSTRAINT fk_madre FOREIGN KEY(id_especimen_madre) REFERENCES especimen(id_especimen) ON DELETE SET NULL,
    
    fecha_registro DATE DEFAULT CURRENT_DATE,
    observaciones TEXT,
    
    -- Validaciones
    CONSTRAINT chk_no_auto_padre CHECK (id_especimen_hijo != id_especimen_padre),
    CONSTRAINT chk_no_auto_madre CHECK (id_especimen_hijo != id_especimen_madre),
    
    -- Un ejemplar solo puede tener un par de padres registrado
    CONSTRAINT uq_hijo UNIQUE(id_especimen_hijo)
);

CREATE INDEX idx_relacion_padre ON relacion_parental(id_especimen_padre);
CREATE INDEX idx_relacion_madre ON relacion_parental(id_especimen_madre);

-- Tabla para relaciones de hermandad (calculada o explícita)
CREATE TABLE relacion_hermandad(
    id_hermandad SERIAL PRIMARY KEY,
    
    id_especimen_1 INT NOT NULL,
    id_especimen_2 INT NOT NULL,
    
    CONSTRAINT fk_hermano_1 FOREIGN KEY(id_especimen_1) REFERENCES especimen(id_especimen) ON DELETE CASCADE,
    CONSTRAINT fk_hermano_2 FOREIGN KEY(id_especimen_2) REFERENCES especimen(id_especimen) ON DELETE CASCADE,
    
    tipo_hermandad VARCHAR(20) CHECK (tipo_hermandad IN ('Completa', 'Paterna', 'Materna')) DEFAULT 'Completa',
    fecha_registro DATE DEFAULT CURRENT_DATE,
    
    -- Evitar duplicados simétricos
    CONSTRAINT chk_orden_hermanos CHECK (id_especimen_1 < id_especimen_2),
    CONSTRAINT uq_hermanos UNIQUE(id_especimen_1, id_especimen_2)
);

CREATE INDEX idx_hermano_1 ON relacion_hermandad(id_especimen_1);
CREATE INDEX idx_hermano_2 ON relacion_hermandad(id_especimen_2);

COMMENT ON TABLE relacion_parental IS 'Almacena las relaciones padre-madre-hijo para programas de cría en cautiverio';
COMMENT ON TABLE relacion_hermandad IS 'Registra relaciones de hermandad entre especímenes';


-- =====================================================
-- 2. PLANIFICACIÓN DE DIETAS (REQ-VIII)
-- =====================================================

-- Tabla de planes de dieta
CREATE TABLE plan_dieta(
    id_plan_dieta SERIAL PRIMARY KEY,
    
    id_especimen INT,
    CONSTRAINT fk_especimen_dieta FOREIGN KEY(id_especimen) REFERENCES especimen(id_especimen) ON DELETE CASCADE,
    
    id_responsable INT NOT NULL,
    CONSTRAINT fk_responsable_dieta FOREIGN KEY(id_responsable) REFERENCES usuario(id_usuario),
    
    nombre_plan VARCHAR(200) NOT NULL,
    descripcion TEXT,
    tipo_alimento VARCHAR(200),
    cantidad VARCHAR(100), -- ej: "500g", "2 unidades", "1 kg"
    frecuencia VARCHAR(20) CHECK (frecuencia IN ('Diaria', 'Cada 2 días', 'Semanal', 'Quincenal', 'Mensual')) NOT NULL,
    horario TIME,
    
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    activo BOOLEAN DEFAULT TRUE,
    
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_fechas_dieta CHECK (fecha_fin IS NULL OR fecha_fin >= fecha_inicio)
);

CREATE INDEX idx_dieta_especimen ON plan_dieta(id_especimen);
CREATE INDEX idx_dieta_activo ON plan_dieta(activo);
CREATE INDEX idx_dieta_responsable ON plan_dieta(id_responsable);

COMMENT ON TABLE plan_dieta IS 'Planes de alimentación programados por ejemplar';


-- =====================================================
-- 3. ENRIQUECIMIENTO AMBIENTAL (REQ-VIII)
-- =====================================================

-- Tabla de actividades de enriquecimiento
CREATE TABLE actividad_enriquecimiento(
    id_actividad SERIAL PRIMARY KEY,
    
    id_especimen INT,
    CONSTRAINT fk_especimen_enriquecimiento FOREIGN KEY(id_especimen) REFERENCES especimen(id_especimen) ON DELETE CASCADE,
    
    id_responsable INT NOT NULL,
    CONSTRAINT fk_responsable_enriquecimiento FOREIGN KEY(id_responsable) REFERENCES usuario(id_usuario),
    
    tipo_actividad VARCHAR(200) NOT NULL,
    descripcion TEXT,
    duracion_minutos INT,
    frecuencia VARCHAR(20) CHECK (frecuencia IN ('Diaria', 'Cada 2 días', 'Semanal', 'Quincenal', 'Mensual')) NOT NULL,
    
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    activo BOOLEAN DEFAULT TRUE,
    
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_fechas_actividad CHECK (fecha_fin IS NULL OR fecha_fin >= fecha_inicio),
    CONSTRAINT chk_duracion_positiva CHECK (duracion_minutos IS NULL OR duracion_minutos > 0)
);

CREATE INDEX idx_actividad_especimen ON actividad_enriquecimiento(id_especimen);
CREATE INDEX idx_actividad_activo ON actividad_enriquecimiento(activo);
CREATE INDEX idx_actividad_responsable ON actividad_enriquecimiento(id_responsable);

COMMENT ON TABLE actividad_enriquecimiento IS 'Actividades de enriquecimiento ambiental programadas';


-- =====================================================
-- 4. EJECUCIÓN DE TAREAS (REQ-VIII)
-- =====================================================

-- Tabla para registrar la ejecución de dietas y enriquecimientos
CREATE TABLE ejecucion_tarea(
    id_ejecucion SERIAL PRIMARY KEY,
    
    tipo_tarea VARCHAR(20) CHECK (tipo_tarea IN ('Dieta', 'Enriquecimiento')) NOT NULL,
    id_tarea INT NOT NULL, -- Referencia a plan_dieta o actividad_enriquecimiento
    
    id_ejecutor INT NOT NULL,
    CONSTRAINT fk_ejecutor_tarea FOREIGN KEY(id_ejecutor) REFERENCES usuario(id_usuario),
    
    fecha_ejecucion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    observaciones TEXT,
    completada BOOLEAN DEFAULT TRUE,
    
    -- Índice compuesto para búsquedas eficientes
    CONSTRAINT uq_ejecucion UNIQUE(tipo_tarea, id_tarea, fecha_ejecucion)
);

CREATE INDEX idx_ejecucion_tipo_tarea ON ejecucion_tarea(tipo_tarea, id_tarea);
CREATE INDEX idx_ejecucion_ejecutor ON ejecucion_tarea(id_ejecutor);
CREATE INDEX idx_ejecucion_fecha ON ejecucion_tarea(fecha_ejecucion);

COMMENT ON TABLE ejecucion_tarea IS 'Registro de tareas completadas (dietas y enriquecimientos)';


-- =====================================================
-- 5. ANÁLISIS DE COMPORTAMIENTO (REQ-IX)
-- =====================================================

-- Catálogo de categorías de comportamiento
CREATE TABLE categoria_comportamiento(
    id_categoria SERIAL PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);

-- Insertar categorías predefinidas
INSERT INTO categoria_comportamiento (nombre_categoria, descripcion) VALUES
('Alimentación', 'Comportamientos relacionados con la búsqueda y consumo de alimento'),
('Social', 'Interacciones con otros individuos de la misma u otra especie'),
('Reproductivo', 'Comportamientos de cortejo, apareamiento y cuidado parental'),
('Agresivo', 'Comportamientos de confrontación o defensa'),
('Juego', 'Actividades lúdicas y de exploración'),
('Descanso', 'Periodos de inactividad y sueño'),
('Estereotipia', 'Comportamientos repetitivos sin función aparente'),
('Exploratorio', 'Investigación del entorno'),
('Territorial', 'Marcaje y defensa de territorio'),
('Anormal', 'Comportamientos fuera de lo esperado para la especie');

-- Tabla de registros de comportamiento
CREATE TABLE registro_comportamiento(
    id_registro_comportamiento SERIAL PRIMARY KEY,
    
    id_especimen INT NOT NULL,
    CONSTRAINT fk_especimen_comportamiento FOREIGN KEY(id_especimen) REFERENCES especimen(id_especimen) ON DELETE CASCADE,
    
    id_observador INT NOT NULL,
    CONSTRAINT fk_observador FOREIGN KEY(id_observador) REFERENCES usuario(id_usuario),
    
    id_categoria INT NOT NULL,
    CONSTRAINT fk_categoria FOREIGN KEY(id_categoria) REFERENCES categoria_comportamiento(id_categoria),
    
    fecha_observacion DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    duracion_minutos INT,
    
    observaciones TEXT NOT NULL,
    
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_duracion_comportamiento CHECK (duracion_minutos IS NULL OR duracion_minutos >= 0)
);

CREATE INDEX idx_comportamiento_especimen ON registro_comportamiento(id_especimen);
CREATE INDEX idx_comportamiento_fecha ON registro_comportamiento(fecha_observacion);
CREATE INDEX idx_comportamiento_categoria ON registro_comportamiento(id_categoria);
CREATE INDEX idx_comportamiento_especimen_fecha ON registro_comportamiento(id_especimen, fecha_observacion);

COMMENT ON TABLE categoria_comportamiento IS 'Catálogo de categorías para clasificar comportamientos observados';
COMMENT ON TABLE registro_comportamiento IS 'Registros detallados de observaciones de comportamiento animal';


-- =====================================================
-- 6. GESTIÓN DE HÁBITATS (REQ-XI)
-- =====================================================

-- Tabla de hábitats del zoológico
CREATE TABLE habitat(
    id_habitat SERIAL PRIMARY KEY,
    
    nombre_habitat VARCHAR(100) NOT NULL UNIQUE,
    tipo_habitat VARCHAR(20) CHECK (tipo_habitat IN ('Exhibición', 'Guardería', 'Cuarentena', 'Investigación')) NOT NULL,
    
    tamaño_m2 DECIMAL(10,2),
    capacidad_maxima INT,
    ubicacion_descripcion TEXT,
    coordenadas_mapa VARCHAR(100), -- Para mapa interactivo: formato "x,y" o "lat,lng"
    
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_capacidad_positiva CHECK (capacidad_maxima IS NULL OR capacidad_maxima > 0),
    CONSTRAINT chk_tamaño_positivo CHECK (tamaño_m2 IS NULL OR tamaño_m2 > 0)
);

CREATE INDEX idx_habitat_tipo ON habitat(tipo_habitat);
CREATE INDEX idx_habitat_activo ON habitat(activo);

COMMENT ON TABLE habitat IS 'Recintos y áreas del zoológico donde se alojan los especímenes';


-- Tabla de asignación de especímenes a hábitats
CREATE TABLE especimen_habitat(
    id_asignacion SERIAL PRIMARY KEY,
    
    id_especimen INT NOT NULL,
    CONSTRAINT fk_especimen_ubicacion FOREIGN KEY(id_especimen) REFERENCES especimen(id_especimen) ON DELETE CASCADE,
    
    id_habitat INT NOT NULL,
    CONSTRAINT fk_habitat_asignacion FOREIGN KEY(id_habitat) REFERENCES habitat(id_habitat),
    
    fecha_asignacion DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_salida DATE,
    
    es_ubicacion_actual BOOLEAN DEFAULT TRUE,
    observaciones TEXT,
    
    CONSTRAINT chk_fechas_habitat CHECK (fecha_salida IS NULL OR fecha_salida >= fecha_asignacion)
);

CREATE INDEX idx_asignacion_especimen ON especimen_habitat(id_especimen);
CREATE INDEX idx_asignacion_habitat ON especimen_habitat(id_habitat);
CREATE INDEX idx_ubicacion_actual ON especimen_habitat(id_especimen, es_ubicacion_actual) WHERE es_ubicacion_actual = TRUE;

COMMENT ON TABLE especimen_habitat IS 'Historial de ubicaciones de especímenes en diferentes hábitats';


-- Función para actualizar ubicación actual
CREATE OR REPLACE FUNCTION actualizar_ubicacion_actual()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.es_ubicacion_actual = TRUE THEN
        -- Desactivar otras ubicaciones actuales del mismo espécimen
        UPDATE especimen_habitat 
        SET es_ubicacion_actual = FALSE 
        WHERE id_especimen = NEW.id_especimen 
          AND id_asignacion != NEW.id_asignacion;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para mantener solo una ubicación actual por espécimen
CREATE TRIGGER trg_actualizar_ubicacion
BEFORE INSERT OR UPDATE ON especimen_habitat
FOR EACH ROW
EXECUTE FUNCTION actualizar_ubicacion_actual();


-- =====================================================
-- 7. SISTEMA DE ALERTAS (REQ-XII)
-- =====================================================

-- Tabla de alertas del sistema
CREATE TABLE alerta(
    id_alerta SERIAL PRIMARY KEY,
    
    tipo_alerta VARCHAR(50) CHECK (tipo_alerta IN (
        'Tratamiento_Vencido',
        'Dieta_Pendiente',
        'Enriquecimiento_Pendiente',
        'Capacidad_Habitat_Excedida',
        'Ejemplar_Sin_Reporte_Medico',
        'Comportamiento_Anormal',
        'Otros'
    )) NOT NULL,
    
    id_especimen INT,
    CONSTRAINT fk_especimen_alerta FOREIGN KEY(id_especimen) REFERENCES especimen(id_especimen) ON DELETE CASCADE,
    
    id_usuario_destinatario INT,
    CONSTRAINT fk_destinatario_alerta FOREIGN KEY(id_usuario_destinatario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    
    titulo VARCHAR(200) NOT NULL,
    mensaje TEXT NOT NULL,
    
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_leida TIMESTAMP,
    leida BOOLEAN DEFAULT FALSE,
    
    prioridad VARCHAR(10) CHECK (prioridad IN ('Baja', 'Media', 'Alta', 'Crítica')) DEFAULT 'Media'
);

CREATE INDEX idx_alerta_usuario ON alerta(id_usuario_destinatario);
CREATE INDEX idx_alerta_leida ON alerta(id_usuario_destinatario, leida) WHERE leida = FALSE;
CREATE INDEX idx_alerta_fecha ON alerta(fecha_creacion DESC);
CREATE INDEX idx_alerta_prioridad ON alerta(prioridad);

COMMENT ON TABLE alerta IS 'Sistema de notificaciones y alertas automáticas para el personal';


-- Tabla de preferencias de alertas por usuario
CREATE TABLE preferencia_alerta(
    id_preferencia SERIAL PRIMARY KEY,
    
    id_usuario INT NOT NULL,
    CONSTRAINT fk_usuario_preferencia FOREIGN KEY(id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    
    tipo_alerta VARCHAR(50) NOT NULL,
    recibir_alerta BOOLEAN DEFAULT TRUE,
    medio_notificacion VARCHAR(10) CHECK (medio_notificacion IN ('In-App', 'Email', 'Ambos')) DEFAULT 'In-App',
    
    CONSTRAINT uq_preferencia_usuario_tipo UNIQUE(id_usuario, tipo_alerta)
);

CREATE INDEX idx_preferencia_usuario ON preferencia_alerta(id_usuario);

COMMENT ON TABLE preferencia_alerta IS 'Configuración de alertas personalizada por usuario';


-- =====================================================
-- 8. GESTIÓN DE ARCHIVOS PDF (REQ-X)
-- =====================================================

-- Tabla de archivos PDF asociados
CREATE TABLE archivo_pdf(
    id_archivo SERIAL PRIMARY KEY,
    
    id_especimen INT,
    CONSTRAINT fk_especimen_archivo FOREIGN KEY(id_especimen) REFERENCES especimen(id_especimen) ON DELETE CASCADE,
    
    id_reporte INT,
    CONSTRAINT fk_reporte_archivo FOREIGN KEY(id_reporte) REFERENCES reporte(id_reporte) ON DELETE CASCADE,
    
    id_usuario_subida INT NOT NULL,
    CONSTRAINT fk_usuario_archivo FOREIGN KEY(id_usuario_subida) REFERENCES usuario(id_usuario),
    
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_archivo VARCHAR(500) NOT NULL,
    tamaño_kb INT,
    descripcion TEXT,
    etiquetas VARCHAR(200),
    
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Límite de tamaño: 10MB (10240 KB)
    CONSTRAINT chk_tamaño_archivo CHECK (tamaño_kb IS NULL OR tamaño_kb <= 10240),
    
    -- Al menos debe estar asociado a un espécimen o a un reporte
    CONSTRAINT chk_asociacion_archivo CHECK (id_especimen IS NOT NULL OR id_reporte IS NOT NULL)
);

CREATE INDEX idx_archivo_especimen ON archivo_pdf(id_especimen);
CREATE INDEX idx_archivo_reporte ON archivo_pdf(id_reporte);
CREATE INDEX idx_archivo_fecha ON archivo_pdf(fecha_subida DESC);

COMMENT ON TABLE archivo_pdf IS 'Archivos PDF asociados a especímenes o reportes';


-- =====================================================
-- 9. NUEVOS PERMISOS (Adiciones al catálogo)
-- =====================================================

-- Permisos para historial genético
INSERT INTO permiso (nombre_permiso) VALUES
('ver_historial_genetico'),
('editar_historial_genetico');

-- Permisos para dietas
INSERT INTO permiso (nombre_permiso) VALUES
('crear_plan_dieta'),
('editar_plan_dieta'),
('eliminar_plan_dieta'),
('ejecutar_plan_dieta'),
('ver_plan_dieta');

-- Permisos para enriquecimiento
INSERT INTO permiso (nombre_permiso) VALUES
('crear_actividad_enriquecimiento'),
('editar_actividad_enriquecimiento'),
('eliminar_actividad_enriquecimiento'),
('ejecutar_actividad_enriquecimiento'),
('ver_actividad_enriquecimiento');

-- Permisos para comportamiento
INSERT INTO permiso (nombre_permiso) VALUES
('registrar_comportamiento'),
('editar_comportamiento'),
('eliminar_comportamiento'),
('ver_analisis_comportamiento');

-- Permisos para hábitats
INSERT INTO permiso (nombre_permiso) VALUES
('crear_habitat'),
('editar_habitat'),
('eliminar_habitat'),
('ver_habitats'),
('asignar_especimen_habitat'),
('ver_mapa_habitats');

-- Permisos para archivos
INSERT INTO permiso (nombre_permiso) VALUES
('subir_archivos_pdf'),
('eliminar_archivos_pdf'),
('ver_archivos_pdf');

-- Permisos para alertas
INSERT INTO permiso (nombre_permiso) VALUES
('configurar_alertas'),
('ver_alertas');


-- =====================================================
-- 10. ASIGNACIÓN DE PERMISOS A ROLES EXISTENTES
-- =====================================================

-- ADMINISTRADOR (id_rol = 1): Acceso completo a todas las funcionalidades nuevas
INSERT INTO rol_permiso (id_rol, id_permiso)
SELECT 1, id_permiso FROM permiso 
WHERE nombre_permiso IN (
    'ver_historial_genetico', 'editar_historial_genetico',
    'crear_plan_dieta', 'editar_plan_dieta', 'eliminar_plan_dieta', 'ejecutar_plan_dieta', 'ver_plan_dieta',
    'crear_actividad_enriquecimiento', 'editar_actividad_enriquecimiento', 'eliminar_actividad_enriquecimiento', 
    'ejecutar_actividad_enriquecimiento', 'ver_actividad_enriquecimiento',
    'registrar_comportamiento', 'editar_comportamiento', 'eliminar_comportamiento', 'ver_analisis_comportamiento',
    'crear_habitat', 'editar_habitat', 'eliminar_habitat', 'ver_habitats', 
    'asignar_especimen_habitat', 'ver_mapa_habitats',
    'subir_archivos_pdf', 'eliminar_archivos_pdf', 'ver_archivos_pdf',
    'configurar_alertas', 'ver_alertas'
);

-- BIÓLOGO (id_rol = 2): Enfoque en comportamiento, genética, hábitats
INSERT INTO rol_permiso (id_rol, id_permiso)
SELECT 2, id_permiso FROM permiso 
WHERE nombre_permiso IN (
    'ver_historial_genetico', 'editar_historial_genetico',
    'ver_plan_dieta',
    'crear_actividad_enriquecimiento', 'editar_actividad_enriquecimiento', 'ver_actividad_enriquecimiento',
    'registrar_comportamiento', 'editar_comportamiento', 'ver_analisis_comportamiento',
    'ver_habitats', 'asignar_especimen_habitat', 'ver_mapa_habitats',
    'subir_archivos_pdf', 'ver_archivos_pdf',
    'ver_alertas'
);

-- VETERINARIO (id_rol = 3): Enfoque en dietas y archivos médicos
INSERT INTO rol_permiso (id_rol, id_permiso)
SELECT 3, id_permiso FROM permiso 
WHERE nombre_permiso IN (
    'ver_historial_genetico',
    'crear_plan_dieta', 'editar_plan_dieta', 'ver_plan_dieta',
    'ver_actividad_enriquecimiento',
    'ver_analisis_comportamiento',
    'ver_habitats', 'ver_mapa_habitats',
    'subir_archivos_pdf', 'ver_archivos_pdf',
    'ver_alertas'
);

-- PATÓLOGO (id_rol = 4): Acceso limitado, principalmente visualización
INSERT INTO rol_permiso (id_rol, id_permiso)
SELECT 4, id_permiso FROM permiso 
WHERE nombre_permiso IN (
    'ver_historial_genetico',
    'ver_plan_dieta',
    'ver_analisis_comportamiento',
    'ver_habitats',
    'subir_archivos_pdf', 'ver_archivos_pdf',
    'ver_alertas'
);

-- CUIDADOR (id_rol = 5): Solo ejecución de tareas y visualización básica
INSERT INTO rol_permiso (id_rol, id_permiso)
SELECT 5, id_permiso FROM permiso 
WHERE nombre_permiso IN (
    'ejecutar_plan_dieta', 'ver_plan_dieta',
    'ejecutar_actividad_enriquecimiento', 'ver_actividad_enriquecimiento',
    'ver_analisis_comportamiento',
    'ver_habitats', 'ver_mapa_habitats',
    'ver_archivos_pdf',
    'ver_alertas'
);


-- =====================================================
-- 11. VISTAS ÚTILES PARA CONSULTAS FRECUENTES
-- =====================================================

-- Vista: Ubicación actual de todos los especímenes activos
CREATE OR REPLACE VIEW v_especimen_ubicacion_actual AS
SELECT 
    e.id_especimen,
    e.num_inventario,
    e.nombre_especimen,
    esp.genero,
    esp.especie,
    h.id_habitat,
    h.nombre_habitat,
    h.tipo_habitat,
    eh.fecha_asignacion
FROM especimen e
JOIN especie esp ON e.id_especie = esp.id_especie
LEFT JOIN especimen_habitat eh ON e.id_especimen = eh.id_especimen 
    AND eh.es_ubicacion_actual = TRUE
LEFT JOIN habitat h ON eh.id_habitat = h.id_habitat
WHERE e.activo = TRUE;

COMMENT ON VIEW v_especimen_ubicacion_actual IS 'Vista consolidada de ubicación actual de especímenes activos';


-- Vista: Árbol genealógico simplificado
CREATE OR REPLACE VIEW v_arbol_genealogico AS
SELECT 
    hijo.id_especimen AS id_hijo,
    hijo.num_inventario AS num_inv_hijo,
    hijo.nombre_especimen AS nombre_hijo,
    rp.id_especimen_padre,
    padre.num_inventario AS num_inv_padre,
    padre.nombre_especimen AS nombre_padre,
    rp.id_especimen_madre,
    madre.num_inventario AS num_inv_madre,
    madre.nombre_especimen AS nombre_madre
FROM relacion_parental rp
JOIN especimen hijo ON rp.id_especimen_hijo = hijo.id_especimen
LEFT JOIN especimen padre ON rp.id_especimen_padre = padre.id_especimen
LEFT JOIN especimen madre ON rp.id_especimen_madre = madre.id_especimen;

COMMENT ON VIEW v_arbol_genealogico IS 'Vista simplificada de relaciones parentales';


-- Vista: Tareas pendientes (dietas y enriquecimientos no ejecutados hoy)
CREATE OR REPLACE VIEW v_tareas_pendientes_hoy AS
SELECT 
    'Dieta' AS tipo_tarea,
    pd.id_plan_dieta AS id_tarea,
    e.id_especimen,
    e.nombre_especimen,
    pd.nombre_plan,
    pd.horario,
    u.nombre_usuario AS responsable
FROM plan_dieta pd
JOIN especimen e ON pd.id_especimen = e.id_especimen
JOIN usuario u ON pd.id_responsable = u.id_usuario
WHERE pd.activo = TRUE
  AND pd.fecha_inicio <= CURRENT_DATE
  AND (pd.fecha_fin IS NULL OR pd.fecha_fin >= CURRENT_DATE)
  AND NOT EXISTS (
      SELECT 1 FROM ejecucion_tarea et
      WHERE et.tipo_tarea = 'Dieta'
        AND et.id_tarea = pd.id_plan_dieta
        AND DATE(et.fecha_ejecucion) = CURRENT_DATE
  )
UNION ALL
SELECT 
    'Enriquecimiento' AS tipo_tarea,
    ae.id_actividad AS id_tarea,
    e.id_especimen,
    e.nombre_especimen,
    ae.tipo_actividad AS nombre_plan,
    NULL AS horario,
    u.nombre_usuario AS responsable
FROM actividad_enriquecimiento ae
JOIN especimen e ON ae.id_especimen = e.id_especimen
JOIN usuario u ON ae.id_responsable = u.id_usuario
WHERE ae.activo = TRUE
  AND ae.fecha_inicio <= CURRENT_DATE
  AND (ae.fecha_fin IS NULL OR ae.fecha_fin >= CURRENT_DATE)
  AND NOT EXISTS (
      SELECT 1 FROM ejecucion_tarea et
      WHERE et.tipo_tarea = 'Enriquecimiento'
        AND et.id_tarea = ae.id_actividad
        AND DATE(et.fecha_ejecucion) = CURRENT_DATE
  )
ORDER BY horario NULLS LAST;

COMMENT ON VIEW v_tareas_pendientes_hoy IS 'Listado de tareas (dietas y enriquecimientos) pendientes para el día actual';


-- Vista: Alertas no leídas por usuario
CREATE OR REPLACE VIEW v_alertas_no_leidas AS
SELECT 
    a.id_alerta,
    a.tipo_alerta,
    a.titulo,
    a.mensaje,
    a.prioridad,
    a.fecha_creacion,
    u.nombre_usuario AS destinatario,
    e.nombre_especimen
FROM alerta a
JOIN usuario u ON a.id_usuario_destinatario = u.id_usuario
LEFT JOIN especimen e ON a.id_especimen = e.id_especimen
WHERE a.leida = FALSE
ORDER BY 
    CASE a.prioridad
        WHEN 'Crítica' THEN 1
        WHEN 'Alta' THEN 2
        WHEN 'Media' THEN 3
        WHEN 'Baja' THEN 4
    END,
    a.fecha_creacion DESC;

COMMENT ON VIEW v_alertas_no_leidas IS 'Alertas pendientes ordenadas por prioridad';


-- =====================================================
-- 12. FUNCIÓN DE UTILIDAD: Generar alerta automática
-- =====================================================

CREATE OR REPLACE FUNCTION generar_alerta(
    p_tipo_alerta VARCHAR,
    p_id_especimen INT,
    p_id_usuario_destinatario INT,
    p_titulo VARCHAR,
    p_mensaje TEXT,
    p_prioridad VARCHAR DEFAULT 'Media'
)
RETURNS INT AS $$
DECLARE
    v_id_alerta INT;
    v_recibir BOOLEAN;
BEGIN
    -- Verificar si el usuario tiene habilitado este tipo de alerta
    SELECT recibir_alerta INTO v_recibir
    FROM preferencia_alerta
    WHERE id_usuario = p_id_usuario_destinatario
      AND tipo_alerta = p_tipo_alerta;
    
    -- Si no hay preferencia definida, asumir que sí recibe
    IF v_recibir IS NULL THEN
        v_recibir := TRUE;
    END IF;
    
    -- Solo crear la alerta si el usuario la acepta
    IF v_recibir THEN
        INSERT INTO alerta(
            tipo_alerta, 
            id_especimen, 
            id_usuario_destinatario, 
            titulo, 
            mensaje, 
            prioridad
        )
        VALUES (
            p_tipo_alerta,
            p_id_especimen,
            p_id_usuario_destinatario,
            p_titulo,
            p_mensaje,
            p_prioridad
        )
        RETURNING id_alerta INTO v_id_alerta;
        
        RETURN v_id_alerta;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION generar_alerta IS 'Función para crear alertas respetando las preferencias del usuario';


-- =====================================================
-- 13. DATOS DE EJEMPLO PARA PRUEBAS (OPCIONAL)
-- =====================================================

-- Insertar algunos hábitats de ejemplo
INSERT INTO habitat (nombre_habitat, tipo_habitat, tamaño_m2, capacidad_maxima, ubicacion_descripcion, coordenadas_mapa) VALUES
('Área de Felinos', 'Exhibición', 250.00, 4, 'Zona norte del zoológico', '23.754152,-99.045142'),
('Aviario Central', 'Exhibición', 180.50, 15, 'Centro del recorrido principal', '23.754200,-99.045000'),
('Cuarentena 1', 'Cuarentena', 50.00, 2, 'Edificio veterinario - Planta baja', NULL),
('Guardería de Mamíferos', 'Guardería', 75.00, 5, 'Anexo al área de primates', '23.754100,-99.045250');


-- =====================================================
-- FIN DEL SCRIPT DE ADICIONES
-- =====================================================

-- Verificar que todas las tablas se crearon correctamente
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
      'relacion_parental',
      'relacion_hermandad',
      'plan_dieta',
      'actividad_enriquecimiento',
      'ejecucion_tarea',
      'categoria_comportamiento',
      'registro_comportamiento',
      'habitat',
      'especimen_habitat',
      'alerta',
      'preferencia_alerta',
      'archivo_pdf'
  )
ORDER BY tablename;

COMMENT ON DATABASE hugin_munin IS 'Sistema de gestión integral para el Zoológico Miguel Álvarez del Toro (ZOOMAT) - Versión actualizada con módulos de historial genético, planificación, comportamiento, hábitats, alertas y archivos';
