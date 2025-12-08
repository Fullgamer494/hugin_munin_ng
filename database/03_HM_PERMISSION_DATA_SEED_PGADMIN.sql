-- ========================================
-- 1. ADMINISTRADOR (id_rol = 1)
-- Todos los permisos (1 al 32)
-- ========================================
INSERT INTO rol_permiso (id_rol, id_permiso) VALUES
(1, 1), (1, 2), (1, 3),   -- Permisos de ALTA
(1, 4), (1, 5), (1, 6), (1, 7), -- Permisos de BAJA
(1, 8), (1, 9), (1, 10), (1, 11), (1, 12), -- Permisos de REPORTES CLÍNICOS
(1, 13), (1, 14), (1, 15), (1, 16), (1, 17), -- Permisos de REPORTES CONDUCTUALES
(1, 18), (1, 19), (1, 20), (1, 21), (1, 22), -- Permisos de REPORTES ALIMENTICIOS
(1, 23), (1, 24), (1, 25), (1, 26), (1, 27), -- Permisos de REPORTES DE DEFUNCIÓN
(1, 28), (1, 29), (1, 30), (1, 31), (1, 32); -- Permisos de REPORTES DE TRASLADO

q
-- ========================================
-- 2. BIÓLOGO (id_rol = 2)
-- Enfoque en manejo de especímenes y reportes científicos
-- ========================================
INSERT INTO rol_permiso (id_rol, id_permiso) VALUES
(2, 1), (2, 2), (2, 3),   -- ALTA (completos)
(2, 4), (2, 5), (2, 6), (2, 7), -- BAJA (completo)
(2, 13), (2, 14), (2, 16), (2, 17), -- CONDUCTUALES (generar/editar/ver/descargar)
(2, 18), (2, 19), (2, 21), (2, 22), -- ALIMENTICIOS (generar/editar/ver/descargar)
(2, 28), (2, 29), (2, 31), (2, 32); -- TRASLADO (generar/editar/ver/descargar)


-- ========================================
-- 3. VETERINARIO (id_rol = 3)
-- Enfoque en salud animal y reportes médicos
-- ========================================
INSERT INTO rol_permiso (id_rol, id_permiso) VALUES
(3, 3),   -- ALTA (ver)
(3, 7),   -- BAJA (ver)
(3, 8), (3, 9), (3, 11), (3, 12), -- CLÍNICOS (generar/editar/ver/descargar)
(3, 16), (3, 17), -- CONDUCTUALES (ver/descargar)
(3, 18), (3, 19), (3, 20), (3, 21), (3, 22), -- ALIMENTICIOS (generar/editar/eliminar/ver/descargar)
(3, 31), (3, 32); -- TRASLADO (ver/descargar)


-- ========================================
-- 4. PATÓLOGO (id_rol = 4)
-- Especialista en análisis post-mortem
-- ========================================
INSERT INTO rol_permiso (id_rol, id_permiso) VALUES
(4, 3),   -- ALTA (ver)
(4, 4), (4, 5), (4, 6), (4, 7), -- BAJA (completo)
(4, 11),  -- CLÍNICOS (solo ver)
(4, 23), (4, 24), (4, 25), (4, 26), (4, 27); -- DEFUNCIÓN (completo)


-- ========================================
-- 5. CUIDADOR (id_rol = 5)
-- Personal de cuidado diario de animales
-- ========================================
INSERT INTO rol_permiso (id_rol, id_permiso) VALUES
(5, 3),   -- ALTA (ver)
(5, 7),   -- BAJA (ver)
(5, 11),  -- CLÍNICOS (solo ver)
(5, 16),  -- CONDUCTUALES (solo ver)
(5, 26),  -- DEFUNCIÓN (solo ver)
(5, 21),  -- ALIMENTICIOS (solo ver)
(5, 31);  -- TRASLADO (solo ver)