package com.project_back_end.controllers;

import com.project_back_end.models.Doctor;
import com.project_back_end.DTO.Login;
import com.project_back_end.services.DoctorService;
import com.project_back_end.services.Service;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.time.LocalDate;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("${api.path}doctor")
public class DoctorController {
    private final DoctorService doctorService;
    private final Service service;

    @Autowired
    public DoctorController(DoctorService doctorService, Service service) {
        this.doctorService = doctorService;
        this.service = service;
    }

    @GetMapping("/availability/{user}/{doctorId}/{date}/{token}")
    public ResponseEntity<Map<String, Object>> getDoctorAvailability(@PathVariable String user, @PathVariable Long doctorId, @PathVariable String date, @PathVariable String token) {
        ResponseEntity<Map<String, String>> validation = service.validateToken(token, user);
        if (validation.getStatusCode() != HttpStatus.OK) {
            return ResponseEntity.status(validation.getStatusCode()).body(Map.of("message", validation.getBody().get("message")));
        }
        LocalDate localDate = LocalDate.parse(date);
        List<String> availability = doctorService.getDoctorAvailability(doctorId, localDate);
        return ResponseEntity.ok(Map.of("availability", availability));
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getDoctors() {
        List<Doctor> doctors = doctorService.getDoctors();
        return ResponseEntity.ok(Map.of("doctors", doctors));
    }

    @PostMapping("/{token}")
    public ResponseEntity<Map<String, String>> saveDoctor(@RequestBody Doctor doctor, @PathVariable String token) {
        ResponseEntity<Map<String, String>> validation = service.validateToken(token, "admin");
        if (validation.getStatusCode() != HttpStatus.OK) {
            return ResponseEntity.status(validation.getStatusCode()).body(validation.getBody());
        }
        int result = doctorService.saveDoctor(doctor);
        if (result == 1) {
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Doctor added to db"));
        } else if (result == -1) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Doctor already exists"));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Some internal error occurred"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> doctorLogin(@RequestBody Login login) {
        return doctorService.validateDoctor(login);
    }

    @PutMapping("/{token}")
    public ResponseEntity<Map<String, String>> updateDoctor(@RequestBody Doctor doctor, @PathVariable String token) {
        ResponseEntity<Map<String, String>> validation = service.validateToken(token, "admin");
        if (validation.getStatusCode() != HttpStatus.OK) {
            return ResponseEntity.status(validation.getStatusCode()).body(validation.getBody());
        }
        int result = doctorService.updateDoctor(doctor);
        if (result == 1) {
            return ResponseEntity.ok(Map.of("message", "Doctor updated"));
        } else if (result == -1) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Doctor not found"));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Some internal error occurred"));
        }
    }

    @DeleteMapping("/{id}/{token}")
    public ResponseEntity<Map<String, String>> deleteDoctor(@PathVariable long id, @PathVariable String token) {
        ResponseEntity<Map<String, String>> validation = service.validateToken(token, "admin");
        if (validation.getStatusCode() != HttpStatus.OK) {
            return ResponseEntity.status(validation.getStatusCode()).body(validation.getBody());
        }
        int result = doctorService.deleteDoctor(id);
        if (result == 1) {
            return ResponseEntity.ok(Map.of("message", "Doctor deleted successfully"));
        } else if (result == -1) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Doctor not found with id"));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Some internal error occurred"));
        }
    }

    @GetMapping("/filter/{name}/{time}/{speciality}")
    public ResponseEntity<Map<String, Object>> filterDoctors(@PathVariable String name, @PathVariable String time, @PathVariable String speciality) {
        Map<String, Object> result = service.filterDoctor(name, speciality, time);
        return ResponseEntity.ok(result);
    }
}
