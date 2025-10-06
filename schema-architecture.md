## **Architecture Summary**

This Spring Boot application employs a **three-tier architecture** with a hybrid controller approach.  
**Thymeleaf Controllers** render traditional, server-side HTML pages for the core **Admin** and **Doctor Dashboards**, ensuring a rich, integrated user experience for staff.  
All other functional modules such as **Appointment Management** and **Patient Records** are served by **REST Controllers**, which expose **JSON-based APIs** suitable for scalable client applications (like a potential mobile app).  

All controllers route their requests through a centralized **Service Layer**, which enforces **business rules**, **data validations**, and **transaction consistency**.  
The application uses **polyglot persistence**, integrating:
- **MySQL (via JPA)** for structured data such as Patients, Doctors, and Appointments.
- **MongoDB** for flexible, document-based data such as Prescriptions.

This design ensures **separation of concerns**, **scalability**, **maintainability**, and **data integrity** across the system.

---

## **Section 2: Numbered Flow of Data and Control**

Below is a step-by-step description of how a request flows through the Smart Clinic application  
from the user interface, through the backend layers, and finally to the databases.

1. **User Interface Layer:**  
   Users interact with the system via either **Thymeleaf-rendered Dashboards** (for Admin and Doctor roles) or through **REST API clients** (for Appointments, Patient Records, etc.).

2. **Controller Layer:**  
   Requests are directed to the appropriate controller:
   - **Thymeleaf Controllers** handle **server-side page rendering**.  
   - **REST Controllers** process **API calls** and return structured **JSON responses**.

3. **Service Layer:**  
   Both controller types delegate to the **Service Layer**, which contains the **core business logic**.  
   This layer performs **validations**, manages **transactions**, and coordinates data operations across multiple repositories.

4. **Repository Layer:**  
   The Service Layer interacts with the **Repository Layer**, using:
   - **MySQL Repositories (via Spring Data JPA)** for **relational entities**, and  
   - **MongoDB Repositories** for **document-based entities**.

5. **Database Access:**  
   The repository classes execute database operations on the respective data sources:
   - **MySQL** for structured tables like **Patient**, **Doctor**, **Appointment**, and **Admin**.  
   - **MongoDB** for dynamic collections like **Prescription**.

6. **Model Binding:**  
   Retrieved data is mapped into **Java domain models**  
   - **JPA Entities** for MySQL, and  
   - **Document Objects** for MongoDB.

7. **Response Delivery:**  
   The **Controller Layer** assembles the processed data into the final output:  
   - Rendered **HTML pages** via Thymeleaf for server-side views, or  
   - **JSON responses** for REST API clients.

