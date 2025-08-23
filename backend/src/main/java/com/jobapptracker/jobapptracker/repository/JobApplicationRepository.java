package com.jobapptracker.jobapptracker.repository;

import com.jobapptracker.jobapptracker.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {}
