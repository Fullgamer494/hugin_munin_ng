package com.hugin_munin.api.domain.ports
import com.hugin_munin.api.domain.models.OrigenAlta
import com.hugin_munin.api.domain.models.Reporte
import com.hugin_munin.api.domain.models.ReporteTraslado

interface ReporteRepository {

    suspend fun findById(id: Int): Reporte?
    suspend fun save(reporte: Reporte): Reporte
    suspend fun saveTraslado(traslado: ReporteTraslado)
    suspend fun findTrasladoByReporteId(reporteId: Int): ReporteTraslado?
    suspend fun findOrigenAltaById(id: Int): OrigenAlta?

    suspend fun findAll(): List<Reporte>
    suspend fun findByEspecimenId(especimenId: Int): List<Reporte>
    suspend fun update(id: Int, reporte: Reporte): Reporte?
    suspend fun delete(id: Int): Boolean
    suspend fun updateTraslado(reporteId: Int, traslado: ReporteTraslado): Boolean

}
