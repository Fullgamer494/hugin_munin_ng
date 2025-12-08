package com.hugin_munin.api.application.services

import com.hugin_munin.api.domain.ports.EstadisticasRepository
import com.hugin_munin.api.infrastructure.api.dto.EstadisticasResponse
import com.hugin_munin.api.infrastructure.api.dto.RegistroAltasEstadisticas
import com.hugin_munin.api.infrastructure.api.dto.RegistroBajasEstadisticas
import kotlinx.datetime.Clock
import kotlinx.datetime.DatePeriod
import kotlinx.datetime.TimeZone
import kotlinx.datetime.minus
import kotlinx.datetime.toLocalDateTime

class EstadisticasService(
    private val estadisticasRepository: EstadisticasRepository
) {

    suspend fun obtenerEstadisticas(): EstadisticasResponse {
        // Calcular fecha límite para últimos 7 días
        val fechaActual = Clock.System.now().toLocalDateTime(TimeZone.Companion.currentSystemDefault()).date
        val fechaLimite = fechaActual.minus(DatePeriod(days = 7))

        // Obtener conteos
        val especimenesActivos = estadisticasRepository.contarEspecimenesActivos()
        val especimenesInactivos = estadisticasRepository.contarEspecimenesInactivos()
        val altasUltimosSieteDias = estadisticasRepository.contarRegistrosAltasUltimosSieteDias(fechaLimite)

        return EstadisticasResponse(
            registroAltasConteo = RegistroAltasEstadisticas(
                total = especimenesActivos,
                ultimosSieteDias = altasUltimosSieteDias
            ),
            registroBajasConteo = RegistroBajasEstadisticas(
                total = especimenesInactivos
            )
        )
    }
}