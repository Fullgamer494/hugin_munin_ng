#!/bin/bash

echo "=========================================="
echo "Iniciando Pre-Deployment"
echo "Fecha: $(date)"
echo "=========================================="

if ! systemctl list-unit-files | grep -q myapp.service; then
    echo "ADVERTENCIA: El servicio myapp.service no existe"
    echo "Continuando de todas formas..."
else
    echo "Deteniendo servicio myapp..."
    systemctl stop myapp.service
    
    sleep 3
    
    if systemctl is-active --quiet myapp.service; then
        echo "ERROR: El servicio no se pudo detener"
        exit 1
    else
        echo "Servicio detenido correctamente"
    fi
fi

echo ""
echo "Limpiando archivos JAR antiguos..."

JAR_COUNT=$(ls -1 /opt/apps/backend/app*.jar 2>/dev/null | wc -l)

if [ $JAR_COUNT -gt 0 ]; then
    echo "Encontrados $JAR_COUNT archivos JAR"
    
    TOTAL_SIZE=$(du -sh /opt/apps/backend/app*.jar 2>/dev/null | awk '{sum+=$1} END {print sum}')
    echo "Espacio a liberar: aproximadamente $TOTAL_SIZE"
    
    rm -f /opt/apps/backend/app*.jar
    echo "JARs antiguos eliminados"
else
    echo "No hay JARs antiguos para eliminar"
fi

echo ""
echo "Espacio disponible en disco:"
df -h /opt/apps/backend | tail -n 1

echo ""
echo "=========================================="
echo "Pre-Deployment completado exitosamente"
echo "=========================================="

exit 0
