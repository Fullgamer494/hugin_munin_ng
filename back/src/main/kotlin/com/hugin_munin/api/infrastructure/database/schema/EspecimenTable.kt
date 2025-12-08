package com.hugin_munin.api.infrastructure.database.schemas

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.ReferenceOption

object EspecimenTable : Table("especimen") {
    val id = integer("id_especimen").autoIncrement()
    val numInventario = varchar("num_inventario", 20).uniqueIndex() // Clave UNICA
    val especieId = integer("id_especie").references(EspecieTable.id, onDelete = ReferenceOption.RESTRICT)
    val nombre = varchar("nombre_especimen", 100)
    val activo = bool("activo").default(true)

    override val primaryKey = PrimaryKey(id)
}