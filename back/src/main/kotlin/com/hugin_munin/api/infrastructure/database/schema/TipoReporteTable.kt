package com.hugin_munin.api.infrastructure.database.schemas

import org.jetbrains.exposed.sql.Table

object TipoReporteTable : Table("tipo_reporte") {
    val id = integer("id_tipo_reporte").autoIncrement()
    val nombre = varchar("nombre_tipo_reporte", 50)
    override val primaryKey = PrimaryKey(id)
}