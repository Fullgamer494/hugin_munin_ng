#!/bin/bash

echo "=========================================="
echo "Iniciando Post-Deployment"
echo "Fecha: $(date)"
echo "=========================================="

echo "Verificando archivos JAR..."
JAR_FILE=$(ls /opt/apps/backend/app*.jar 2>/dev/null | head -n 1)

if [ -z "$JAR_FILE" ]; then
    echo "ERROR: No se encontró ningún archivo JAR en /opt/apps/backend/"
    exit 1
fi

echo "JAR encontrado: $JAR_FILE"
JAR_SIZE=$(du -h "$JAR_FILE" | cut -f1)
echo "Tamaño: $JAR_SIZE"

echo ""
echo "Recargando configuración de systemd..."
systemctl daemon-reload
echo "Daemon recargado"

echo ""
echo "Iniciando servicio myapp..."
systemctl start myapp.service

sleep 5

echo ""
echo "Verificando estado del servicio..."

if systemctl is-active --quiet myapp.service; then
    echo "Servicio iniciado correctamente"
    
    echo ""
    echo "=== Estado del Servicio ==="
    systemctl status myapp.service --no-pager -l
    
    echo ""
    echo "=== Últimas líneas del log ==="
    journalctl -u myapp.service -n 20 --no-pager
    
    echo ""
    echo "=========================================="
    echo "Post-Deployment completado exitosamente"
    echo "La aplicación está corriendo"
    echo "=========================================="
    
    exit 0
else
    echo "ERROR: El servicio no pudo iniciar"
    
    echo ""
    echo "=== Logs de error ==="
    journalctl -u myapp.service -n 50 --no-pager
    
    echo ""
    echo "=========================================="
    echo "Post-Deployment FALLÓ"
    echo "=========================================="
    
    exit 1
fi
