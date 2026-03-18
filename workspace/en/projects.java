package portfolio.soap;

public final class Projects {

  private Projects() { }

  public static void main(String[] args) {
    String soapResponse = getProjectsResponse();
    System.out.println("Generated SOAP response:\n");
    System.out.println(soapResponse);
  }

  public static String getProjectsResponse() {
    return """
      <?xml version="1.0" encoding="UTF-8"?>
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
                     xmlns:proj="urn:portfolio:projects:v2">
        <soap:Header/>
        <soap:Body>
          <proj:GetProjectsResponse>
            <proj:Years>

              <!-- ===================== 2026 ===================== -->
              <proj:Year value="2026">

                <proj:Project>
                  <proj:Name>Mobile Application (Evolution & Modernization)</proj:Name>
                  <proj:Summary>Refactoring and evolution of critical services under a decoupled, cloud-native architecture.</proj:Summary>
                  <proj:Highlights>
                    <proj:Item>Implementation of a decoupled architecture integrating AWS (SQS, SNS) with PostgreSQL persistence.</proj:Item>
                    <proj:Item>Application of observability practices (structured logging, metrics, health checks).</proj:Item>
                    <proj:Item>Optimization of transfer services, biometric authentication, and key management.</proj:Item>
                    <proj:Item>Design of services for investment certificates and balance inquiries.</proj:Item>
                  </proj:Highlights>
                </proj:Project>

                <proj:Project>
                  <proj:Name>Digital Onboarding & KYC</proj:Name>
                  <proj:Summary>Automation of customer digital onboarding processes.</proj:Summary>
                  <proj:Highlights>
                    <proj:Item>Implementation and enhancement of KYC services.</proj:Item>
                    <proj:Item>Development of digital onboarding workflows.</proj:Item>
                  </proj:Highlights>
                </proj:Project>

                <proj:Project>
                  <proj:Name>Messaging & Integrations (MQ / ISO)</proj:Name>
                  <proj:Summary>Modernization of integrations with legacy systems and external processors.</proj:Summary>
                  <proj:Highlights>
                    <proj:Item>Migration and development of services over MQ messaging queues.</proj:Item>
                    <proj:Item>Integration with ISO 8583 messages for credit card processing.</proj:Item>
                  </proj:Highlights>
                </proj:Project>

                <proj:Project>
                  <proj:Name>Payments & Automation</proj:Name>
                  <proj:Summary>Automation of recurring payments and notification systems.</proj:Summary>
                  <proj:Highlights>
                    <proj:Item>Implementation of batch processing and scheduled tasks.</proj:Item>
                    <proj:Item>Design of payment processing and query services.</proj:Item>
                  </proj:Highlights>
                </proj:Project>

                <proj:Project>
                  <proj:Name>Error Handling & Whitelisting</proj:Name>
                  <proj:Summary>Standardization and certification of error codes.</proj:Summary>
                  <proj:Highlights>
                    <proj:Item>Normalization of error codes and handling of critical states.</proj:Item>
                    <proj:Item>Implementation of reporting and auditing mechanisms.</proj:Item>
                  </proj:Highlights>
                </proj:Project>

              </proj:Year>

              <!-- ===================== 2025 ===================== -->
              <proj:Year value="2025">

                <proj:Project>
                  <proj:Name>Security Services & OTP</proj:Name>
                  <proj:Summary>Implementation of authentication and validation mechanisms.</proj:Summary>
                  <proj:Highlights>
                    <proj:Item>OTP generation and SMS notification services.</proj:Item>
                    <proj:Item>Deployment of APIs on IIS for critical workflows.</proj:Item>
                  </proj:Highlights>
                </proj:Project>

                <proj:Project>
                  <proj:Name>Containerized Architecture</proj:Name>
                  <proj:Summary>Adoption of cloud-native architecture using Kubernetes.</proj:Summary>
                  <proj:Highlights>
                    <proj:Item>Deployment management with Docker and Helm.</proj:Item>
                    <proj:Item>CI/CD automation.</proj:Item>
                  </proj:Highlights>
                </proj:Project>

                <proj:Project>
                  <proj:Name>Encryption Services</proj:Name>
                  <proj:Summary>Implementation of security services and certificate management.</proj:Summary>
                  <proj:Highlights>
                    <proj:Item>Development of decoupled services using .NET 8.</proj:Item>
                    <proj:Item>Key management and AES encryption.</proj:Item>
                  </proj:Highlights>
                </proj:Project>

              </proj:Year>

              <!-- ===================== 2024 ===================== -->
              <proj:Year value="2024">

                <proj:Project>
                  <proj:Name>Core APIs & K8s Architecture</proj:Name>
                  <proj:Summary>Exposure of backend services under a microservices architecture.</proj:Summary>
                  <proj:Highlights>
                    <proj:Item>Development of scalable REST APIs.</proj:Item>
                    <proj:Item>Implementation of architectural patterns.</proj:Item>
                  </proj:Highlights>
                </proj:Project>

                <proj:Project>
                  <proj:Name>ETL & Data Processing</proj:Name>
                  <proj:Summary>Optimization of data processing and reporting workflows.</proj:Summary>
                  <proj:Highlights>
                    <proj:Item>Design and implementation of ETL processes.</proj:Item>
                    <proj:Item>SQL query and stored procedure optimization.</proj:Item>
                  </proj:Highlights>
                </proj:Project>

              </proj:Year>

              <!-- ===================== 2023 - 2021 ===================== -->
              <proj:Year value="2023-2021">

                <proj:Project>
                  <proj:Name>Legacy Systems Integration</proj:Name>
                  <proj:Summary>Modernization and integration with legacy platforms.</proj:Summary>
                  <proj:Highlights>
                    <proj:Item>Development of SOAP and REST services.</proj:Item>
                    <proj:Item>Implementation of API Gateways.</proj:Item>
                    <proj:Item>Application of idempotency and transaction control.</proj:Item>
                  </proj:Highlights>
                </proj:Project>

                <proj:Project>
                  <proj:Name>Financial Transaction Processing</proj:Name>
                  <proj:Summary>Implementation of business logic for payment and transaction processing.</proj:Summary>
                  <proj:Highlights>
                    <proj:Item>Integration with ISO 8583 and financial systems.</proj:Item>
                    <proj:Item>Real-time transaction processing.</proj:Item>
                  </proj:Highlights>
                </proj:Project>

                <proj:Project>
                  <proj:Name>Automation & Reporting</proj:Name>
                  <proj:Summary>Automation of processes and report generation.</proj:Summary>
                  <proj:Highlights>
                    <proj:Item>Implementation of batch and ETL processes.</proj:Item>
                    <proj:Item>PDF report generation and notification systems.</proj:Item>
                  </proj:Highlights>
                </proj:Project>

              </proj:Year>

            </proj:Years>
          </proj:GetProjectsResponse>
        </soap:Body>
      </soap:Envelope>
      """;
  }
}