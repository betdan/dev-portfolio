using System;
using System.Collections.Generic;

class Learn
{
    static void Main(string[] args)
    {
        Console.WriteLine("Initializing professional profile...\n");

        var controller = new LearningController();

        var response = controller.GetTopics();

        Console.WriteLine("\n--- API RESPONSE ---");

        Console.WriteLine($"Success: {response.Success}");
        Console.WriteLine($"Message: {response.Message}");

        Console.WriteLine("\nTopics:");

        foreach (var topic in response.Data)
        {
            Console.WriteLine($"✔ {topic}");
        }

        Console.WriteLine("\nApplication finished.");
    }
}

public class LearningController
{
    public ApiResponse<List<string>> GetTopics()
    {
        Logger.Info("Fetching learning topics...");

        var learning = new Learning();

        Logger.Success("Topics loaded successfully.");

        return new ApiResponse<List<string>>
        {
            Success = true,
            Message = "Learning topics retrieved",
            Data = learning.Topics
        };
    }
}

public static class Logger
{
    public static void Info(string message)
    {
        Console.WriteLine($"[INFO] {DateTime.Now:HH:mm:ss} - {message}");
    }

    public static void Success(string message)
    {
        Console.WriteLine($"[SUCCESS] {DateTime.Now:HH:mm:ss} - {message}");
    }

    public static void Error(string message)
    {
        Console.WriteLine($"[ERROR] {DateTime.Now:HH:mm:ss} - {message}");
    }
}

public class Learning
{
    public List<string> Topics { get; set; } = new()
    {
        // Cloud & DevOps
        "AWS",
        "Docker",
        "Kubernetes",
        "CI/CD",
        "Infrastructure as Code",

        // Arquitecture
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

        // Messaging & Integration
        "RabbitMQ",
        "AMQP",
        "Asynchronous Processing",
        "Idempotency",
        "Retries & Circuit Breaker",

        // Observability
        "Observability",
        "Structured Logging",
        "Distributed Tracing",
        "Health Checks",
        "Error Handling Strategies",

        // Security
        "JWT Authentication",
        "OAuth2",
        "Encryption (AES-256)",
        "Secrets Management",

        // Data
        "SQL Server",
        "PostgreSQL",
        "ETL Processes",
        "Performance Optimization",

        // Frontend / Complementario
        "Angular",
        "Microfrontends",

        // In progress
        "AI Integration",
        "LLM Integration",
        "Cloud-Native Applications"
    };
}

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; }
    public T Data { get; set; }
}