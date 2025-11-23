package com.hugin_munin.api.infrastructure.api.dto

import kotlinx.datetime.LocalDate
import kotlinx.serialization.Serializable

@Serializable
data class EspecimenDetalleResponse(
    val id: Int,
    val numInventario: String,
    val nombreEspecimen: String,
    val genero: String,
    val especieNombre: String,
    val activo: Boolean,
    val origenAltaId: Int,
    val registroAlta: RegistroAltaInfo
)

@Serializable
data class RegistroAltaInfo(
    val id: Int,
    val origenAltaNombre: String,
    val procedencia: String?,
    val observacion: String?,
    val fechaIngreso: LocalDate,
    val responsableId: Int,
    val traslado: TrasladoInfo
)

@Serializable
data class TrasladoInfo(
    val areaDestino: String,
    val ubicacionDestino: String,
    val areaOrigen: String,
    val ubicacionOrigen: String,
    val motivo: String?
)