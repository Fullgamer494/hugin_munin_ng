package com.hugin_munin.api.infrastructure.api.dto

import kotlinx.datetime.LocalDate
import kotlinx.serialization.Serializable

@Serializable
data class AltaEspecimenRequest(
    // Datos de la especie
    val genero: String,
    val especieNombre: String,

    // Datos del especimen
    val numInventario: String,
    val nombreEspecimen: String,

    // Datos del responsable y fecha
    val responsableId: Int,
    val fechaIngreso: LocalDate,

    // Datos del registro de alta
    val origenAltaId: Int,
    val procedencia: String? = null,
    val observacionAlta: String? = null,

    // Datos del traslado inicial
    val areaDestino: String,
    val ubicacionDestino: String
)