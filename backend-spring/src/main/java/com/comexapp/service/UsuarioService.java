package com.comexapp.service;

import com.comexapp.repository.UsuarioRepository;
import com.comexapp.model.Usuario;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private static final String CARACTERES = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%!";

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public void atualizarSenha(Long id, String novaSenha) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        usuario.setSenhaHash(novaSenha);
        usuarioRepository.save(usuario);
    }

    public String gerarNovaSenha(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        String senhaGerada = gerarSenhaAleatoria(10); // tamanho 10
        usuario.setSenhaHash(senhaGerada);
        usuarioRepository.save(usuario);

        return senhaGerada;
    }

    private String gerarSenhaAleatoria(int tamanho) {
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder(tamanho);
        for (int i = 0; i < tamanho; i++) {
            int index = random.nextInt(CARACTERES.length());
            sb.append(CARACTERES.charAt(index));
        }
        return sb.toString();
    }
}
