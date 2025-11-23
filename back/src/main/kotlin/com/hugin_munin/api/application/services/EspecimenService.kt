package com.hugin_munin.api.application.services

import com.hugin_munin.api.domain.models.*
import com.hugin_munin.api.domain.ports.*
import kotlinx.datetime.LocalDate

class EspecimenService(
    private val especieRepository: EspecieRepository,
    private val especimenRepository: EspecimenRepository,
    private val altaRepository: RegistroAltaRepository,
    private val reporteRepository: ReporteRepository
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

    suspend fun updateEspecimen(id: Int, especimen: Especimen): Especimen? {
        return especimenRepository.update(id, especimen)
    }
}