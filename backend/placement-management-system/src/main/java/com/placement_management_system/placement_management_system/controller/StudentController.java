package com.placement_management_system.placement_management_system.controller;

import com.placement_management_system.placement_management_system.entity.Student;
import com.placement_management_system.placement_management_system.repository.StudentRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentRepository studentRepository;

    public StudentController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    /*
     * =====================================================
     * REGISTER STUDENT
     * =====================================================
     */

    @PostMapping
    public Student addStudent(@RequestBody Student student) {

        return studentRepository.save(student);
    }

    /*
     * =====================================================
     * GET ALL STUDENTS
     * =====================================================
     */

    @GetMapping
    public List<Student> getAllStudents() {

        return studentRepository.findAll();
    }

    /*
     * =====================================================
     * GET STUDENT BY ID
     * =====================================================
     */

    @GetMapping("/{id}")
    public Student getStudentById(@PathVariable Long id) {

        return studentRepository
                .findById(id)
                .orElse(null);
    }

    /*
     * =====================================================
     * FIND STUDENT BY EMAIL
     * =====================================================
     */

    @GetMapping("/email/{email}")
    public Student getStudentByEmail(@PathVariable String email) {

        return studentRepository
                .findByEmail(email)
                .orElse(null);
    }

    /*
     * =====================================================
     * DELETE STUDENT
     * =====================================================
     */

    @DeleteMapping("/{id}")
    public String deleteStudent(@PathVariable Long id) {

        if (!studentRepository.existsById(id)) {

            return "Student not found";
        }

        studentRepository.deleteById(id);

        return "Student deleted successfully";
    }
}