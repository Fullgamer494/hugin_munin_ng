package com.hugin_munin.api.infrastructure.database.repositories

import com.hugin_munin.api.domain.models.AuthenticatedUser
import com.hugin_munin.api.domain.ports.AuthRepository
import com.hugin_munin.api.domain.models.RefreshTokenInfo
import com.hugin_munin.api.infrastructure.database.DatabaseFactory.dbQuery
import com.hugin_munin.api.infrastructure.database.schemas.*
import kotlinx.datetime.Instant
import org.jetbrains.exposed.sql.*

class AuthRepositoryImpl : AuthRepository {

    override suspend fun findUserByEmail(email: String): AuthenticatedUser? = dbQuery {
        // Join de usuario + rol + permisos usando Exposed DSL
        val userRow = UsuarioTable
            .innerJoin(RolTable, { UsuarioTable.rolId }, { RolTable.id })
            .select {
                (UsuarioTable.correo eq email) and (UsuarioTable.activo eq true)
            }
            .singleOrNull() ?: return@dbQuery null

        // Obtener permisos del rol
        val permisos = RolPermisoTable
            .innerJoin(PermisoTable, { RolPermisoTable.permisoId }, { PermisoTable.id })
            .select { RolPermisoTable.rolId eq userRow[UsuarioTable.rolId] }
            .map { it[PermisoTable.nombre] }

        AuthenticatedUser(
            id = userRow[UsuarioTable.id],
            nombreUsuario = userRow[UsuarioTable.nombreUsuario],
            correo = userRow[UsuarioTable.correo],
            rolId = userRow[UsuarioTable.rolId],
            rolNombre = userRow[RolTable.nombre],
            permisos = permisos,
            activo = userRow[UsuarioTable.activo]
        )
    }

    override suspend fun findUserById(id: Int): AuthenticatedUser? = dbQuery {
        // Join de usuario + rol usando Exposed DSL
        val userRow = UsuarioTable
            .innerJoin(RolTable, { UsuarioTable.rolId }, { RolTable.id })
            .select {
                (UsuarioTable.id eq id) and (UsuarioTable.activo eq true)
            }
            .singleOrNull() ?: return@dbQuery null

        // Obtener permisos del rol
        val permisos = RolPermisoTable
            .innerJoin(PermisoTable, { RolPermisoTable.permisoId }, { PermisoTable.id })
            .select { RolPermisoTable.rolId eq userRow[UsuarioTable.rolId] }
            .map { it[PermisoTable.nombre] }

        AuthenticatedUser(
            id = userRow[UsuarioTable.id],
            nombreUsuario = userRow[UsuarioTable.nombreUsuario],
            correo = userRow[UsuarioTable.correo],
            rolId = userRow[UsuarioTable.rolId],
            rolNombre = userRow[RolTable.nombre],
            permisos = permisos,
            activo = userRow[UsuarioTable.activo]
        )
    }

    override suspend fun saveRefreshToken(
        userId: Int,
        token: String,
        expiresAt: Long,
        ipAddress: String?,
        userAgent: String?
    ): Boolean = dbQuery {
        val expiresAtLocalDate = Instant.fromEpochMilliseconds(expiresAt)
        val now = kotlinx.datetime.Clock.System.now()

        RefreshTokenTable.insert {
            it[RefreshTokenTable.userId] = userId
            it[RefreshTokenTable.token] = token
            it[RefreshTokenTable.expiresAt] = expiresAtLocalDate
            it[createdAt] = now
            it[revoked] = false
            it[RefreshTokenTable.ipAddress] = ipAddress
            it[RefreshTokenTable.userAgent] = userAgent
        }.insertedCount > 0
    }

    override suspend fun findRefreshToken(token: String): RefreshTokenInfo? = dbQuery {
        RefreshTokenTable
            .select { RefreshTokenTable.token eq token }
            .map { row ->
                RefreshTokenInfo(
                    id = row[RefreshTokenTable.id],
                    userId = row[RefreshTokenTable.userId],
                    token = row[RefreshTokenTable.token],
                    expiresAt = row[RefreshTokenTable.expiresAt].toEpochMilliseconds(),
                    revoked = row[RefreshTokenTable.revoked]
                )
            }
            .singleOrNull()
    }

    override suspend fun revokeRefreshToken(token: String): Boolean = dbQuery {
        RefreshTokenTable.update({ RefreshTokenTable.token eq token }) {
            it[revoked] = true
        } > 0
    }

    override suspend fun revokeAllUserTokens(userId: Int): Boolean = dbQuery {
        RefreshTokenTable.update({ RefreshTokenTable.userId eq userId }) {
            it[revoked] = true
        } > 0
    }
}