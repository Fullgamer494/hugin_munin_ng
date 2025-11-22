package com.hugin_munin.infrastructure.services

import com.hugin_munin.infrastructure.database.DatabaseFactory
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.javatime.date
import org.jetbrains.exposed.sql.javatime.timestamp
import org.jetbrains.exposed.sql.javatime.CurrentTimestamp
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
    val fechaRegistro = timestamp("fecha_registro").defaultExpression(CurrentTimestamp)
}

object OrigenAlta : IntIdTable("origen_alta", "id_origen_alta") {
    val nombreOrigenAlta = varchar("nombre_origen_alta", 100).uniqueIndex()
}

object Usuarios : IntIdTable("usuario", "id_usuario") {
    val idRol = integer("id_rol")
    val nombreUsuario = varchar("nombre_usuario", 100)
    val correo = varchar("correo", 100)
    val contrasena = varchar("contrasena", 255)
    val activo = bool("activo").default(true)
    val fechaCreacion = timestamp("fecha_creacion").defaultExpression(CurrentTimestamp)
    val ultimoAcceso = timestamp("ultimo_acceso").nullable()
}

object RegistroAlta : IntIdTable("registro_alta", "id_registro_alta") {
    val idEspecimen = reference("id_especimen", Especimenes, onDelete = ReferenceOption.CASCADE).uniqueIndex()
    val idOrigenAlta = reference("id_origen_alta", OrigenAlta, onDelete = ReferenceOption.RESTRICT)
    val idResponsable = reference("id_responsable", Usuarios, onDelete = ReferenceOption.RESTRICT)
    val fechaIngreso = date("fecha_ingreso")
    val procedencia = varchar("procedencia", 200).nullable()
    val observacion = text("observacion").nullable()
    val fechaRegistro = timestamp("fecha_registro").defaultExpression(CurrentTimestamp)
}

// ========== DTOs ==========

@Serializable
data class RegistroAltaRequest(

    val idEspecimen: Int? = null,
    val numInventario: String? = null,
    val idEspecie: Int? = null,
    val nombreEspecimen: String? = null,
    val sexo: String? = null,
    val fechaNacimiento: String? = null,


    val idOrigenAlta: Int,
    val idResponsable: Int,
    val fechaIngreso: String,
    val procedencia: String? = null,
    val observacion: String? = null
)

@Serializable
data class RegistroAltaResponse(
    val idRegistroAlta: Int,
    val idEspecimen: Int,
    val numInventario: String,
    val nombreEspecimen: String,
    val genero: String,
    val especie: String,
    val nombreComun: String?,
    val sexo: String?,
    val fechaNacimiento: String?,
    val nombreOrigenAlta: String,
    val nombreResponsable: String,
    val fechaIngreso: String,
    val procedencia: String?,
    val observacion: String?,
    val fechaRegistro: String
)

@Serializable
data class RegistroAltaListResponse(
    val idRegistroAlta: Int,
    val numInventario: String,
    val nombreEspecimen: String,
    val nombreCientifico: String, // genero + especie
    val nombreComun: String?,
    val nombreOrigenAlta: String,
    val fechaIngreso: String,
    val fechaRegistro: String
)

// ========== SERVICE ==========

class RegistrationService {

    suspend fun createRegistroAlta(data: RegistroAltaRequest): RegistroAltaResponse = DatabaseFactory.dbQuery {


        if (data.idOrigenAlta <= 0) {
            throw IllegalArgumentException("El ID del origen de alta es obligatorio")
        }
        if (data.idResponsable <= 0) {
            throw IllegalArgumentException("El ID del responsable es obligatorio")
        }

        val fechaIngreso = try {
            LocalDate.parse(data.fechaIngreso)
        } catch (e: Exception) {
            throw IllegalArgumentException("Formato de fecha de ingreso inválido")
        }


        val idEspecimen = if (data.idEspecimen != null) {

            val especimen = Especimenes.selectAll()
                .where { Especimenes.id eq data.idEspecimen }
                .singleOrNull()
                ?: throw IllegalArgumentException("El espécimen con ID ${data.idEspecimen} no existe")


            val existeAlta = RegistroAlta.selectAll()
                .where { RegistroAlta.idEspecimen eq data.idEspecimen }
                .count() > 0

            if (existeAlta) {
                throw IllegalArgumentException("El espécimen con ID ${data.idEspecimen} ya tiene un registro de alta")
            }

            data.idEspecimen
        } else {

            if (data.numInventario.isNullOrBlank()) {
                throw IllegalArgumentException("El número de inventario es obligatorio para crear un nuevo espécimen")
            }
            if (data.idEspecie == null || data.idEspecie <= 0) {
                throw IllegalArgumentException("El ID de especie es obligatorio para crear un nuevo espécimen")
            }
            if (data.nombreEspecimen.isNullOrBlank()) {
                throw IllegalArgumentException("El nombre del espécimen es obligatorio para crear un nuevo espécimen")
            }


            val especieExiste = Especies.selectAll()
                .where { Especies.id eq data.idEspecie }
                .count() > 0

            if (!especieExiste) {
                throw IllegalArgumentException("La especie con ID ${data.idEspecie} no existe")
            }


            val numInventarioExiste = Especimenes.selectAll()
                .where { Especimenes.numInventario eq data.numInventario }
                .count() > 0

            if (numInventarioExiste) {
                throw IllegalArgumentException("Ya existe un espécimen con el número de inventario '${data.numInventario}'")
            }


            if (data.sexo != null && data.sexo !in listOf("M", "F", "I")) {
                throw IllegalArgumentException("El sexo debe ser 'M', 'F' o 'I'")
            }


            Especimenes.insert { stmt ->
                stmt[numInventario] = data.numInventario
                stmt[idEspecie] = data.idEspecie
                stmt[nombreEspecimen] = data.nombreEspecimen
                stmt[sexo] = data.sexo?.firstOrNull()
                stmt[fechaNacimiento] = data.fechaNacimiento?.let { LocalDate.parse(it) }
                stmt[activo] = true
            }[Especimenes.id].value
        }


        val origenExiste = OrigenAlta.selectAll()
            .where { OrigenAlta.id eq data.idOrigenAlta }
            .count() > 0

        if (!origenExiste) {
            throw IllegalArgumentException("El origen de alta con ID ${data.idOrigenAlta} no existe")
        }


        val usuarioExiste = Usuarios.selectAll()
            .where { Usuarios.id eq data.idResponsable }
            .count() > 0

        if (!usuarioExiste) {
            throw IllegalArgumentException("El usuario con ID ${data.idResponsable} no existe")
        }

        val idRegistroAlta = RegistroAlta.insert { stmt ->
            stmt[RegistroAlta.idEspecimen] = idEspecimen
            stmt[RegistroAlta.idOrigenAlta] = data.idOrigenAlta
            stmt[RegistroAlta.idResponsable] = data.idResponsable
            stmt[RegistroAlta.fechaIngreso] = fechaIngreso
            stmt[RegistroAlta.procedencia] = data.procedencia
            stmt[RegistroAlta.observacion] = data.observacion
        }[RegistroAlta.id].value

        (RegistroAlta innerJoin Especimenes innerJoin Especies innerJoin OrigenAlta innerJoin Usuarios)
            .selectAll()
            .where { RegistroAlta.id eq idRegistroAlta }
            .map { toRegistroAltaResponse(it) }
            .singleOrNull()
            ?: throw IllegalStateException("Error al recuperar el registro de alta creado")
    }


