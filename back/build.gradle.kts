plugins {
    kotlin("jvm") version "2.0.21"
    id("io.ktor.plugin") version "3.0.3"
    kotlin("plugin.serialization") version "2.0.21"
}

group = "com.hugin_munin"
version = "0.0.1"

application {
    mainClass.set("io.ktor.server.netty.EngineMain")
}

repositories {
    mavenCentral()
}

dependencies {
    // Ktor Core
    implementation("io.ktor:ktor-server-core-jvm:3.0.3")
    implementation("io.ktor:ktor-server-netty-jvm:3.0.3")
    implementation("io.ktor:ktor-server-content-negotiation-jvm:3.0.3")
    implementation("io.ktor:ktor-serialization-kotlinx-json-jvm:3.0.3")
    implementation("io.ktor:ktor-server-status-pages-jvm:3.0.3")
    implementation("io.ktor:ktor-server-config-yaml:3.0.3")

    // JWT
    implementation("io.ktor:ktor-server-auth-jvm:3.0.3")
    implementation("io.ktor:ktor-server-auth-jwt-jvm:3.0.3")

    // Logging
    implementation("ch.qos.logback:logback-classic:1.4.14")

    // Exposed
    implementation("org.jetbrains.exposed:exposed-core:0.41.1")
    implementation("org.jetbrains.exposed:exposed-dao:0.41.1")
    implementation("org.jetbrains.exposed:exposed-jdbc:0.41.1")
    implementation("org.jetbrains.exposed:exposed-kotlin-datetime:0.41.1")

    // PostgreSQL
    implementation("org.postgresql:postgresql:42.7.1")
    implementation("com.zaxxer:HikariCP:5.1.0")

    // Koin
    implementation("io.insert-koin:koin-ktor:4.0.0")
    implementation("io.insert-koin:koin-logger-slf4j:4.0.0")

    // Kotlinx DateTime
    implementation("org.jetbrains.kotlinx:kotlinx-datetime:0.5.0")

    // Bycript para hash de contras
    implementation("org.mindrot:jbcrypt:0.4")

    // Testing
    testImplementation("io.ktor:ktor-server-test-host-jvm:3.0.3")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit:2.0.21")

    // CORS
    implementation("io.ktor:ktor-server-cors-jvm:3.0.3")
}

tasks {
    shadowJar {
        archiveBaseName.set("app")
        archiveClassifier.set("all")
        archiveVersion.set(project.version.toString())

        manifest {
            attributes(
                "Main-Class" to application.mainClass.get()
            )
        }

        mergeServiceFiles()
    }

    build {
        dependsOn(shadowJar)
    }
}

kotlin {
    jvmToolchain(21)
}