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
    val ubicacionOrigen: String,
    val ubicacionDestino: String
)

@Serializable
data class UpdateAltaEspecimenRequest(
    // Datos del espécimen
    val nombreEspecimen: String,

    // Datos de la especie (opcional si quieres permitir cambiarla)
    val genero: String?,
    val especieNombre: String?,

    // Datos del registro de alta
    val fechaIngreso: LocalDate,
    val origenAltaId: Int,
    val procedencia: String?,
    val observacion: String?,

    // Datos del traslado (excluyendo lo que NO debe cambiar)
    // areaOrigen, areaDestino, ubicacionOrigen NO se actualizan
    val ubicacionDestino: String?,
    val motivo: String?
)