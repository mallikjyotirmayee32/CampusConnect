package com.placement_management_system.placement_management_system.controller;

import com.placement_management_system.placement_management_system.entity.Student;
import com.placement_management_system.placement_management_system.repository.StudentRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentRepository studentRepository;

    public StudentController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    /* ================= ADD STUDENT ================= */

    @PostMapping
    public Student addStudent(@RequestBody Student student) {
        return studentRepository.save(student);
    }

    /* ================= GET ALL STUDENTS ================= */

    @GetMapping
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    /* ================= GET STUDENT BY ID ================= */

    @GetMapping("/{id}")
    public Student getStudentById(@PathVariable Long id) {
        return studentRepository.findById(id).orElse(null);
    }

    /* ================= UPDATE STUDENT ================= */

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStudent(
            @PathVariable Long id,
            @RequestBody Student updatedStudent) {

        Student student = studentRepository.findById(id).orElse(null);

        if (student == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Student not found");
        }

        student.setFullName(updatedStudent.getFullName());
        student.setEmail(updatedStudent.getEmail());
        student.setPassword(updatedStudent.getPassword());
        student.setPhone(updatedStudent.getPhone());
        student.setRollNumber(updatedStudent.getRollNumber());
        student.setBranch(updatedStudent.getBranch());
        student.setCgpa(updatedStudent.getCgpa());
        student.setBacklogs(updatedStudent.getBacklogs());
        student.setGraduationYear(updatedStudent.getGraduationYear());

        return ResponseEntity.ok(studentRepository.save(student));
    }

    /* ================= GET STUDENT BY EMAIL ================= */

    @GetMapping("/email/{email}")
    public Student getStudentByEmail(@PathVariable String email) {
        return studentRepository.findByEmail(email).orElse(null);
    }

    /* ================= STUDENT LOGIN ================= */

    @PostMapping("/login")
    public ResponseEntity<?> studentLogin(
            @RequestBody StudentLoginRequest loginRequest) {

        if (loginRequest.getEmail() == null ||
                loginRequest.getPassword() == null) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Email and password are required.");
        }

        Optional<Student> studentOptional = studentRepository.findByEmail(
                loginRequest.getEmail().trim());

        if (studentOptional.isEmpty()) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Student account not found.");
        }

        Student student = studentOptional.get();

        if (student.getPassword() == null ||
                !student.getPassword().equals(
                        loginRequest.getPassword())) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Incorrect password.");
        }

        return ResponseEntity.ok(student);
    }

    /* ================= DELETE STUDENT ================= */

    @DeleteMapping("/{id}")
    public String deleteStudent(@PathVariable Long id) {

        if (!studentRepository.existsById(id)) {
            return "Student not found";
        }

        studentRepository.deleteById(id);

        return "Student deleted successfully";
    }

    /* ================= LOGIN REQUEST CLASS ================= */

    public static class StudentLoginRequest {

        private String email;
        private String password;

        public StudentLoginRequest() {
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}