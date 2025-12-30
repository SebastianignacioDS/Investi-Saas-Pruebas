import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { createClient } from '@supabase/supabase-js';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-434a9eb5`;

// Helper para hacer requests autenticados
const authenticatedFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('accessToken');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : { 'Authorization': `Bearer ${publicAnonKey}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error en la petición');
  }

  return response.json();
};

// ============================================
// 🔐 AUTENTICACIÓN
// ============================================

export const auth = {
  register: async (data: { rut: string; password: string; name: string; email?: string; grade?: string; course?: string; role?: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al registrar usuario');
    }

    return response.json();
  },

  login: async (rut: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ rut, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al iniciar sesión');
    }

    const data = await response.json();
    
    // Guardar token en localStorage
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('userProfile', JSON.stringify(data.profile));
    }

    return data;
  },

  // Login demo con auto-creación de usuario si no existe
  loginDemo: async () => {
    try {
      console.log('🎮 Intentando login demo...');
      
      // Primero intentar login normal
      try {
        return await auth.login('12345678-9', 'demo123');
      } catch (error) {
        console.log('⚠️ Usuario demo no existe, creando...');
        
        // Si falla, crear usuario demo
        const createResponse = await fetch(`${API_BASE_URL}/init-demo-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        });

        if (!createResponse.ok) {
          const error = await createResponse.json();
          throw new Error(error.error || 'Error al crear usuario demo');
        }

        console.log('✅ Usuario demo creado, intentando login...');
        
        // Intentar login nuevamente
        return await auth.login('12345678-9', 'demo123');
      }
    } catch (err) {
      console.error('❌ Error en loginDemo:', err);
      throw err;
    }
  },

  // Limpiar base de datos (solo desarrollo)
  cleanDatabase: async () => {
    try {
      console.log('🧹 Limpiando base de datos...');
      
      const response = await fetch(`${API_BASE_URL}/clean-database`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al limpiar base de datos');
      }

      const data = await response.json();
      console.log('✅ Base de datos limpiada:', data);
      
      // Limpiar localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userProfile');
      
      return data;
    } catch (err) {
      console.error('❌ Error limpiando base de datos:', err);
      throw err;
    }
  },

  loginWithGoogle: async () => {
    try {
      console.log('🔵 Iniciando login con Google...');
      
      // Iniciar sesión con Google OAuth
      const supabase = createClient(
        `https://${projectId}.supabase.co`,
        publicAnonKey
      );

      console.log('🔵 Cliente de Supabase creado');

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          // Usar popup en lugar de redirect para evitar problemas con iframes
          skipBrowserRedirect: false,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      console.log('🔵 Respuesta de OAuth:', { data, error });

      if (error) {
        console.error('❌ Error de OAuth:', error);
        throw new Error(error.message);
      }

      console.log('✅ Redirigiendo a Google...');
      return data;
    } catch (err) {
      console.error('❌ Error en loginWithGoogle:', err);
      throw err;
    }
  },

  handleOAuthCallback: async () => {
    // Manejar el callback después del login con Google
    const supabase = createClient(
      `https://${projectId}.supabase.co`,
      publicAnonKey
    );

    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      throw new Error('Error al obtener la sesión de Google');
    }

    // Guardar token y crear/actualizar perfil
    localStorage.setItem('accessToken', session.access_token);

    // Obtener o crear perfil del usuario
    const response = await fetch(`${API_BASE_URL}/profile`, {
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
    });

    const profileData = await response.json();
    
    if (profileData.profile) {
      localStorage.setItem('userProfile', JSON.stringify(profileData.profile));
      return profileData.profile;
    }

    // Si no tiene perfil, crear uno básico con datos de Google
    const googleProfile = {
      name: session.user.user_metadata.full_name || session.user.email,
      email: session.user.email,
      rut: null,
      grade: null,
      course: null,
      role: 'student',
      level: 1,
      xp: 0,
      totalSaved: 0,
    };

    const createResponse = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(googleProfile),
    });

    const createdProfile = await createResponse.json();
    localStorage.setItem('userProfile', JSON.stringify(createdProfile.profile));
    
    return createdProfile.profile;
  },

  resetPassword: async (rut: string, email: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ rut, email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al resetear contraseña');
    }

    return response.json();
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userProfile');
  },

  getSession: async () => {
    return authenticatedFetch('/auth/session');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },

  getCurrentProfile: () => {
    const profile = localStorage.getItem('userProfile');
    return profile ? JSON.parse(profile) : null;
  },
};

// ============================================
// 👤 PERFIL
// ============================================

export const profile = {
  get: async () => {
    return authenticatedFetch('/profile');
  },

  update: async (updates: any) => {
    const result = await authenticatedFetch('/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });

    // Actualizar localStorage
    if (result.profile) {
      localStorage.setItem('userProfile', JSON.stringify(result.profile));
    }

    return result;
  },
};

// ============================================
// 🎯 METAS
// ============================================

export const goals = {
  getAll: async () => {
    return authenticatedFetch('/goals');
  },

  create: async (goalData: any) => {
    return authenticatedFetch('/goals', {
      method: 'POST',
      body: JSON.stringify(goalData),
    });
  },

  updateProgress: async (goalId: number, amount: number) => {
    return authenticatedFetch(`/goals/${goalId}/progress`, {
      method: 'PUT',
      body: JSON.stringify({ amount }),
    });
  },

  delete: async (goalId: number) => {
    return authenticatedFetch(`/goals/${goalId}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// 📚 COMPETENCIAS
// ============================================

export const competencies = {
  getAll: async () => {
    return authenticatedFetch('/competencies');
  },

  save: async (competenciesData: any[]) => {
    return authenticatedFetch('/competencies', {
      method: 'POST',
      body: JSON.stringify({ competencies: competenciesData }),
    });
  },
};

// ============================================
// 🏆 LOGROS
// ============================================

export const achievements = {
  getAll: async () => {
    return authenticatedFetch('/achievements');
  },

  unlock: async (achievementId: string) => {
    return authenticatedFetch('/achievements/unlock', {
      method: 'POST',
      body: JSON.stringify({ achievementId }),
    });
  },
};

// ============================================
// 🎓 META DEL CURSO
// ============================================

export const courseGoal = {
  get: async (grade: string, course: string) => {
    return authenticatedFetch(`/course-goal/${encodeURIComponent(grade)}/${course}`);
  },

  update: async (grade: string, course: string, goalData: any) => {
    return authenticatedFetch(`/course-goal/${encodeURIComponent(grade)}/${course}`, {
      method: 'PUT',
      body: JSON.stringify(goalData),
    });
  },

  contribute: async (grade: string, course: string, amount: number) => {
    return authenticatedFetch(`/course-goal/${encodeURIComponent(grade)}/${course}/contribute`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  },
};

// ============================================
// 📊 ESTADÍSTICAS
// ============================================

export const stats = {
  get: async () => {
    return authenticatedFetch('/stats');
  },
};

// Health check
export const healthCheck = async () => {
  const response = await fetch(`${API_BASE_URL}/health`);
  return response.json();
};