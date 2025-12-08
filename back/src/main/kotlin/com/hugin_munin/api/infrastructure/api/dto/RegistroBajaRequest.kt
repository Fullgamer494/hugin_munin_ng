package com.hugin_munin.api.infrastructure.api.dto

import kotlinx.datetime.LocalDate
import kotlinx.serialization.Serializable

@Serializable
data class RegistroBajaRequest(
    val especimenId: Int,
    val causaBajaId: Int,
    val responsableId: Int,
    val fechaBaja: LocalDate,
    val observacion: String?
)

@Serializable
data class RegistroBajaUpdateRequest(
    val causaBajaId: Int,
    val fechaBaja: LocalDate,
    val observacion: String?
)

@Serializable
data class RegistroBajaResponse(
    val id: Int,
    val especimenId: Int,
    val causaBajaId: Int,
    val responsableId: Int,
    val fechaBaja: LocalDate,
    val observacion: String?
)

@Serializable
data class CausaBajaResponse(
    val id: Int,
    val nombreCausaBaja: String
)