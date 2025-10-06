# **Schema Architecture**

## **Section 1: Architecture Summary**

The Smart Clinic System is built on a **three-tier microservice architecture** using **Java Spring Boot** as the backend framework.  
This architecture separates concerns into distinct layers **Presentation**, **Application**, and **Data Persistence** — ensuring scalability, maintainability, and strong security.  
The frontend (HTML/CSS/JavaScript) communicates with the backend only through **secure RESTful APIs**, while the backend handles all business logic, authentication, and data access.  
Data is managed using a **polyglot persistence** strategy: **MySQL** stores structured relational data such as users and appointments, while **MongoDB** handles flexible document data such as prescriptions and medical histories.

---

## **Section 2: Numbered Flow**

### **1. Request Initiation (Presentation Layer)**
A **Doctor** fills out a prescription form on the **JavaScript frontend**.  
The frontend sends an **HTTP POST** request containing the prescription data and the Doctor’s **JWT token** to the backend endpoint `/api/prescriptions`.

---

### **2. Security Interception (Application Layer - Filter)**
The **Spring Boot security filter chain** intercepts the incoming request.  
It validates the **JWT token** for authenticity and expiration, extracts the user role, and verifies the **Doctor’s authorization** to perform this action.

---

### **3. Controller Delegation (Application Layer - Controller)**
Once validated, the request reaches the **`PrescriptionController`**.  
The controller parses the incoming data and forwards it to the **Service Layer** for business logic execution.

---

### **4. Business Logic (Application Layer - Service)**
The **`PrescriptionService`** checks the validity of entities (e.g., patient and doctor IDs) and constructs a document structure ready for database insertion.

---

### **5. Data Persistence (Application Layer - Repository)**
The **Service Layer** uses **Spring Data MongoDB Repository (`PrescriptionRepository`)** to perform the database write operation.

---

### **6. Data Write (Data Layer - MongoDB)**
The repository inserts the **new prescription document** into the **MongoDB** database.

---

### **7. Response Construction (Application Layer)**
After a successful write, the **Service Layer** returns the newly created record to the **Controller**,  
which sends back an **HTTP 201 (Created)** response.

---

### **8. Response Delivery (Presentation Layer)**
The **frontend** receives the success response.  
It displays a confirmation notification and updates the doctor’s interface with the new prescription entry.

---

