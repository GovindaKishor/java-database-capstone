package com.project.back_end.services;

import com.project.back_end.models.Patient;
import com.project.back_end.models.Appointment;
import com.project.back_end.DTO.AppointmentDTO;
import com.project.back_end.repo.PatientRepository;
import com.project.back_end.repo.AppointmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.*;

@Service
public class PatientService {
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final TokenService tokenService;

    public PatientService(PatientRepository patientRepository, AppointmentRepository appointmentRepository, TokenService tokenService) {
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
        this.tokenService = tokenService;
    }

    public int createPatient(Patient patient) {
        try {
            patientRepository.save(patient);
            return 1;
        } catch (Exception e) {
            return 0;
        }
    }

    @Transactional
    public ResponseEntity<Map<String, Object>> getPatientAppointment(Long id, String token) {
        Map<String, Object> response = new HashMap<>();
        String email = tokenService.extractEmail(token);
        Optional<Patient> patientOpt = patientRepository.findById(id);
        if (!patientOpt.isPresent()) {
            response.put("message", "Patient not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        Patient patient = patientOpt.get();
        if (!patient.getEmail().equals(email)) {
            response.put("message", "Unauthorized access");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        List<Appointment> appointments = appointmentRepository.findByPatientId(id);
        List<AppointmentDTO> dtos = new ArrayList<>();
        for (Appointment appt : appointments) {
            dtos.add(new AppointmentDTO(appt));
        }
        response.put("appointments", dtos);
        return ResponseEntity.ok(response);
    }

    @Transactional
    public ResponseEntity<Map<String, Object>> filterByCondition(String condition, Long id) {
        Map<String, Object> response = new HashMap<>();
        Optional<Patient> patientOpt = patientRepository.findById(id);
        if (!patientOpt.isPresent()) {
            response.put("message", "Patient not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        int status;
        if ("past".equalsIgnoreCase(condition)) {
            status = 1;
        } else if ("future".equalsIgnoreCase(condition)) {
            status = 0;
        } else {
            response.put("message", "Invalid condition");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        List<Appointment> appointments = appointmentRepository.findByPatientIdAndStatus(id, status);
        List<AppointmentDTO> dtos = new ArrayList<>();
        for (Appointment appt : appointments) {
            dtos.add(new AppointmentDTO(appt));
        }
        response.put("appointments", dtos);
        return ResponseEntity.ok(response);
    }

    @Transactional
    public ResponseEntity<Map<String, Object>> filterByDoctor(String name, Long patientId) {
        Map<String, Object> response = new HashMap<>();
        Optional<Patient> patientOpt = patientRepository.findById(patientId);
        if (!patientOpt.isPresent()) {
            response.put("message", "Patient not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        List<Appointment> appointments = appointmentRepository.findByPatientIdAndDoctorName(patientId, name);
        List<AppointmentDTO> dtos = new ArrayList<>();
        for (Appointment appt : appointments) {
            dtos.add(new AppointmentDTO(appt));
        }
        response.put("appointments", dtos);
        return ResponseEntity.ok(response);
    }

    @Transactional
    public ResponseEntity<Map<String, Object>> filterByDoctorAndCondition(String condition, String name, long patientId) {
        Map<String, Object> response = new HashMap<>();
        Optional<Patient> patientOpt = patientRepository.findById(patientId);
        if (!patientOpt.isPresent()) {
            response.put("message", "Patient not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        int status;
        if ("past".equalsIgnoreCase(condition)) {
            status = 1;
        } else if ("future".equalsIgnoreCase(condition)) {
            status = 0;
        } else {
            response.put("message", "Invalid condition");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        List<Appointment> appointments = appointmentRepository.findByPatientIdAndDoctorNameAndStatus(patientId, name, status);
        List<AppointmentDTO> dtos = new ArrayList<>();
        for (Appointment appt : appointments) {
            dtos.add(new AppointmentDTO(appt));
        }
        response.put("appointments", dtos);
        return ResponseEntity.ok(response);
    }

    @Transactional
    public ResponseEntity<Map<String, Object>> getPatientDetails(String token) {
        Map<String, Object> response = new HashMap<>();
        String email = tokenService.extractEmail(token);
        Optional<Patient> patientOpt = patientRepository.findByEmail(email);
        if (!patientOpt.isPresent()) {
            response.put("message", "Patient not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        response.put("patient", patientOpt.get());
        return ResponseEntity.ok(response);
    }
}
