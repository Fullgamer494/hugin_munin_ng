package com.hugin_munin.api.infrastructure.api.dto

import kotlinx.datetime.LocalDate
import kotlinx.serialization.Serializable

@Serializable
data class ResponsableInfo(
    val id: Int,
    val nombreCompleto: String
)

@Serializable
data class RegistroBajaDetalleResponse(
    val id: Int,
    val causaBajaId: Int,
    val causaBajaNombre: String,
    val fechaBaja: LocalDate,
    val observacion: String?,
    val especimenId: Int,
    val numInventario: String,
    val nombreEspecimen: String,
    val nombreComun: String,
    val genero: String,
    val especieNombre: String,
    val origen: String,
    val procedencia: String,
    val fechaIngreso: LocalDate,
    val responsable: ResponsableInfo
)