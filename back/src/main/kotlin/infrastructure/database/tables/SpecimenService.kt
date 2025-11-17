package com.hugin_munin.infrastructure.data.tables

import com.hugin_munin.infrastructure.database.DatabaseFactory
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.SqlExpressionBuilder.like
import org.jetbrains.exposed.sql.javatime.date
import org.jetbrains.exposed.sql.javatime.datetime
import org.jetbrains.exposed.sql.javatime.CurrentDateTime
import java.time.LocalDate

// ========== TABLE ==========

object Especies : IntIdTable("especie", "id_especie") {
    val genero = varchar("genero", 50)
    val especie = varchar("especie", 50)
    val nombreComun = varchar("nombre_comun", 100).nullable()
}

object Especimenes : IntIdTable("especimen", "id_especimen") {
    val numInventario = varchar("num_inventario", 20).uniqueIndex()
    val idEspecie = reference("id_especie", Especies, onDelete = ReferenceOption.RESTRICT)
    val nombreEspecimen = varchar("nombre_especimen", 100)
    val sexo = char("sexo").nullable()
    val fechaNacimiento = date("fecha_nacimiento").nullable()
    val activo = bool("activo").default(true)
    val fechaRegistro = datetime("fecha_registro").defaultExpression(CurrentDateTime)
}

// ========== DATA CLASSES ==========

@Serializable
data class EspecieRequest(
    val genero: String,
    val especie: String,
    val nombreComun: String? = null
)

@Serializable
data class EspecieResponse(
    val id: Int,
    val genero: String,
    val especie: String,
    val nombreComun: String?
)

@Serializable
data class EspecimenRequest(
    val numInventario: String,
    val idEspecie: Int,
    val nombreEspecimen: String,
    val sexo: String? = null,
    val fechaNacimiento: String? = null,
    val activo: Boolean = true
)

@Serializable
data class EspecimenResponse(
    val id: Int,
    val numInventario: String,
    val idEspecie: Int,
    val genero: String,
    val especie: String,
    val nombreComun: String?,
    val nombreEspecimen: String,
    val sexo: String?,
    val fechaNacimiento: String?,
    val activo: Boolean
)

// ========== SERVICE ==========

class SpecimenService {

    // ========== ESPECIES ==========

    suspend fun createEspecie(data: EspecieRequest): Int = DatabaseFactory.dbQuery {
        Especies.insert { stmt ->
            stmt[genero] = data.genero
            stmt[especie] = data.especie
            stmt[nombreComun] = data.nombreComun
        }[Especies.id].value
    }

    suspend fun getAllEspecies(): List<EspecieResponse> = DatabaseFactory.dbQuery {
        Especies.selectAll().map { toEspecieResponse(it) }
    }

    suspend fun getEspecieById(id: Int): EspecieResponse? = DatabaseFactory.dbQuery {
        Especies.selectAll()
            .where { Especies.id eq id }
            .map { toEspecieResponse(it) }
            .singleOrNull()
    }

    // ========== ESPECÍMENES ==========

    suspend fun createEspecimen(data: EspecimenRequest): Int = DatabaseFactory.dbQuery {
        Especimenes.insert { stmt ->
            stmt[numInventario] = data.numInventario
            stmt[idEspecie] = data.idEspecie
            stmt[nombreEspecimen] = data.nombreEspecimen
            stmt[sexo] = data.sexo?.firstOrNull()
            stmt[fechaNacimiento] = data.fechaNacimiento?.let { LocalDate.parse(it) }
            stmt[activo] = data.activo
        }[Especimenes.id].value
    }

    suspend fun getAllEspecimenes(): List<EspecimenResponse> = DatabaseFactory.dbQuery {
        (Especimenes innerJoin Especies)
            .selectAll()
            .map { toEspecimenResponse(it) }
    }

    suspend fun getEspecimenById(id: Int): EspecimenResponse? = DatabaseFactory.dbQuery {
        (Especimenes innerJoin Especies)
            .selectAll()
            .where { Especimenes.id eq id }
            .map { toEspecimenResponse(it) }
            .singleOrNull()
    }

    suspend fun updateEspecimen(id: Int, data: EspecimenRequest) = DatabaseFactory.dbQuery {
        Especimenes.update({ Especimenes.id eq id }) { stmt ->
            stmt[numInventario] = data.numInventario
            stmt[idEspecie] = data.idEspecie
            stmt[nombreEspecimen] = data.nombreEspecimen
            stmt[sexo] = data.sexo?.firstOrNull()
            stmt[fechaNacimiento] = data.fechaNacimiento?.let { LocalDate.parse(it) }
            stmt[activo] = data.activo
        }
    }

    suspend fun deleteEspecimen(id: Int) = DatabaseFactory.dbQuery {
        Especimenes.deleteWhere { Especimenes.id eq id }
    }

    suspend fun searchByName(name: String): List<EspecimenResponse> = DatabaseFactory.dbQuery {
        (Especimenes innerJoin Especies)
            .selectAll()
            .where { Especimenes.nombreEspecimen like "%$name%" }
            .map { toEspecimenResponse(it) }
    }

    suspend fun filterBySpecies(speciesName: String): List<EspecimenResponse> = DatabaseFactory.dbQuery {
        (Especimenes innerJoin Especies)
            .selectAll()
            .where {
                (Especies.genero like "%$speciesName%") or
                        (Especies.especie like "%$speciesName%")
            }
            .map { toEspecimenResponse(it) }
    }

    suspend fun filterByCommonName(commonName: String): List<EspecimenResponse> = DatabaseFactory.dbQuery {
        (Especimenes innerJoin Especies)
            .selectAll()
            .where { Especies.nombreComun like "%$commonName%" }
            .map { toEspecimenResponse(it) }
    }


    private fun toEspecieResponse(row: ResultRow) = EspecieResponse(
        id = row[Especies.id].value,
        genero = row[Especies.genero],
        especie = row[Especies.especie],
        nombreComun = row[Especies.nombreComun]
    )

    private fun toEspecimenResponse(row: ResultRow) = EspecimenResponse(
        id = row[Especimenes.id].value,
        numInventario = row[Especimenes.numInventario],
        idEspecie = row[Especimenes.idEspecie].value,
        genero = row[Especies.genero],
        especie = row[Especies.especie],
        nombreComun = row[Especies.nombreComun],
        nombreEspecimen = row[Especimenes.nombreEspecimen],
        sexo = row[Especimenes.sexo]?.toString(),
        fechaNacimiento = row[Especimenes.fechaNacimiento]?.toString(),
        activo = row[Especimenes.activo]
    )
}