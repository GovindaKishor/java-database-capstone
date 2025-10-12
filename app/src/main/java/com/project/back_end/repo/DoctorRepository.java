package com.project.back_end.repo;

import com.project.back_end.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for managing Doctor entities.
 * Extends JpaRepository to provide standard CRUD operations.
 * Defines custom queries for searching and filtering doctors based on name, email, and specialty.
 */
@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    /**
     * Finds a Doctor entity by their unique email address.
     * Used primarily for doctor login authentication.
     *
     * @param email The email address of the Doctor to find.
     * @return An Optional containing the Doctor if found.
     */
    Optional<Doctor> findByEmail(String email);

    /**
     * Finds doctors whose name partially matches the given string (case-insensitive).
     * The query uses LIKE with CONCAT to allow flexible pattern matching in the database.
     *
     * @param name The partial name to search for. Must include '%' wildcard if needed,
     * or the service layer handles it. The JPQL uses wildcards.
     * @return A list of matching Doctor entities.
     */
    @Query("SELECT d FROM Doctor d WHERE LOWER(d.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Doctor> findByNameLike(@Param("name") String name);

    /**
     * Filters doctors by partial name match and exact specialty match (both case-insensitive).
     * This query is useful for highly specific searches.
     *
     * @param name The partial name to search for.
     * @param specialty The specialty to filter by.
     * @return A list of matching Doctor entities.
     */
    @Query("SELECT d FROM Doctor d WHERE LOWER(d.name) LIKE LOWER(CONCAT('%', :name, '%')) " +
           "AND LOWER(d.specialty) = LOWER(:specialty)")
    List<Doctor> findByNameContainingIgnoreCaseAndSpecialtyIgnoreCase(
            @Param("name") String name,
            @Param("specialty") String specialty);

    /**
     * Finds a list of doctors based on their specialty, ignoring case.
     * Spring Data JPA provides automatic implementation for this method name.
     *
     * @param specialty The specialty to search for.
     * @return A list of matching Doctor entities.
     */
    List<Doctor> findBySpecialtyIgnoreCase(String specialty);
}
