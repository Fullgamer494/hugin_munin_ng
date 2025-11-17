package com.hugin_munin.api.domain.models

import kotlinx.datetime.LocalDate
import kotlinx.datetime.LocalDateTime

data class ReporteConductual(
    val idReporte: Int,
    val idEspecimen: Int,
    val idResponsable: Int,
    val asunto: String,
    val fechaReporte: LocalDate,
    val contenido: String
)