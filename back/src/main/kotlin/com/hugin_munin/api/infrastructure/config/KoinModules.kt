package com.hugin_munin.api.infrastructure.config

import com.hugin_munin.api.domain.ports.*
import com.hugin_munin.api.infrastructure.database.repositories.*
import com.hugin_munin.api.application.services.EspecimenService
import com.hugin_munin.api.application.services.EspecimenQueryService
import com.hugin_munin.api.application.services.RegistroAltaService
import com.hugin_munin.api.application.services.RegistroBajaService
import com.hugin_munin.api.application.services.ReporteConductualService
import com.hugin_munin.api.application.services.ReporteService

import org.koin.dsl.module

val appModule = module {
    single<EspecieRepository> { EspecieRepositoryImpl() }
    single<EspecimenRepository> { EspecimenRepositoryImpl() }
    single<RegistroAltaRepository> { RegistroAltaRepositoryImpl() }
    single<ReporteRepository> { ReporteRepositoryImpl() }
    single<CausaBajaRepository> { CausaBajaRepositoryImpl() }
    single<RegistroBajaRepository> { RegistroBajaRepositoryImpl() }
    single<ReporteConductualRepository> { ReporteConductualRepositoryImpl() }

    single {
        EspecimenService(
            especieRepository = get(),
            especimenRepository = get(),
            altaRepository = get(),
            reporteRepository = get()
        )
    }

    single {
        EspecimenQueryService(
            especimenRepository = get(),
            especieRepository = get(),
            registroAltaRepository = get(),
            reporteRepository = get()
        )
    }

    single {
        RegistroAltaService(
            registroAltaRepository = get(),
            especimenRepository = get(),
            reporteRepository = get()
        )
    }

    single {
        RegistroBajaService(
            registroBajaRepository = get(),
            especimenRepository = get(),
            causaBajaRepository = get()
        )
    }

    single {
        ReporteService(
            reporteRepository = get()
        )
    }

    single {
        ReporteConductualService(get())
    }
}