package com.hugin_munin.api.infrastructure.api.dto

import kotlinx.datetime.LocalDate
import kotlinx.serialization.Serializable

@Serializable
data class RegistroAltaRequest(
    val especimenId: Int,
    val origenAltaId: Int,
    val responsableId: Int,
    val fechaIngreso: LocalDate,
    val procedencia: String?,
    val observacion: String?,
    val traslado: TrasladoInfoRequest
)

@Serializable
data class TrasladoInfoRequest(
    val areaOrigen: String,
    val areaDestino: String,
    val ubicacionOrigen: String,
    val ubicacionDestino: String,
    val motivo: String?
)

@Serializable
data class RegistroAltaUpdateRequest(
    val origenAltaId: Int?,
    val procedencia: String?,
    val observacion: String?
)

@Serializable
data class RegistroAltaResponse(
    val id: Int,
    val especimenId: Int,
    val origenAltaId: Int,
    val responsableId: Int,
    val fechaIngreso: LocalDate,
    val procedencia: String?,
    val observacion: String?,
    val idReporteTraslado: Int
)