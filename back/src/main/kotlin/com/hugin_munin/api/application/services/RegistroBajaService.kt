package com.hugin_munin.api.application.services

import com.hugin_munin.api.domain.models.RegistroBaja
import com.hugin_munin.api.domain.ports.*
import com.hugin_munin.api.infrastructure.api.dto.RegistroBajaDetalleResponse
import com.hugin_munin.api.infrastructure.api.dto.RegistroBajaUpdateRequest

class RegistroBajaService(
    private val registroBajaRepository: RegistroBajaRepository,
    private val especimenRepository: EspecimenRepository,
    private val causaBajaRepository: CausaBajaRepository
) {

    suspend fun getAllRegistros(): List<RegistroBajaDetalleResponse> {
        return registroBajaRepository.findAll()
    }

    suspend fun getRegistroById(id: Int): RegistroBajaDetalleResponse? {
        return registroBajaRepository.findById(id)
    }

    suspend fun getRegistroByEspecimenId(especimenId: Int): RegistroBajaDetalleResponse? {
        return registroBajaRepository.findByEspecimenId(especimenId)
    }

    suspend fun createRegistroBaja(baja: RegistroBaja): RegistroBaja {
        val especimen = especimenRepository.findById(baja.especimenId)
            ?: throw IllegalArgumentException("Especimen con ID ${baja.especimenId} no encontrado")

        if (!especimen.activo) {
            throw IllegalArgumentException("El especimen ya está dado de baja")
        }

        val causaBaja = causaBajaRepository.findById(baja.causaBajaId)
            ?: throw IllegalArgumentException("Causa de baja con ID ${baja.causaBajaId} no encontrada")

        val existingBaja = registroBajaRepository.findByEspecimenId(baja.especimenId)
        if (existingBaja != null) {
            throw IllegalArgumentException("Ya existe un registro de baja para este especimen")
        }

        val especimenInactivo = especimen.copy(activo = false)
        especimenRepository.update(especimen.id!!, especimenInactivo)

        return registroBajaRepository.save(baja)
    }

    suspend fun deleteRegistroBaja(id: Int): Boolean {
        val baja = registroBajaRepository.findById(id) ?: return false

        val especimen = especimenRepository.findById(baja.especimenId)
        if (especimen != null) {
            val especimenActivo = especimen.copy(activo = true)
            especimenRepository.update(especimen.id!!, especimenActivo)
        }

        return registroBajaRepository.delete(id)
    }

    suspend fun getAllCausasBaja(): List<com.hugin_munin.api.domain.models.CausaBaja> {
        return causaBajaRepository.findAll()
    }

    suspend fun updateRegistroBaja(id: Int, updateRequest: RegistroBajaUpdateRequest): RegistroBajaDetalleResponse? {
        val existingBaja = registroBajaRepository.findById(id) ?: return null

        val causaBaja = causaBajaRepository.findById(updateRequest.causaBajaId)
            ?: throw IllegalArgumentException("Causa de baja con ID ${updateRequest.causaBajaId} no encontrada")

        // Creamos un RegistroBaja para la actualización manteniendo los campos que no se modifican
        val registroBajaToUpdate = RegistroBaja(
            id = id,
            especimenId = existingBaja.especimenId,
            causaBajaId = updateRequest.causaBajaId,
            responsableId = existingBaja.responsable.id, // Aquí está el responsableId que faltaba
            fechaBaja = updateRequest.fechaBaja,
            observacion = updateRequest.observacion
        )

        return registroBajaRepository.update(id, registroBajaToUpdate)
    }
}