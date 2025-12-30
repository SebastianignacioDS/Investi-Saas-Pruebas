# 📸 Imágenes de Investï - Instrucciones de Deployment

## ✅ COMPLETADO: Migración a producción

Todas las referencias de `figma:asset` han sido actualizadas exitosamente a rutas estáticas `/images/`.

---

## 📂 Imágenes requeridas para producción

Coloca las siguientes 3 imágenes en esta carpeta (`/public/images/`):

### 1. **logo.png**
- **Descripción:** Logo de Investï
- **Usado en:** Sidebar, Login, Register, ResetPassword
- **Origen (Figma Make):** `ef832f539e0c42b27ec4656b57c8f88b1e7d4023.png`

### 2. **bg-login.png**
- **Descripción:** Fondo dorado para pantallas de autenticación
- **Usado en:** Login, Register, ResetPassword
- **Origen (Figma Make):** `0d94f8ce02ac8f361a50e911a60e7cd753ce9a69.png`

### 3. **banner-dashboard.png**
- **Descripción:** Banner del dashboard (opcional, actualmente no usado)
- **Origen (Figma Make):** `a3809b4f7369643e6b428ec3e76fecc532e3812b.png`

---

## 🔄 Cómo obtener las imágenes desde Figma Make

### **Método 1: DevTools (Recomendado)**

1. Abre tu app en Figma Make en el navegador
2. Presiona `F12` para abrir DevTools
3. Ve a la pestaña **Network** (Red)
4. Filtra por `png`
5. Recarga la página (`F5`)
6. Busca las 3 imágenes por su ID
7. Click derecho → **Open in new tab**
8. Click derecho en la imagen → **Guardar imagen como...**
9. Renombra según la tabla arriba

### **Método 2: Inspeccionar elemento**

1. Click derecho en una imagen → **Inspeccionar**
2. Copia la URL de la imagen desde el HTML
3. Pégala en una nueva pestaña
4. Guarda la imagen con el nombre correcto

---

## ✅ Verificación

Una vez colocadas las 3 imágenes en `/public/images/`, tu estructura debe verse así:

```
/public/
  └── images/
      ├── logo.png ✅
      ├── bg-login.png ✅
      ├── banner-dashboard.png ✅ (opcional)
      ├── README.md (este archivo)
      └── INSTRUCCIONES.md
```

---

## 🚀 Componentes actualizados

Los siguientes componentes ya usan rutas estáticas:

- ✅ `/src/app/components/Sidebar.tsx` → `/images/logo.png`
- ✅ `/src/app/components/Login.tsx` → `/images/logo.png` + `/images/bg-login.png`
- ✅ `/src/app/components/Register.tsx` → `/images/logo.png` + `/images/bg-login.png`
- ✅ `/src/app/components/ResetPassword.tsx` → `/images/logo.png` + `/images/bg-login.png`
- ✅ `/src/app/components/Dashboard.tsx` → (Banner no usado actualmente)

---

## 🎯 Próximos pasos para deployment

1. ✅ Colocar las 3 imágenes en `/public/images/`
2. ✅ Verificar que todas las imágenes cargan correctamente localmente
3. ✅ Hacer commit y push a tu repositorio
4. ✅ Desplegar en tu plataforma de hosting (Vercel, Netlify, etc.)
5. ✅ Verificar que las imágenes carguen en producción

---

## ⚠️ Notas importantes

- **NO** modifiques las rutas en el código (ya están listas para producción)
- **NO** uses subdirectorios dentro de `/public/images/` (las rutas apuntan directamente a `/images/`)
- Las imágenes deben estar en formato **PNG** o **JPG**
- Los nombres de archivo deben ser **exactamente** como se muestran arriba (en minúsculas)

---

## 🆘 Troubleshooting

**Problema:** Las imágenes no cargan en Figma Make después de los cambios

**Solución:** Esto es normal. Las referencias `figma:asset` solo funcionan en Figma Make. Para volver a trabajar en Figma Make, revierte los cambios temporalmente. Los cambios actuales son para **producción**.

**Problema:** Las imágenes no cargan en producción

**Solución:** Verifica que:
1. Las imágenes estén en `/public/images/` (no en `/src/`)
2. Los nombres de archivo sean exactos (case-sensitive en algunos servidores)
3. El build haya incluido la carpeta `/public/` correctamente

---

**Última actualización:** 30 de diciembre de 2025
**Estado:** ✅ Listo para producción