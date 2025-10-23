package com.comexapp.service;

import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import com.comexapp.model.Usuario;
import com.comexapp.repository.UsuarioRepository;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;

    @Autowired
    public AuthService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    // ✅ Método novo para buscar usuário pelo email
    public Usuario buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email).orElse(null);
    }

    public boolean validarLogin(String email, String senha) {
        System.out.println("🔍 Tentando login com email: " + email);

        Optional<Usuario> optUser = usuarioRepository.findByEmail(email);

        if (optUser.isPresent()) {
            Usuario user = optUser.get();
            System.out.println("✅ Usuário encontrado: " + user.getEmail());
            System.out.println("🔐 Usuário está ativo? " + user.isAtivo());

            // Mostra senhas para depuração
            System.out.println("Senha digitada: " + senha);
            System.out.println("Senha no banco: " + user.getSenhaHash());

            // Comparação simples (sem hash)
            boolean senhaConfere = senha.equals(user.getSenhaHash());

            System.out.println("🔑 Senha válida? " + senhaConfere);

            return user.isAtivo() && senhaConfere;
        }

        System.out.println("❌ Usuário não encontrado.");
        return false;
    }
}
