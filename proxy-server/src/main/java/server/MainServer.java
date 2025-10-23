package server;

import com.sun.net.httpserver.HttpServer;
import server.handler.ProxyHandler;
import server.handler.RootHandler;
import server.handler.StaticFileHandler;

import java.io.IOException;
import java.net.InetSocketAddress;

public class MainServer {
    public static void main(String[] args) {
        try {
            // Porta do proxy
            int port = 8088;

            // URL base do backend Spring Boot - Adicionada variável backendBase (padrão http://localhost:8080).
            String backendBase = System.getenv().getOrDefault("BACKEND_BASE", "http://localhost:8080");

            HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);

            // rota simples de teste
            server.createContext("/ping", new RootHandler());

            // rota que repassa /api/* para o backend - Cria contexto /api com new ProxyHandler(backendBase) para repassar chamadas.
            server.createContext("/api", new ProxyHandler(backendBase));

            // 🔹 Serve o frontend (ajuste o caminho abaixo conforme sua pasta real)
            server.createContext("/", new StaticFileHandler("C:\\Mous-Track-main\\frontend"));

            // executor (pool de threads) - Usa thread pool (8 threads).
            server.setExecutor(java.util.concurrent.Executors.newFixedThreadPool(8));
            server.start();

            System.out.println("Proxy rodando em http://localhost:" + port);
            System.out.println("Frontend servido de: ../frontend/");
            System.out.println("Encaminhando requisições para backend: " + backendBase);

        } catch (IOException e) {
            System.err.println("Erro ao iniciar servidor: " + e.getMessage());
        }
    }
}
