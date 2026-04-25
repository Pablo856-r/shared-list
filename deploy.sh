#!/bin/bash

echo "🚀 Desplegando Shared List a Render..."

# Verificar que estamos en el directorio correcto
if [ ! -f "pom.xml" ]; then
    echo "❌ Error: Ejecuta este script desde el directorio raíz del proyecto"
    exit 1
fi

# Verificar que tenemos git
if ! command -v git &> /dev/null; then
    echo "❌ Error: Git no está instalado"
    exit 1
fi

# Verificar que tenemos un repositorio git
if [ ! -d ".git" ]; then
    echo "📝 Inicializando repositorio git..."
    git init
    git add .
    git commit -m "Initial commit - Shared List App"
fi

echo "✅ Proyecto listo para despliegue"
echo ""
echo "📋 Pasos manuales que debes seguir:"
echo ""
echo "1. Crea una cuenta en https://render.com"
echo "2. Crea un nuevo repositorio en GitHub"
echo "3. Sube tu código:"
echo "   git remote add origin https://github.com/TU-USUARIO/TU-REPO.git"
echo "   git push -u origin main"
echo ""
echo "4. En Render:"
echo "   - New → Web Service"
echo "   - Conecta tu repo de GitHub"
echo "   - Runtime: Java"
echo "   - Build Command: mvn clean package -DskipTests"
echo "   - Start Command: java -jar target/shared-list-0.0.1-SNAPSHOT.jar"
echo "   - Variables: PORT=8080, JAVA_OPTS=-Xmx512m -Xms256m"
echo ""
echo "🎉 ¡Tu app estará disponible en una URL de Render!"