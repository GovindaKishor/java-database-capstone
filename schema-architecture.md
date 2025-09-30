This Spring Boot application combines both MVC and REST controllers. The Admin and Doctor dashboards are built using Thymeleaf templates, while the rest of the modules expose functionality through REST APIs. The system works with two databases: MySQL, which stores data about patients, doctors, appointments, and admins, and MongoDB, which stores prescription records. All incoming requests pass through a shared service layer, which then interacts with the correct repository. MySQL data is managed with JPA entities, whereas MongoDB uses document models.

1. Dashboards and REST modules – The Admin and Doctor dashboards interact through Thymeleaf, while modules like Appointments, Patient Dashboard, and Patient Records use REST APIs (JSON) to communicate with the backend.

2. Controllers – Dashboard requests go through Thymeleaf controllers, and API calls go through REST controllers.

3. Service layer – Both types of controllers forward requests to a common service layer, which centralizes business logic.

4. Repository layer – The service layer communicates with either MySQL repositories or the MongoDB repository, depending on the type of data needed.

5. Databases – These repositories handle persistence by accessing the corresponding databases: MySQL for patient, doctor, appointment, and admin data, and MongoDB for prescriptions.

6. Models – Each database interaction uses appropriate models: JPA entities for MySQL tables, and document models for MongoDB collections.

7. Data mapping – The entities and documents (e.g., Patient, Doctor, Appointment, Admin, Prescription) represent the structured data models that are returned to the repositories, passed back through the service layer, and eventually delivered to the controllers and dashboards/APIs.
