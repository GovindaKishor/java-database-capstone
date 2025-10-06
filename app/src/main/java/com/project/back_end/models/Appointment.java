package com.project.back_end.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Transient;

// Time and Date Imports
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.LocalDate;
import java.time.Duration;

// Validation Imports
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Future;

// NOTE: Minimal definitions for Doctor and Patient for compilation.
// These should be replaced by their fully-featured files later.

/**
 * Placeholder for the Doctor entity, required for the @ManyToOne relationship.
 */
@Entity
class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    // Getters and Setters omitted for brevity in placeholder
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}

/**
 * Placeholder for the Patient entity, required for the @ManyToOne relationship.
 */
@Entity
class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    // Getters and Setters omitted for brevity in placeholder
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}

/**
 * Represents a scheduled Appointment, linking a Patient and a Doctor.
 * This entity is mapped to a relational database table.
 */
@Entity
public class Appointment {

    // Assuming a standard appointment duration of 1 hour as requested
    private static final Duration APPOINTMENT_DURATION = Duration.ofHours(1);

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relationships
    @NotNull(message = "Doctor must be assigned")
    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @NotNull(message = "Patient must be assigned")
    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    // Core Data Fields
    @NotNull(message = "Appointment time is required")
    @Future(message = "Appointment time must be in the future")
    private LocalDateTime appointmentTime;

    @NotNull(message = "Status is required")
    private int status; // 0 for Scheduled, 1 for Completed

    // --- Helper Methods (Transients) ---

    /**
     * Returns the end time of the appointment (1 hour after start time).
     * Marked @Transient to prevent persistence in the database.
     */
    @Transient
    public LocalDateTime getEndTime() {
        return this.appointmentTime.plus(APPOINTMENT_DURATION);
    }

    /**
     * Returns only the date portion of the appointment.
     * Marked @Transient to prevent persistence in the database.
     */
    @Transient
    public LocalDate getAppointmentDate() {
        return this.appointmentTime.toLocalDate();
    }

    /**
     * Returns only the time portion of the appointment.
     * Marked @Transient to prevent persistence in the database.
     */
    @Transient
    public LocalTime getAppointmentTimeOnly() {
        return this.appointmentTime.toLocalTime();
    }

    // --- Getters and Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public LocalDateTime getAppointmentTime() {
        return appointmentTime;
    }

    public void setAppointmentTime(LocalDateTime appointmentTime) {
        this.appointmentTime = appointmentTime;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }
}
