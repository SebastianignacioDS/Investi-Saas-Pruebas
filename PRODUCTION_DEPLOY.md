# 🚀 Guía de Deploy a Producción - Investï

## Paso 1️⃣: Preparar las Imágenes

### Descargar imágenes de Figma Make:
1. Abre tu proyecto en Figma Make
2. Busca los assets que estás usando (con IDs `figma:asset/...`)
3. Descárgalos a tu computadora

### Subir a GitHub:
```bash
# Opción A: Desde la terminal
git clone tu-repositorio
cd tu-repositorio
cp /ruta/descarga/logo.png public/images/logo.png
cp /ruta/descarga/background.png public/images/bg-login.png
cp /ruta/descarga/banner.png public/images/banner-dashboard.png

git add public/images/
git commit -m "Add production images"
git push
```

**Opción B: Desde GitHub Web:**
1. Ve a GitHub.com → Tu repositorio
2. Navega a `public/images/`
3. Click "Add file" → "Upload files"
4. Arrastra las 3 imágenes
5. Commit

---

## Paso 2️⃣: Actualizar el Código

Reemplaza las referencias `figma:asset` por rutas de `/public/images/`:

### **Sidebar.tsx**
```tsx
// ❌ ANTES:
import logo from 'figma:asset/ef832f539e0c42b27ec4656b57c8f88b1e7d4023.png';

// ✅ DESPUÉS:
const logo = '/images/logo.png';
```

### **Login.tsx**
```tsx
// ❌ ANTES:
import logo from 'figma:asset/ef832f539e0c42b27ec4656b57c8f88b1e7d4023.png';
import bgImage from 'figma:asset/0d94f8ce02ac8f361a50e911a60e7cd753ce9a69.png';

// ✅ DESPUÉS:
const logo = '/images/logo.png';
const bgImage = '/images/bg-login.png';
```

### **Register.tsx**
```tsx
// ❌ ANTES:
import logo from 'figma:asset/ef832f539e0c42b27ec4656b57c8f88b1e7d4023.png';
import bgImage from 'figma:asset/0d94f8ce02ac8f361a50e911a60e7cd753ce9a69.png';

// ✅ DESPUÉS:
const logo = '/images/logo.png';
const bgImage = '/images/bg-login.png';
```

### **ResetPassword.tsx**
```tsx
// ❌ ANTES:
import logo from 'figma:asset/ef832f539e0c42b27ec4656b57c8f88b1e7d4023.png';
import bgImage from 'figma:asset/0d94f8ce02ac8f361a50e911a60e7cd753ce9a69.png';

// ✅ DESPUÉS:
const logo = '/images/logo.png';
const bgImage = '/images/bg-login.png';
```

### **Dashboard.tsx**
```tsx
// ❌ ANTES:
import bannerBg from 'figma:asset/a3809b4f7369643e6b428ec3e76fecc532e3812b.png';

// ✅ DESPUÉS:
const bannerBg = '/images/banner-dashboard.png';
```

---

## Paso 3️⃣: Probar Localmente

```bash
npm run build
npm run preview
```

Abre `http://localhost:4173` y verifica que las imágenes cargan correctamente.

---

## Paso 4️⃣: Deploy a Vercel

### A) Conectar GitHub con Vercel:
1. Ve a [vercel.com](https://vercel.com)
2. Click "New Project"
3. Importa tu repositorio de GitHub
4. Vercel detecta automáticamente que es Vite/React
5. Click "Deploy"

### B) Configurar Variables de Entorno:
En Vercel Dashboard → Tu proyecto → Settings → Environment Variables:

```
VITE_SUPABASE_URL=tu-url-de-supabase
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

### C) Primer Deploy:
- Vercel hace build automáticamente
- Te da una URL temporal: `investi.vercel.app`
- ¡Prueba que todo funcione!

---

## Paso 5️⃣: Configurar Dominio Personalizado

### A) Comprar dominio:
- **Chile (.cl)**: [NIC.cl](https://www.nic.cl) o Hostinger Chile
- **Internacional (.com)**: Namecheap, GoDaddy, Google Domains

### B) En tu proveedor de dominio:
Configura los DNS:

```
Tipo: A
Nombre: @
Valor: 76.76.21.21

Tipo: CNAME
Nombre: www
Valor: cname.vercel-dns.com
```

### C) En Vercel:
1. Project Settings → Domains
2. Add Domain: `investi.cl`
3. Vercel verifica automáticamente
4. Espera 5 min - 48 hrs (propagación DNS)

---

## Paso 6️⃣: Configurar Supabase

En tu Dashboard de Supabase → Authentication → URL Configuration:

```
Site URL: https://investi.cl

Redirect URLs:
- https://investi.cl
- https://www.investi.cl
- https://investi.cl/**
- http://localhost:3000 (para desarrollo)
```

---

## ✅ Checklist Final

- [ ] Imágenes subidas a `public/images/`
- [ ] Código actualizado (sin `figma:asset`)
- [ ] Build exitoso localmente (`npm run build`)
- [ ] Push a GitHub
- [ ] Proyecto conectado a Vercel
- [ ] Variables de entorno configuradas
- [ ] Primer deploy exitoso
- [ ] Dominio comprado (opcional)
- [ ] DNS configurado (opcional)
- [ ] Dominio agregado en Vercel (opcional)
- [ ] URLs actualizadas en Supabase
- [ ] SSL activo (automático con Vercel)
- [ ] Pruebas de login/registro funcionando

---

## 🆘 Solución de Problemas

### Error: "Cannot find module 'figma:asset'"
→ Olvidaste cambiar las referencias en el código

### Imágenes no cargan (404)
→ Verifica que están en `public/images/` exactamente
→ Las rutas deben ser `/images/logo.png` (sin `public`)

### Build falla en Vercel
→ Revisa los logs en Vercel Dashboard
→ Asegúrate que `npm run build` funcione localmente

### Login/Register no funciona
→ Verifica variables de entorno en Vercel
→ Actualiza las Redirect URLs en Supabase

---

## 🎯 Tu SaaS estará en:

```
🌐 https://investi.cl (tu dominio)
✅ SSL automático
⚡ CDN global de Vercel
🔒 Backend seguro con Supabase
```

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs de Vercel
2. Verifica la consola del navegador (F12)
3. Revisa los logs de Supabase
4. Consulta la documentación de Vercel

¡Éxito con tu deploy! 🚀
