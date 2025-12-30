import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// ============================================
// 🔐 AUTENTICACIÓN Y USUARIOS
// ============================================

// Registro de usuarios
app.post('/make-server-434a9eb5/auth/register', async (c) => {
  try {
    const { rut, password, name, email } = await c.req.json();

    if (!rut || !password || !name || !email) {
      return c.json({ error: 'Todos los campos son requeridos' }, 400);
    }

    console.log(`📝 Intento de registro para RUT: ${rut}, Email: ${email}`);

    // Verificar si el RUT ya existe en los perfiles
    const allProfiles = await kv.getByPrefix('user:');
    const existingProfile = allProfiles.find((p: any) => p.value && p.value.rut === rut);

    if (existingProfile) {
      console.log(`❌ RUT ${rut} ya existe en perfiles`);
      return c.json({ error: 'User already registered with this RUT' }, 400);
    }

    // Intentar crear usuario en Supabase Auth
    let authUser;
    try {
      const { data, error: signUpError } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true, // Auto-confirmar email
      });

      if (signUpError) {
        // Si el error es que el email ya existe, buscar el usuario existente
        if (signUpError.message.includes('already been registered') || signUpError.message.includes('already registered')) {
          console.log(`⚠️ Email ${email} ya existe, buscando usuario...`);
          
          // Buscar usuarios por email
          const { data: users, error: listError } = await supabase.auth.admin.listUsers();
          
          if (listError) {
            throw listError;
          }

          const existingUser = users?.users.find(u => u.email === email);
          
          if (existingUser) {
            console.log(`✅ Usuario encontrado con email ${email}, verificando si tiene perfil...`);
            
            // Verificar si ya tiene perfil con RUT
            const existingUserProfile = await kv.get(`user:${existingUser.id}:profile`);
            
            if (existingUserProfile && existingUserProfile.rut) {
              console.log(`❌ Usuario ya tiene perfil con RUT: ${existingUserProfile.rut}`);
              return c.json({ error: 'Este email ya está registrado con otro RUT' }, 400);
            }
            
            // Si no tiene perfil o no tiene RUT, usar este usuario y crear/actualizar perfil
            authUser = existingUser;
            console.log(`🔄 Reutilizando usuario existente y creando perfil con RUT ${rut}`);
          } else {
            throw new Error('Email ya registrado pero no se pudo encontrar el usuario');
          }
        } else {
          throw signUpError;
        }
      } else {
        authUser = data.user;
        console.log(`✅ Usuario creado en Supabase Auth: ${authUser.id}`);
      }
    } catch (authError: any) {
      console.log(`❌ Error en Supabase Auth: ${authError.message}`);
      return c.json({ error: authError.message }, 500);
    }

    // Crear perfil de usuario
    const profile = {
      rut: rut,
      name: name,
      email: email,
      level: 1,
      xp: 0,
      totalSaved: 0,
      currentStreak: 0,
      maxStreak: 0,
      lessonsCompleted: 0,
      achievements: [],
      role: 'student',
      createdAt: new Date().toISOString(),
    };

    await kv.set(`user:${authUser.id}:profile`, profile);
    console.log(`✅ Perfil creado para usuario ${authUser.id}`);

    return c.json({
      success: true,
      message: 'Usuario registrado exitosamente',
      userId: authUser.id,
    });
  } catch (error) {
    console.log(`💥 Error crítico durante registro: ${error}`);
    return c.json({ error: 'Error al registrar usuario' }, 500);
  }
});

