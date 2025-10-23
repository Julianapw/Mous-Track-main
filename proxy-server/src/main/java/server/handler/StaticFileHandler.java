// server/handler/StaticFileHandler.java
package server.handler;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class StaticFileHandler implements HttpHandler {
    private final Path basePath;

    public StaticFileHandler(String baseDir) {
        this.basePath = Paths.get(baseDir).toAbsolutePath();
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String requestedPath = exchange.getRequestURI().getPath();

        // Se a requisição for "/", retorna o index.html
        if (requestedPath.equals("/")) {
            requestedPath = "C:\\Mous-Track-main\\frontend\\index.html";
        }

        Path filePath = basePath.resolve("." + requestedPath).normalize();

        if (!filePath.startsWith(basePath) || !Files.exists(filePath)) {
            String notFound = "404 - Página não encontrada";
            exchange.sendResponseHeaders(404, notFound.getBytes().length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(notFound.getBytes());
            }
            return;
        }

        String contentType = Files.probeContentType(filePath);
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        byte[] fileBytes = Files.readAllBytes(filePath);
        exchange.getResponseHeaders().set("Content-Type", contentType);
        exchange.sendResponseHeaders(200, fileBytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(fileBytes);
        }
    }
}
