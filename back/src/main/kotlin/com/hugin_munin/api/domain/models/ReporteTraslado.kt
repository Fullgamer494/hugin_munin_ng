package com.hugin_munin.api.domain.models

import kotlinx.serialization.Serializable

@Serializable
data class ReporteTraslado(
    val reporteId: Int,
    val areaOrigen: String,
    val areaDestino: String,
    val ubicacionOrigen: String,
    val ubicacionDestino: String,
    val motivo: String?
)