// Login con RUT
app.post('/make-server-434a9eb5/auth/login', async (c) => {
  try {
    const { rut, password } = await c.req.json();

    if (!rut || !password) {
      return c.json({ error: 'RUT y password son requeridos' }, 400);
    }

    console.log(`📝 Intento de login con RUT: ${rut}`);

    // Primero intentamos buscar el usuario por RUT en el KV store
    // para obtener su email real (si fue registrado con uno)
    let userEmail = `${rut}@investi.cl`; // Email por defecto
    let existingUserId = null;
    
    // Buscar todos los perfiles que coincidan con el RUT
    console.log(`🔍 Buscando perfil con RUT: ${rut}`);
    const allProfiles = await kv.getByPrefix('user:');
    console.log(`📊 Total de perfiles encontrados: ${allProfiles.length}`);
    
    const matchingProfile = allProfiles.find((p: any) => 
      p.value && p.value.rut === rut
    );
    
    if (matchingProfile) {
      console.log(`✅ Perfil encontrado para RUT ${rut}`);
      existingUserId = matchingProfile.key.split(':')[1];
      if (matchingProfile.value.email) {
        userEmail = matchingProfile.value.email;
        console.log(`📧 Email asociado: ${userEmail}`);
      }
    } else {
      console.log(`⚠️ No se encontró perfil con RUT ${rut}, usando email por defecto: ${userEmail}`);
    }

    // Iniciar sesión usando el email encontrado
    console.log(`🔐 Intentando login con email: ${userEmail}`);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: userEmail,
      password: password,
    });

    if (error) {
      console.log(`❌ Error de autenticación Supabase: ${error.message}`);
      return c.json({ error: 'RUT o contraseña incorrectos' }, 401);
    }

    console.log(`✅ Login exitoso para user ID: ${data.user.id}`);

    // Obtener perfil del usuario
    let profile = await kv.get(`user:${data.user.id}:profile`);
    
    // Si no encontramos el perfil, intentar buscarlo de nuevo (puede ser un timing issue)
    if (!profile && existingUserId) {
      console.log(`⚠️ Perfil no encontrado, reintentando con userId conocido: ${existingUserId}`);
      profile = await kv.get(`user:${existingUserId}:profile`);
    }
    
    if (!profile) {
      console.log(`❌ ADVERTENCIA: Usuario autenticado pero sin perfil en KV`);
      // Crear un perfil básico si no existe
      profile = {
        rut: rut,
        name: data.user.user_metadata?.name || 'Usuario',
        email: userEmail,
        level: 1,
        xp: 0,
        totalSaved: 0,
        currentStreak: 0,
        role: 'student',
      };
      await kv.set(`user:${data.user.id}:profile`, profile);
      console.log(`✅ Perfil creado on-the-fly para usuario ${data.user.id}`);
    }
    
    console.log(`📋 Perfil obtenido:`, profile ? 'Sí' : 'No');

    return c.json({
      success: true,
      accessToken: data.session.access_token,
      user: data.user,
      profile: profile,
    });
  } catch (error) {
    console.log(`💥 Error crítico durante login: ${error}`);
    return c.json({ error: 'Error al iniciar sesión' }, 500);
  }
});

// Obtener sesión actual
app.get('/make-server-434a9eb5/auth/session', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No autorizado' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Sesión inválida' }, 401);
    }

    const profile = await kv.get(`user:${user.id}:profile`);

    return c.json({
      success: true,
      user: user,
      profile: profile,
    });
  } catch (error) {
    console.log(`Error getting session: ${error}`);
    return c.json({ error: 'Error al obtener sesión' }, 500);
  }
});

