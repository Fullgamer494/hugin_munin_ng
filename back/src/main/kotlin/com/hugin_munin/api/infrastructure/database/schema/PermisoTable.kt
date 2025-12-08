package com.hugin_munin.api.infrastructure.database.schemas

import org.jetbrains.exposed.sql.Table

object PermisoTable : Table("permiso") {
    val id = integer("id_permiso").autoIncrement()
    val nombre = varchar("nombre_permiso", 100).uniqueIndex()

    override val primaryKey = PrimaryKey(id)
}