package com.hugin_munin.api.infrastructure.api.dto

import kotlinx.serialization.Serializable

@Serializable
data class EstadisticasResponse(
    val registroAltasConteo: RegistroAltasEstadisticas,
    val registroBajasConteo: RegistroBajasEstadisticas
)

@Serializable
data class RegistroAltasEstadisticas(
    val total: Int,
    val ultimosSieteDias: Int
)

@Serializable
data class RegistroBajasEstadisticas(
    val total: Int
)