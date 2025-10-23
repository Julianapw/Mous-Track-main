package server.handler;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;

/**
 * Handler responsável por redirecionar todas as requisições /api/*
 * para o backend (ex: http://localhost:8080/api/*),
 * ou responder com dados simulados (mock) se o backend não existir.
 */
public class ProxyHandler implements HttpHandler {

    private final HttpClient client;
    private final String backendBase;

    public ProxyHandler(String backendBase) {
        this.backendBase = backendBase;
        this.client = HttpClient.newBuilder()
                .followRedirects(HttpClient.Redirect.NORMAL)
                .build();
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        try {
            // 🔹 Tratamento de requisições OPTIONS (CORS preflight)
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                addCorsHeaders(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            String path = exchange.getRequestURI().getPath();

            // =====================================================
            // 🔹 MOCK: responde manualmente sem backend
            // =====================================================
            if (path.startsWith("/api/teste")) {
                addCorsHeaders(exchange);
                String mockJson = """
                    {
                      "status": "ok",
                      "mensagem": "Backend simulado com sucesso!",
                      "dados": [1, 2, 3]
                    }
                    """;
                byte[] body = mockJson.getBytes();
                exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
                exchange.sendResponseHeaders(200, body.length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(body);
                }
                return;
            }

            // =====================================================
            // 🔹 Caso contrário, tenta encaminhar pro backend real
            // =====================================================
            String targetUrl = backendBase + exchange.getRequestURI().toString();

            // 🧩 LOG DE DEPURAÇÃO
            System.out.println("➡ Encaminhando para backend: " + targetUrl);

            HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()
                    .uri(URI.create(targetUrl))
                    .method(exchange.getRequestMethod(), getRequestBody(exchange));

            copyHeaders(exchange.getRequestHeaders(), requestBuilder);

            HttpResponse<InputStream> backendResponse = client.send(requestBuilder.build(),
                    HttpResponse.BodyHandlers.ofInputStream());

            // 🧩 LOG DE RESPOSTA DO BACKEND
            System.out.println("✅ Resposta do backend: " + backendResponse.statusCode());

            sendResponse(exchange, backendResponse);

        } catch (InterruptedException e) {
            e.printStackTrace();
            exchange.sendResponseHeaders(500, -1);
        } catch (Exception e) {
            // 🔹 Se o backend não estiver rodando, devolve uma mensagem padrão
            addCorsHeaders(exchange);
            String msg = "{\"erro\": \"Backend indisponível ou não configurado\"}";
            byte[] body = msg.getBytes();
            exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
            exchange.sendResponseHeaders(502, body.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(body);
            }

            // 🧩 LOG DE ERRO — MOSTRA O MOTIVO CASO FALHE
            System.err.println("❌ Erro ao encaminhar requisição para o backend (" + backendBase + "): " + e.getMessage());
        } finally {
            exchange.close();
        }
    }

    // =============================================================
    // Métodos auxiliares
    // =============================================================

    private static HttpRequest.BodyPublisher getRequestBody(HttpExchange exchange) throws IOException {
        InputStream body = exchange.getRequestBody();
        byte[] bytes = body.readAllBytes();
        if (bytes.length == 0) return HttpRequest.BodyPublishers.noBody();
        return HttpRequest.BodyPublishers.ofByteArray(bytes);
    }

    // ✅ CORREÇÃO AQUI: ignora headers restritos
    private static void copyHeaders(Map<String, List<String>> sourceHeaders, HttpRequest.Builder target) {
        sourceHeaders.forEach((key, values) -> {
            if (!key.equalsIgnoreCase("Host")
                    && !key.equalsIgnoreCase("Content-Length")
                    && !key.equalsIgnoreCase("Connection") // ⬅️ ADICIONADO
                    && !key.equalsIgnoreCase("Keep-Alive")
                    && !key.equalsIgnoreCase("Transfer-Encoding")
                    && !key.equalsIgnoreCase("Upgrade")) {
                for (String v : values) {
                    target.header(key, v);
                }
            }
        });
    }

    private static void sendResponse(HttpExchange exchange, HttpResponse<InputStream> backendResponse) throws IOException {
        addCorsHeaders(exchange);
        backendResponse.headers().map().forEach((key, values) -> {
            if (!key.equalsIgnoreCase("transfer-encoding")) {
                for (String v : values) exchange.getResponseHeaders().add(key, v);
            }
        });

        byte[] body = backendResponse.body().readAllBytes();
        exchange.sendResponseHeaders(backendResponse.statusCode(), body.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(body);
        }
    }

    private static void addCorsHeaders(HttpExchange exchange) {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type,Authorization");
    }
}
