package com.hugin_munin.api.domain.models

import kotlinx.datetime.LocalDate
import kotlinx.serialization.Serializable

@Serializable
data class RegistroBaja(
    val id: Int? = null,
    val especimenId: Int,
    val causaBajaId: Int,
    val responsableId: Int,
    val fechaBaja: LocalDate,
    val observacion: String?
)