package com.hugin_munin.api.application.services

import com.hugin_munin.api.domain.models.*
import com.hugin_munin.api.domain.ports.*
import com.hugin_munin.api.infrastructure.api.dto.EspecimenDetalleResponse
import com.hugin_munin.api.infrastructure.api.dto.RegistroAltaInfo
import com.hugin_munin.api.infrastructure.api.dto.TrasladoInfo
import com.hugin_munin.api.infrastructure.api.dto.UpdateAltaEspecimenRequest

class EspecimenService(
    private val especieRepository: EspecieRepository,
    private val especimenRepository: EspecimenRepository,
    private val altaRepository: RegistroAltaRepository,
    private val reporteRepository: ReporteRepository,
    private val registroAltaRepository: RegistroAltaRepository
) {
    private val TIPO_REPORTE_TRASLADO_ID = 5

    suspend fun registerEspecimen(
        especieData: Especie,
        especimenData: Especimen,
        altaData: RegistroAlta,
        trasladoData: ReporteTraslado
    ): Especimen {
        val especieExistente = especieRepository.findByGeneroAndEspecie(especieData.genero, especieData.especie)
        val especieFinal = especieExistente ?: especieRepository.save(especieData)

        val especimenParaGuardar = especimenData.copy(especieId = especieFinal.id!!)
        val nuevoEspecimen = especimenRepository.save(especimenParaGuardar)

        val reportePadre = Reporte(
            tipoReporteId = TIPO_REPORTE_TRASLADO_ID,
            especimenId = nuevoEspecimen.id,
            responsableId = altaData.responsableId,
            asunto = "Ingreso inicial: ${nuevoEspecimen.nombre}",
            fechaReporte = altaData.fechaIngreso,
            contenido = "Espécimen ingresado y ubicado en ${trasladoData.ubicacionDestino}"
        )
        val nuevoReportePadre = reporteRepository.save(reportePadre)

        val trasladoFinal = trasladoData.copy(reporteId = nuevoReportePadre.id!!)
        reporteRepository.saveTraslado(trasladoFinal)

        val altaParaGuardar = altaData.copy(
            especimenId = nuevoEspecimen.id!!,
            idReporteTraslado = nuevoReportePadre.id
        )
        altaRepository.save(altaParaGuardar)

        return nuevoEspecimen
    }

    suspend fun getEspecimenDetalleById(id: Int): EspecimenDetalleResponse? {
        val especimen = especimenRepository.findById(id) ?: return null
        val especie = especieRepository.findById(especimen.especieId) ?: return null
        val registroAlta = registroAltaRepository.findByEspecimenId(especimen.id!!) ?: return null

        val reporte = reporteRepository.findById(registroAlta.idReporteTraslado) ?: return null
        val traslado = reporteRepository.findTrasladoByReporteId(registroAlta.idReporteTraslado) ?: return null
        val origenAlta = reporteRepository.findOrigenAltaById(registroAlta.origenAltaId) ?: return null

        return EspecimenDetalleResponse(
            id = especimen.id,
            numInventario = especimen.numInventario,
            nombreEspecimen = especimen.nombre,
            genero = especie.genero,
            especieNombre = especie.especie,
            activo = especimen.activo,
            registroAlta = RegistroAltaInfo(
                id = registroAlta.id!!,
                origenAltaNombre = origenAlta.nombre,
                procedencia = registroAlta.procedencia,
                observacion = registroAlta.observacion,
                fechaIngreso = registroAlta.fechaIngreso,
                responsableId = registroAlta.responsableId,
                traslado = TrasladoInfo(
                    areaDestino = traslado.areaDestino,
                    ubicacionDestino = traslado.ubicacionDestino,
                    areaOrigen = traslado.areaOrigen,
                    ubicacionOrigen = traslado.ubicacionOrigen,
                    motivo = traslado.motivo
                )
            )
        )
    }

    suspend fun getAllEspecimenesDetalle(): List<EspecimenDetalleResponse> {
        val especimenes = especimenRepository.findAll()
        return especimenes.mapNotNull { especimen ->
            getEspecimenDetalleById(especimen.id!!)
        }
    }

    suspend fun update(
        id: Int,
        request: UpdateAltaEspecimenRequest,
    ): EspecimenDetalleResponse? {
        val especimen = especimenRepository.findById(id) ?: return null
        val registroAlta = altaRepository.findByEspecimenId(id) ?: return null

        // 1. Actualizar Especie (si viene en el request)
        if (request.genero != null && request.especieNombre != null) {
            val especieExistente = especieRepository.findByGeneroAndEspecie(
                request.genero,
                request.especieNombre
            )
            val especieFinal = especieExistente ?: especieRepository.save(
                Especie(genero = request.genero, especie = request.especieNombre)
            )

            especimenRepository.update(id, especimen.copy(
                nombre = request.nombreEspecimen,
                especieId = especieFinal.id!!
            ))
        } else {
            especimenRepository.update(id, especimen.copy(
                nombre = request.nombreEspecimen
            ))
        }

        // 2. Actualizar Registro de Alta
        altaRepository.update(registroAlta.id!!, registroAlta.copy(
            origenAltaId = request.origenAltaId,
            fechaIngreso = request.fechaIngreso,
            procedencia = request.procedencia,
            observacion = request.observacion
        ))

        // 3. Actualizar ReporteTraslado (solo campos permitidos)
        if (request.ubicacionDestino != null || request.motivo != null) {
            val trasladoActual = reporteRepository.findTrasladoByReporteId(
                registroAlta.idReporteTraslado
            )

            if (trasladoActual != null) {
                val trasladoActualizado = trasladoActual.copy(
                    ubicacionDestino = request.ubicacionDestino ?: trasladoActual.ubicacionDestino,
                    motivo = request.motivo ?: trasladoActual.motivo
                )
                reporteRepository.updateTraslado(registroAlta.idReporteTraslado, trasladoActualizado)
            }
        }

        return getEspecimenDetalleById(id)
    }
}