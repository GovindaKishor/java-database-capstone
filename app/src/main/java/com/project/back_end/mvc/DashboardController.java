package com.project.back_end.mvc;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.beans.factory.annotation.Autowired;

import com.project.back_end.service.TokenService; // Adjusted package for service dependency
import java.util.Map;

/**
 * Controller to handle requests for the main application dashboards (Admin and Doctor).
 * Acts as a security gate by validating an authentication token passed in the path.
 */
@Controller
public class DashboardController {

    /**
     * Autowire the service responsible for validating JWT tokens.
     * The validateToken method is expected to return an empty map if validation succeeds.
     */
    @Autowired
    private TokenService tokenService;

    /**
     * Handles access to the Admin Dashboard.
     * Requires a valid token for the 'admin' role.
     *
     * @param token The authentication token provided by the client.
     * @return The path to the Thymeleaf view, or a redirect to the login page.
     */
    @GetMapping("/adminDashboard/{token}")
    public String adminDashboard(@PathVariable String token) {
        // Validate the token and ensure it is for the 'admin' role.
        Map<String, Object> validationResult = tokenService.validateToken(token, "admin");

        if (validationResult.isEmpty()) {
            // Token is valid; return the admin dashboard view.
            return "admin/adminDashboard";
        } else {
            // Token is invalid, expired, or incorrect role; redirect to the homepage/login.
            // Note: The client-side logic should handle token invalidation (e.g., localStorage.clear())
            return "redirect:http://localhost:8080";
        }
    }

    /**
     * Handles access to the Doctor Dashboard.
     * Requires a valid token for the 'doctor' role.
     *
     * @param token The authentication token provided by the client.
     * @return The path to the Thymeleaf view, or a redirect to the login page.
     */
    @GetMapping("/doctorDashboard/{token}")
    public String doctorDashboard(@PathVariable String token) {
        // Validate the token and ensure it is for the 'doctor' role.
        Map<String, Object> validationResult = tokenService.validateToken(token, "doctor");

        if (validationResult.isEmpty()) {
            // Token is valid; return the doctor dashboard view.
            return "doctor/doctorDashboard";
        } else {
            // Token is invalid, expired, or incorrect role; redirect to the homepage/login.
            return "redirect:http://localhost:8080";
        }
    }
}