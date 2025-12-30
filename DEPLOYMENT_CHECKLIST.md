# ✅ Checklist de Deployment - Investï

## 🎯 Estado Actual: LISTO PARA PRODUCCIÓN

Todas las referencias de imágenes han sido migradas de `figma:asset` a rutas estáticas `/images/`.

---

## 📋 PASOS PARA DEPLOYMENT

### **Paso 1: Obtener las imágenes desde Figma Make** ⏳

Tienes las 3 imágenes guardadas en tu computadora. Ahora **cópialas a la carpeta del proyecto**:

```bash
# Estructura que debes crear:
tu-proyecto/
└── public/
    └── images/
        ├── logo.png              ← Imagen del logo
        ├── bg-login.png          ← Fondo dorado
        └── banner-dashboard.png  ← Banner (opcional)
```

**Nombres exactos (case-sensitive):**
- ✅ `logo.png` (todo en minúsculas)
- ✅ `bg-login.png` (todo en minúsculas)
- ✅ `banner-dashboard.png` (todo en minúsculas)

---

### **Paso 2: Verificar localmente** ⏳

```bash
# Inicia el servidor de desarrollo
npm run dev

# Verifica que todas las pantallas muestren las imágenes:
# 1. Pantalla de Login → Logo + Fondo ✅
# 2. Pantalla de Registro → Logo + Fondo ✅
# 3. Pantalla de Reset Password → Logo + Fondo ✅
# 4. Sidebar → Logo ✅
```

---

### **Paso 3: Commit y Push** ⏳

```bash
git add .
git commit -m "feat: Migrar imágenes a producción - Listo para deployment"
git push origin main
```

---

### **Paso 4: Deploy a producción** ⏳

**Opción A: Vercel (Recomendado)**
1. Ve a [vercel.com](https://vercel.com)
2. Conecta tu repositorio de GitHub
3. Click en "Deploy"
4. Espera a que termine el build
5. Verifica que las imágenes carguen correctamente

**Opción B: Netlify**
1. Ve a [netlify.com](https://netlify.com)
2. Arrastra la carpeta del proyecto o conecta GitHub
3. Configuración de build:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Click en "Deploy"

**Opción C: GitHub Pages**
```bash
npm run build
# Sube la carpeta dist/ a la rama gh-pages
```

---

## ✅ Componentes actualizados

Todos estos componentes **YA ESTÁN LISTOS** para producción:

| Componente | Cambio realizado | Estado |
|------------|------------------|--------|
| **Sidebar.tsx** | `figma:asset` → `/images/logo.png` | ✅ Listo |
| **Login.tsx** | `figma:asset` → `/images/logo.png` + `/images/bg-login.png` | ✅ Listo |
| **Register.tsx** | `figma:asset` → `/images/logo.png` + `/images/bg-login.png` | ✅ Listo |
| **ResetPassword.tsx** | `figma:asset` → `/images/logo.png` + `/images/bg-login.png` | ✅ Listo |
| **Dashboard.tsx** | Removido import no usado | ✅ Listo |

---

## 📊 Resumen de cambios

### **Antes (Figma Make):**
```tsx
import logo from 'figma:asset/ef832f539e0c42b27ec4656b57c8f88b1e7d4023.png';
import bgImage from 'figma:asset/0d94f8ce02ac8f361a50e911a60e7cd753ce9a69.png';
```

### **Ahora (Producción):**
```tsx
// Los imports fueron eliminados
// Las imágenes se usan directamente en el HTML:
<img src="/images/logo.png" alt="Logo" />
<div style={{ backgroundImage: 'url(/images/bg-login.png)' }}></div>
```

---

## ⚠️ IMPORTANTE: Entorno dual

### **En Figma Make (desarrollo):**
- ❌ Las imágenes **NO cargarán** porque ya no usan `figma:asset`
- ✅ Esto es **ESPERADO** - los cambios son para producción

### **En producción (Vercel/Netlify):**
- ✅ Las imágenes **SÍ cargarán** desde `/public/images/`
- ✅ La app funcionará completamente

### **Si necesitas volver a Figma Make temporalmente:**
```bash
# Revierte los cambios temporalmente
git stash

# Trabaja en Figma Make...

# Recupera los cambios de producción
git stash pop
```

---

## 🔍 Verificación post-deployment

Una vez desplegado, verifica:

- [ ] El logo aparece en el Sidebar
- [ ] El logo aparece en Login
- [ ] El fondo dorado aparece en Login
- [ ] El logo aparece en Registro
- [ ] El fondo dorado aparece en Registro
- [ ] El logo aparece en Reset Password
- [ ] El fondo dorado aparece en Reset Password
- [ ] No hay errores 404 en la consola del navegador
- [ ] Las imágenes se ven nítidas y no pixeladas

---

## 🆘 Troubleshooting

### **Problema: Imágenes no cargan en producción**

**Causas comunes:**
1. ❌ Las imágenes no están en `/public/images/`
2. ❌ Los nombres de archivo tienen mayúsculas (`Logo.png` en vez de `logo.png`)
3. ❌ El build no incluyó la carpeta `/public/`

**Solución:**
```bash
# Verifica que las imágenes existan
ls -la public/images/

# Deberías ver:
# logo.png
# bg-login.png
# banner-dashboard.png
```

### **Problema: Error 404 en las imágenes**

**Solución:**
- Verifica que la plataforma de hosting esté sirviendo la carpeta `/public/`
- En Vercel/Netlify, esto debería ser automático
- Verifica la configuración de "Static Assets" en tu plataforma

---

## 📞 Soporte

Si tienes problemas:
1. Revisa la consola del navegador (F12 → Console)
2. Revisa la pestaña Network para ver qué URLs están fallando
3. Verifica que las imágenes estén en la ubicación correcta

---

**Estado:** ✅ LISTO PARA DEPLOYMENT  
**Última actualización:** 30 de diciembre de 2025  
**Próximo paso:** Colocar las 3 imágenes en `/public/images/` y hacer deployment
