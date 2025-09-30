# Schema Design — Smart Clinic System

This document defines a **MySQL relational schema** and a **MongoDB document design** for a Smart Clinic System. The goal is pragmatic: store transactional healthcare data (appointments, patients, doctors, admins) in MySQL for strong consistency and ACID semantics, and store document-like/denormalized artifacts (prescriptions, feedback, logs) in MongoDB where nested arrays and flexible fields are useful.

---

## MySQL Database Design

**Engine:** InnoDB (transactions, FK constraints, row-level locking)
**Charset/collation:** `utf8mb4` / `utf8mb4_unicode_ci`
**Timezone handling:** store UTC timestamps (`TIMESTAMP`/`DATETIME` in UTC) and convert in the app layer.

### Design notes (high level)

* Use surrogate numeric primary keys (`BIGINT UNSIGNED AUTO_INCREMENT`) for joins and performance.
* Keep `uuid` (CHAR(36)) where external references are needed (mobile/web clients, API tokens).
* Timestamps: `created_at`, `updated_at` on most tables.
* Use `UNIQUE` on email/license where necessary.
* Prevent exact duplicate bookings via unique constraint on `(doctor_id, start_time)`; overlap detection beyond exact duplicates should be handled in application logic or via stored procedures.

### 1) `patients` table

