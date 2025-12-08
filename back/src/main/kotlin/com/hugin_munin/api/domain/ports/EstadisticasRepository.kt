package com.hugin_munin.api.domain.ports

import kotlinx.datetime.LocalDate

interface EstadisticasRepository {
    suspend fun contarEspecimenesActivos(): Int
    suspend fun contarEspecimenesInactivos(): Int
    suspend fun contarRegistrosAltasUltimosSieteDias(fechaLimite: LocalDate): Int
}