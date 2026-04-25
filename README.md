# 📝 Lista Compartida - Shared List

Una aplicación web de lista de compras compartida en tiempo real construida con Spring Boot, H2 y WebSockets.

## 🚀 Características

- ✅ Lista compartida en tiempo real
- ✅ Interfaz web responsive
- ✅ Base de datos H2 integrada
- ✅ WebSockets para actualizaciones en vivo
- ✅ API REST completa
- ✅ Desplegable en la nube

## 🛠️ Tecnologías

- **Backend**: Java 21 + Spring Boot
- **Base de datos**: H2 Database
- **Frontend**: HTML + JavaScript (Vanilla)
- **Tiempo real**: WebSockets
- **Despliegue**: Docker + Render

## 📦 Instalación Local

### Prerrequisitos
- Java 21
- Maven 3.6+

### Ejecutar
```bash
# Clonar el repositorio
git clone <tu-repo>
cd shared-list

# Compilar y ejecutar
mvn clean package
mvn spring-boot:run
```

Accede a: `http://localhost:8080`

## ☁️ Despliegue en Render

### Paso 1: Preparar el proyecto
El proyecto ya está configurado con:
- ✅ Configuración de producción
- ✅ Variables de entorno
- ✅ Archivo render.yaml

### Paso 2: Crear cuenta en Render
1. Ve a [render.com](https://render.com)
2. Regístrate con GitHub/GitLab

### Paso 3: Conectar tu repositorio
1. Haz push de tu código a GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/shared-list.git
   git push -u origin main
   ```

2. En Render, haz clic en "New +" → "Web Service"
3. Conecta tu repositorio de GitHub

### Paso 4: Configurar el servicio
- **Name**: `shared-list` (o el que prefieras)
- **Runtime**: `Java`
- **Build Command**: `mvn clean package -DskipTests`
- **Start Command**: `java -jar target/shared-list-0.0.1-SNAPSHOT.jar`

### Paso 5: Variables de entorno
Agrega estas variables:
- `PORT`: `8080`
- `JAVA_OPTS`: `-Xmx512m -Xms256m`

### Paso 6: Desplegar
Haz clic en "Create Web Service" y espera a que se despliegue (5-10 minutos).

### Paso 7: ¡Listo!
Render te dará una URL como: `https://shared-list.onrender.com`

## 🔧 Despliegue Manual (Alternativo)

Si prefieres desplegar manualmente:

```bash
# Compilar
mvn clean package -DskipTests

# Ejecutar
java -jar target/shared-list-0.0.1-SNAPSHOT.jar
```

## 🔗 Endpoints API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/items` | Obtener todos los items |
| POST | `/api/items` | Crear nuevo item |
| PUT | `/api/items/{id}` | Actualizar item |
| DELETE | `/api/items/{id}` | Eliminar item |
| PATCH | `/api/items/{id}/toggle` | Marcar completado |

## 📱 Uso

1. Abre la aplicación en tu navegador
2. Añade elementos escribiendo y presionando Enter
3. Marca elementos como completados con el checkbox
4. Elimina elementos con el botón 🗑️
5. Comparte la URL con otros usuarios

## 🗄️ Base de datos

- **Producción**: Archivo H2 persistente (`./data/shared-list-db`)
- **Desarrollo**: Memoria H2
- **Consola H2**: Solo disponible en desarrollo

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Añade nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

Desarrollado con ❤️ usando Spring Boot