package com.comexapp.config;

import java.util.concurrent.atomic.AtomicLong;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;


import com.comexapp.model.Usuario;
import com.comexapp.model.TipoUsuario;
import com.comexapp.repository.UsuarioRepository;

@Component
public class DataLoader implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private static final AtomicLong clienteIdCounter = new AtomicLong(1);

    public DataLoader(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public void run(String... args) {
        if (usuarioRepository.findByEmail("teste@empresa.com").isEmpty()) {
            Usuario user = new Usuario();
            user.setEmail("teste@empresa.com");
            user.setNome("Usuário Teste");
            user.setTipoUsuario(TipoUsuario.admin);
            user.setAtivo(true);

            // gera clienteId automático
            user.setClienteId(clienteIdCounter.getAndIncrement());

            // seta a senha hash existente
            user.setSenhaHash("$2a$10$YpTllmxeuFbH0G8zv7vZtuf4pB8iG5YchEpKU8VxLknac8W7vJHjK");

            usuarioRepository.save(user);
            System.out.println("✅ Usuário de teste criado: teste@empresa.com / senha já definida");
        }
    }
}
