package TFG.shared_list.service;

import TFG.shared_list.model.Item;
import TFG.shared_list.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    // Obtener todos los items
    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    // Obtener un item por ID
    public Optional<Item> getItemById(Long id) {
        return itemRepository.findById(id);
    }

    // Crear un nuevo item
    public Item createItem(String text) {
        Item item = new Item(text);
        return itemRepository.save(item);
    }

    // Actualizar un item
    public Item updateItem(Long id, Item itemDetails) {
        Optional<Item> optionalItem = itemRepository.findById(id);
        if (optionalItem.isPresent()) {
            Item item = optionalItem.get();
            if (itemDetails.getText() != null) {
                item.setText(itemDetails.getText());
            }
            if (itemDetails.getCompleted() != null) {
                item.setCompleted(itemDetails.getCompleted());
            }
            return itemRepository.save(item);
        }
        return null;
    }

    // Eliminar un item
    public boolean deleteItem(Long id) {
        if (itemRepository.existsById(id)) {
            itemRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Eliminar todos los items
    public void deleteAllItems() {
        itemRepository.deleteAll();
    }

    // Marcar como completado
    public Item toggleItemCompletion(Long id) {
        Optional<Item> optionalItem = itemRepository.findById(id);
        if (optionalItem.isPresent()) {
            Item item = optionalItem.get();
            item.setCompleted(!item.getCompleted());
            return itemRepository.save(item);
        }
        return null;
    }
}
