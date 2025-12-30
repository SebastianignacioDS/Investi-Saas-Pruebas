# 📚 Documentación del Backend - Investï

## 🎯 Arquitectura

```
Frontend (React) → Supabase Edge Function (Hono Server) → Supabase Auth + KV Store
```

## 🔐 Autenticación

### Sistema de RUT Chileno
- Los usuarios se registran y loguean usando su **RUT** (en lugar de email)
- Internamente, el sistema convierte el RUT a un email único: `{RUT}@investi.cl`
- Las contraseñas están encriptadas por Supabase Auth

### Roles de Usuario
- **`student`** (Estudiante) - Rol por defecto
- **`teacher`** (Profesor Jefe) - Puede editar meta del curso
- **`treasurer`** (Tesorero) - Puede editar meta del curso

---

## 📡 API Endpoints

### 🔐 Autenticación

#### `POST /auth/register`
Registrar nuevo usuario con RUT

**Body:**
```json
{
  "rut": "12345678-9",
  "password": "miPassword123",
  "name": "Ana Estudiante",
  "grade": "2do Medio",
  "course": "A",
  "role": "student"
}
```

**Response:**
```json
{
  "success": true,
  "user": { ... },
  "message": "Usuario registrado exitosamente"
}
```

---

#### `POST /auth/login`
Iniciar sesión con RUT

**Body:**
```json
{
  "rut": "12345678-9",
  "password": "miPassword123"
}
```

**Response:**
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... },
  "profile": {
    "rut": "12345678-9",
    "name": "Ana Estudiante",
    "grade": "2do Medio",
    "course": "A",
    "level": 15,
    "xp": 750,
    "totalSaved": 142000
  }
}
```

---

#### `GET /auth/session`
Obtener sesión actual (requiere token)

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "user": { ... },
  "profile": { ... }
}
```

---

### 👤 Perfil

#### `GET /profile`
Obtener perfil del usuario autenticado

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "profile": {
    "rut": "12345678-9",
    "name": "Sebastian",
    "grade": "3ro Medio",
    "course": "B",
    "role": "student",
    "level": 15,
    "xp": 750,
    "totalSaved": 142000,
    "currentStreak": 12,
    "selectedLevel": 2
  }
}
```

---

#### `PUT /profile`
Actualizar perfil

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Body:**
```json
{
  "name": "Sebastian Actualizado",
  "grade": "4to Medio",
  "course": "C"
}
```

**Response:**
```json
{
  "success": true,
  "profile": { ... }
}
```

---

### 🎯 Metas de Ahorro

#### `GET /goals`
Obtener todas las metas del usuario

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "goals": [
    {
      "id": 1735247891234,
      "title": "Zapatillas nuevas",
      "description": "Nike Air Jordan",
      "targetAmount": 89990,
      "currentAmount": 45000,
      "icon": "👟",
      "deadline": "2025-02-15",
      "category": "short",
      "createdAt": "2024-12-26T10:30:00.000Z"
    }
  ]
}
```

---

#### `POST /goals`
Crear nueva meta

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Body:**
```json
{
  "title": "Notebook",
  "description": "Para clases",
  "targetAmount": 500000,
  "icon": "💻",
  "deadline": "2025-06-30",
  "category": "medium"
}
```

**Response:**
```json
{
  "success": true,
  "goal": {
    "id": 1735247891234,
    "title": "Notebook",
    "currentAmount": 0,
    "createdAt": "2024-12-26T10:30:00.000Z",
    ...
  }
}
```

---

#### `PUT /goals/:goalId/progress`
Agregar progreso a una meta (ahorrar más)

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Body:**
```json
{
  "amount": 10000
}
```

**Response:**
```json
{
  "success": true,
  "goal": {
    "id": 1,
    "currentAmount": 55000,
    ...
  }
}
```

---

#### `DELETE /goals/:goalId`
Eliminar una meta

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true
}
```

---

### 📚 Competencias

#### `GET /competencies`
Obtener competencias evaluadas

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "competencies": [
    {
      "id": 1,
      "name": "Planificación de metas",
      "score": 9,
      "level": 3
    },
    {
      "id": 2,
      "name": "Creación de presupuestos",
      "score": 11,
      "level": 4
    }
  ]
}
```

---

#### `POST /competencies`
Guardar resultados de autoevaluación

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Body:**
```json
{
  "competencies": [
    { "id": 1, "name": "Planificación de metas", "score": 9, "level": 3 },
    { "id": 2, "name": "Creación de presupuestos", "score": 11, "level": 4 }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "competencies": [ ... ]
}
```

---

### 🏆 Logros y Trofeos

