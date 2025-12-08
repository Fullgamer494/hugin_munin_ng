package com.hugin_munin.api.application.services

import com.hugin_munin.api.domain.models.*
import com.hugin_munin.api.domain.ports.*

class RegistroAltaService(
    private val registroAltaRepository: RegistroAltaRepository,
    private val especimenRepository: EspecimenRepository,
    private val reporteRepository: ReporteRepository
) {
    private val TIPO_REPORTE_TRASLADO_ID = 5

    suspend fun getAllRegistros(): List<RegistroAlta> {
        return registroAltaRepository.findAll()
    }

    suspend fun getRegistroById(id: Int): RegistroAlta? {
        return registroAltaRepository.findById(id)
    }

    suspend fun getRegistroByEspecimenId(especimenId: Int): RegistroAlta? {
        return registroAltaRepository.findByEspecimenId(especimenId)
    }

    suspend fun createRegistroAlta(
        especimenId: Int,
        altaData: RegistroAlta,
        trasladoData: ReporteTraslado
    ): RegistroAlta {
        val especimen = especimenRepository.findById(especimenId)
            ?: throw IllegalArgumentException("Especimen con ID $especimenId no encontrado")

        val reportePadre = Reporte(
            tipoReporteId = TIPO_REPORTE_TRASLADO_ID,
            especimenId = especimen.id,
            responsableId = altaData.responsableId,
            asunto = "Registro de alta: ${especimen.nombre}",
            fechaReporte = altaData.fechaIngreso,
            contenido = "Espécimen registrado y ubicado en ${trasladoData.ubicacionDestino}"
        )
        val nuevoReportePadre = reporteRepository.save(reportePadre)

        val trasladoFinal = trasladoData.copy(reporteId = nuevoReportePadre.id!!)
        reporteRepository.saveTraslado(trasladoFinal)

        val altaParaGuardar = altaData.copy(
            especimenId = especimen.id!!,
            idReporteTraslado = nuevoReportePadre.id
        )
        return registroAltaRepository.save(altaParaGuardar)
    }

    suspend fun updateRegistroAlta(id: Int, altaData: RegistroAlta): RegistroAlta? {
        val existing = registroAltaRepository.findById(id)
            ?: return null

        val updated = existing.copy(
            origenAltaId = altaData.origenAltaId,
            procedencia = altaData.procedencia,
            observacion = altaData.observacion
        )

        return registroAltaRepository.update(id, updated)
    }

    suspend fun deleteRegistroAlta(id: Int): Boolean {
        return registroAltaRepository.delete(id)
    }
}