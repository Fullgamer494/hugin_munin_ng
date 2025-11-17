-- 1. Causas de Baja
INSERT INTO causa_baja (nombre_causa_baja)
VALUES
('Aprovechamiento'),
('Cambio de depositaría'),
('Fuga'),
('Deceso'),
('Préstamo'),
('Liberación'),
('Entrega a profepa');

-- 2. Orígenes de Alta
INSERT INTO origen_alta (nombre_origen_alta)
VALUES
('Donación'),
('Rescate'),
('Incautado'),
('Abandonado'),
('Captura'),
('Depositoría'),
('Intercambio');

-- 3. Permisos
INSERT INTO permiso (nombre_permiso)
VALUES
('registrar_alta'),
('editar_alta'),
('ver_alta'),
('registrar_baja'),
('editar_baja'),
('eliminar_baja'),
('ver_baja'),
('generar_reporte_clinico'),
('editar_reporte_clinico'),
('eliminar_reporte_clinico'),
('ver_reporte_clinico'),
('descargar_reporte_clinico'),
('generar_reporte_conductual'),
('editar_reporte_conductual'),
('eliminar_reporte_conductual'),
('ver_reporte_conductual'),
('descargar_reporte_conductual'),
('generar_reporte_alimenticio'),
('editar_reporte_alimenticio'),
('eliminar_reporte_alimenticio'),
('ver_reporte_alimenticio'),
('descargar_reporte_alimenticio'),
('generar_reporte_defuncion'),
('editar_reporte_defuncion'),
('eliminar_reporte_defuncion'),
('ver_reporte_defuncion'),
('descargar_reporte_defuncion'),
('generar_reporte_traslado'),
('editar_reporte_traslado'),
('eliminar_reporte_traslado'),
('ver_reporte_traslado'),
('descargar_reporte_traslado');

-- 4. Roles
INSERT INTO rol (nombre_rol)
VALUES
('Administrador'),
('Biólogo'),
('Veterinario'),
('Patólogo'),
('Cuidador');

-- 5. Tipos de Reporte
INSERT INTO tipo_reporte (nombre_tipo_reporte)
VALUES
('Clínico'),
('Conductual'),
('Alimenticio'),
('Defunción'),
('Traslado');