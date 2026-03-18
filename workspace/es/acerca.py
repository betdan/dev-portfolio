import time
import random

class DesarrolladorSenior:

    def __init__(self):
        self.nombre = "Daniel Alfonso Betancourt Jiménez"
        self.rol = "Desarrollador de Sistemas | Consultor Técnico | Ingeniero de datos"

        self.stacksTecnologico = [
            "C#",
            ".NET",
            "Java",
            "Python",
            "Angular",
            "AWS",
            "Docker",
            "Kubernetes"
        ]

        self.enfoque = [
            "Monolitos",
            "Microservicios",
            "Microfrontend",
            "Diseño de APIs (REST / SOAP / gRPC)",
            "Arquitectura orientada a eventos (AMQP)",
            "Programación orientada a objetos (OOP)",
            "Bases de datos SQL y NoSQL"
        ]

    def iniciar_sesion(self):
        print("Inicializando perfil profesional...")
        time.sleep(1)
        print(f"Nombre: {self.nombre}")
        print(f"Rol: {self.rol}")
        print()

    def cargar_stack(self):
        print("Cargando stack tecnológico...")
        time.sleep(1)

        for tech in self.stacksTecnologico:
            print(f"✔ {tech} cargado")
            time.sleep(0.4)

        print()

    def mostrar_enfoque(self):
        print("Inicializando áreas de enfoque...")
        time.sleep(1)

        for area in self.enfoque:
            print(f"→ {area}")
            time.sleep(0.5)

        print()

    def ejecutar_proyecto(self):
        proyectos = [
            "API de pagos (microservicios)",
            "Plataforma de modernización cloud",
            "Sistema distribuido de integraciones",
            "Backend de alta disponibilidad"
        ]

        proyecto = random.choice(proyectos)

        print("Ejecutando proyecto actual...")
        time.sleep(1)
        print(f"Proyecto activo: {proyecto}")
        print("Estado: RUNNING")
        print()


def main():

    dev = DesarrolladorSenior()

    dev.iniciar_sesion()
    dev.cargar_stack()
    dev.mostrar_enfoque()
    dev.ejecutar_proyecto()

    print("Sistema listo.")


if __name__ == "__main__":
    main()
