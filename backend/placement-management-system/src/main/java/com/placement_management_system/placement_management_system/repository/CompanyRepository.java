package com.placement_management_system.placement_management_system.repository;

import com.placement_management_system.placement_management_system.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRepository extends JpaRepository<Company, Long> {
}