```sql
-- patients: master record for persons receiving care
CREATE TABLE patients (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  uuid CHAR(36) NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NULL,
  phone VARCHAR(30) NULL,
  date_of_birth DATE NULL,
  gender ENUM('male','female','other','unknown') NOT NULL DEFAULT 'unknown',
  address TEXT NULL,
  emergency_contact_name VARCHAR(150) NULL,
  emergency_contact_phone VARCHAR(30) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_patients_email (email),
  INDEX idx_patients_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

*Justification:* keep contact fields lightly normalized. `email` is optional (some patients register with phone). Use `uuid` for external refs.

### 2) `doctors` table

```sql
-- doctors: provider profiles
CREATE TABLE doctors (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  uuid CHAR(36) NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(30) NULL,
  specialization VARCHAR(150) NULL,
  license_number VARCHAR(100) NOT NULL UNIQUE,
  bio TEXT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_doctors_spec (specialization)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

*Justification:* `license_number` must be unique for regulatory traceability. `is_active` allows soft deactivation.

### 3) `admins` table

```sql
-- admins: administrative users who manage the portal
CREATE TABLE admins (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(255) NULL,
  role ENUM('superadmin','admin','report_viewer') NOT NULL DEFAULT 'admin',
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

*Justification:* store hashed passwords only. Consider MFA, audit logs stored separately (or in `audit_logs` table).

### 4) `appointments` table

```sql
-- appointments: scheduled meetings between patients and doctors
CREATE TABLE appointments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  patient_id BIGINT UNSIGNED NOT NULL,
  doctor_id BIGINT UNSIGNED NOT NULL,
  created_by_admin_id BIGINT UNSIGNED NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  duration_minutes INT NOT NULL COMMENT 'redundant but useful for quick queries',
  status ENUM('scheduled','confirmed','cancelled','completed','no_show') NOT NULL DEFAULT 'scheduled',
  reason VARCHAR(500) NULL,
  notes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_appointments_patient FOREIGN KEY (patient_id) REFERENCES patients (id) ON DELETE CASCADE,
  CONSTRAINT fk_appointments_doctor FOREIGN KEY (doctor_id) REFERENCES doctors (id) ON DELETE RESTRICT,
  CONSTRAINT fk_appointments_admin FOREIGN KEY (created_by_admin_id) REFERENCES admins (id) ON DELETE SET NULL,
  -- prevent exact duplicate start times for a doctor (application must check overlaps with different start/end)
  UNIQUE KEY uniq_doctor_start (doctor_id, start_time),
  INDEX idx_appointments_patient (patient_id),
  INDEX idx_appointments_doctor (doctor_id),
  INDEX idx_appointments_start (start_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

*Justification:* application-level logic required for overlapping appointments (range conflicts cannot be fully prevented by simple DB constraints). `ON DELETE CASCADE` for patients means if a patient is removed, appointments are cleaned up — confirm data retention policy before enabling cascade in production.

### 5) `doctor_unavailability` table (blocks / off times)

```sql
-- doctor_unavailability: store intervals when doctor is NOT available
CREATE TABLE doctor_unavailability (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  doctor_id BIGINT UNSIGNED NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  reason VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by_admin_id BIGINT UNSIGNED NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_unavail_doctor FOREIGN KEY (doctor_id) REFERENCES doctors (id) ON DELETE CASCADE,
  INDEX idx_unavail_doctor (doctor_id, start_time, end_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

*Justification:* Use these intervals to exclude time slots from booking queries.

### Additional relational tables you may add

* `prescriptions_relational` (if you prefer prescriptions normalized rather than in MongoDB)
* `audit_logs` (store admin actions, appointment changes)
* `clinic_locations` (if multiple clinics)

---

## MongoDB Collection Design

Use MongoDB for document-style records where nested lists and flexible fields are common. Below are recommended collections:

* `prescriptions` — natural document for a prescription with medication arrays and instructions.
* `feedback` — patient feedback forms, varying fields.
* `system_logs` — high-throughput application logs with TTL index.

### Design tradeoffs / justification

* Prescriptions are frequently read as a whole by dispensaries or patients and contain nested medication arrays — MongoDB avoids heavy joins and allows storing the doctor/patient snapshot with the prescription for auditability.
* Use indexes on `patient.patient_id`, `doctor.doctor_id`, and `issued_at` for query performance.
* Keep critical transactional data (appointments, patients, doctors) in MySQL for strong consistency.

### prescriptions collection — example document

Below is a realistic example document. (Fields like `_id` would normally be `ObjectId` in MongoDB.)

```json
{
  "_id": "651f9e7a8d3b5c001234abcd",
  "prescription_number": "RX-2025-000123",
  "clinic_id": "clinic_001",
  "patient": {
    "patient_id": 1024,
    "name": { "first": "Asha", "last": "Patel" },
    "date_of_birth": "1986-04-10",
    "phone": "+91-9876543210"
  },
  "doctor": {
    "doctor_id": 55,
    "name": { "first": "Rohit", "last": "Kumar" },
    "specialization": "General Medicine",
    "license_number": "MED-CA-998877"
  },
  "medications": [
    {
      "name": "Atorvastatin",
      "strength": "10 mg",
      "form": "tablet",
      "dose": "1",
      "dose_unit": "tablet",
      "frequency": "once daily",
      "duration_days": 30,
      "instructions": ["Take after evening meal","Avoid grapefruit juice"]
    },
    {
      "name": "Paracetamol",
      "strength": "500 mg",
      "form": "tablet",
      "dose": "1-2",
      "dose_unit": "tablet",
      "frequency": "every 6-8 hours as needed",
      "duration_days": 5
    }
  ],
  "notes": "Patient complains of mild chest pain. ECG normal. Start statin and review in 1 month.",
  "issued_at": "2025-09-30T07:30:00Z",
  "valid_till": "2025-10-30T07:30:00Z",
  "refills": [
    { "refill_number": 0, "authorized_by": 55, "authorized_at": "2025-09-30T07:30:00Z" }
  ],
  "attachments": [
    { "type": "image", "uri": "s3://clinic-bucket/prescriptions/651f9e7a8d3b5c001234abcd/front.jpg" }
  ],
  "created_at": "2025-09-30T07:30:00Z",
  "updated_at": "2025-09-30T07:30:00Z",
  "tags": ["cardio","chronic"]
}
```

**Why this shape?**

* `patient` and `doctor` store identifying snapshot fields (`patient_id`, `doctor_id`, name, license). Storing a snapshot ensures historical integrity (if doctor/patient names change later, the prescription keeps original values).
* `medications` is an array of objects — natural fit for queries like `db.prescriptions.find({"medications.name":"Atorvastatin"})` and for rendering in the UI.
* `attachments` store URIs (S3) rather than binary blobs.

### Recommended MongoDB indexes

```text
db.prescriptions.createIndex({ "patient.patient_id": 1 });
db.prescriptions.createIndex({ "doctor.doctor_id": 1 });
db.prescriptions.createIndex({ "issued_at": -1 });
```

For `system_logs`, use a TTL index on `created_at` to expire old logs:

```text
db.system_logs.createIndex({ "created_at": 1 }, { expireAfterSeconds: 60*60*24*90 }); -- keep 90 days
```

---

## Operational notes

* Backups: schedule logical dumps for MySQL (mysqldump / Percona XtraBackup) and MongoDB snapshots (mongodump / cloud backups).
* Migrations: manage DDL changes with a migration tool (Flyway / Liquibase) for MySQL; for MongoDB, use scripted migrations (migrate data shape carefully since documents are flexible).
* Data retention / GDPR: define retention policies and anonymization for patient data.

---

<!-- End of schema-design.md -->
