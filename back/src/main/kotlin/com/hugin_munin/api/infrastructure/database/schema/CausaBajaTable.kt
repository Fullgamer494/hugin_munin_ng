package com.hugin_munin.api.infrastructure.database.schemas

import org.jetbrains.exposed.sql.Table

object CausaBajaTable : Table("causa_baja") {
    val id = integer("id_causa_baja").autoIncrement()
    val nombreCausaBaja = varchar("nombre_causa_baja", 100)
    override val primaryKey = PrimaryKey(id)
}