package com.jobapptracker.jobapptracker.service;

import com.jobapptracker.jobapptracker.model.JobApplication;
import com.jobapptracker.jobapptracker.repository.JobApplicationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class JobApplicationService {
    private final JobApplicationRepository repo;

    public JobApplicationService(JobApplicationRepository repo) {
        this.repo = repo;
    }

    public List<JobApplication> getAll() { return repo.findAll(); }
    public JobApplication getById(Long id) { return repo.findById(id).orElse(null); }

    public JobApplication add(JobApplication app) {
        app.setId(null);     // let DB assign the ID
        app.setCreatedAt(LocalDateTime.now()); // Set creation timestamp
        return repo.save(app);
    }

    public JobApplication update(Long id, JobApplication incoming) {
        return repo.findById(id).map(existing -> {
            existing.setCompany(incoming.getCompany());
            existing.setRole(incoming.getRole());
            existing.setStatus(incoming.getStatus());
            existing.setNotes(incoming.getNotes());
            existing.setAppliedDate(incoming.getAppliedDate());
            return repo.save(existing);
        }).orElse(null);
    }

    public void delete(Long id) { repo.deleteById(id); }
}
