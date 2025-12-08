package com.hugin_munin.api.domain.models

import kotlinx.datetime.LocalDate
import kotlinx.serialization.Serializable

@Serializable
data class Reporte(
    val id: Int? = null,
    val tipoReporteId: Int,
    val especimenId: Int?,
    val responsableId: Int,
    val asunto: String,
    val fechaReporte: LocalDate,
    val contenido: String
)