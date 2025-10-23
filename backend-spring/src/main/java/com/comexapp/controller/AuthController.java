package com.comexapp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.comexapp.service.AuthService;
import com.comexapp.model.Usuario;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // 🔥 Permite chamadas do frontend
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String senha = payload.get("senha");

        System.out.println("📩 Requisição recebida no backend: " + email);

        Usuario usuario = authService.buscarPorEmail(email);

        if (usuario != null && authService.validarLogin(email, senha)) {
            // Retorna id e mensagem de sucesso
            return ResponseEntity.ok(Map.of(
                "mensagem", "Login realizado com sucesso!",
                "id", usuario.getId()
            ));
        } else {
            return ResponseEntity.status(401).body(Map.of("erro", "Email ou senha inválidos"));
        }
    }
}
