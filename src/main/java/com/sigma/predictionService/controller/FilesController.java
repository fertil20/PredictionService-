package com.sigma.predictionService.controller;


import com.sigma.predictionService.service.FileService;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;


@RestController
@RequestMapping("/api/file")
public class FilesController {

    private final FileService fileService;

    public FilesController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping("/upload/{id}")
    public void uploadFile(@RequestParam("file") MultipartFile file, @PathVariable Long id) throws IOException {
        if (file!= null && id!=null){
            fileService.uploadFile(file, id);
        }
    }

    @PostMapping("/changeName/{id}")
    public void changeFileName(@PathVariable Long id, @RequestParam("name") String name){
        if (id!=null){
            fileService.changeFileName(id, name);
        }
    }

    @DeleteMapping("/delete/{id}")
    public void deleteFile(@PathVariable Long id){
        if (id!=null){
            fileService.deleteFile(id);
        }
    }

    @Transactional
    @GetMapping("/parse/{id}")
    public void parseFile(@PathVariable Long id){
        fileService.readScv(id);
    }

    @GetMapping("/download/{id}")
    public byte[] downloadFine(@PathVariable Long id, @RequestParam Long userId){
        if (id!=null){
            return fileService.getFile(id, userId);
        }
        return null;
    }

}
