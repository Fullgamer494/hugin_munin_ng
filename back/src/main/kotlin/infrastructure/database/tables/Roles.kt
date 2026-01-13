package com.hugin_munin.infrastructure.database.tables

import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.ReferenceOption
import org.jetbrains.exposed.sql.javatime.timestamp
import org.jetbrains.exposed.sql.javatime.CurrentTimestamp

object Roles : IntIdTable("rol", "id_rol") {
    val roleName = varchar("nombre_rol", 50).uniqueIndex()
    val createdAt = timestamp("fecha_creacion").defaultExpression(CurrentTimestamp)
}

object Permissions : IntIdTable("permiso", "id_permiso") {
    val permissionName = varchar("nombre_permiso", 100).uniqueIndex()
    val createdAt = timestamp("fecha_creacion").defaultExpression(CurrentTimestamp)
}

object RolePermissions : org.jetbrains.exposed.sql.Table("rol_permiso") {
    val id = integer("id_rol_permiso").autoIncrement()
    val roleId = reference("id_rol", Roles, onDelete = ReferenceOption.CASCADE)
    val permissionId = reference("id_permiso", Permissions, onDelete = ReferenceOption.CASCADE)
    val assignedAt = timestamp("fecha_asignacion").defaultExpression(CurrentTimestamp)

    override val primaryKey = PrimaryKey(id)

    init {
        uniqueIndex(roleId, permissionId)
    }
}