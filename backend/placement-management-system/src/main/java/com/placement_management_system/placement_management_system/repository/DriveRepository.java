package com.placement_management_system.placement_management_system.repository;

import com.placement_management_system.placement_management_system.entity.Drives;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DriveRepository extends JpaRepository<Drives, Long> {
}