package com.hugin_munin.infrastructure.database.tables

import org.jetbrains.exposed.dao.id.IntIdTable

object RegistrationOrigins : IntIdTable("origen_alta", "id_origen_alta") {
    val originName = varchar("nombre_origen_alta", 100)
}
object DeregistrationCauses : IntIdTable("causa_baja", "id_causa_baja") {
    val causeName = varchar("nombre_causa_baja", 100)
}