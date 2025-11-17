package com.hugin_munin.api.infrastructure.api.dto

import kotlinx.serialization.Serializable

@Serializable
data class ReporteConductualResponse(
    val idReporte: Int,
    val idEspecimen: Int,
    val idResponsable: Int,
    val asunto: String,
    val fechaReporte: String,
    val contenido: String
)

@Serializable
data class MessageResponse(
    val message: String
)