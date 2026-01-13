package com.hugin_munin.infrastructure.database.tables

import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.ReferenceOption
import org.jetbrains.exposed.sql.javatime.timestamp
import org.jetbrains.exposed.sql.javatime.CurrentTimestamp

object Users : IntIdTable("usuario", "id_usuario") {
    val roleId = reference("id_rol", Roles, onDelete = ReferenceOption.RESTRICT)
    val username = varchar("nombre_usuario", 100)
    val email = varchar("correo", 150).uniqueIndex()
    val password = varchar("contrasena", 255)
    val active = bool("activo").default(true)
    val createdAt = timestamp("fecha_creacion").defaultExpression(CurrentTimestamp)
    val lastAccess = timestamp("ultimo_acceso").nullable()
}