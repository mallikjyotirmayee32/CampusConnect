package com.placement_management_system.placement_management_system.repository;

import com.placement_management_system.placement_management_system.entity.Application;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ApplicationRepository
        extends JpaRepository<Application, Long> {

    @Query("""
                SELECT COUNT(a)
                FROM Application a
                WHERE a.student.id = :studentId
                AND a.company.id = :companyId
            """)
    long countApplication(
            @Param("studentId") Long studentId,
            @Param("companyId") Long companyId);
}