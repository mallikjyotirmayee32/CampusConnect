package com.placement_management_system.placement_management_system.controller;

import com.placement_management_system.placement_management_system.entity.Application;
import com.placement_management_system.placement_management_system.entity.Company;
import com.placement_management_system.placement_management_system.entity.Student;
import com.placement_management_system.placement_management_system.repository.ApplicationRepository;
import com.placement_management_system.placement_management_system.repository.CompanyRepository;
import com.placement_management_system.placement_management_system.repository.StudentRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;

    public ApplicationController(
            ApplicationRepository applicationRepository,
            StudentRepository studentRepository,
            CompanyRepository companyRepository) {

        this.applicationRepository = applicationRepository;
        this.studentRepository = studentRepository;
        this.companyRepository = companyRepository;
    }

    /*
     * =========================================================
     * APPLY FOR PLACEMENT DRIVE
     * =========================================================
     */

    @PostMapping
    public ResponseEntity<?> applyForCompany(
            @RequestParam Long studentId,
            @RequestParam Long companyId) {

        Student student = studentRepository
                .findById(studentId)
                .orElse(null);

        if (student == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Student not found");
        }

        Company company = companyRepository
                .findById(companyId)
                .orElse(null);

        if (company == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Company not found");
        }

        /*
         * =====================================================
         * CHECK DUPLICATE APPLICATION
         * =====================================================
         */

        if (applicationRepository.countApplication(
                studentId,
                companyId) > 0) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(
                            "You have already applied for this placement drive.");
        }

        /*
         * =====================================================
         * CREATE APPLICATION
         * =====================================================
         */

        Application application = new Application();

        application.setStudent(student);

        application.setCompany(company);

        application.setApplicationDate(
                LocalDateTime.now());

        application.setStatus("Applied");

        Application savedApplication = applicationRepository.save(application);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedApplication);
    }

    /*
     * =========================================================
     * GET ALL APPLICATIONS
     * =========================================================
     */

    @GetMapping
    public List<Application> getAllApplications() {

        return applicationRepository.findAll();
    }

    /*
     * =========================================================
     * UPDATE APPLICATION STATUS
     * =========================================================
     */

    @PutMapping("/{id}")
    public ResponseEntity<?> updateApplicationStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        /*
         * =====================================================
         * FIND APPLICATION
         * =====================================================
         */

        Application application = applicationRepository
                .findById(id)
                .orElse(null);

        if (application == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Application not found");
        }

        /*
         * =====================================================
         * VALIDATE STATUS
         * =====================================================
         */

        if (!status.equalsIgnoreCase("Applied")
                && !status.equalsIgnoreCase("Shortlisted")
                && !status.equalsIgnoreCase("Selected")
                && !status.equalsIgnoreCase("Rejected")) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            "Invalid status. " +
                                    "Use Applied, Shortlisted, Selected or Rejected.");
        }

        /*
         * =====================================================
         * UPDATE STATUS
         * =====================================================
         */

        application.setStatus(
                status.substring(0, 1).toUpperCase()
                        + status.substring(1).toLowerCase());

        Application updatedApplication = applicationRepository.save(application);

        return ResponseEntity.ok(updatedApplication);
    }

}
