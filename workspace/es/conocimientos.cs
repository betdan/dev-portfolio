using System;
using System.Collections.Generic;

class Aprender
{
    static void Main(string[] args)
    {
        Console.WriteLine("Inicializando perfil profesional...\n");

        var controlador = new ControladorAprendizaje();

        var respuesta = controlador.ObtenerTemas();

        Console.WriteLine("\n--- RESPUESTA API ---");

        Console.WriteLine($"Éxito: {respuesta.Exito}");
        Console.WriteLine($"Mensaje: {respuesta.Mensaje}");

        Console.WriteLine("\nTemas:");

        foreach (var tema in respuesta.Datos)
        {
            Console.WriteLine($"✔ {tema}");
        }

        Console.WriteLine("\nAplicación finalizada.");
    }
}

public class ControladorAprendizaje
{
    public RespuestaApi<List<string>> ObtenerTemas()
    {
        Logger.Info("Obteniendo temas de aprendizaje...");

        var aprendizaje = new Aprendizaje();

        Logger.Success("Temas cargados exitosamente.");

        return new RespuestaApi<List<string>>
        {
            Exito = true,
            Mensaje = "Temas de aprendizaje obtenidos",
            Datos = aprendizaje.Temas
        };
    }
}

public static class Logger
{
    public static void Info(string mensaje)
    {
        Console.WriteLine($"[INFO] {DateTime.Now:HH:mm:ss} - {mensaje}");
    }

    public static void Success(string mensaje)
    {
        Console.WriteLine($"[SUCCESS] {DateTime.Now:HH:mm:ss} - {mensaje}");
    }

    public static void Error(string mensaje)
    {
        Console.WriteLine($"[ERROR] {DateTime.Now:HH:mm:ss} - {mensaje}");
    }
}

public class Aprendizaje
{
    public List<string> Temas { get; set; } = new()
    {
        // Nube & DevOps
        "AWS",
        "Docker",
        "Kubernetes",
        "CI/CD",
        "Infrastructure as Code",

        // Arquitectura
        "Microservices",
        "Event-Driven Architecture",
        "Clean Architecture",
        "Domain-Driven Design (DDD)",
        "Scalable Systems Design",

        // Backend & APIs
        ".NET",
        "Java",
        "Python",
        "REST APIs",
        "SOAP Services",
        "gRPC",
        "API Gateway",
        "Middleware",
        "WebSocket",

        // Frontend
        "Angular",
        "Flutter",
        "Java",

        // Mensajeria e Integracion
        "RabbitMQ",
        "AMQP",
        "Asynchronous Processing",
        "Idempotency",
        "Retries & Circuit Breaker",

        // Observabilida
        "Observability",
        "Structured Logging",
        "Distributed Tracing",
        "Health Checks",
        "Error Handling Strategies",

        // Seguridad
        "JWT Authentication",
        "OAuth2",
        "Encryption (AES-256)",
        "Secrets Management",

        // Datos
        "SQL Server",
        "PostgreSQL",
        "ETL Processes",
        "Performance Optimization",

        // Frontend / Complementario
        "Angular",
        "Microfrontends",

        // En progreso
        "AI Integration",
        "LLM Integration",
        "Cloud-Native Applications"
    };
}

public class RespuestaApi<T>
{
    public bool Exito { get; set; }
    public string Mensaje { get; set; }
    public T Datos { get; set; }
}