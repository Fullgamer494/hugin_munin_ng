package com.hugin_munin.api.infrastructure.database.schemas

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.kotlin.datetime.date
import org.jetbrains.exposed.sql.ReferenceOption
import org.jetbrains.exposed.sql.kotlin.datetime.date

object RegistroAltaTable : Table("registro_alta") {
    val id = integer("id_registro_alta").autoIncrement()
    val especimenId = integer("id_especimen").uniqueIndex().references(EspecimenTable.id, onDelete = ReferenceOption.CASCADE)
    val origenAltaId = integer("id_origen_alta").references(OrigenAltaTable.id, onDelete = ReferenceOption.RESTRICT)
    val responsableId = integer("id_responsable").references(UsuarioTable.id, onDelete = ReferenceOption.RESTRICT)
    val fechaIngreso = date("fecha_ingreso")
    val procedencia = varchar("procedencia", 100).nullable()
    val observacion = text("observacion").nullable()
    val idReporteTraslado = integer("id_reporte_traslado")
        .references(ReporteTable.id, onDelete = ReferenceOption.RESTRICT)
        .uniqueIndex()
    override val primaryKey = PrimaryKey(id)
}