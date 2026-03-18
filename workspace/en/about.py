import time
import random


class SeniorDeveloper:

    def __init__(self):
        self.name = "Daniel Alfonso Betancourt Jiménez"
        self.role = "Software Engineer | Technical Consultant | Data Engineering"

        self.skills = [
            "C#",
            ".NET",
            "Java",
            "Python",
            "Angular",
            "React",
            "AWS",
            "Docker",
            "Kubernetes"
        ]

        self.focus = [
            "Monoliths",
            "Microservices",
            "Microfrontend",
            "API Design (REST / SOAP / gRPC)",
            "Event-driven Architecture (AMQP)",
            "Object Oriented Programming (OOP)",
            "SQL and NoSQL Databases"
        ]

    def begin_session(self):
        print("Initializing professional profile...")
        time.sleep(1)
        print(f"Name: {self.name}")
        print(f"Role: {self.role}")
        print()

    def load_stack(self):
        print("Loading technology stack...")
        time.sleep(1)

        for tech in self.skills:
            print(f"✔ {tech} loaded")
            time.sleep(0.4)

        print()

    def show_focus(self):
        print("Initializing focus areas...")
        time.sleep(1)

        for area in self.focus:
            print(f"→ {area}")
            time.sleep(0.5)

        print()

    def run_project(self):
        projects = [
            "Payment API (Microservices)",
            "Cloud Modernization Platform",
            "Distributed Integration System",
            "High Availability Backend"
        ]

        project = random.choice(projects)

        print("Running current project...")
        time.sleep(1)
        print(f"Active project: {project}")
        print("Status: RUNNING")
        print()


def main():

    dev = SeniorDeveloper()

    dev.begin_session()
    dev.load_stack()
    dev.show_focus()
    dev.run_project()

    print("System ready.")


if __name__ == "__main__":
    main()