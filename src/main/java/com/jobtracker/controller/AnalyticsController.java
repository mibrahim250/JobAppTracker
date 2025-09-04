package com.jobtracker.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.*;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = {"http://localhost:3000", "https://trackytrack.online"}, methods = {RequestMethod.GET, RequestMethod.POST})
public class AnalyticsController {
    
    // Main analytics endpoint that processes job application data
    @PostMapping("/process")
    public ResponseEntity<Map<String, Object>> processAnalytics(@RequestBody Map<String, Object> request) {
        try {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> applications = (List<Map<String, Object>>) request.get("applications");
            String userId = (String) request.get("userId");
            
            Map<String, Object> analytics = processApplicationsData(applications);
            analytics.put("processedBy", "Spring Boot");
            analytics.put("timestamp", new Date());
            analytics.put("userId", userId);
            
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to process analytics: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // Enhanced analytics endpoint that can process data from Supabase
    @GetMapping("/enhanced-stats")
    public ResponseEntity<Map<String, Object>> getEnhancedStats() {
        Map<String, Object> analytics = new HashMap<>();
        
        // This would normally process data from a database
        // For now, it returns sample analytics structure
        analytics.put("message", "Spring Boot Analytics API is running!");
        analytics.put("timestamp", new Date());
        analytics.put("version", "1.0.0");
        
        // Sample analytics data structure
        Map<String, Object> sampleData = new HashMap<>();
        sampleData.put("totalApplications", 0);
        sampleData.put("successRate", 0.0);
        sampleData.put("monthlyTrends", new ArrayList<>());
        sampleData.put("statusDistribution", new HashMap<>());
        
        analytics.put("analytics", sampleData);
        
        return ResponseEntity.ok(analytics);
    }
    
    // Health check for analytics service
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Spring Boot Analytics Service is running!");
    }
    
    // Sample advanced analytics endpoint
    @GetMapping("/predictions")
    public ResponseEntity<Map<String, Object>> getPredictions() {
        Map<String, Object> predictions = new HashMap<>();
        
        // This could include ML predictions, trend analysis, etc.
        predictions.put("nextBestTimeToApply", "Monday mornings");
        predictions.put("estimatedResponseTime", "5-7 business days");
        predictions.put("successProbability", "Based on current pipeline");
        predictions.put("recommendedActions", Arrays.asList(
            "Follow up on pending applications",
            "Update resume based on recent feedback",
            "Network with industry professionals"
        ));
        
        return ResponseEntity.ok(predictions);
    }
    
    // Career insights endpoint
    @GetMapping("/career-insights")
    public ResponseEntity<Map<String, Object>> getCareerInsights() {
        Map<String, Object> insights = new HashMap<>();
        
        insights.put("marketTrends", "Software engineering demand remains high");
        insights.put("salaryInsights", "Average salary range: $80k - $150k");
        insights.put("skillDemand", Arrays.asList("React", "Java", "Python", "Cloud"));
        insights.put("interviewTips", Arrays.asList(
            "Practice system design questions",
            "Review data structures and algorithms",
            "Prepare behavioral questions",
            "Research company culture"
        ));
        
        return ResponseEntity.ok(insights);
    }
    
    // Process applications data and generate analytics
    private Map<String, Object> processApplicationsData(List<Map<String, Object>> applications) {
        Map<String, Object> analytics = new HashMap<>();
        
        if (applications == null || applications.isEmpty()) {
            analytics.put("totalApplications", 0);
            analytics.put("successRate", 0.0);
            analytics.put("monthlyData", new HashMap<>());
            analytics.put("statusCounts", new HashMap<>());
            analytics.put("companyCounts", new HashMap<>());
            analytics.put("successCount", 0);
            return analytics;
        }
        
        // Status distribution
        Map<String, Integer> statusCounts = new HashMap<>();
        Map<String, Integer> companyCounts = new HashMap<>();
        Map<String, Integer> monthlyData = new HashMap<>();
        
        int successCount = 0;
        List<String> successStatuses = Arrays.asList("offer", "accepted", "interview");
        
        for (Map<String, Object> app : applications) {
            // Count by status
            String status = (String) app.get("status");
            if (status != null) {
                statusCounts.put(status, statusCounts.getOrDefault(status, 0) + 1);
                if (successStatuses.contains(status)) {
                    successCount++;
                }
            }
            
            // Count by company
            String company = (String) app.get("company");
            if (company != null) {
                companyCounts.put(company, companyCounts.getOrDefault(company, 0) + 1);
            }
            
            // Count by month
            String appliedAt = (String) app.get("applied_at");
            if (appliedAt != null) {
                try {
                    // Parse date and format as month
                    java.time.LocalDate date = java.time.LocalDate.parse(appliedAt);
                    String monthKey = date.getMonth().toString().substring(0, 3) + " " + date.getYear();
                    monthlyData.put(monthKey, monthlyData.getOrDefault(monthKey, 0) + 1);
                } catch (Exception e) {
                    // Skip invalid dates
                }
            }
        }
        
        // Calculate success rate
        double successRate = applications.size() > 0 ? 
            ((double) successCount / applications.size()) * 100 : 0.0;
        
        analytics.put("totalApplications", applications.size());
        analytics.put("successRate", Math.round(successRate * 10.0) / 10.0);
        analytics.put("monthlyData", monthlyData);
        analytics.put("statusCounts", statusCounts);
        analytics.put("companyCounts", companyCounts);
        analytics.put("successCount", successCount);
        
        return analytics;
    }
}
