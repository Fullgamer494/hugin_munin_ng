package com.hugin_munin.api.infrastructure.database.repositories

import com.hugin_munin.api.domain.ports.EstadisticasRepository
import com.hugin_munin.api.infrastructure.database.DatabaseFactory
import com.hugin_munin.api.infrastructure.database.schemas.EspecimenTable
import com.hugin_munin.api.infrastructure.database.schemas.RegistroAltaTable
import kotlinx.datetime.LocalDate
import org.jetbrains.exposed.sql.select

class EstadisticasRepositoryImpl : EstadisticasRepository {

    override suspend fun contarEspecimenesActivos(): Int = DatabaseFactory.dbQuery {
        EspecimenTable
            .select { EspecimenTable.activo eq true }
            .count()
            .toInt()
    }

    override suspend fun contarEspecimenesInactivos(): Int = DatabaseFactory.dbQuery {
        EspecimenTable
            .select { EspecimenTable.activo eq false }
            .count()
            .toInt()
    }

    override suspend fun contarRegistrosAltasUltimosSieteDias(fechaLimite: LocalDate): Int = DatabaseFactory.dbQuery {
        RegistroAltaTable
            .select { RegistroAltaTable.fechaIngreso greaterEq fechaLimite }
            .count()
            .toInt()
    }
}