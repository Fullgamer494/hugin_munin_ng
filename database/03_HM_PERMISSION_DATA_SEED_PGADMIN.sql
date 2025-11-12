-- =====================================================
-- 1. ADMINISTRADOR (id_rol = 1)
-- Acceso total a todas las funcionalidades
-- =====================================================

INSERT INTO rol_permiso (id_rol, id_permiso) 
SELECT 1, id_permiso FROM permiso WHERE nombre_permiso IN (
    -- Permisos de ALTA
    'registrar_alta',
    'editar_alta',
    'ver_alta',
    
    -- Permisos de BAJA
    'registrar_baja',
    'editar_baja',
    'eliminar_baja',
    'ver_baja',
    
    -- Permisos de REPORTES CLÍNICOS
    'generar_reporte_clinico',
    'editar_reporte_clinico',
    'eliminar_reporte_clinico',
    'ver_reporte_clinico',
    'descargar_reporte_clinico',
    
    -- Permisos de REPORTES CONDUCTUALES
    'generar_reporte_conductual',
    'editar_reporte_conductual',
    'eliminar_reporte_conductual',
    'ver_reporte_conductual',
    'descargar_reporte_conductual',
    
    -- Permisos de REPORTES ALIMENTICIOS
    'generar_reporte_alimenticio',
    'editar_reporte_alimenticio',
    'eliminar_reporte_alimenticio',
    'ver_reporte_alimenticio',
    'descargar_reporte_alimenticio',
    
    -- Permisos de REPORTES DE DEFUNCIÓN
    'generar_reporte_defuncion',
    'editar_reporte_defuncion',
    'eliminar_reporte_defuncion',
    'ver_reporte_defuncion',
    'descargar_reporte_defuncion',
    
    -- Permisos de REPORTES DE TRASLADO
    'generar_reporte_traslado',
    'editar_reporte_traslado',
    'eliminar_reporte_traslado',
    'ver_reporte_traslado',
    'descargar_reporte_traslado'
);

-- =====================================================
-- 2. BIÓLOGO (id_rol = 2)
-- Enfoque en manejo de especímenes y reportes científicos
-- =====================================================

INSERT INTO rol_permiso (id_rol, id_permiso)
SELECT 2, id_permiso FROM permiso WHERE nombre_permiso IN (
    -- Permisos de ALTA (completos)
    'registrar_alta',
    'editar_alta',
    'ver_alta',
    
    -- Permisos de BAJA (completos)
    'registrar_baja',
    'editar_baja',
    'eliminar_baja',
    'ver_baja',
    
    -- Permisos de REPORTES CONDUCTUALES (completos)
    'generar_reporte_conductual',
    'editar_reporte_conductual',
    'ver_reporte_conductual',
    'descargar_reporte_conductual',
    
    -- Permisos de REPORTES ALIMENTICIOS (completos)
    'generar_reporte_alimenticio',
    'editar_reporte_alimenticio',
    'ver_reporte_alimenticio',
    'descargar_reporte_alimenticio',
    
    -- Permisos de REPORTES DE TRASLADO (completos)
    'generar_reporte_traslado',
    'editar_reporte_traslado',
    'ver_reporte_traslado',
    'descargar_reporte_traslado'
);

-- =====================================================
-- 3. VETERINARIO (id_rol = 3)
-- Enfoque en salud animal y reportes médicos
-- =====================================================

INSERT INTO rol_permiso (id_rol, id_permiso)
SELECT 3, id_permiso FROM permiso WHERE nombre_permiso IN (
    -- Permisos de ALTA (solo ver)
    'ver_alta',
    
    -- Permisos de BAJA (solo ver)
    'ver_baja',
    
    -- Permisos de REPORTES CLÍNICOS (completos)
    'generar_reporte_clinico',
    'editar_reporte_clinico',
    'ver_reporte_clinico',
    'descargar_reporte_clinico',
    
    -- Permisos de REPORTES CONDUCTUALES (solo ver)
    'ver_reporte_conductual',
    'descargar_reporte_conductual',
    
    -- Permisos de REPORTES ALIMENTICIOS (completos)
    'generar_reporte_alimenticio',
    'editar_reporte_alimenticio',
    'eliminar_reporte_alimenticio',
    'ver_reporte_alimenticio',
    'descargar_reporte_alimenticio',
    
    -- Permisos de REPORTES DE TRASLADO (solo ver)
    'ver_reporte_traslado',
    'descargar_reporte_traslado'
);

