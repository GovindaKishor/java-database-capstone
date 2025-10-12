package com.project_back_end.controllers;

import com.project_back_end.models.Patient;
import com.project_back_end.DTO.Login;
import com.project_back_end.services.PatientService;
import com.project_back_end.services.Service;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.Map;

@RestController
@RequestMapping("/patient")
public class PatientController {
    private final PatientService patientService;
    private final Service service;

    @Autowired
    public PatientController(PatientService patientService, Service service) {
        this.patientService = patientService;
        this.service = service;
    }

    @GetMapping("/{token}")
    public ResponseEntity<Map<String, Object>> getPatient(@PathVariable String token) {
        ResponseEntity<Map<String, String>> validation = service.validateToken(token, "patient");
        if (validation.getStatusCode() != HttpStatus.OK) {
            return ResponseEntity.status(validation.getStatusCode()).body(Map.of("message", validation.getBody().get("message")));
        }
        return patientService.getPatientDetails(token);
    }

    @PostMapping()
    public ResponseEntity<Map<String, String>> createPatient(@RequestBody Patient patient) {
        boolean valid = service.validatePatient(patient);
        if (!valid) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Patient with email id or phone no already exist"));
        }
        int result = patientService.createPatient(patient);
        if (result == 1) {
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Signup successful"));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Internal server error"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Login login) {
        return service.validatePatientLogin(login);
    }

    @GetMapping("/{id}/{token}")
    public ResponseEntity<Map<String, Object>> getPatientAppointment(@PathVariable Long id, @PathVariable String token) {
        ResponseEntity<Map<String, String>> validation = service.validateToken(token, "patient");
        if (validation.getStatusCode() != HttpStatus.OK) {
            return ResponseEntity.status(validation.getStatusCode()).body(Map.of("message", validation.getBody().get("message")));
        }
        return patientService.getPatientAppointment(id, token);
    }

    @GetMapping("/filter/{condition}/{name}/{token}")
    public ResponseEntity<Map<String, Object>> filterPatientAppointment(@PathVariable String condition, @PathVariable String name, @PathVariable String token) {
        ResponseEntity<Map<String, String>> validation = service.validateToken(token, "patient");
        if (validation.getStatusCode() != HttpStatus.OK) {
            return ResponseEntity.status(validation.getStatusCode()).body(Map.of("message", validation.getBody().get("message")));
        }
        return service.filterPatient(condition, name, token);
    }
}
