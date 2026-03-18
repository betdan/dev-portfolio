package portafolio.soap;

public final class Proyectos {

  private Proyectos() { }

  public static void main(String[] args) {
    String soapResponse = obtenerProyectosRespuesta();
    System.out.println("Respuesta SOAP generada:\n");
    System.out.println(soapResponse);
  }

  public static String obtenerProyectosRespuesta() {
    return """
      <?xml version="1.0" encoding="UTF-8"?>
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
                     xmlns:proj="urn:portafolio:proyectos:v2">
        <soap:Header/>
        <soap:Body>
          <proj:ObtenerProyectosRespuesta>
            <proj:Anios>

              <!-- ===================== 2026 ===================== -->
              <proj:Anio valor="2026">

                <proj:Proyecto>
                  <proj:Nombre>Aplicación Móvil (Evolución y Modernización)</proj:Nombre>
                  <proj:Resumen>Refactorización y evolución de servicios críticos bajo arquitectura desacoplada y cloud-native.</proj:Resumen>
                  <proj:AspectosDestacados>
                    <proj:Elemento>Implementación de arquitectura desacoplada con integración a AWS (SQS, SNS) y persistencia en PostgreSQL.</proj:Elemento>
                    <proj:Elemento>Aplicación de observabilidad (logs estructurados, métricas, health checks).</proj:Elemento>
                    <proj:Elemento>Optimización de servicios de transferencias, autenticación biométrica y gestión de claves.</proj:Elemento>
                    <proj:Elemento>Diseño de servicios para certificados de inversión y consulta de saldos.</proj:Elemento>
                  </proj:AspectosDestacados>
                </proj:Proyecto>

                <proj:Proyecto>
                  <proj:Nombre>Onboarding Digital & KYC</proj:Nombre>
                  <proj:Resumen>Automatización del proceso de vinculación digital de clientes.</proj:Resumen>
                  <proj:AspectosDestacados>
                    <proj:Elemento>Implementación y mejora del servicio KYC.</proj:Elemento>
                    <proj:Elemento>Desarrollo de flujos digitales para onboarding de clientes.</proj:Elemento>
                  </proj:AspectosDestacados>
                </proj:Proyecto>

                <proj:Proyecto>
                  <proj:Nombre>Mensajería e Integraciones (MQ / ISO)</proj:Nombre>
                  <proj:Resumen>Modernización de integraciones con sistemas legacy y procesadores externos.</proj:Resumen>
                  <proj:AspectosDestacados>
                    <proj:Elemento>Migración y desarrollo de servicios sobre colas MQ.</proj:Elemento>
                    <proj:Elemento>Integración con tramas ISO 8583 para tarjetas de crédito.</proj:Elemento>
                  </proj:AspectosDestacados>
                </proj:Proyecto>

                <proj:Proyecto>
                  <proj:Nombre>Pagos y Automatización</proj:Nombre>
                  <proj:Resumen>Automatización de pagos recurrentes y notificaciones.</proj:Resumen>
                  <proj:AspectosDestacados>
                    <proj:Elemento>Implementación de procesos batch y tareas programadas.</proj:Elemento>
                    <proj:Elemento>Diseño de servicios de consulta y procesamiento de pagos.</proj:Elemento>
                  </proj:AspectosDestacados>
                </proj:Proyecto>

                <proj:Proyecto>
                  <proj:Nombre>Gestión de Errores y Listas Blancas</proj:Nombre>
                  <proj:Resumen>Estandarización y certificación de códigos de error.</proj:Resumen>
                  <proj:AspectosDestacados>
                    <proj:Elemento>Homologación de códigos de error y manejo de estados críticos.</proj:Elemento>
                    <proj:Elemento>Implementación de reportería y auditoría.</proj:Elemento>
                  </proj:AspectosDestacados>
                </proj:Proyecto>

              </proj:Anio>

              <!-- ===================== 2025 ===================== -->
              <proj:Anio valor="2025">

                <proj:Proyecto>
                  <proj:Nombre>Servicios de Seguridad y OTP</proj:Nombre>
                  <proj:Resumen>Implementación de mecanismos de autenticación y validación.</proj:Resumen>
                  <proj:AspectosDestacados>
                    <proj:Elemento>Generación de OTP y envío de notificaciones SMS.</proj:Elemento>
                    <proj:Elemento>Despliegue de APIs en IIS para flujos críticos.</proj:Elemento>
                  </proj:AspectosDestacados>
                </proj:Proyecto>

                <proj:Proyecto>
                  <proj:Nombre>Arquitectura en Contenedores</proj:Nombre>
                  <proj:Resumen>Adopción de arquitectura cloud con Kubernetes.</proj:Resumen>
                  <proj:AspectosDestacados>
                    <proj:Elemento>Gestión de despliegues con Docker y Helm.</proj:Elemento>
                    <proj:Elemento>Automatización CI/CD.</proj:Elemento>
                  </proj:AspectosDestacados>
                </proj:Proyecto>

                <proj:Proyecto>
                  <proj:Nombre>Servicios de Encriptación</proj:Nombre>
                  <proj:Resumen>Implementación de seguridad y manejo de certificados.</proj:Resumen>
                  <proj:AspectosDestacados>
                    <proj:Elemento>Desarrollo de servicios desacoplados en .NET 8.</proj:Elemento>
                    <proj:Elemento>Gestión de claves y cifrado AES.</proj:Elemento>
                  </proj:AspectosDestacados>
                </proj:Proyecto>

              </proj:Anio>

              <!-- ===================== 2024 ===================== -->
              <proj:Anio valor="2024">

                <proj:Proyecto>
                  <proj:Nombre>APIs Core & Arquitectura K8s</proj:Nombre>
                  <proj:Resumen>Exposición de servicios backend bajo arquitectura de microservicios.</proj:Resumen>
                  <proj:AspectosDestacados>
                    <proj:Elemento>Desarrollo de APIs REST escalables.</proj:Elemento>
                    <proj:Elemento>Implementación de patrones de arquitectura.</proj:Elemento>
                  </proj:AspectosDestacados>
                </proj:Proyecto>

                <proj:Proyecto>
                  <proj:Nombre>ETL & Data Processing</proj:Nombre>
                  <proj:Resumen>Optimización de procesos de datos y reportería.</proj:Resumen>
                  <proj:AspectosDestacados>
                    <proj:Elemento>Diseño de procesos ETL.</proj:Elemento>
                    <proj:Elemento>Optimización de consultas SQL y procedimientos.</proj:Elemento>
                  </proj:AspectosDestacados>
                </proj:Proyecto>

              </proj:Anio>

              <!-- ===================== 2023 - 2021 ===================== -->
              <proj:Anio valor="2023-2021">

                <proj:Proyecto>
                  <proj:Nombre>Integración con Sistemas Legacy</proj:Nombre>
                  <proj:Resumen>Modernización e integración con plataformas legacy.</proj:Resumen>
                  <proj:AspectosDestacados>
                    <proj:Elemento>Desarrollo de servicios SOAP y REST.</proj:Elemento>
                    <proj:Elemento>Implementación de API Gateways.</proj:Elemento>
                    <proj:Elemento>Aplicación de idempotencia y control de transacciones.</proj:Elemento>
                  </proj:AspectosDestacados>
                </proj:Proyecto>

                <proj:Proyecto>
                  <proj:Nombre>Procesamiento Financiero y Transaccional</proj:Nombre>
                  <proj:Resumen>Implementación de lógica para procesamiento de pagos y movimientos.</proj:Resumen>
                  <proj:AspectosDestacados>
                    <proj:Elemento>Integración con ISO 8583 y sistemas financieros.</proj:Elemento>
                    <proj:Elemento>Procesamiento de transacciones en tiempo real.</proj:Elemento>
                  </proj:AspectosDestacados>
                </proj:Proyecto>

                <proj:Proyecto>
                  <proj:Nombre>Automatización y Reporting</proj:Nombre>
                  <proj:Resumen>Automatización de procesos y generación de reportes.</proj:Resumen>
                  <proj:AspectosDestacados>
                    <proj:Elemento>Implementación de procesos batch y ETL.</proj:Elemento>
                    <proj:Elemento>Generación de reportes PDF y sistemas de notificación.</proj:Elemento>
                  </proj:AspectosDestacados>
                </proj:Proyecto>

              </proj:Anio>

            </proj:Anios>
          </proj:ObtenerProyectosRespuesta>
        </soap:Body>
      </soap:Envelope>
      """;
  }
}