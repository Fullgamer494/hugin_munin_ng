package com.hugin_munin.infrastructure.services

import kotlinx.serialization.Serializable

@Serializable
data class ReportRequest(
    val id_tipo_reporte: Int,
    val id_especimen: Int,
    val id_responsable: Int,
    val asunto: String,
    val contenido: String, // Se mapeara a 'observaciones_generales' o similar en la tabla base
    val fecha_reporte: String
)

@Serializable
data class ReportResponse(
    val id_reporte: Int,
    val id_tipo_reporte: Int,
    val tipo_reporte: String,
    val id_especimen: Int,
    val num_inventario: String,
    val id_responsable: Int,
    val nombre_responsable: String,
    val asunto: String,
    val contenido: String?,
    val fecha_reporte: String,
    val fecha_creacion: String
)