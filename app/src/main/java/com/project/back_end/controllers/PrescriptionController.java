package com.project_back_end.controllers;

import com.project_back_end.models.Prescription;
import com.project_back_end.services.PrescriptionService;
import com.project_back_end.services.AdminService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.Map;

@RestController
@RequestMapping("${api.path}prescription")
public class PrescriptionController {
    private final PrescriptionService prescriptionService;
    private final AdminService service;

    @Autowired
    public PrescriptionController(PrescriptionService prescriptionService, AdminService service) {
        this.prescriptionService = prescriptionService;
        this.service = service;
    }

    @PostMapping("/{token}")
    public ResponseEntity<Map<String, String>> savePrescription(@RequestBody Prescription prescription, @PathVariable String token) {
        ResponseEntity<Map<String, String>> validation = service.validateToken(token, "doctor");
        if (validation.getStatusCode() != HttpStatus.OK) {
            return ResponseEntity.status(validation.getStatusCode()).body(validation.getBody());
        }
        return prescriptionService.savePrescription(prescription);
    }

    @GetMapping("/{appointmentId}/{token}")
    public ResponseEntity<Map<String, Object>> getPrescription(@PathVariable Long appointmentId, @PathVariable String token) {
        ResponseEntity<Map<String, String>> validation = service.validateToken(token, "doctor");
        if (validation.getStatusCode() != HttpStatus.OK) {
            return ResponseEntity.status(validation.getStatusCode()).body(Map.of("message", validation.getBody().get("message")));
        }
        return prescriptionService.getPrescription(appointmentId);
    }
}