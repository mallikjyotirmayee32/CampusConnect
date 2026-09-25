package com.placement_management_system.placement_management_system.controller;

import com.placement_management_system.placement_management_system.entity.Company;
import com.placement_management_system.placement_management_system.repository.CompanyRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
@CrossOrigin(origins = "*")
public class CompanyController {

    private final CompanyRepository companyRepository;

    public CompanyController(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    // Add a new company
    @PostMapping
    public Company addCompany(@RequestBody Company company) {
        return companyRepository.save(company);
    }

    // Get all companies
    @GetMapping
    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    // Get company by ID
    @GetMapping("/{id}")
    public Company getCompanyById(@PathVariable Long id) {
        return companyRepository.findById(id).orElse(null);
    }

    // Delete company
    @DeleteMapping("/{id}")
    public String deleteCompany(@PathVariable Long id) {

        if (!companyRepository.existsById(id)) {
            return "Company not found";
        }

        companyRepository.deleteById(id);
        return "Company deleted successfully";
    }
}