#### `GET /achievements`
Obtener logros desbloqueados

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "achievements": ["first_save", "perfect_week", "financial_sage"]
}
```

---

#### `POST /achievements/unlock`
Desbloquear un logro

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Body:**
```json
{
  "achievementId": "investment_master"
}
```

**Response:**
```json
{
  "success": true,
  "achievements": ["first_save", "perfect_week", "investment_master"]
}
```

---

### 🎓 Meta del Curso (Colaborativa)

#### `GET /course-goal/:grade/:course`
Obtener meta del curso

**Ejemplo:**
```
GET /course-goal/2do%20Medio/A
```

**Response:**
```json
{
  "success": true,
  "courseGoal": {
    "title": "Gira de Estudios",
    "description": "Meta colaborativa de todo el curso",
    "targetAmount": 5000000,
    "currentAmount": 1000000,
    "deadline": "Sep 2025",
    "participants": 32
  }
}
```

---

#### `PUT /course-goal/:grade/:course`
Actualizar meta del curso (Solo Profesor Jefe o Tesorero)

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Body:**
```json
{
  "title": "Viaje de Graduación",
  "description": "Meta actualizada",
  "targetAmount": 6000000,
  "currentAmount": 1000000,
  "deadline": "Oct 2025",
  "participants": 35
}
```

**Response:**
```json
{
  "success": true,
  "courseGoal": { ... }
}
```

**⚠️ Error si no tiene permisos:**
```json
{
  "error": "Solo el Profesor Jefe o el Tesorero pueden editar la meta del curso"
}
```

---

#### `POST /course-goal/:grade/:course/contribute`
Aportar a la meta del curso

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Body:**
```json
{
  "amount": 5000
}
```

**Response:**
```json
{
  "success": true,
  "courseGoal": {
    "currentAmount": 1005000,
    ...
  }
}
```

---

### 📊 Estadísticas

#### `GET /stats`
Obtener estadísticas del usuario

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "level": 15,
    "xp": 750,
    "totalSaved": 142000,
    "currentStreak": 12,
    "goalsCompleted": 1,
    "totalGoals": 3,
    "competenciesCompleted": 7,
    "achievementsUnlocked": 8
  }
}
```

---

## 🔧 Uso en Frontend

### Ejemplo de Login

```typescript
import { auth } from '../utils/supabase';

const handleLogin = async () => {
  try {
    const result = await auth.login('12345678-9', 'miPassword123');
    console.log('Login exitoso:', result.profile);
    // El token se guarda automáticamente en localStorage
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

### Ejemplo de Crear Meta

```typescript
import { goals } from '../utils/supabase';

const createGoal = async () => {
  try {
    const result = await goals.create({
      title: 'Zapatillas nuevas',
      description: 'Nike Air Jordan',
      targetAmount: 89990,
      icon: '👟',
      deadline: '2025-02-15',
      category: 'short',
    });
    console.log('Meta creada:', result.goal);
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

### Ejemplo de Actualizar Perfil

```typescript
import { profile } from '../utils/supabase';

const updateProfile = async () => {
  try {
    const result = await profile.update({
      name: 'Ana',
      grade: '3ro Medio',
      course: 'B',
    });
    console.log('Perfil actualizado:', result.profile);
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

---

## 💾 Estructura de Datos en KV Store

### Perfil de Usuario
```
Key: user:{userId}:profile
Value: {
  rut: "12345678-9",
  name: "Sebastian",
  grade: "2do Medio",
  course: "A",
  role: "student",
  level: 15,
  xp: 750,
  totalSaved: 142000,
  currentStreak: 12,
  selectedLevel: 2
}
```

### Metas de Usuario
```
Key: user:{userId}:goals
Value: [ { id, title, description, targetAmount, currentAmount, ... } ]
```

### Competencias de Usuario
```
Key: user:{userId}:competencies
Value: [ { id, name, score, level } ]
```

### Logros Desbloqueados
```
Key: user:{userId}:achievements
Value: ["first_save", "perfect_week", "financial_sage"]
```

### Meta del Curso
```
Key: course:{grade}:{course}:goal
Value: {
  title: "Gira de Estudios",
  targetAmount: 5000000,
  currentAmount: 1000000,
  ...
}
```

---

## 🔒 Seguridad

1. **Autenticación requerida**: Todos los endpoints (excepto login/register) requieren token
2. **Validación de permisos**: Solo Teacher/Treasurer pueden editar meta del curso
3. **Aislamiento de datos**: Cada usuario solo puede acceder a sus propios datos
4. **Tokens seguros**: Manejados por Supabase Auth (JWT)

---

## 🚀 Próximos Pasos

Ahora puedes integrar estas llamadas en tus componentes para:

✅ Persistir datos reales
✅ Autenticación funcional con RUT
✅ Sincronizar metas entre dispositivos
✅ Competencias colaborativas del curso
✅ Sistema de roles (estudiante, profesor, tesorero)

¡El backend está listo para usar! 🎉