// Resetear contraseña
app.post('/make-server-434a9eb5/auth/reset-password', async (c) => {
  try {
    const { rut, email } = await c.req.json();

    if (!rut || !email) {
      return c.json({ error: 'RUT y email son requeridos' }, 400);
    }

    console.log(`🔄 Intento de reseteo de contraseña para RUT: ${rut}`);

    // Buscar el usuario por RUT
    const allProfiles = await kv.getByPrefix('user:');
    const matchingProfile = allProfiles.find((p: any) => 
      p.value && p.value.rut === rut && p.value.email === email
    );

    if (!matchingProfile) {
      console.log(`❌ No se encontró usuario con RUT ${rut} y email ${email}`);
      return c.json({ error: 'No se encontró un usuario con ese RUT y email' }, 404);
    }

    console.log(`✅ Usuario encontrado, enviando email de recuperación...`);

    // Obtener el ID del usuario del key
    const userId = matchingProfile.key.split(':')[1];

    // Obtener el usuario de Supabase Auth
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);

    if (userError || !userData) {
      console.log(`❌ Error al obtener usuario de Supabase: ${userError?.message}`);
      return c.json({ error: 'Error al procesar la solicitud' }, 500);
    }

    // Enviar email de recuperación usando Supabase Auth
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${c.req.header('origin') || 'http://localhost:3000'}/reset-password`,
    });

    if (resetError) {
      console.log(`⚠️ Error al enviar email de recuperación: ${resetError.message}`);
      // Si falla el envío, puede ser porque no hay SMTP configurado
      return c.json({ 
        error: '⚠️ No se pudo enviar el email de recuperación. Verifica que SMTP esté configurado en Supabase.',
        details: resetError.message 
      }, 503);
    }

    console.log(`✅ Email de recuperación enviado exitosamente`);

    return c.json({
      success: true,
      message: 'Se ha enviado un email con instrucciones para resetear tu contraseña',
    });
  } catch (error) {
    console.log(`💥 Error crítico durante reseteo de contraseña: ${error}`);
    return c.json({ error: 'Error al resetear contraseña' }, 500);
  }
});

// ============================================
// 👤 PERFIL DE USUARIO
// ============================================

// Actualizar perfil
app.put('/make-server-434a9eb5/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'No autorizado' }, 401);
    }

    const updates = await c.req.json();
    const currentProfile = await kv.get(`user:${user.id}:profile`) || {};

    const updatedProfile = { ...currentProfile, ...updates };
    await kv.set(`user:${user.id}:profile`, updatedProfile);

    return c.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.log(`Error updating profile: ${error}`);
    return c.json({ error: 'Error al actualizar perfil' }, 500);
  }
});

// Obtener perfil
app.get('/make-server-434a9eb5/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'No autorizado' }, 401);
    }

    const profile = await kv.get(`user:${user.id}:profile`);

    return c.json({ success: true, profile: profile });
  } catch (error) {
    console.log(`Error getting profile: ${error}`);
    return c.json({ error: 'Error al obtener perfil' }, 500);
  }
});

// ============================================
// 🎯 METAS DE AHORRO
// ============================================

// Crear meta personal
app.post('/make-server-434a9eb5/goals', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'No autorizado' }, 401);
    }

    const newGoal = await c.req.json();
    const goals = await kv.get(`user:${user.id}:goals`) || [];

    const goal = {
      id: Date.now(),
      ...newGoal,
      currentAmount: 0,
      createdAt: new Date().toISOString(),
    };

    goals.push(goal);
    await kv.set(`user:${user.id}:goals`, goals);

    return c.json({ success: true, goal: goal });
  } catch (error) {
    console.log(`Error creating goal: ${error}`);
    return c.json({ error: 'Error al crear meta' }, 500);
  }
});

// Obtener metas
app.get('/make-server-434a9eb5/goals', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'No autorizado' }, 401);
    }

    const goals = await kv.get(`user:${user.id}:goals`) || [];

    return c.json({ success: true, goals: goals });
  } catch (error) {
    console.log(`Error getting goals: ${error}`);
    return c.json({ error: 'Error al obtener metas' }, 500);
  }
});

// Actualizar progreso de meta
app.put('/make-server-434a9eb5/goals/:goalId/progress', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'No autorizado' }, 401);
    }

    const goalId = parseInt(c.req.param('goalId'));
    const { amount } = await c.req.json();

    const goals = await kv.get(`user:${user.id}:goals`) || [];
    const goalIndex = goals.findIndex((g: any) => g.id === goalId);

    if (goalIndex === -1) {
      return c.json({ error: 'Meta no encontrada' }, 404);
    }

    goals[goalIndex].currentAmount += amount;
    await kv.set(`user:${user.id}:goals`, goals);

    // Actualizar total ahorrado en perfil
    const profile = await kv.get(`user:${user.id}:profile`) || {};
    profile.totalSaved = (profile.totalSaved || 0) + amount;
    await kv.set(`user:${user.id}:profile`, profile);

    return c.json({ success: true, goal: goals[goalIndex] });
  } catch (error) {
    console.log(`Error updating goal progress: ${error}`);
    return c.json({ error: 'Error al actualizar progreso' }, 500);
  }
});

// Eliminar meta
app.delete('/make-server-434a9eb5/goals/:goalId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'No autorizado' }, 401);
    }

    const goalId = parseInt(c.req.param('goalId'));
    const goals = await kv.get(`user:${user.id}:goals`) || [];
    const filteredGoals = goals.filter((g: any) => g.id !== goalId);

    await kv.set(`user:${user.id}:goals`, filteredGoals);

    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting goal: ${error}`);
    return c.json({ error: 'Error al eliminar meta' }, 500);
  }
});

// ============================================
// 📚 COMPETENCIAS
// ============================================

// Guardar resultados de autoevaluación
app.post('/make-server-434a9eb5/competencies', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'No autorizado' }, 401);
    }

    const { competencies } = await c.req.json();
    await kv.set(`user:${user.id}:competencies`, competencies);

    return c.json({ success: true, competencies: competencies });
  } catch (error) {
    console.log(`Error saving competencies: ${error}`);
    return c.json({ error: 'Error al guardar competencias' }, 500);
  }
});

// Obtener competencias
app.get('/make-server-434a9eb5/competencies', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'No autorizado' }, 401);
    }

    const competencies = await kv.get(`user:${user.id}:competencies`) || [];

    return c.json({ success: true, competencies: competencies });
  } catch (error) {
    console.log(`Error getting competencies: ${error}`);
    return c.json({ error: 'Error al obtener competencias' }, 500);
  }
});

