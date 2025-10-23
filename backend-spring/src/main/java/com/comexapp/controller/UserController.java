package com.comexapp.controller;

import com.comexapp.model.Usuario;
import com.comexapp.model.Cliente;
import com.comexapp.model.TipoUsuario;
import com.comexapp.repository.UsuarioRepository;
import com.comexapp.repository.ClienteRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @GetMapping("/teste")
    public String teste() {
        return "Controller funcionando!";
    }

    // 🔹 Criar novo usuário (usando clienteId vindo do front)
    @PostMapping
    public ResponseEntity<?> criarUsuario(@RequestBody Map<String, Object> dados) {
        try {
            System.out.println("📩 Requisição para criar usuário: " + dados);

            String email = (String) dados.get("email");
            String senha = (String) dados.get("senhaHash");
            String nome = (String) dados.get("nome");
            String telefone = (String) dados.get("telefone");
            String tipoUsuarioStr = (String) dados.get("tipoUsuario");
            Integer clienteId = (Integer) dados.get("clienteId");

            if (email == null || senha == null || nome == null || clienteId == null) {
                return ResponseEntity.badRequest().body("Campos obrigatórios ausentes.");
            }

            if (usuarioRepository.findByEmail(email).isPresent()) {
                return ResponseEntity.badRequest().body("Email já cadastrado.");
            }

            Optional<Cliente> clienteOpt = clienteRepository.findById(Long.valueOf(clienteId));
            if (clienteOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Cliente não encontrado.");
            }

            Usuario usuario = new Usuario();
            usuario.setEmail(email);
            usuario.setSenhaHash(senha);
            usuario.setNome(nome);
            usuario.setTelefone(telefone);
            usuario.setTipoUsuario(tipoUsuarioStr != null
                    ? TipoUsuario.valueOf(tipoUsuarioStr.toLowerCase())
                    : TipoUsuario.colaborador);
            usuario.setAtivo(true);
            usuario.setClienteId(clienteOpt.get().getId());

            usuarioRepository.save(usuario);

            System.out.println("✅ Usuário salvo com sucesso!");
            return ResponseEntity.ok("Usuário criado com sucesso!");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Erro ao salvar usuário.");
        }
    }

    // 🔹 Atualizar telefone
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarTelefone(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        if (usuarioOpt.isEmpty()) return ResponseEntity.notFound().build();

        String telefone = body.get("telefone");
        if (telefone == null || telefone.isBlank()) {
            return ResponseEntity.badRequest().body("Telefone inválido.");
        }

        Usuario usuario = usuarioOpt.get();
        usuario.setTelefone(telefone);
        usuarioRepository.saveAndFlush(usuario);
        return ResponseEntity.ok("Telefone atualizado com sucesso!");
    }

    // 🔹 Atualizar senha
    @PutMapping("/{id}/senha")
    public ResponseEntity<?> atualizarSenha(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        if (usuarioOpt.isEmpty()) return ResponseEntity.notFound().build();

        String novaSenha = body.get("novaSenha");
        if (novaSenha == null || novaSenha.isBlank()) {
            return ResponseEntity.badRequest().body("Senha inválida.");
        }

        Usuario usuario = usuarioOpt.get();
        usuario.setSenhaHash(novaSenha);
        usuarioRepository.saveAndFlush(usuario);
        return ResponseEntity.ok("Senha atualizada com sucesso!");
    }
}
