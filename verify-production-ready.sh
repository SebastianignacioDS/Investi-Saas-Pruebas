#!/bin/bash

# Script de verificación para deployment de Investï
# Verifica que todos los archivos estén listos para producción

echo "🔍 Verificando que el proyecto esté listo para producción..."
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

errors=0
warnings=0

# Función para verificar archivos
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $1 existe"
    else
        echo -e "${RED}❌${NC} $1 NO ENCONTRADO"
        ((errors++))
    fi
}

# Función para verificar que NO contenga texto
check_not_contains() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "${RED}❌${NC} $1 todavía contiene '$2'"
        ((errors++))
    else
        echo -e "${GREEN}✅${NC} $1 NO contiene '$2'"
    fi
}

echo "📂 Verificando estructura de archivos..."
echo ""

# Verificar que las imágenes existan
echo "📸 Imágenes en /public/images/:"
check_file "public/images/logo.png"
check_file "public/images/bg-login.png"
check_file "public/images/banner-dashboard.png"
echo ""

# Verificar componentes
echo "🔧 Componentes actualizados:"
check_file "src/app/components/Sidebar.tsx"
check_file "src/app/components/Login.tsx"
check_file "src/app/components/Register.tsx"
check_file "src/app/components/ResetPassword.tsx"
check_file "src/app/components/Dashboard.tsx"
echo ""

# Verificar que NO haya referencias a figma:asset
echo "🚫 Verificando que NO haya referencias a figma:asset..."
check_not_contains "src/app/components/Sidebar.tsx" "figma:asset"
check_not_contains "src/app/components/Login.tsx" "figma:asset"
check_not_contains "src/app/components/Register.tsx" "figma:asset"
check_not_contains "src/app/components/ResetPassword.tsx" "figma:asset"
check_not_contains "src/app/components/Dashboard.tsx" "figma:asset"
echo ""

# Verificar que SÍ contengan las rutas correctas
echo "✅ Verificando rutas correctas a /images/..."
if grep -q "/images/logo.png" "src/app/components/Sidebar.tsx"; then
    echo -e "${GREEN}✅${NC} Sidebar.tsx usa /images/logo.png"
else
    echo -e "${RED}❌${NC} Sidebar.tsx NO usa /images/logo.png"
    ((errors++))
fi

if grep -q "/images/logo.png" "src/app/components/Login.tsx" && grep -q "/images/bg-login.png" "src/app/components/Login.tsx"; then
    echo -e "${GREEN}✅${NC} Login.tsx usa /images/logo.png y /images/bg-login.png"
else
    echo -e "${RED}❌${NC} Login.tsx NO usa las rutas correctas"
    ((errors++))
fi

if grep -q "/images/logo.png" "src/app/components/Register.tsx" && grep -q "/images/bg-login.png" "src/app/components/Register.tsx"; then
    echo -e "${GREEN}✅${NC} Register.tsx usa /images/logo.png y /images/bg-login.png"
else
    echo -e "${RED}❌${NC} Register.tsx NO usa las rutas correctas"
    ((errors++))
fi

if grep -q "/images/logo.png" "src/app/components/ResetPassword.tsx" && grep -q "/images/bg-login.png" "src/app/components/ResetPassword.tsx"; then
    echo -e "${GREEN}✅${NC} ResetPassword.tsx usa /images/logo.png y /images/bg-login.png"
else
    echo -e "${RED}❌${NC} ResetPassword.tsx NO usa las rutas correctas"
    ((errors++))
fi
echo ""

# Resumen final
echo "======================================"
echo ""
if [ $errors -eq 0 ]; then
    echo -e "${GREEN}🎉 ¡TODO LISTO PARA PRODUCCIÓN!${NC}"
    echo ""
    echo "Próximos pasos:"
    echo "1. git add ."
    echo "2. git commit -m 'Add production images and update code'"
    echo "3. git push origin main"
    echo "4. Deploy en Vercel/Netlify"
else
    echo -e "${RED}⚠️  ERRORES ENCONTRADOS: $errors${NC}"
    echo ""
    echo "Por favor, corrige los errores antes de hacer deployment."
    echo "Revisa el archivo /FIX_VERCEL_BUILD.md para más información."
fi

echo ""
echo "======================================"

exit $errors