package TFG.shared_list.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.socket.*;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class ItemWebSocketHandler implements WebSocketHandler {

    // Almacena todas las sesiones conectadas
    private static final Set<WebSocketSession> sessions = Collections.synchronizedSet(new HashSet<>());
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
        System.out.println("✅ WebSocket conectado: " + session.getId());
        System.out.println("📊 Usuarios conectados: " + sessions.size());
    }

    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
        String payload = (String) message.getPayload();
        System.out.println("📨 Mensaje recibido: " + payload);
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        System.err.println("❌ Error en WebSocket: " + exception.getMessage());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {
        sessions.remove(session);
        System.out.println("❌ WebSocket desconectado: " + session.getId());
        System.out.println("📊 Usuarios conectados: " + sessions.size());
    }

    @Override
    public boolean supportsPartialMessages() {
        return false;
    }

    // Método estático para notificar a todos los clientes
    public static void notifyAllClients(String action, Object data) {
        try {
            Map<String, Object> notification = new HashMap<>();
            notification.put("action", action);
            notification.put("data", data);
            
            String message = objectMapper.writeValueAsString(notification);

            for (WebSocketSession session : sessions) {
                if (session.isOpen()) {
                    try {
                        session.sendMessage(new TextMessage(message));
                    } catch (Exception e) {
                        System.err.println("❌ Error enviando mensaje: " + e.getMessage());
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("❌ Error serializando mensaje: " + e.getMessage());
        }
    }

    // Método para obtener número de clientes conectados
    public static int getConnectedClientsCount() {
        return sessions.size();
    }
}

