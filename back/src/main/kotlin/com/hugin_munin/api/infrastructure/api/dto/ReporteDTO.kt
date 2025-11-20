package com.hugin_munin.api.infrastructure.api.dto

import kotlinx.datetime.LocalDate
import kotlinx.serialization.Serializable

@Serializable
data class ReporteRequest(
    val tipoReporteId: Int,
    val especimenId: Int,
    val responsableId: Int,
    val asunto: String,
    val contenido: String,
    val fechaReporte: LocalDate
)

@Serializable
data class ReporteUpdateRequest(
    val tipoReporteId: Int?,
    val asunto: String?,
    val contenido: String?,
    val fechaReporte: LocalDate?
)

@Serializable
data class ReporteResponse(
    val id: Int,
    val tipoReporteId: Int,
    val especimenId: Int,
    val responsableId: Int,
    val asunto: String,
    val contenido: String,
    val fechaReporte: LocalDate
)