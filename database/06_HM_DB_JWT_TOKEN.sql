-- =====================================================
-- SISTEMA DE AUTENTICACIÓN JWT
-- =====================================================

-- Tabla para almacenar refresh tokens
CREATE TABLE refresh_token(
    id_refresh_token SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    CONSTRAINT fk_usuario_refresh_token FOREIGN KEY(id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    
    token VARCHAR(500) NOT NULL UNIQUE,
    fecha_expiracion TIMESTAMP NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revocado BOOLEAN DEFAULT FALSE,
    
    -- Información del dispositivo/sesión
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    CONSTRAINT chk_expiracion_futura CHECK (fecha_expiracion > fecha_creacion)
);

CREATE INDEX idx_refresh_token_usuario ON refresh_token(id_usuario);
CREATE INDEX idx_refresh_token_token ON refresh_token(token) WHERE revocado = FALSE;
CREATE INDEX idx_refresh_token_expiracion ON refresh_token(fecha_expiracion) WHERE revocado = FALSE;

COMMENT ON TABLE refresh_token IS 'Almacena refresh tokens para renovación de sesiones JWT';

-- Función para limpiar tokens expirados (ejecutar periódicamente)
CREATE OR REPLACE FUNCTION limpiar_tokens_expirados()
RETURNS INT AS $$
DECLARE
    tokens_eliminados INT;
BEGIN
    DELETE FROM refresh_token
    WHERE fecha_expiracion < CURRENT_TIMESTAMP
       OR revocado = TRUE;
    
    GET DIAGNOSTICS tokens_eliminados = ROW_COUNT;
    RETURN tokens_eliminados;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION limpiar_tokens_expirados IS 'Elimina tokens expirados o revocados';

-- Vista para obtener información completa del usuario autenticado
CREATE OR REPLACE VIEW v_usuario_autenticacion AS
SELECT 
    u.id_usuario,
    u.nombre_usuario,
    u.correo,
    u.contrasena,
    u.activo,
    u.id_rol,
    r.nombre_rol,
    ARRAY_AGG(p.nombre_permiso ORDER BY p.nombre_permiso) AS permisos
FROM usuario u
JOIN rol r ON u.id_rol = r.id_rol
LEFT JOIN rol_permiso rp ON r.id_rol = rp.id_rol
LEFT JOIN permiso p ON rp.id_permiso = p.id_permiso
WHERE u.activo = TRUE
GROUP BY u.id_usuario, u.nombre_usuario, u.correo, u.contrasena, u.activo, u.id_rol, r.nombre_rol;

COMMENT ON VIEW v_usuario_autenticacion IS 'Vista optimizada para autenticación con permisos agregados';