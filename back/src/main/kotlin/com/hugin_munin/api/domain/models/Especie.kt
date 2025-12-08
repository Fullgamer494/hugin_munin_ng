package com.hugin_munin.api.domain.models

import kotlinx.serialization.Serializable

@Serializable
data class Especie(
    val id: Int? = null,
    val genero: String,
    val especie: String
)