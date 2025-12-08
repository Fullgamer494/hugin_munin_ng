package com.hugin_munin.api.domain.models

import kotlinx.datetime.LocalDate
import kotlinx.serialization.Serializable

@Serializable
data class RegistroAlta(
    val id: Int? = null,
    val especimenId: Int,
    val origenAltaId: Int,
    val responsableId: Int,
    val fechaIngreso: LocalDate,
    val procedencia: String?,
    val observacion: String?,
    val idReporteTraslado: Int
)