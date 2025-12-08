package com.hugin_munin.api.domain.models

import kotlinx.serialization.Serializable

@Serializable
data class Especimen(
    val id: Int? = null,
    val numInventario: String,
    val especieId: Int,
    val nombre: String,
    val activo: Boolean = true
)