package com.project.back_end.repo;

import com.project.back_end.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for managing Admin entities.
 * Extends JpaRepository to provide standard CRUD operations.
 *
 * @author Gemini
 */
@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {

    /**
     * Finds an Admin entity by their unique username.
     * Spring Data JPA automatically implements this method based on the method name.
     *
     * @param username The username of the Admin to find.
     * @return An Optional containing the Admin if found, or empty otherwise.
     */
    Optional<Admin> findByUsername(String username);
}
