package com.project.back_end.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;

// Validation Imports
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

// JSON Serialization Import
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

/**
 * Represents a System Administrator for managing the clinic system.
 * This entity is mapped to a relational database table.
 */
@Entity
public class Admin {

    /**
     * Unique identifier (Primary Key) for the Admin. Auto-incremented.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The unique username used for authentication.
     * Cannot be null.
     */
    @Column(unique = true, nullable = false)
    @NotNull(message = "Username cannot be null")
    @Size(min = 4, max = 50, message = "Username must be between 4 and 50 characters")
    private String username;

    /**
     * The password used for authentication.
     * Marked as WRITE_ONLY so it is accepted in requests but never exposed in API responses.
     */
    @JsonProperty(access = Access.WRITE_ONLY)
    @NotNull(message = "Password cannot be null")
    private String password;

    // --- Getters and Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
