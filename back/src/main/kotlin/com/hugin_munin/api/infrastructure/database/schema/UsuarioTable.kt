package com.hugin_munin.api.infrastructure.database.schemas

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.ReferenceOption

object UsuarioTable : Table("usuario") {
    val id = integer("id_usuario").autoIncrement()
    val rolId = integer("id_rol").references(RolTable.id, onDelete = ReferenceOption.RESTRICT)
    val nombreUsuario = varchar("nombre_usuario", 100).uniqueIndex()
    val correo = varchar("correo", 100).uniqueIndex()
    val activo = bool("activo").default(true)
    override val primaryKey = PrimaryKey(id)
}