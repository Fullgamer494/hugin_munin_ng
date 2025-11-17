package com.hugin_munin.api.infrastructure.database.repositories

import com.hugin_munin.api.domain.models.ReporteConductual
import com.hugin_munin.api.domain.ports.ReporteConductualRepository
import com.hugin_munin.api.infrastructure.database.DatabaseFactory
import com.hugin_munin.api.infrastructure.database.schemas.ReporteTable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq

class ReporteConductualRepositoryImpl : ReporteConductualRepository {

    override suspend fun create(reporte: ReporteConductual): Int =
        DatabaseFactory.dbQuery {
            ReporteTable.insert {
                it[tipoReporteId] = 2
                it[especimenId] = reporte.idEspecimen
                it[responsableId] = reporte.idResponsable
                it[asunto] = reporte.asunto
                it[fechaReporte] = reporte.fechaReporte
                it[contenido] = reporte.contenido
            }[ReporteTable.id]
        }

    override suspend fun findById(id: Int): ReporteConductual? =
        DatabaseFactory.dbQuery {
            ReporteTable.select {
                (ReporteTable.id eq id) and (ReporteTable.tipoReporteId eq 2)
            }.map { rowToReporte(it) }.singleOrNull()
        }

    override suspend fun findAll(): List<ReporteConductual> =
        DatabaseFactory.dbQuery {
            ReporteTable.select { ReporteTable.tipoReporteId eq 2 }
                .map { rowToReporte(it) }
        }

    override suspend fun findByEspecimen(idEspecimen: Int): List<ReporteConductual> =
        DatabaseFactory.dbQuery {
            ReporteTable.select {
                (ReporteTable.especimenId eq idEspecimen) and (ReporteTable.tipoReporteId eq 2)
            }.map { rowToReporte(it) }
        }

    override suspend fun update(id: Int, reporte: ReporteConductual): Boolean =
        DatabaseFactory.dbQuery {
            ReporteTable.update({
                (ReporteTable.id eq id) and (ReporteTable.tipoReporteId eq 2)
            }) {
                it[especimenId] = reporte.idEspecimen
                it[responsableId] = reporte.idResponsable
                it[asunto] = reporte.asunto
                it[fechaReporte] = reporte.fechaReporte
                it[contenido] = reporte.contenido
            } > 0
        }

    override suspend fun delete(id: Int): Boolean =
        DatabaseFactory.dbQuery {
            ReporteTable.deleteWhere {
                (ReporteTable.id eq id) and (ReporteTable.tipoReporteId eq 2)
            } > 0
        }

    private fun rowToReporte(row: ResultRow) = ReporteConductual(
        idReporte = row[ReporteTable.id],
        idEspecimen = row[ReporteTable.especimenId],
        idResponsable = row[ReporteTable.responsableId],
        asunto = row[ReporteTable.asunto],
        fechaReporte = row[ReporteTable.fechaReporte],
        contenido = row[ReporteTable.contenido]
    )
}