    suspend fun getRegistroAltaById(id: Int): RegistroAltaResponse? = DatabaseFactory.dbQuery {
        (RegistroAlta innerJoin Especimenes innerJoin Especies innerJoin OrigenAlta innerJoin Usuarios)
            .selectAll()
            .where { RegistroAlta.id eq id }
            .map { toRegistroAltaResponse(it) }
            .singleOrNull()
    }


    suspend fun getAllRegistrosAlta(): List<RegistroAltaListResponse> = DatabaseFactory.dbQuery {
        (RegistroAlta innerJoin Especimenes innerJoin Especies innerJoin OrigenAlta)
            .selectAll()
            .orderBy(RegistroAlta.fechaRegistro to SortOrder.DESC)
            .map { toRegistroAltaListResponse(it) }
    }


    suspend fun updateRegistroAlta(id: Int, data: RegistroAltaRequest): Boolean = DatabaseFactory.dbQuery {

        val fechaIngreso = try {
            LocalDate.parse(data.fechaIngreso)
        } catch (e: Exception) {
            throw IllegalArgumentException("Formato de fecha de ingreso inválido. Use YYYY-MM-DD")
        }

        val updated = RegistroAlta.update({ RegistroAlta.id eq id }) { stmt ->
            stmt[idOrigenAlta] = data.idOrigenAlta
            stmt[idResponsable] = data.idResponsable
            stmt[RegistroAlta.fechaIngreso] = fechaIngreso
            stmt[procedencia] = data.procedencia
            stmt[observacion] = data.observacion
        }
        updated > 0
    }

    suspend fun deleteRegistroAlta(id: Int): Boolean = DatabaseFactory.dbQuery {

        val registro = RegistroAlta.selectAll()
            .where { RegistroAlta.id eq id }
            .singleOrNull()
            ?: return@dbQuery false

        val idEspecimen = registro[RegistroAlta.idEspecimen].value


        Especimenes.update({ Especimenes.id eq idEspecimen }) { stmt ->
            stmt[activo] = false
        }


        RegistroAlta.deleteWhere { RegistroAlta.id eq id } > 0
    }

    // ========== MAPPERS ==========

    private fun toRegistroAltaResponse(row: ResultRow): RegistroAltaResponse {
        return RegistroAltaResponse(
            idRegistroAlta = row[RegistroAlta.id].value,
            idEspecimen = row[Especimenes.id].value,
            numInventario = row[Especimenes.numInventario],
            nombreEspecimen = row[Especimenes.nombreEspecimen],
            genero = row[Especies.genero],
            especie = row[Especies.especie],
            nombreComun = row[Especies.nombreComun],
            sexo = row[Especimenes.sexo]?.toString(),
            fechaNacimiento = row[Especimenes.fechaNacimiento]?.toString(),
            nombreOrigenAlta = row[OrigenAlta.nombreOrigenAlta],
            nombreResponsable = row[Usuarios.nombreUsuario],
            fechaIngreso = row[RegistroAlta.fechaIngreso].toString(),
            procedencia = row[RegistroAlta.procedencia],
            observacion = row[RegistroAlta.observacion],
            fechaRegistro = row[RegistroAlta.fechaRegistro].toString()
        )
    }

    private fun toRegistroAltaListResponse(row: ResultRow): RegistroAltaListResponse {
        val genero = row[Especies.genero]
        val especie = row[Especies.especie]
        return RegistroAltaListResponse(
            idRegistroAlta = row[RegistroAlta.id].value,
            numInventario = row[Especimenes.numInventario],
            nombreEspecimen = row[Especimenes.nombreEspecimen],
            nombreCientifico = "$genero $especie",
            nombreComun = row[Especies.nombreComun],
            nombreOrigenAlta = row[OrigenAlta.nombreOrigenAlta],
            fechaIngreso = row[RegistroAlta.fechaIngreso].toString(),
            fechaRegistro = row[RegistroAlta.fechaRegistro].toString()
        )
    }
}