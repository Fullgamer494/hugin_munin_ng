package com.hugin_munin.api.infrastructure.api.dto

import kotlinx.serialization.Serializable

@Serializable
data class CreateReporteConductualRequest(
    val idEspecimen: Int,
    val idResponsable: Int,
    val asunto: String,
    val fechaReporte: String,
    val contenido: String,
    val rolUsuario: Int
)

@Serializable
data class UpdateReporteConductualRequest(
    val idEspecimen: Int,
    val idResponsable: Int,
    val asunto: String,
    val fechaReporte: String,
    val contenido: String,
    val rolUsuario: Int
)