package com.comexapp.controller;

import com.comexapp.DTO.ShippingInstructionDTO;
import com.comexapp.service.ShippingPdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shipping")
@CrossOrigin(origins = "*")
public class ShippingController {

    @Autowired
    private ShippingPdfService pdfService;

    @PostMapping("/pdf")
    public ResponseEntity<byte[]> gerarPdf(@RequestBody ShippingInstructionDTO dto) {
        byte[] pdf = pdfService.gerarPdf(dto);

        if (pdf == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("filename", "shipping_instruction.pdf");

        return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
    }
}
