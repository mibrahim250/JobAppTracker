package com.jobtracker.repository;

import com.jobtracker.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    
    // Find applications by status
    List<JobApplication> findByStatus(String status);
    
    // Find applications by company
    List<JobApplication> findByCompanyContainingIgnoreCase(String company);
    
    // Find applications by role
    List<JobApplication> findByRoleContainingIgnoreCase(String role);
    
    // Find applications applied after a specific date
    List<JobApplication> findByAppliedDateAfter(LocalDate date);
    
    // Find applications by status and company
    List<JobApplication> findByStatusAndCompanyContainingIgnoreCase(String status, String company);
    
    // Custom query to find applications with project experience
    @Query("SELECT ja FROM JobApplication ja WHERE ja.projectName IS NOT NULL AND ja.projectName != ''")
    List<JobApplication> findApplicationsWithProjects();
    
    // Custom query to find applications by date range
    @Query("SELECT ja FROM JobApplication ja WHERE ja.appliedDate BETWEEN :startDate AND :endDate")
    List<JobApplication> findByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    // Count applications by status
    long countByStatus(String status);
}

