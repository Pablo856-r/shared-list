package TFG.shared_list.controller;

import TFG.shared_list.model.Item;
import TFG.shared_list.service.ItemService;
import TFG.shared_list.websocket.ItemWebSocketHandler;
import TFG.shared_list.dto.ItemRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "*")
public class ItemController {

    @Autowired
    private ItemService itemService;

    // GET: Obtener todos los items
    @GetMapping
    public ResponseEntity<List<Item>> getAllItems() {
        List<Item> items = itemService.getAllItems();
        return ResponseEntity.ok(items);
    }

    // GET: Obtener un item por ID
    @GetMapping("/{id}")
    public ResponseEntity<Item> getItemById(@PathVariable Long id) {
        Optional<Item> item = itemService.getItemById(id);
        return item.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // POST: Crear un nuevo item
    @PostMapping
    public ResponseEntity<Item> createItem(@RequestBody ItemRequest itemRequest) {
        Item item = itemService.createItem(itemRequest.getText());
        
        // Notificar a todos los clientes vía WebSocket
        ItemWebSocketHandler.notifyAllClients("item_created", item);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(item);
    }

    // PUT: Actualizar un item
    @PutMapping("/{id}")
    public ResponseEntity<Item> updateItem(@PathVariable Long id, @RequestBody ItemRequest itemRequest) {
        Item itemDetails = new Item();
        itemDetails.setText(itemRequest.getText());
        itemDetails.setCompleted(itemRequest.getCompleted());
        
        Item updatedItem = itemService.updateItem(id, itemDetails);
        if (updatedItem != null) {
            // Notificar a todos los clientes vía WebSocket
            ItemWebSocketHandler.notifyAllClients("item_updated", updatedItem);
            return ResponseEntity.ok(updatedItem);
        }
        return ResponseEntity.notFound().build();
    }

    // DELETE: Eliminar un item
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        if (itemService.deleteItem(id)) {
            // Notificar a todos los clientes vía WebSocket
            ItemWebSocketHandler.notifyAllClients("item_deleted", id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // DELETE: Eliminar todos los items
    @DeleteMapping
    public ResponseEntity<Void> deleteAllItems() {
        itemService.deleteAllItems();
        // Notificar a todos los clientes vía WebSocket
        ItemWebSocketHandler.notifyAllClients("all_items_deleted", null);
        return ResponseEntity.noContent().build();
    }

    // PATCH: Cambiar el estado de completado
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Item> toggleItem(@PathVariable Long id) {
        Item updatedItem = itemService.toggleItemCompletion(id);
        if (updatedItem != null) {
            // Notificar a todos los clientes vía WebSocket
            ItemWebSocketHandler.notifyAllClients("item_toggled", updatedItem);
            return ResponseEntity.ok(updatedItem);
        }
        return ResponseEntity.notFound().build();
    }
}

