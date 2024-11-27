package com.hugin_munin.api.infrastructure.middleware

import com.hugin_munin.api.infrastructure.config.hasAnyPermission
import com.hugin_munin.api.infrastructure.config.hasPermission
import com.hugin_munin.api.infrastructure.config.userPermissions
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import kotlinx.serialization.Serializable

// Exception lanzada cuando el usuario no tiene permisos suficientes
class PermissionDeniedException(
    val requiredPermissions: List<String>,
    val userPermissions: List<String>
) : Exception("Permisos insuficientes. Requeridos: $requiredPermissions, Usuario tiene: $userPermissions")

// Validar que el usuario tenga UN permiso específico
suspend fun ApplicationCall.requirePermission(permission: String) {
    if (!hasPermission(permission)) {
        respond(
            HttpStatusCode.Forbidden,
            ForbiddenResponse(
                error = "Acceso denegado",
                message = "No tienes permiso para realizar esta acción",
                requiredPermissions = listOf(permission),
                userPermissions = userPermissions
            )
        )
        throw PermissionDeniedException(listOf(permission), userPermissions)
    }
}

// Validar que el usuario tenga TODOS los permisos especificados
suspend fun ApplicationCall.requireAllPermissions(vararg permissions: String) {
    val userPerms = userPermissions
    val missingPermissions = permissions.filter { it !in userPerms }

    if (missingPermissions.isNotEmpty()) {
        respond(
            HttpStatusCode.Forbidden,
            ForbiddenResponse(
                error = "Acceso denegado",
                message = "Te faltan permisos necesarios para esta acción",
                requiredPermissions = permissions.toList(),
                userPermissions = userPerms,
                missingPermissions = missingPermissions
            )
        )
        throw PermissionDeniedException(permissions.toList(), userPerms)
    }
}

// Validar que el usuario tenga AL MENOS UNO de los permisos especificados
suspend fun ApplicationCall.requireAnyPermission(vararg permissions: String) {
    if (!hasAnyPermission(*permissions)) {
        respond(
            HttpStatusCode.Forbidden,
            ForbiddenResponse(
                error = "Acceso denegado",
                message = "No tienes ninguno de los permisos requeridos para esta acción",
                requiredPermissions = permissions.toList(),
                userPermissions = userPermissions
            )
        )
        throw PermissionDeniedException(permissions.toList(), userPermissions)
    }
}

@Serializable
data class ForbiddenResponse(
    val error: String,
    val message: String,
    val requiredPermissions: List<String>,
    val userPermissions: List<String>,
    val missingPermissions: List<String>? = null
)