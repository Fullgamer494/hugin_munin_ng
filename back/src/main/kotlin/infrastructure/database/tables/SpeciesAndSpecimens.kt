package com.hugin_munin.infrastructure.database.tables

import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.ReferenceOption
import org.jetbrains.exposed.sql.javatime.timestamp
import org.jetbrains.exposed.sql.javatime.date
import org.jetbrains.exposed.sql.javatime.CurrentTimestamp

object Species : IntIdTable("especie", "id_especie") {
    val genus = varchar("genero", 50)
    val species = varchar("especie", 50)
    val commonName = varchar("nombre_comun", 100).nullable()
}

object Specimens : IntIdTable("especimen", "id_especimen") {
    val inventoryNumber = varchar("num_inventario", 20).uniqueIndex()
    val speciesId = reference("id_especie", Species, onDelete = ReferenceOption.RESTRICT)
    val specimenName = varchar("nombre_especimen", 100)
    val sex = char("sexo").nullable()
    val birthDate = date("fecha_nacimiento").nullable()
    val active = bool("activo").default(true)
    val registrationDate = timestamp("fecha_registro").defaultExpression(CurrentTimestamp)
}