-- =====================================================
-- USUARIOS DE PRUEBA
-- =====================================================

INSERT INTO usuario (id_rol, nombre_usuario, correo, contrasena, activo) VALUES
(1, 'Gilberto', 'fullgamer494@gmail.com', 'qwerty123', TRUE),
(2, 'Ilya', 'ilya@gmail.com', 'qwerty123', TRUE),
(3, 'Maria', 'regina@gmail.com', 'qwerty123', TRUE),
(4, 'Brittany', 'aurora@gmail.com', 'qwerty123', TRUE),
(5, 'Paul', 'paul@gmail.com', 'qwerty123', TRUE);

-- =====================================================
-- INFORMACIÓN DE USUARIOS CREADOS
-- =====================================================

DO $$
DECLARE
    rec RECORD;
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'USUARIOS DE PRUEBA CREADOS';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'ADVERTENCIA: Contraseñas en texto plano (solo desarrollo)';
    RAISE NOTICE '';
    
    FOR rec IN 
        SELECT 
            u.id_usuario,
            u.nombre_usuario,
            u.correo,
            r.nombre_rol,
            u.contrasena
        FROM usuario u
        JOIN rol r ON u.id_rol = r.id_rol
        ORDER BY u.id_usuario
    LOOP
        RAISE NOTICE 'ID: % | Usuario: % | Correo: % | Rol: % | Pass: %', 
            rec.id_usuario,
            rec.nombre_usuario,
            rec.correo,
            rec.nombre_rol,
            rec.contrasena;
    END LOOP;
    
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Total de usuarios: %', (SELECT COUNT(*) FROM usuario);
    RAISE NOTICE '========================================';
END $$;


CREATE OR REPLACE VIEW v_usuarios_info AS
SELECT 
    u.id_usuario,
    u.nombre_usuario,
    u.correo,
    r.nombre_rol,
    u.activo,
    u.fecha_creacion,
    u.ultimo_acceso,
    COUNT(rp.id_permiso) AS total_permisos
FROM usuario u
JOIN rol r ON u.id_rol = r.id_rol
LEFT JOIN rol_permiso rp ON r.id_rol = rp.id_rol
GROUP BY u.id_usuario, u.nombre_usuario, u.correo, r.nombre_rol, u.activo, u.fecha_creacion, u.ultimo_acceso
ORDER BY u.id_usuario;

COMMENT ON VIEW v_usuarios_info IS 'Vista consolidada de usuarios con información de rol y cantidad de permisos';