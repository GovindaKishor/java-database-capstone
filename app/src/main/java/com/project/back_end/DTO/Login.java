package com.project.back_end.DTO;

/**
 * Data Transfer Object (DTO) used to receive login credentials from the client.
 * This class abstracts the authentication input for different user types (Admin, Doctor, Patient).
 */
public class Login {

    // The unique identifier for the user (e.g., email for doctor/patient, username for admin)
    private String identifier;
    
    // The password provided by the user
    private String password;

    /**
     * Default constructor required for framework deserialization.
     */
    public Login() {
    }

    /**
     * Constructor for creating a Login DTO instance.
     *
     * @param identifier The user's unique identifier.
     * @param password The user's password.
     */
    public Login(String identifier, String password) {
        this.identifier = identifier;
        this.password = password;
    }

    // --- Getter Methods ---

    public String getIdentifier() {
        return identifier;
    }

    public String getPassword() {
        return password;
    }

    // --- Setter Methods ---

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
