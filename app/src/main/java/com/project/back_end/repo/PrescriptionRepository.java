package com.project.back_end.repo;

import com.project.back_end.model.Prescription;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for managing Prescription entities stored in MongoDB.
 * Extends MongoRepository to enable basic CRUD operations.
 */
@Repository
public interface PrescriptionRepository extends MongoRepository<Prescription, String> {

    /**
     * Finds all prescriptions associated with a specific appointment ID.
     * The field 'appointmentId' is expected to exist within the Prescription model.
     *
     * @param appointmentId The ID of the appointment to find prescriptions for.
     * @return A list of matching Prescription entities.
     */
    List<Prescription> findByAppointmentId(Long appointmentId);
}

