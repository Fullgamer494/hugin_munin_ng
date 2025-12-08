package com.hugin_munin.api.domain.models

import kotlinx.datetime.Clock
import kotlinx.datetime.LocalDate
import kotlinx.datetime.TimeZone
import kotlinx.datetime.toLocalDateTime
import kotlinx.serialization.Serializable

@Serializable
data class EspecimenDetalle(
    val id: Int,
    val numInventario: String,
    val genero: String,
    val especieNombre: String,
    val activo: Boolean,
    val origenAltaNombre: String,
    val procedencia: String?,
    val observacion: String?,
    val fechaIngreso: LocalDate = Clock.System.now().toLocalDateTime(TimeZone.currentSystemDefault()).date,
    val areaDestino: String?,
    val ubicacionDestino: String?
)