// ============================================
// 🏆 LOGROS Y TROFEOS
// ============================================

// Desbloquear logro
app.post('/make-server-434a9eb5/achievements/unlock', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'No autorizado' }, 401);
    }

    const { achievementId } = await c.req.json();
    const achievements = await kv.get(`user:${user.id}:achievements`) || [];

    if (!achievements.includes(achievementId)) {
      achievements.push(achievementId);
      await kv.set(`user:${user.id}:achievements`, achievements);
    }

    return c.json({ success: true, achievements: achievements });
  } catch (error) {
    console.log(`Error unlocking achievement: ${error}`);
    return c.json({ error: 'Error al desbloquear logro' }, 500);
  }
});

// Obtener logros desbloqueados
app.get('/make-server-434a9eb5/achievements', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'No autorizado' }, 401);
    }

    const achievements = await kv.get(`user:${user.id}:achievements`) || [];

    return c.json({ success: true, achievements: achievements });
  } catch (error) {
    console.log(`Error getting achievements: ${error}`);
    return c.json({ error: 'Error al obtener logros' }, 500);
  }
});

// ============================================
// 🎓 META DEL CURSO (Colaborativa)
// ============================================

// Crear/Actualizar meta del curso (Solo Profesor Jefe o Tesorero)
app.put('/make-server-434a9eb5/course-goal/:grade/:course', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'No autorizado' }, 401);
    }

    // Verificar permisos
    const profile = await kv.get(`user:${user.id}:profile`);
    if (profile.role !== 'teacher' && profile.role !== 'treasurer') {
      return c.json({ error: 'Solo el Profesor Jefe o el Tesorero pueden editar la meta del curso' }, 403);
    }

    const grade = c.req.param('grade');
    const course = c.req.param('course');
    const goalData = await c.req.json();

    const courseGoalKey = `course:${grade}:${course}:goal`;
    await kv.set(courseGoalKey, goalData);

    return c.json({ success: true, courseGoal: goalData });
  } catch (error) {
    console.log(`Error updating course goal: ${error}`);
    return c.json({ error: 'Error al actualizar meta del curso' }, 500);
  }
});

// Obtener meta del curso
app.get('/make-server-434a9eb5/course-goal/:grade/:course', async (c) => {
  try {
    const grade = c.req.param('grade');
    const course = c.req.param('course');

    const courseGoalKey = `course:${grade}:${course}:goal`;
    const courseGoal = await kv.get(courseGoalKey);

    if (!courseGoal) {
      // Meta por defecto si no existe
      return c.json({
        success: true,
        courseGoal: {
          title: 'Gira de Estudios',
          description: 'Meta colaborativa de todo el curso',
          targetAmount: 5000000,
          currentAmount: 0,
          deadline: 'Sep 2025',
          participants: 32,
        }
      });
    }

    return c.json({ success: true, courseGoal: courseGoal });
  } catch (error) {
    console.log(`Error getting course goal: ${error}`);
    return c.json({ error: 'Error al obtener meta del curso' }, 500);
  }
});

// Aportar a la meta del curso
app.post('/make-server-434a9eb5/course-goal/:grade/:course/contribute', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'No autorizado' }, 401);
    }

    const grade = c.req.param('grade');
    const course = c.req.param('course');
    const { amount } = await c.req.json();

    const courseGoalKey = `course:${grade}:${course}:goal`;
    const courseGoal = await kv.get(courseGoalKey) || {
      title: 'Gira de Estudios',
      description: 'Meta colaborativa de todo el curso',
      targetAmount: 5000000,
      currentAmount: 0,
      deadline: 'Sep 2025',
      participants: 32,
    };

    courseGoal.currentAmount += amount;
    await kv.set(courseGoalKey, courseGoal);

    return c.json({ success: true, courseGoal: courseGoal });
  } catch (error) {
    console.log(`Error contributing to course goal: ${error}`);
    return c.json({ error: 'Error al aportar a la meta del curso' }, 500);
  }
});

// ============================================
// 📊 ESTADÍSTICAS DEL DASHBOARD
// ============================================

