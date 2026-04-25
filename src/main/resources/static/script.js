// Configuración de la API
const API_URL = 'http://localhost:8080/api/items';
const WS_URL = 'ws://localhost:8080/ws/items';

// WebSocket
let ws = null;
let wsReconnectAttempts = 0;
const MAX_WS_RECONNECT_ATTEMPTS = 5;

// DOM Elements
const itemInput = document.getElementById('itemInput');
const addBtn = document.getElementById('addBtn');
const clearBtn = document.getElementById('clearBtn');
const itemList = document.getElementById('itemList');
const emptyMessage = document.getElementById('emptyMessage');
const itemCount = document.getElementById('itemCount');

// Event Listeners
addBtn.addEventListener('click', addItem);
clearBtn.addEventListener('click', clearAllItems);
itemInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addItem();
    }
});

// Cargar items al iniciar y conectar WebSocket
document.addEventListener('DOMContentLoaded', () => {
    loadItems();
    connectWebSocket();
    // Refresco automático cada 2 segundos (fallback si WebSocket falla)
    setInterval(loadItems, 2000);
});

// ============================================
// CONEXIÓN WEBSOCKET
// ============================================

function connectWebSocket() {
    try {
        ws = new WebSocket(WS_URL);

        ws.onopen = () => {
            console.log('✅ WebSocket conectado');
            wsReconnectAttempts = 0; // Reset contador
            showSuccessNotification('🌐 Conectado en tiempo real');
        };

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                const action = message.action;
                const data = message.data;

                console.log('📨 Mensaje WebSocket recibido:', action, data);

                // Procesar acciones
                switch (action) {
                    case 'item_created':
                        handleItemCreated(data);
                        break;
                    case 'item_updated':
                        handleItemUpdated(data);
                        break;
                    case 'item_deleted':
                        handleItemDeleted(data);
                        break;
                    case 'item_toggled':
                        handleItemToggled(data);
                        break;
                    case 'all_items_deleted':
                        handleAllItemsDeleted();
                        break;
                    default:
                        console.log('Acción desconocida:', action);
                }
            } catch (error) {
                console.error('Error procesando mensaje WebSocket:', error);
            }
        };

        ws.onerror = (error) => {
            console.error('❌ Error WebSocket:', error);
        };

        ws.onclose = () => {
            console.log('❌ WebSocket desconectado');
            
            // Intentar reconectar
            if (wsReconnectAttempts < MAX_WS_RECONNECT_ATTEMPTS) {
                wsReconnectAttempts++;
                const delay = Math.min(1000 * Math.pow(2, wsReconnectAttempts), 10000);
                console.log(`🔄 Reconectando WebSocket en ${delay}ms...`);
                setTimeout(connectWebSocket, delay);
            } else {
                showErrorNotification('⚠️ Desconectado. Funciona sin actualizaciones en tiempo real.');
            }
        };
    } catch (error) {
        console.error('Error al conectar WebSocket:', error);
        setTimeout(connectWebSocket, 3000);
    }
}

// ============================================
// MANEJADORES DE EVENTOS WEBSOCKET
// ============================================

function handleItemCreated(item) {
    addItemToDOM(item);
    const currentCount = itemList.children.length;
    updateItemCount(currentCount);
    updateEmptyMessage(false);
}

function handleItemUpdated(item) {
    updateItemInDOM(item);
}

function handleItemToggled(item) {
    updateItemInDOM(item);
}

function handleItemDeleted(id) {
    const element = document.getElementById(`item-${id}`);
    if (element) {
        element.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            element.remove();
            const currentCount = itemList.children.length;
            updateItemCount(currentCount);
            updateEmptyMessage(currentCount === 0);
        }, 300);
    }
}

function handleAllItemsDeleted() {
    itemList.innerHTML = '';
    updateItemCount(0);
    updateEmptyMessage(true);
}

// ============================================
// FUNCIONES PRINCIPALES
// ============================================

async function loadItems() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al cargar items');
        
        const items = await response.json();
        
        // Solo actualizar si hay cambios
        const currentIds = new Set(Array.from(itemList.children).map(li => parseInt(li.id.replace('item-', ''))));
        const newIds = new Set(items.map(item => item.id));
        
        // Si las IDs son iguales, no hacer nada (evita parpadeos)
        if (JSON.stringify(Array.from(currentIds).sort()) === JSON.stringify(Array.from(newIds).sort())) {
            return;
        }
        
        // Limpiar y reconstruir
        itemList.innerHTML = '';
        items.forEach(item => {
            addItemToDOM(item);
        });
        
        updateItemCount(items.length);
        updateEmptyMessage(items.length === 0);
        
        if (items.length > 0) {
            console.log('✅ Items cargados:', items.length);
        }
    } catch (error) {
        console.error('❌ Error al cargar items:', error);
    }
}

