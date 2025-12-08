package com.hugin_munin.api.infrastructure.database.schemas

import org.jetbrains.exposed.sql.Column
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.ReferenceOption

object ReporteTrasladoTable : Table("reporte_traslado") {
    val reporteId: Column<Int> = integer("id_reporte")
        .references(ReporteTable.id, onDelete = ReferenceOption.CASCADE)
    val areaOrigen = varchar("area_origen", 10)
    val areaDestino = varchar("area_destino", 10)
    val ubicacionOrigen = varchar("ubicacion_origen", 100)
    val ubicacionDestino = varchar("ubicacion_destino", 100)
    val motivo = text("motivo").nullable()

    override val primaryKey = PrimaryKey(reporteId)
}