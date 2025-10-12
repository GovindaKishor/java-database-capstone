package com.project_back_end.controllers;

import com.project_back_end.models.Appointment;
import com.project_back_end.services.AppointmentService;
import com.project_back_end.services.Service;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {
    private final AppointmentService appointmentService;
    private final Service service;

    @Autowired
    public AppointmentController(AppointmentService appointmentService, Service service) {
        this.appointmentService = appointmentService;
        this.service = service;
    }

    @GetMapping("/{date}/{patientName}/{token}")
    public ResponseEntity<Map<String, Object>> getAppointments(@PathVariable String date, @PathVariable String patientName, @PathVariable String token) {
        ResponseEntity<Map<String, String>> validation = service.validateToken(token, "doctor");
        if (validation.getStatusCode() != HttpStatus.OK) {
            return ResponseEntity.status(validation.getStatusCode()).body(Map.of("message", validation.getBody().get("message")));
        }
        LocalDate localDate = LocalDate.parse(date);
        Map<String, Object> appointments = appointmentService.getAppointment(patientName, localDate, token);
        return ResponseEntity.ok(appointments);
    }

    @PostMapping("/{token}")
    public ResponseEntity<Map<String, String>> bookAppointment(@RequestBody Appointment appointment, @PathVariable String token) {
        ResponseEntity<Map<String, String>> validation = service.validateToken(token, "patient");
        if (validation.getStatusCode() != HttpStatus.OK) {
            return ResponseEntity.status(validation.getStatusCode()).body(validation.getBody());
        }
        int valid = service.validateAppointment(appointment);
        if (valid == -1) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid doctor ID"));
        } else if (valid == 0) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Appointment slot unavailable"));
        }
        int booked = appointmentService.bookAppointment(appointment);
        if (booked == 1) {
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Appointment booked successfully"));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Error booking appointment"));
        }
    }

    @PutMapping("/{token}")
    public ResponseEntity<Map<String, String>> updateAppointment(@RequestBody Appointment appointment, @PathVariable String token) {
        ResponseEntity<Map<String, String>> validation = service.validateToken(token, "patient");
        if (validation.getStatusCode() != HttpStatus.OK) {
            return ResponseEntity.status(validation.getStatusCode()).body(validation.getBody());
        }
        return appointmentService.updateAppointment(appointment);
    }

    @DeleteMapping("/{id}/{token}")
    public ResponseEntity<Map<String, String>> cancelAppointment(@PathVariable long id, @PathVariable String token) {
        ResponseEntity<Map<String, String>> validation = service.validateToken(token, "patient");
        if (validation.getStatusCode() != HttpStatus.OK) {
            return ResponseEntity.status(validation.getStatusCode()).body(validation.getBody());
        }
        return appointmentService.cancelAppointment(id, token);
    }
}
