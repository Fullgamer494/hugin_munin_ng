package com.hugin_munin.api.infrastructure.api.dto

import kotlinx.datetime.LocalDate
import kotlinx.serialization.Serializable

@Serializable
data class TrasladoRequest(
    val especimenId: Int,
    val responsableId: Int,
    val areaOrigen: String,
    val areaDestino: String,
    val ubicacionOrigen: String,
    val ubicacionDestino: String,
    val motivo: String?,
    val asunto: String? = null,
    val fechaReporte: LocalDate? = null
)

@Serializable
data class TrasladoUpdateRequest(
    val areaOrigen: String?,
    val areaDestino: String?,
    val ubicacionOrigen: String?,
    val ubicacionDestino: String?,
    val motivo: String?,
    val asunto: String?,
    val fechaReporte: LocalDate?
)

@Serializable
data class TrasladoResponse(
    val idReporte: Int,
    val tipoReporteId: Int,
    val especimenId: Int,
    val responsableId: Int,
    val asunto: String,
    val contenido: String,
    val fechaReporte: LocalDate,
    val traslado: TrasladoDetalleResponse
)

@Serializable
data class TrasladoDetalleResponse(
    val areaOrigen: String,
    val areaDestino: String,
    val ubicacionOrigen: String,
    val ubicacionDestino: String,
    val motivo: String?
)