package com.project.back_end.repo;

import com.project.back_end.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for managing Appointment entities.
 * Extends JpaRepository to provide standard CRUD operations and defines custom queries
 * for filtering appointments based on doctor, patient, status, and time.
 */
@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // --- Queries for Doctor Dashboard (Filtering by time and/or patient) ---

    /**
     * Retrieves appointments for a specific doctor within a given time range.
     * Uses LEFT JOIN FETCH to eagerly load related Doctor/Patient data if needed for the DTO.
     *
     * @param doctorId The ID of the doctor.
     * @param start The start of the time range (inclusive).
     * @param end The end of the time range (exclusive).
     * @return A list of matching appointments.
     */
    @Query("SELECT a FROM Appointment a LEFT JOIN FETCH a.doctor d LEFT JOIN FETCH a.patient p " +
           "WHERE d.id = :doctorId AND a.appointmentTime BETWEEN :start AND :end")
    List<Appointment> findByDoctorIdAndAppointmentTimeBetween(
            @Param("doctorId") Long doctorId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    /**
     * Filters appointments by doctor ID, partial patient name (case-insensitive), and time range.
     *
     * @param doctorId The ID of the doctor.
     * @param patientName The partial name of the patient to search for.
     * @param start The start of the time range (inclusive).
     * @param end The end of the time range (exclusive).
     * @return A list of matching appointments.
     */
    @Query("SELECT a FROM Appointment a LEFT JOIN FETCH a.patient p " +
           "WHERE a.doctor.id = :doctorId AND LOWER(p.name) LIKE LOWER(CONCAT('%', :patientName, '%')) " +
           "AND a.appointmentTime BETWEEN :start AND :end")
    List<Appointment> findByDoctorIdAndPatient_NameContainingIgnoreCaseAndAppointmentTimeBetween(
            @Param("doctorId") Long doctorId,
            @Param("patientName") String patientName,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    // --- Delete Operation (Used in Admin/Doctor management) ---

    /**
     * Deletes all appointments associated with a specific doctor ID.
     * Requires @Modifying and @Transactional annotations.
     *
     * @param doctorId The ID of the doctor whose appointments should be deleted.
     */
    @Modifying
    @Transactional
    void deleteAllByDoctorId(Long doctorId);

    // --- Queries for Patient Dashboard (Filtering by patient) ---

    /**
     * Finds all appointments for a specific patient.
     *
     * @param patientId The ID of the patient.
     * @return A list of all appointments for the patient.
     */
    List<Appointment> findByPatientId(Long patientId);

    /**
     * Retrieves appointments for a patient by status, ordered by ascending appointment time.
     *
     * @param patientId The ID of the patient.
     * @param status The status of the appointment (e.g., scheduled).
     * @return A list of matching appointments, ordered by time.
     */
    List<Appointment> findByPatient_IdAndStatusOrderByAppointmentTimeAsc(Long patientId, int status);

    /**
     * Filters appointments by partial doctor name (case-insensitive) and patient ID.
     *
     * @param doctorName The partial name of the doctor to search for.
     * @param patientId The ID of the patient.
     * @return A list of matching appointments.
     */
    @Query("SELECT a FROM Appointment a LEFT JOIN a.doctor d " +
           "WHERE a.patient.id = :patientId AND LOWER(d.name) LIKE LOWER(CONCAT('%', :doctorName, '%'))")
    List<Appointment> filterByDoctorNameAndPatientId(
            @Param("doctorName") String doctorName,
            @Param("patientId") Long patientId);

    /**
     * Filters appointments by partial doctor name, patient ID, and status.
     *
     * @param doctorName The partial name of the doctor to search for.
     * @param patientId The ID of the patient.
     * @param status The status of the appointment.
     * @return A list of matching appointments.
     */
    @Query("SELECT a FROM Appointment a LEFT JOIN a.doctor d " +
           "WHERE a.patient.id = :patientId AND LOWER(d.name) LIKE LOWER(CONCAT('%', :doctorName, '%')) " +
           "AND a.status = :status")
    List<Appointment> filterByDoctorNameAndPatientIdAndStatus(
            @Param("doctorName") String doctorName,
            @Param("patientId") Long patientId,
            @Param("status") int status);
}
