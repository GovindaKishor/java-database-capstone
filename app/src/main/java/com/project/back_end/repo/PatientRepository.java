package com.project.back_end.repo;

import com.project.back_end.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for managing Patient entities.
 * Extends JpaRepository to provide standard CRUD operations.
 */
@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    /**
     * Finds a Patient entity by their unique email address.
     * Used primarily for patient login authentication and validation.
     *
     * @param email The email address of the Patient to find.
     * @return An Optional containing the Patient if found.
     */
    Optional<Patient> findByEmail(String email);

    /**
     * Finds a Patient entity by either their email address OR phone number.
     * This is useful for flexible login or uniqueness checks during registration.
     *
     * @param email The email address to search for.
     * @param phone The phone number to search for.
     * @return An Optional containing the Patient if found by either credential.
     */
    Optional<Patient> findByEmailOrPhone(String email, String phone);
}
