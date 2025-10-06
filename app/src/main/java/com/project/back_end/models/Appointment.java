package com.project.back_end.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Transient;

// Validation and Utility Imports
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Future;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;

/**
 * Represents a scheduled appointment between a doctor and a patient.
 * It is mapped to a relational database table.
 */
@Entity
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relationships: Assuming Doctor and Patient are in the same models package
    @ManyToOne
    @NotNull(message = "Doctor is required for an appointment")
    private Doctor doctor;

    @ManyToOne
    @NotNull(message = "Patient is required for an appointment")
    private Patient patient;

    @NotNull(message = "Appointment time is required")
    @Future(message = "Appointment time must be in the future")
    private LocalDateTime appointmentTime;

    @NotNull(message = "Appointment status is required")
    private int status; // 0 for Scheduled, 1 for Completed

    // --- Helper Methods (Transient - not persisted) ---

    /**
     * Calculates the end time of the appointment (assuming 1 hour duration).
     * @return The calculated end time.
     */
    @Transient
    public LocalDateTime getEndTime() {
        // Assuming a standard 1-hour appointment duration
        return this.appointmentTime.plus(1, ChronoUnit.HOURS);
    }

    /**
     * Extracts only the date portion of the appointment.
     * @return The appointment date.
     */
    @Transient
    public LocalDate getAppointmentDate() {
        return this.appointmentTime.toLocalDate();
    }

    /**
     * Extracts only the time portion of the appointment.
     * @return The appointment time.
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
