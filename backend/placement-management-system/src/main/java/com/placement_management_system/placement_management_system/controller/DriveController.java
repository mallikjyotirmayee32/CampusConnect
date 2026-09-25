package com.placement_management_system.placement_management_system.controller;

import com.placement_management_system.placement_management_system.entity.Drives;

import com.placement_management_system.placement_management_system.repository.DriveRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drives")
@CrossOrigin(origins = "*")
public class DriveController {

    private final DriveRepository driveRepository;

    public DriveController(DriveRepository driveRepository) {
        this.driveRepository = driveRepository;
    }

    @PostMapping
    public Drives addDrive(@RequestBody Drives drive) {
        return driveRepository.save(drive);
    }

    @GetMapping
    public List<Drives> getAllDrives() {
        return driveRepository.findAll();
    }

    @GetMapping("/{id}")
    public Drives getDriveById(@PathVariable Long id) {
        return driveRepository.findById(id).orElse(null);
    }

    @DeleteMapping("/{id}")
    public String deleteDrive(@PathVariable Long id) {

        if (!driveRepository.existsById(id)) {
            return "Drive not found";
        }

        driveRepository.deleteById(id);

        return "Drive deleted successfully";
    }
}