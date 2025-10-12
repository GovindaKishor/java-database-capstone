package com.project.back_end.services;

import com.project.back_end.models.Doctor;
import com.project.back_end.models.Appointment;
import com.project.back_end.models.Login;
import com.project.back_end.repo.DoctorRepository;
import com.project.back_end.repo.AppointmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Service
public class DoctorService {
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final TokenService tokenService;

    public DoctorService(DoctorRepository doctorRepository, AppointmentRepository appointmentRepository, TokenService tokenService) {
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
        this.tokenService = tokenService;
    }

    @Transactional
    public List<String> getDoctorAvailability(Long doctorId, LocalDate date) {
        List<String> allSlots = Arrays.asList("09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00");
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.atTime(LocalTime.MAX);
        List<Appointment> appointments = appointmentRepository.findByDoctorIdAndAppointmentTimeBetween(doctorId, start, end);
        Set<String> bookedSlots = new HashSet<>();
        for (Appointment appt : appointments) {
            bookedSlots.add(appt.getAppointmentTime().toLocalTime().toString().substring(0,5));
        }
        List<String> availableSlots = new ArrayList<>();
        for (String slot : allSlots) {
            if (!bookedSlots.contains(slot)) {
                availableSlots.add(slot);
            }
        }
        return availableSlots;
    }

    public int saveDoctor(Doctor doctor) {
        if (doctorRepository.findByEmail(doctor.getEmail()).isPresent()) {
            return -1;
        }
        try {
            doctorRepository.save(doctor);
            return 1;
        } catch (Exception e) {
            return 0;
        }
    }

    public int updateDoctor(Doctor doctor) {
        Optional<Doctor> existing = doctorRepository.findById(doctor.getId());
        if (!existing.isPresent()) {
            return -1;
        }
        try {
            doctorRepository.save(doctor);
            return 1;
        } catch (Exception e) {
            return 0;
        }
    }

    @Transactional
    public List<Doctor> getDoctors() {
        return doctorRepository.findAll();
    }

    public int deleteDoctor(long id) {
        Optional<Doctor> doctorOpt = doctorRepository.findById(id);
        if (!doctorOpt.isPresent()) {
            return -1;
        }
        try {
            appointmentRepository.deleteAllByDoctorId(id);
            doctorRepository.deleteById(id);
            return 1;
        } catch (Exception e) {
            return 0;
        }
    }

    public ResponseEntity<Map<String, String>> validateDoctor(Login login) {
        Map<String, String> response = new HashMap<>();
        Optional<Doctor> doctorOpt = doctorRepository.findByEmail(login.getEmail());
        if (!doctorOpt.isPresent()) {
            response.put("message", "Doctor not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        Doctor doctor = doctorOpt.get();
        if (!doctor.getPassword().equals(login.getPassword())) {
            response.put("message", "Invalid password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        String token = tokenService.generateTokenForDoctor(doctor);
        response.put("token", token);
        return ResponseEntity.ok(response);
    }

    @Transactional
    public Map<String, Object> findDoctorByName(String name) {
        Map<String, Object> result = new HashMap<>();
        List<Doctor> doctors = doctorRepository.findByNameLike("%" + name + "%");
        result.put("doctors", doctors);
        return result;
    }

    @Transactional
    public Map<String, Object> filterDoctorsByNameSpecilityandTime(String name, String specialty, String amOrPm) {
        Map<String, Object> result = new HashMap<>();
        List<Doctor> doctors = doctorRepository.findByNameContainingIgnoreCaseAndSpecialtyIgnoreCase(name, specialty);
        doctors = filterDoctorByTime(doctors, amOrPm);
        result.put("doctors", doctors);
        return result;
    }

    @Transactional
    public Map<String, Object> filterDoctorByNameAndTime(String name, String amOrPm) {
        Map<String, Object> result = new HashMap<>();
        List<Doctor> doctors = doctorRepository.findByNameContainingIgnoreCase(name);
        doctors = filterDoctorByTime(doctors, amOrPm);
        result.put("doctors", doctors);
        return result;
    }

    @Transactional
    public Map<String, Object> filterDoctorByNameAndSpecility(String name, String specialty) {
        Map<String, Object> result = new HashMap<>();
        List<Doctor> doctors = doctorRepository.findByNameContainingIgnoreCaseAndSpecialtyIgnoreCase(name, specialty);
        result.put("doctors", doctors);
        return result;
    }

    @Transactional
    public Map<String, Object> filterDoctorByTimeAndSpecility(String specialty, String amOrPm) {
        Map<String, Object> result = new HashMap<>();
        List<Doctor> doctors = doctorRepository.findBySpecialtyIgnoreCase(specialty);
        doctors = filterDoctorByTime(doctors, amOrPm);
        result.put("doctors", doctors);
        return result;
    }

    @Transactional
    public Map<String, Object> filterDoctorBySpecility(String specialty) {
        Map<String, Object> result = new HashMap<>();
        List<Doctor> doctors = doctorRepository.findBySpecialtyIgnoreCase(specialty);
        result.put("doctors", doctors);
        return result;
    }

    @Transactional
    public Map<String, Object> filterDoctorsByTime(String amOrPm) {
        Map<String, Object> result = new HashMap<>();
        List<Doctor> doctors = doctorRepository.findAll();
        doctors = filterDoctorByTime(doctors, amOrPm);
        result.put("doctors", doctors);
        return result;
    }

    private List<Doctor> filterDoctorByTime(List<Doctor> doctors, String amOrPm) {
        List<Doctor> filtered = new ArrayList<>();
        for (Doctor doctor : doctors) {
            List<String> times = doctor.getAvailableTimes();
            for (String time : times) {
                int hour = Integer.parseInt(time.split(":")[0]);
                if (("AM".equalsIgnoreCase(amOrPm) && hour < 12) || ("PM".equalsIgnoreCase(amOrPm) && hour >= 12)) {
                    filtered.add(doctor);
                    break;
                }
            }
        }
        return filtered;
    }
}
