package com.hugin_munin.api.application.services

import com.hugin_munin.api.domain.models.Area
import com.hugin_munin.api.domain.models.Reporte
import com.hugin_munin.api.domain.models.ReporteTraslado
import com.hugin_munin.api.domain.ports.ReporteRepository
import com.hugin_munin.api.domain.ports.EspecimenRepository
import com.hugin_munin.api.infrastructure.api.dto.TrasladoRequest
import com.hugin_munin.api.infrastructure.api.dto.TrasladoUpdateRequest
import com.hugin_munin.api.infrastructure.api.dto.TrasladoResponse
import com.hugin_munin.api.infrastructure.api.dto.TrasladoDetalleResponse
import kotlinx.datetime.Clock
import kotlinx.datetime.LocalDate
import kotlinx.datetime.TimeZone
import kotlinx.datetime.atStartOfDayIn
import kotlinx.datetime.toLocalDateTime
import kotlinx.datetime.todayIn

class TrasladoService(
    private val reporteRepository: ReporteRepository,
    private val especimenRepository: EspecimenRepository
) {
    private val TIPO_REPORTE_TRASLADO_ID = 5

    suspend fun createTraslado(request: TrasladoRequest): TrasladoResponse {

        val especimen = especimenRepository.findById(request.especimenId)
            ?: throw IllegalArgumentException("Especimen con ID ${request.especimenId} no encontrado")

        validarArea(request.areaOrigen, "origen")
        validarArea(request.areaDestino, "destino")

        if (request.areaDestino.equals("Externo", ignoreCase = true)) {
            throw IllegalArgumentException("El área de destino no puede ser 'Externo'")
        }

        if (request.areaOrigen.equals(request.areaDestino, ignoreCase = true)) {
            throw IllegalArgumentException("El área de origen y destino deben ser diferentes")
        }

        if (request.ubicacionOrigen.isBlank()) {
            throw IllegalArgumentException("La ubicación de origen no puede estar vacía")
        }
        if (request.ubicacionDestino.isBlank()) {
            throw IllegalArgumentException("La ubicación de destino no puede estar vacía")
        }

        val fechaReporte = request.fechaReporte
            ?: Clock.System.now().toLocalDateTime(TimeZone.currentSystemDefault()).date

        val asunto = request.asunto
            ?: "Traslado: ${especimen.nombre} de ${request.areaOrigen} a ${request.areaDestino}"

        val contenido = buildString {
            append("Especimen trasladado de ")
            append("${request.areaOrigen} (${request.ubicacionOrigen}) ")
            append("a ${request.areaDestino} (${request.ubicacionDestino})")
            if (!request.motivo.isNullOrBlank()) {
                append(". Motivo: ${request.motivo}")
            }
        }

        val reporte = Reporte(
            tipoReporteId = TIPO_REPORTE_TRASLADO_ID,
            especimenId = request.especimenId,
            responsableId = request.responsableId,
            asunto = asunto,
            contenido = contenido,
            fechaReporte = fechaReporte
        )

        val nuevoReporte = reporteRepository.save(reporte)

        val traslado = ReporteTraslado(
            reporteId = nuevoReporte.id!!,
            areaOrigen = request.areaOrigen,
            areaDestino = request.areaDestino,
            ubicacionOrigen = request.ubicacionOrigen,
            ubicacionDestino = request.ubicacionDestino,
            motivo = request.motivo
        )

        reporteRepository.saveTraslado(traslado)

        return TrasladoResponse(
            idReporte = nuevoReporte.id,
            tipoReporteId = nuevoReporte.tipoReporteId,
            especimenId = nuevoReporte.especimenId!!,
            responsableId = nuevoReporte.responsableId,
            asunto = nuevoReporte.asunto,
            contenido = nuevoReporte.contenido,
            fechaReporte = nuevoReporte.fechaReporte,
            traslado = TrasladoDetalleResponse(
                areaOrigen = traslado.areaOrigen,
                areaDestino = traslado.areaDestino,
                ubicacionOrigen = traslado.ubicacionOrigen,
                ubicacionDestino = traslado.ubicacionDestino,
                motivo = traslado.motivo
            )
        )
    }

    suspend fun getTrasladoById(idReporte: Int): TrasladoResponse? {
        val reporte = reporteRepository.findById(idReporte) ?: return null

        if (reporte.tipoReporteId != TIPO_REPORTE_TRASLADO_ID) {
            throw IllegalArgumentException("El reporte $idReporte no es de tipo traslado")
        }

        val traslado = reporteRepository.findTrasladoByReporteId(idReporte) ?: return null

        return TrasladoResponse(
            idReporte = reporte.id!!,
            tipoReporteId = reporte.tipoReporteId,
            especimenId = reporte.especimenId!!,
            responsableId = reporte.responsableId,
            asunto = reporte.asunto,
            contenido = reporte.contenido,
            fechaReporte = reporte.fechaReporte,
            traslado = TrasladoDetalleResponse(
                areaOrigen = traslado.areaOrigen,
                areaDestino = traslado.areaDestino,
                ubicacionOrigen = traslado.ubicacionOrigen,
                ubicacionDestino = traslado.ubicacionDestino,
                motivo = traslado.motivo
            )
        )
    }

    suspend fun getAllTraslados(): List<TrasladoResponse> {
        val reportes = reporteRepository.findAll()
            .filter { it.tipoReporteId == TIPO_REPORTE_TRASLADO_ID }

        return reportes.mapNotNull { reporte ->
            val traslado = reporteRepository.findTrasladoByReporteId(reporte.id!!)
            if (traslado != null) {
                TrasladoResponse(
                    idReporte = reporte.id,
                    tipoReporteId = reporte.tipoReporteId,
                    especimenId = reporte.especimenId!!,
                    responsableId = reporte.responsableId,
                    asunto = reporte.asunto,
                    contenido = reporte.contenido,
                    fechaReporte = reporte.fechaReporte,
                    traslado = TrasladoDetalleResponse(
                        areaOrigen = traslado.areaOrigen,
                        areaDestino = traslado.areaDestino,
                        ubicacionOrigen = traslado.ubicacionOrigen,
                        ubicacionDestino = traslado.ubicacionDestino,
                        motivo = traslado.motivo
                    )
                )
            } else null
        }
    }

    suspend fun updateTraslado(idReporte: Int, request: TrasladoUpdateRequest): TrasladoResponse? {
        val reporteExistente = reporteRepository.findById(idReporte) ?: return null

        if (reporteExistente.tipoReporteId != TIPO_REPORTE_TRASLADO_ID) {
            throw IllegalArgumentException("El reporte $idReporte no es de tipo traslado")
        }

        val trasladoExistente = reporteRepository.findTrasladoByReporteId(idReporte)
            ?: throw IllegalArgumentException("No se encontró el detalle de traslado")

        if (request.areaOrigen != null) {
            validarArea(request.areaOrigen, "origen")
        }
        if (request.areaDestino != null) {
            validarArea(request.areaDestino, "destino")
            if (request.areaDestino.equals("Externo", ignoreCase = true)) {
                throw IllegalArgumentException("El área de destino no puede ser 'Externo'")
            }
        }

        val reporteActualizado = reporteExistente.copy(
            asunto = request.asunto ?: reporteExistente.asunto,
            fechaReporte = request.fechaReporte ?: reporteExistente.fechaReporte
        )

        reporteRepository.update(idReporte, reporteActualizado)

        return getTrasladoById(idReporte)
    }

    private fun validarArea(area: String, tipo: String) {
        if (Area.fromString(area) == null) {
            throw IllegalArgumentException(
                "Área de $tipo '$area' no válida. " +
                        "Valores permitidos: ${Area.valoresPermitidos().joinToString()}"
            )
        }
    }
}