package com.hugin_munin.api.infrastructure.database.repositories

import com.hugin_munin.api.domain.models.RegistroBaja
import com.hugin_munin.api.domain.ports.RegistroBajaRepository
import com.hugin_munin.api.infrastructure.api.dto.RegistroBajaDetalleResponse
import com.hugin_munin.api.infrastructure.api.dto.ResponsableInfo
import com.hugin_munin.api.infrastructure.database.DatabaseFactory.dbQuery
import com.hugin_munin.api.infrastructure.database.schemas.CausaBajaTable
import com.hugin_munin.api.infrastructure.database.schemas.EspecieTable
import com.hugin_munin.api.infrastructure.database.schemas.EspecimenTable
import com.hugin_munin.api.infrastructure.database.schemas.OrigenAltaTable
import com.hugin_munin.api.infrastructure.database.schemas.RegistroAltaTable
import com.hugin_munin.api.infrastructure.database.schemas.RegistroBajaTable
import com.hugin_munin.api.infrastructure.database.schemas.UsuarioTable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq

class RegistroBajaRepositoryImpl : RegistroBajaRepository {

    private fun resultRowToRegistroBaja(row: ResultRow) = RegistroBaja(
        id = row[RegistroBajaTable.id],
        especimenId = row[RegistroBajaTable.especimenId],
        causaBajaId = row[RegistroBajaTable.causaBajaId],
        responsableId = row[RegistroBajaTable.responsableId],
        fechaBaja = row[RegistroBajaTable.fechaBaja],
        observacion = row[RegistroBajaTable.observacion]
    )

    override suspend fun findAll(): List<RegistroBajaDetalleResponse> = dbQuery {
        RegistroBajaTable
            .innerJoin(EspecimenTable, { RegistroBajaTable.especimenId }, { EspecimenTable.id })
            .innerJoin(CausaBajaTable, { RegistroBajaTable.causaBajaId }, { CausaBajaTable.id })
            .innerJoin(UsuarioTable, { RegistroBajaTable.responsableId }, { UsuarioTable.id })
            .innerJoin(RegistroAltaTable, { EspecimenTable.id }, { RegistroAltaTable.especimenId })
            .innerJoin(OrigenAltaTable, { RegistroAltaTable.origenAltaId }, { OrigenAltaTable.id })
            .innerJoin(EspecieTable, { EspecimenTable.especieId }, { EspecieTable.id })
            .selectAll()
            .map(::resultRowToRegistroBajaDetalle)
    }

    override suspend fun findById(id: Int): RegistroBajaDetalleResponse? = dbQuery {
        RegistroBajaTable
            .innerJoin(EspecimenTable, { RegistroBajaTable.especimenId }, { EspecimenTable.id })
            .innerJoin(CausaBajaTable, { RegistroBajaTable.causaBajaId }, { CausaBajaTable.id })
            .innerJoin(UsuarioTable, { RegistroBajaTable.responsableId }, { UsuarioTable.id })
            .innerJoin(RegistroAltaTable, { EspecimenTable.id }, { RegistroAltaTable.especimenId })
            .innerJoin(OrigenAltaTable, { RegistroAltaTable.origenAltaId }, { OrigenAltaTable.id })
            .innerJoin(EspecieTable, { EspecimenTable.especieId }, { EspecieTable.id })
            .select { RegistroBajaTable.id eq id }
            .singleOrNull()
            ?.let(::resultRowToRegistroBajaDetalle)
    }

    override suspend fun findByEspecimenId(especimenId: Int): RegistroBajaDetalleResponse? = dbQuery {
        RegistroBajaTable
            .innerJoin(EspecimenTable, { RegistroBajaTable.especimenId }, { EspecimenTable.id })
            .innerJoin(CausaBajaTable, { RegistroBajaTable.causaBajaId }, { CausaBajaTable.id })
            .innerJoin(UsuarioTable, { RegistroBajaTable.responsableId }, { UsuarioTable.id })
            .innerJoin(RegistroAltaTable, { EspecimenTable.id }, { RegistroAltaTable.especimenId })
            .innerJoin(OrigenAltaTable, { RegistroAltaTable.origenAltaId }, { OrigenAltaTable.id })
            .innerJoin(EspecieTable, { EspecimenTable.especieId }, { EspecieTable.id })
            .select { RegistroBajaTable.especimenId eq especimenId }
            .singleOrNull()
            ?.let(::resultRowToRegistroBajaDetalle)
    }

    private fun resultRowToRegistroBajaDetalle(row: ResultRow): RegistroBajaDetalleResponse {
        val responsable = ResponsableInfo(
            id = row[UsuarioTable.id],
            nombreCompleto = row[UsuarioTable.nombreUsuario]
        )

        return RegistroBajaDetalleResponse(
            id = row[RegistroBajaTable.id],
            causaBajaId = row[RegistroBajaTable.causaBajaId],
            causaBajaNombre = row[CausaBajaTable.nombreCausaBaja],
            fechaBaja = row[RegistroBajaTable.fechaBaja],
            observacion = row[RegistroBajaTable.observacion],
            especimenId = row[EspecimenTable.id],
            numInventario = row[EspecimenTable.numInventario],
            nombreEspecimen = row[EspecimenTable.nombre],
            nombreComun = row[EspecimenTable.nombre] ?: "N/A",
            genero = row[EspecieTable.genero],
            especieNombre = row[EspecieTable.especie],
            origen = row[OrigenAltaTable.nombre],
            procedencia = row[RegistroAltaTable.procedencia] ?: "N/A",
            fechaIngreso = row[RegistroAltaTable.fechaIngreso],
            responsable = responsable
        )
    }

    override suspend fun save(baja: RegistroBaja): RegistroBaja = dbQuery {
        val insertStatement = RegistroBajaTable.insert {
            it[especimenId] = baja.especimenId
            it[causaBajaId] = baja.causaBajaId
            it[responsableId] = baja.responsableId
            it[fechaBaja] = baja.fechaBaja
            it[observacion] = baja.observacion
        }
        val id = insertStatement.resultedValues?.singleOrNull()?.get(RegistroBajaTable.id)
            ?: throw IllegalStateException("No se pudo crear el registro de baja")
        baja.copy(id = id)
    }

    override suspend fun update(id: Int, baja: RegistroBaja): RegistroBajaDetalleResponse? = dbQuery {
        val rowsAffected = RegistroBajaTable.update({ RegistroBajaTable.id eq id }) {
            it[causaBajaId] = baja.causaBajaId
            it[fechaBaja] = baja.fechaBaja
            it[observacion] = baja.observacion
        }
        
        if (rowsAffected > 0) {
            return@dbQuery findById(id)
        } else {
            null
        }
    }

    override suspend fun delete(id: Int): Boolean = dbQuery {
        RegistroBajaTable.deleteWhere { RegistroBajaTable.id eq id } > 0
    }
}