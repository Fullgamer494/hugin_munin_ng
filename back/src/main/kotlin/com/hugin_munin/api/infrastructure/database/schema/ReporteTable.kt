package com.hugin_munin.api.infrastructure.database.schemas

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.kotlin.datetime.date
import org.jetbrains.exposed.sql.ReferenceOption
import org.jetbrains.exposed.sql.kotlin.datetime.date

object ReporteTable : Table("reporte") {
    val id = integer("id_reporte").autoIncrement()
    val tipoReporteId = integer("id_tipo_reporte").references(TipoReporteTable.id, onDelete = ReferenceOption.RESTRICT)
    val especimenId = integer("id_especimen").references(EspecimenTable.id, onDelete = ReferenceOption.CASCADE)
    val responsableId = integer("id_responsable").references(UsuarioTable.id, onDelete = ReferenceOption.RESTRICT)
    val asunto = varchar("asunto", 200)
    val fechaReporte = date("fecha_reporte")
    val contenido = text("contenido")
    override val primaryKey = PrimaryKey(id)
}