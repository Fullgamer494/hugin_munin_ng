-- =====================================================
-- SECCIÓN 1: CATÁLOGO DE CAUSAS DE BAJA
-- =====================================================

INSERT INTO causa_baja (nombre_causa_baja) VALUES
('Aprovechamiento'),
('Cambio de depositaría'),
('Fuga'),
('Deceso'),
('Préstamo'),
('Liberación'),
('Entrega a PROFEPA');

-- =====================================================
-- SECCIÓN 2: CATÁLOGO DE ORÍGENES DE ALTA
-- =====================================================

INSERT INTO origen_alta (nombre_origen_alta) VALUES
('Donación'),
('Rescate'),
('Incautado'),
('Abandonado'),
('Captura'),
('Depositaría'),
('Intercambio');

-- =====================================================
-- SECCIÓN 3: CATÁLOGO DE PERMISOS
-- =====================================================

-- Permisos de ALTA (3 permisos)
INSERT INTO permiso (nombre_permiso) VALUES
('registrar_alta'),
('editar_alta'),
('ver_alta');

-- Permisos de BAJA (4 permisos)
INSERT INTO permiso (nombre_permiso) VALUES
('registrar_baja'),
('editar_baja'),
('eliminar_baja'),
('ver_baja');

-- Permisos de REPORTES CLÍNICOS (5 permisos)
INSERT INTO permiso (nombre_permiso) VALUES
('generar_reporte_clinico'),
('editar_reporte_clinico'),
('eliminar_reporte_clinico'),
('ver_reporte_clinico'),
('descargar_reporte_clinico');

-- Permisos de REPORTES CONDUCTUALES (5 permisos)
INSERT INTO permiso (nombre_permiso) VALUES
('generar_reporte_conductual'),
('editar_reporte_conductual'),
('eliminar_reporte_conductual'),
('ver_reporte_conductual'),
('descargar_reporte_conductual');

-- Permisos de REPORTES ALIMENTICIOS (5 permisos)
INSERT INTO permiso (nombre_permiso) VALUES
('generar_reporte_alimenticio'),
('editar_reporte_alimenticio'),
('eliminar_reporte_alimenticio'),
('ver_reporte_alimenticio'),
('descargar_reporte_alimenticio');

-- Permisos de REPORTES DE DEFUNCIÓN (5 permisos)
INSERT INTO permiso (nombre_permiso) VALUES
('generar_reporte_defuncion'),
('editar_reporte_defuncion'),
('eliminar_reporte_defuncion'),
('ver_reporte_defuncion'),
('descargar_reporte_defuncion');

-- Permisos de REPORTES DE TRASLADO (5 permisos)
INSERT INTO permiso (nombre_permiso) VALUES
('generar_reporte_traslado'),
('editar_reporte_traslado'),
('eliminar_reporte_traslado'),
('ver_reporte_traslado'),
('descargar_reporte_traslado');

-- =====================================================
-- SECCIÓN 4: CATÁLOGO DE ROLES
-- =====================================================

INSERT INTO rol (nombre_rol) VALUES
('Administrador'),
('Biólogo'),
('Veterinario'),
('Patólogo'),
('Cuidador');

-- =====================================================
-- SECCIÓN 5: CATÁLOGO DE TIPOS DE REPORTE
-- =====================================================

INSERT INTO tipo_reporte (nombre_tipo_reporte, descripcion) VALUES
('Clínico', 'Reportes de consultas veterinarias y tratamientos médicos'),
('Conductual', 'Reportes de observaciones de comportamiento animal'),
('Alimenticio', 'Reportes de registro de alimentación y consumo'),
('Defunción', 'Reportes de decesos y análisis post-mortem'),
('Traslado', 'Reportes de movimientos entre áreas del zoológico');

-- =====================================================
-- VERIFICACIÓN DE DATOS INSERTADOS
-- =====================================================

-- Resumen de registros por tabla
DO $$
DECLARE
    v_causas_baja INT;
    v_origenes_alta INT;
    v_permisos INT;
    v_roles INT;
    v_tipos_reporte INT;
BEGIN
    SELECT COUNT(*) INTO v_causas_baja FROM causa_baja;
    SELECT COUNT(*) INTO v_origenes_alta FROM origen_alta;
    SELECT COUNT(*) INTO v_permisos FROM permiso;
    SELECT COUNT(*) INTO v_roles FROM rol;
    SELECT COUNT(*) INTO v_tipos_reporte FROM tipo_reporte;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'DATOS DE CATÁLOGO INSERTADOS EXITOSAMENTE';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Causas de baja: %', v_causas_baja;
    RAISE NOTICE 'Orígenes de alta: %', v_origenes_alta;
    RAISE NOTICE 'Permisos: %', v_permisos;
    RAISE NOTICE 'Roles: %', v_roles;
    RAISE NOTICE 'Tipos de reporte: %', v_tipos_reporte;
    RAISE NOTICE '========================================';
END $$;

-- Consulta opcional: Ver todos los permisos insertados
-- \echo '\nPermisos del sistema:'
-- SELECT id_permiso, nombre_permiso FROM permiso ORDER BY id_permiso;