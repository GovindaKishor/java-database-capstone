package com.project.back_end.services;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class Service {
    private final TokenService tokenService;
    private final AdminRepository adminRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final DoctorService doctorService;
    private final PatientService patientService;

    public Service(TokenService tokenService,
                   AdminRepository adminRepository,
                   DoctorRepository doctorRepository,
                   PatientRepository patientRepository,
                   DoctorService doctorService,
                   PatientService patientService) {
        this.tokenService = tokenService;
        this.adminRepository = adminRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.doctorService = doctorService;
        this.patientService = patientService;
    }

    // 1. validateToken
    public ResponseEntity<Map<String, String>> validateToken(String token, String user) {
        boolean isValid = tokenService.validateToken(token, user);
        if (!isValid) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid or expired token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
        return ResponseEntity.ok(Collections.singletonMap("message", "Token is valid"));
    }

    // 2. validateAdmin
    public ResponseEntity<Map<String, String>> validateAdmin(Admin receivedAdmin) {
        try {
            Admin admin = adminRepository.findByUsername(receivedAdmin.getUsername());
            if (admin != null && admin.getPassword().equals(receivedAdmin.getPassword())) {
                String token = tokenService.generateToken(admin.getUsername());
                Map<String, String> response = new HashMap<>();
                response.put("token", token);
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid username or password");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Internal server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // 3. filterDoctor
    public Map<String, Object> filterDoctor(String name, String specialty, String time) {
        List<Doctor> doctors = doctorService.filterDoctorsByNameSpecilityandTime(name, specialty, time);
        Map<String, Object> result = new HashMap<>();
        result.put("doctors", doctors);
        return result;
    }

    // 4. validateAppointment
    public int validateAppointment(Appointment appointment) {
        Optional<Doctor> doctorOpt = doctorRepository.findById(appointment.getDoctorId());
        if (!doctorOpt.isPresent()) {
            return -1;
        }
        List<TimeSlot> slots = doctorService.getDoctorAvailability(appointment.getDoctorId(), appointment.getDate());
        for (TimeSlot slot : slots) {
            if (slot.getStartTime().equals(appointment.getTime())) {
                return 1;
            }
        }
        return 0;
    }

    // 5. validatePatient
    public boolean validatePatient(Patient patient) {
        Patient existing = patientRepository.findByEmailOrPhone(patient.getEmail(), patient.getPhone());
        return existing == null;
    }

    // 6. validatePatientLogin
    public ResponseEntity<Map<String, String>> validatePatientLogin(Login login) {
        try {
            Patient patient = patientRepository.findByEmail(login.getEmail());
            if (patient != null && patient.getPassword().equals(login.getPassword())) {
                String token = tokenService.generateToken(patient.getEmail());
                Map<String, String> response = new HashMap<>();
                response.put("token", token);
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid email or password");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Internal server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // 7. filterPatient
    public ResponseEntity<Map<String, Object>> filterPatient(String condition, String name, String token) {
        String email = tokenService.extractUser(token);
        Map<String, Object> result = new HashMap<>();
        List<Appointment> appointments;
        if (condition != null && name != null) {
            appointments = patientService.filterByDoctorAndCondition(email, name, condition);
        } else if (condition != null) {
            appointments = patientService.filterByCondition(email, condition);
        } else if (name != null) {
            appointments = patientService.filterByDoctor(email, name);
        } else {
            appointments = patientService.getAllAppointments(email);
        }
        result.put("appointments", appointments);
        return ResponseEntity.ok(result);
    }
}
