package com.hugin_munin.api.domain.models

import kotlinx.serialization.Serializable

@Serializable
data class CausaBaja(
    val id: Int? = null,
    val nombreCausaBaja: String
)