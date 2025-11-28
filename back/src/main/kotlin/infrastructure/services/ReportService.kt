package com.hugin_munin.infrastructure.services

import kotlinx.serialization.Serializable
import com.hugin_munin.infrastructure.database.DatabaseFactory.dbQuery
import com.hugin_munin.infrastructure.database.tables.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq

@Serializable
data class ReportRequest(
    val id_tipo_reporte: Int,
    val id_especimen: Int,
    val id_responsable: Int,
    val asunto: String,
    val contenido: String, // Se mapeará a 'observaciones_generales' o similar en la tabla base
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



class ReportService {

    suspend fun createReport(data: ReportRequest): Int = dbQuery {
        Reports.insert { stmt ->
            stmt[reportTypeId] = data.id_tipo_reporte
            stmt[specimenId] = data.id_especimen
            stmt[registeredBy] = data.id_responsable
            stmt[asunto] = data.asunto
            stmt[generalObservations] = data.contenido
        }[Reports.id].value
    }

    suspend fun getReportsBySpecimen(specimenId: Int): List<ReportResponse> = dbQuery {
        (Reports innerJoin ReportTypes innerJoin Users innerJoin Specimens)
            .selectAll()
            .where { Reports.specimenId eq specimenId }
            .orderBy(Reports.reportDate to SortOrder.DESC)
            .map { toReportResponse(it) }
    }

    suspend fun getReportById(id: Int): ReportResponse? = dbQuery {
        (Reports innerJoin ReportTypes innerJoin Users innerJoin Specimens)
            .selectAll()
            .where { Reports.id eq id }
            .singleOrNull()
            ?.let { toReportResponse(it) }
    }

    suspend fun updateReport(id: Int, data: ReportRequest): Boolean = dbQuery {
        Reports.update({ Reports.id eq id }) { stmt ->
            stmt[reportTypeId] = data.id_tipo_reporte
            stmt[asunto] = data.asunto
            stmt[generalObservations] = data.contenido
        } > 0
    }

    suspend fun deleteReport(id: Int): Boolean = dbQuery {
        Reports.deleteWhere { Reports.id eq id } > 0
    }

    private fun toReportResponse(row: ResultRow) = ReportResponse(
        id_reporte = row[Reports.id].value,
        id_tipo_reporte = row[ReportTypes.id].value,
        tipo_reporte = row[ReportTypes.reportTypeName],
        id_especimen = row[Specimens.id].value,
        num_inventario = row[Specimens.inventoryNumber],
        id_responsable = row[Users.id].value,
        nombre_responsable = row[Users.username],
        asunto = row[Reports.asunto],
        contenido = row[Reports.generalObservations],
        fecha_reporte = row[Reports.reportDate].toString(),
        fecha_creacion = row[Reports.createdAt].toString()
    )
}