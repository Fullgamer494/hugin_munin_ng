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

data class RegistroComportamiento(
    val idRegistro: Int?,
    val idEspecimen: Int,
    val idObservador: Int,
    val idCategoria: Int,
    val fechaObservacion: LocalDate,
    val horaInicio: String,
    val duracionMinutos: Int,
    val observaciones: String?
)