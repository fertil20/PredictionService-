package com.sigma.predictionService.controller;


import com.sigma.predictionService.dto.FileDownloadResponse;
import com.sigma.predictionService.security.CurrentUser;
import com.sigma.predictionService.security.UserPrincipal;
import com.sigma.predictionService.service.FileService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Map;;


@RestController
@RequestMapping("/api/file")
public class FilesController {

    private final FileService fileService;

    public FilesController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping("/upload/{id}")
    public void uploadFile(@RequestParam("file") MultipartFile file,
                           @PathVariable Long id,
                           @RequestParam("dataType") String dataType) throws IOException {
        if (file!= null && id!=null){
            fileService.uploadFile(file, id, dataType);
        }
    }

    @PostMapping("/savePrediction/{id}")
    public void changeFileName(@RequestParam("file") Map<String, Double> data,
                               @PathVariable Long id,
                               @RequestParam("dataType") String dataType){
        if (id!=null){
            fileService.savePrediction(data, id, dataType);
        }
    }

    @PostMapping("/changeName/{id}")
    public void changeFileName(@PathVariable Long id, @RequestBody String name){
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


    @Transactional
    @GetMapping("/download/{id}")
    @CrossOrigin(value = {"*"}, exposedHeaders = {"Content-Disposition"})
    public ResponseEntity<byte[]> downloadFile(@PathVariable Long id, @CurrentUser UserPrincipal currentUser){
        if (id!=null){
            FileDownloadResponse fileDownloadResponse = fileService.getDownloadFile(id, currentUser.getId());

            HttpHeaders header = new HttpHeaders();
            header.setContentType(MediaType.valueOf(fileDownloadResponse.getContentType()));
            header.setContentLength(fileDownloadResponse.getFile().length);
            header.set("Content-Disposition", "attachment; filename=" + fileDownloadResponse.getFileName());

            return new ResponseEntity<>(fileDownloadResponse.getFile(), header, HttpStatus.OK);
        }
        return null;
    }

}