async function addItem() {
    const text = itemInput.value.trim();
    
    if (!text) {
        showErrorNotification('❌ Por favor ingresa un elemento');
        return;
    }
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text })
        });
        
        if (!response.ok) throw new Error('Error al crear item');
        
        const newItem = await response.json();
        itemInput.value = '';
        itemInput.focus();
        
        // Agregar a la UI inmediatamente (no esperar a WebSocket)
        addItemToDOM(newItem);
        const currentCount = itemList.children.length;
        updateItemCount(currentCount);
        updateEmptyMessage(false);
        showSuccessNotification('✅ Elemento añadido');
        
        console.log('✅ Item añadido:', newItem);
    } catch (error) {
        console.error('❌ Error al añadir item:', error);
        showErrorNotification('Error al añadir elemento');
    }
}

async function deleteItem(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Error al eliminar item');
        
        // Remover del DOM inmediatamente
        const element = document.getElementById(`item-${id}`);
        if (element) {
            element.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                element.remove();
                const currentCount = itemList.children.length;
                updateItemCount(currentCount);
                updateEmptyMessage(currentCount === 0);
            }, 300);
        }
        
        console.log('✅ Item eliminado:', id);
    } catch (error) {
        console.error('❌ Error al eliminar item:', error);
        showErrorNotification('Error al eliminar elemento');
    }
}

async function toggleItemCompletion(id) {
    try {
        const response = await fetch(`${API_URL}/${id}/toggle`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (!response.ok) throw new Error('Error al actualizar item');
        
        const updatedItem = await response.json();
        // Actualizar UI inmediatamente
        updateItemInDOM(updatedItem);
        
        console.log('✅ Item actualizado:', updatedItem);
    } catch (error) {
        console.error('❌ Error al actualizar item:', error);
        showErrorNotification('Error al actualizar elemento');
    }
}

async function clearAllItems() {
    if (!confirm('⚠️ ¿Estás seguro de que quieres eliminar TODOS los elementos?')) {
        return;
    }
    
    try {
        const response = await fetch(API_URL, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Error al limpiar lista');
        
        itemList.innerHTML = '';
        updateItemCount(0);
        updateEmptyMessage(true);
        showSuccessNotification('🧹 Lista limpiada');
        
        console.log('✅ Lista limpiada');
    } catch (error) {
        console.error('❌ Error al limpiar lista:', error);
        showErrorNotification('Error al limpiar la lista');
    }
}

// ============================================
// FUNCIONES DE MANIPULACIÓN DEL DOM
// ============================================

function addItemToDOM(item) {
    // Evitar duplicados
    if (document.getElementById(`item-${item.id}`)) {
        return;
    }
    
    const li = document.createElement('li');
    li.id = `item-${item.id}`;
    li.className = `item-row ${item.completed ? 'completed' : ''}`;
    
    li.innerHTML = `
        <div class="item-content">
            <input 
                type="checkbox" 
                class="item-checkbox" 
                ${item.completed ? 'checked' : ''}
                onchange="toggleItemCompletion(${item.id})"
            >
            <span class="item-text">${escapeHtml(item.text)}</span>
        </div>
        <div class="item-meta">
            <small>${formatDate(item.createdAt)}</small>
            <button class="delete-btn" onclick="deleteItem(${item.id})">🗑️</button>
        </div>
    `;
    
    li.style.animation = 'slideIn 0.3s ease';
    itemList.appendChild(li);
}

function updateItemInDOM(item) {
    const li = document.getElementById(`item-${item.id}`);
    if (li) {
        li.classList.toggle('completed', item.completed);
        const checkbox = li.querySelector('.item-checkbox');
        if (checkbox) {
            checkbox.checked = item.completed;
        }
    }
}

function updateItemCount(count) {
    itemCount.textContent = `${count} ${count === 1 ? 'elemento' : 'elementos'}`;
}

function updateEmptyMessage(isEmpty) {
    emptyMessage.style.display = isEmpty ? 'block' : 'none';
}

// ============================================
// FUNCIONES DE UTILIDAD
// ============================================

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES') + ' ' + date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showSuccessNotification(message) {
    showNotification(message, 'success');
}

function showErrorNotification(message) {
    showNotification(message, 'error');
}

function showNotification(message, type) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.display = 'block';
    
    // Agregar al body
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

