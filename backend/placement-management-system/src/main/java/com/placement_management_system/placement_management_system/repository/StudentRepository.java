package com.placement_management_system.placement_management_system.repository;

import com.placement_management_system.placement_management_system.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByEmail(String email);

}