package com.jobapptracker.jobapptracker.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * JPA Entity representing a job application.
 * - @Entity makes it a DB table (via JPA/Hibernate)
 * - Validation annotations ensure clean inputs
 */
@Entity
@Table(name = "job_applications")
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // H2 will auto-generate IDs
    private Long id;

    @NotBlank
    @Size(max = 200)
    private String company;

    @NotBlank
    @Size(max = 200)
    private String role;

    @NotBlank
    @Size(max = 50)
    private String status;

    @Size(max = 2000)
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "applied_date")
    private LocalDate appliedDate;

    public JobApplication() {}

    public JobApplication(Long id, String company, String role, String status, String notes) {
        this.id = id;
        this.company = company;
        this.role = role;
        this.status = status;
        this.notes = notes;
    }

    public JobApplication(Long id, String company, String role, String status, String notes, LocalDateTime createdAt, LocalDate appliedDate) {
        this.id = id;
        this.company = company;
        this.role = role;
        this.status = status;
        this.notes = notes;
        this.createdAt = createdAt;
        this.appliedDate = appliedDate;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDate getAppliedDate() { return appliedDate; }
    public void setAppliedDate(LocalDate appliedDate) { this.appliedDate = appliedDate; }
}