app.get('/make-server-434a9eb5/stats', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'No autorizado' }, 401);
    }

    const profile = await kv.get(`user:${user.id}:profile`) || {};
    const goals = await kv.get(`user:${user.id}:goals`) || [];
    const competencies = await kv.get(`user:${user.id}:competencies`) || [];
    const achievements = await kv.get(`user:${user.id}:achievements`) || [];

    const completedGoals = goals.filter((g: any) => g.currentAmount >= g.targetAmount).length;

    return c.json({
      success: true,
      stats: {
        level: profile.level || 1,
        xp: profile.xp || 0,
        totalSaved: profile.totalSaved || 0,
        currentStreak: profile.currentStreak || 0,
        goalsCompleted: completedGoals,
        totalGoals: goals.length,
        competenciesCompleted: competencies.length,
        achievementsUnlocked: achievements.length,
      }
    });
  } catch (error) {
    console.log(`Error getting stats: ${error}`);
    return c.json({ error: 'Error al obtener estadísticas' }, 500);
  }
});

// Health check
app.get('/make-server-434a9eb5/health', (c) => {
  return c.json({ status: 'ok', message: 'Investï Backend is running!' });
});

// 🔧 ENDPOINT DE INICIALIZACIÓN TEMPORAL (solo para desarrollo)
app.post('/make-server-434a9eb5/init-demo-user', async (c) => {
  try {
    const rut = '12345678-9';
    const password = 'demo123';
    const userEmail = `${rut}@investi.cl`;

    console.log('🚀 Creando usuario demo...');

    // Verificar si ya existe
    const allProfiles = await kv.getByPrefix('user:');
    const existingProfile = allProfiles.find((p: any) => 
      p.value && p.value.rut === rut
    );

    if (existingProfile) {
      return c.json({ 
        message: 'Usuario demo ya existe',
        credentials: {
          rut: rut,
          password: password
        }
      });
    }

    // Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userEmail,
      password: password,
      email_confirm: true,
      user_metadata: {
        rut: rut,
        name: 'Usuario Demo',
        email: userEmail,
        grade: '3ro Medio',
        course: 'A',
        role: 'student',
        level: 1,
        xp: 0,
        totalSaved: 0,
        currentStreak: 0,
        selectedLevel: null,
      },
    });

    if (authError) {
      console.log(`Error creando usuario demo: ${authError.message}`);
      return c.json({ error: authError.message }, 400);
    }

    // Inicializar datos en KV
    const userId = authData.user.id;
    await kv.set(`user:${userId}:profile`, {
      rut,
      name: 'Usuario Demo',
      email: userEmail,
      grade: '3ro Medio',
      course: 'A',
      role: 'student',
      level: 1,
      xp: 0,
      totalSaved: 0,
      currentStreak: 0,
      selectedLevel: null,
    });

    await kv.set(`user:${userId}:goals`, []);
    await kv.set(`user:${userId}:competencies`, []);
    await kv.set(`user:${userId}:achievements`, []);

    console.log('✅ Usuario demo creado exitosamente');

    return c.json({ 
      success: true,
      message: 'Usuario demo creado exitosamente',
      credentials: {
        rut: rut,
        password: password
      }
    });
  } catch (error) {
    console.log(`Error inicializando usuario demo: ${error}`);
    return c.json({ error: 'Error al crear usuario demo' }, 500);
  }
});

// 🧹 ENDPOINT DE LIMPIEZA (solo para desarrollo)
app.post('/make-server-434a9eb5/clean-database', async (c) => {
  try {
    console.log('🧹 Limpiando base de datos...');

    // Limpiar todos los usuarios de Auth
    const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      throw listError;
    }

    const users = usersData?.users || [];
    console.log(`📊 Usuarios en Auth: ${users.length}`);

    for (const user of users) {
      try {
        await supabase.auth.admin.deleteUser(user.id);
        console.log(`🗑️ Usuario eliminado de Auth: ${user.email}`);
      } catch (err) {
        console.log(`⚠️ Error eliminando usuario ${user.email}:`, err);
      }
    }

    // Limpiar todos los datos del KV store
    const allKeys = await kv.getByPrefix('');
    console.log(`📊 Registros en KV: ${allKeys.length}`);
    
    for (const item of allKeys) {
      try {
        await kv.del(item.key);
        console.log(`🗑️ Registro eliminado de KV: ${item.key}`);
      } catch (err) {
        console.log(`⚠️ Error eliminando registro ${item.key}:`, err);
      }
    }

    console.log('✅ Base de datos limpiada exitosamente');

    return c.json({ 
      success: true,
      message: 'Base de datos limpiada exitosamente',
      deleted: {
        authUsers: users.length,
        kvRecords: allKeys.length
      }
    });
  } catch (error) {
    console.log(`💥 Error limpiando base de datos: ${error}`);
    return c.json({ error: 'Error al limpiar base de datos' }, 500);
  }
});

Deno.serve(app.fetch);