package com.hugin_munin.api.infrastructure.config

import com.hugin_munin.api.domain.ports.*
import com.hugin_munin.api.infrastructure.database.repositories.*
import com.hugin_munin.api.application.services.*

import org.koin.dsl.module

val appModule = module {
    single<EspecieRepository> { EspecieRepositoryImpl() }
    single<EspecimenRepository> { EspecimenRepositoryImpl() }
    single<RegistroAltaRepository> { RegistroAltaRepositoryImpl() }
    single<ReporteRepository> { ReporteRepositoryImpl() }
    single<CausaBajaRepository> { CausaBajaRepositoryImpl() }
    single<RegistroBajaRepository> { RegistroBajaRepositoryImpl() }
    single<EstadisticasRepository> { EstadisticasRepositoryImpl() }
    single { EstadisticasService(get()) }


    single<AuthRepository> { AuthRepositoryImpl() }

    single {
        EspecimenService(
            especieRepository = get(),
            especimenRepository = get(),
            altaRepository = get(),
            reporteRepository = get(),
            registroAltaRepository = get()
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
        TrasladoService(
            reporteRepository = get(),
            especimenRepository = get()
        )
    }

    single {
        AuthService(
            authRepository = get()
        )
    }
}