-- =====================================================
-- 4. PATÓLOGO (id_rol = 4)
-- Especialista en análisis post-mortem
-- =====================================================

INSERT INTO rol_permiso (id_rol, id_permiso)
SELECT 4, id_permiso FROM permiso WHERE nombre_permiso IN (
    -- Permisos de ALTA (solo ver)
    'ver_alta',
    
    -- Permisos de BAJA (completos)
    'registrar_baja',
    'editar_baja',
    'eliminar_baja',
    'ver_baja',
    
    -- Permisos de REPORTES CLÍNICOS (solo ver)
    'ver_reporte_clinico',
    
    -- Permisos de REPORTES DE DEFUNCIÓN (completos)
    'generar_reporte_defuncion',
    'editar_reporte_defuncion',
    'eliminar_reporte_defuncion',
    'ver_reporte_defuncion',
    'descargar_reporte_defuncion'
);

-- =====================================================
-- 5. CUIDADOR (id_rol = 5)
-- Personal de cuidado diario de animales
-- =====================================================

INSERT INTO rol_permiso (id_rol, id_permiso)
SELECT 5, id_permiso FROM permiso WHERE nombre_permiso IN (
    -- Permisos de ALTA (solo ver)
    'ver_alta',
    
    -- Permisos de BAJA (solo ver)
    'ver_baja',
    
    -- Permisos de REPORTES CLÍNICOS (solo ver)
    'ver_reporte_clinico',
    
    -- Permisos de REPORTES CONDUCTUALES (solo ver)
    'ver_reporte_conductual',
    
    -- Permisos de REPORTES ALIMENTICIOS (solo ver)
    'ver_reporte_alimenticio',
    
    -- Permisos de REPORTES DE DEFUNCIÓN (solo ver)
    'ver_reporte_defuncion',
    
    -- Permisos de REPORTES DE TRASLADO (solo ver)
    'ver_reporte_traslado'
);

-- =====================================================
-- VERIFICACIÓN DE PERMISOS ASIGNADOS
-- =====================================================

-- Vista temporal para verificar asignaciones
CREATE TEMP VIEW v_permisos_por_rol AS
SELECT 
    r.id_rol,
    r.nombre_rol,
    COUNT(rp.id_permiso) AS total_permisos
FROM rol r
LEFT JOIN rol_permiso rp ON r.id_rol = rp.id_rol
GROUP BY r.id_rol, r.nombre_rol
ORDER BY r.id_rol;

-- Mostrar resumen
DO $$
DECLARE
    rec RECORD;
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'PERMISOS ASIGNADOS POR ROL';
    RAISE NOTICE '========================================';
    
    FOR rec IN SELECT * FROM v_permisos_por_rol LOOP
        RAISE NOTICE '% (ID %): % permisos', 
            rec.nombre_rol, 
            rec.id_rol, 
            rec.total_permisos;
    END LOOP;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'ASIGNACIÓN DE PERMISOS COMPLETADA';
    RAISE NOTICE '========================================';
END $$;

-- Consulta opcional: Ver permisos detallados por rol
/*
\echo '\nPermisos detallados por rol:'
SELECT 
    r.nombre_rol,
    p.nombre_permiso
FROM rol r
JOIN rol_permiso rp ON r.id_rol = rp.id_rol
JOIN permiso p ON rp.id_permiso = p.id_permiso
ORDER BY r.id_rol, p.nombre_permiso;
*/

-- =====================================================
-- FUNCIÓN DE UTILIDAD: Verificar permisos de usuario
-- =====================================================

CREATE OR REPLACE FUNCTION tiene_permiso(
    p_id_usuario INT,
    p_nombre_permiso VARCHAR
)
RETURNS BOOLEAN AS $$
DECLARE
    v_tiene_permiso BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM usuario u
        JOIN rol_permiso rp ON u.id_rol = rp.id_rol
        JOIN permiso p ON rp.id_permiso = p.id_permiso
        WHERE u.id_usuario = p_id_usuario
          AND p.nombre_permiso = p_nombre_permiso
          AND u.activo = TRUE
    ) INTO v_tiene_permiso;
    
    RETURN v_tiene_permiso;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION tiene_permiso IS 'Verifica si un usuario tiene un permiso específico basado en su rol';

-- Ejemplo de uso:
-- SELECT tiene_permiso(1, 'registrar_alta');