import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Check, X, Loader, Database, User, Target, Trophy } from 'lucide-react';
import { healthCheck, auth, profile, goals, competencies, achievements, stats } from '../../utils/supabase';

export function SupabaseTest() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<any>(null);

  useEffect(() => {
    runTests();
  }, []);

  const runTests = async () => {
    const results: any[] = [];

    // Test 1: Health Check
    try {
      const health = await healthCheck();
      results.push({
        name: 'Conexión al servidor',
        status: 'success',
        message: health.message,
        icon: Database,
      });
      setStatus('connected');
    } catch (error: any) {
      results.push({
        name: 'Conexión al servidor',
        status: 'error',
        message: error.message,
        icon: Database,
      });
      setStatus('error');
    }

    // Test 2: Verificar autenticación
    const isAuth = auth.isAuthenticated();
    const storedProfile = auth.getCurrentProfile();
    
    setIsAuthenticated(isAuth);
    setCurrentProfile(storedProfile);

    results.push({
      name: 'Estado de autenticación',
      status: isAuth ? 'success' : 'warning',
      message: isAuth ? `Usuario autenticado: ${storedProfile?.name}` : 'No hay sesión activa',
      icon: User,
    });

    // Test 3-6: Solo si está autenticado
    if (isAuth) {
      // Test 3: Obtener metas
      try {
        const goalsData = await goals.getAll();
        results.push({
          name: 'Metas de ahorro',
          status: 'success',
          message: `${goalsData.goals.length} metas encontradas`,
          icon: Target,
        });
      } catch (error: any) {
        results.push({
          name: 'Metas de ahorro',
          status: 'error',
          message: error.message,
          icon: Target,
        });
      }

      // Test 4: Obtener competencias
      try {
        const compData = await competencies.getAll();
        results.push({
          name: 'Competencias',
          status: 'success',
          message: `${compData.competencies.length} competencias evaluadas`,
          icon: Trophy,
        });
      } catch (error: any) {
        results.push({
          name: 'Competencias',
          status: 'error',
          message: error.message,
          icon: Trophy,
        });
      }

      // Test 5: Obtener logros
      try {
        const achData = await achievements.getAll();
        results.push({
          name: 'Logros desbloqueados',
          status: 'success',
          message: `${achData.achievements.length} logros desbloqueados`,
          icon: Trophy,
        });
      } catch (error: any) {
        results.push({
          name: 'Logros desbloqueados',
          status: 'error',
          message: error.message,
          icon: Trophy,
        });
      }

      // Test 6: Obtener estadísticas
      try {
        const statsData = await stats.get();
        results.push({
          name: 'Estadísticas',
          status: 'success',
          message: `Nivel ${statsData.stats.level} - XP: ${statsData.stats.xp}`,
          icon: Trophy,
        });
      } catch (error: any) {
        results.push({
          name: 'Estadísticas',
          status: 'error',
          message: error.message,
          icon: Trophy,
        });
      }
    }

    setTestResults(results);
  };

  const handleTestRegister = async () => {
    const testRut = `${Math.floor(10000000 + Math.random() * 90000000)}-${Math.floor(Math.random() * 10)}`;
    
    try {
      await auth.register({
        rut: testRut,
        password: 'test123456',
        name: 'Usuario de Prueba',
        grade: '2do Medio',
        course: 'A',
        role: 'student',
      });
      
      alert(`✅ Usuario registrado exitosamente!\nRUT: ${testRut}\nContraseña: test123456`);
      runTests();
    } catch (error: any) {
      alert(`❌ Error: ${error.message}`);
    }
  };

  const handleTestLogin = async () => {
    const rut = prompt('Ingresa el RUT (ej: 12345678-9):');
    const password = prompt('Ingresa la contraseña:');
    
    if (!rut || !password) return;

    try {
      await auth.login(rut, password);
      alert('✅ Login exitoso!');
      runTests();
    } catch (error: any) {
      alert(`❌ Error: ${error.message}`);
    }
  };

  const handleLogout = () => {
    auth.logout();
    alert('✅ Sesión cerrada');
    runTests();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">🧪 Panel de Pruebas - Supabase</h2>
        <p className="text-gray-600 mt-1">Verifica la conexión y funcionalidad del backend</p>
      </div>

      {/* Estado de Conexión */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          {status === 'checking' && (
            <>
              <Loader className="w-8 h-8 text-blue-500 animate-spin" />
              <div>
                <h3 className="font-bold text-lg">Verificando conexión...</h3>
                <p className="text-sm text-gray-600">Conectando con Supabase</p>
              </div>
            </>
          )}
          {status === 'connected' && (
            <>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-green-700">✅ Conectado a Supabase</h3>
                <p className="text-sm text-gray-600">Backend funcionando correctamente</p>
              </div>
            </>
          )}
          {status === 'error' && (
            <>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <X className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-red-700">❌ Error de conexión</h3>
                <p className="text-sm text-gray-600">No se pudo conectar al backend</p>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Información del Usuario */}
      {isAuthenticated && currentProfile && (
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-lg text-blue-900 mb-2">👤 Usuario Autenticado</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Nombre:</strong> {currentProfile.name}</p>
                <p><strong>RUT:</strong> {currentProfile.rut}</p>
                <p><strong>Grado:</strong> {currentProfile.grade} {currentProfile.course}</p>
                <p><strong>Rol:</strong> {currentProfile.role}</p>
                <p><strong>Nivel:</strong> {currentProfile.level} - XP: {currentProfile.xp}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all"
            >
              Cerrar Sesión
            </button>
          </div>
        </Card>
      )}

      {/* Acciones de Prueba */}
      {!isAuthenticated && (
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4">🔐 Pruebas de Autenticación</h3>
          <div className="flex gap-3">
            <button
              onClick={handleTestRegister}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Registrar Usuario de Prueba
            </button>
            <button
              onClick={handleTestLogin}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Iniciar Sesión
            </button>
          </div>
        </Card>
      )}

      {/* Resultados de Pruebas */}
      <div>
        <h3 className="font-bold text-lg mb-4">📋 Resultados de Pruebas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testResults.map((result, index) => {
            const Icon = result.icon;
            return (
              <Card key={index} className={`p-4 ${
                result.status === 'success' ? 'border-green-300 bg-green-50' :
                result.status === 'warning' ? 'border-yellow-300 bg-yellow-50' :
                'border-red-300 bg-red-50'
              } border-2`}>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    result.status === 'success' ? 'bg-green-500' :
                    result.status === 'warning' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{result.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                  </div>
                  {result.status === 'success' && <Check className="w-5 h-5 text-green-600" />}
                  {result.status === 'error' && <X className="w-5 h-5 text-red-600" />}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Botón para refrescar */}
      <div className="flex justify-center">
        <button
          onClick={runTests}
          className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          🔄 Ejecutar Pruebas Nuevamente
        </button>
      </div>

      {/* Documentación */}
      <Card className="p-6 bg-gray-50">
        <h3 className="font-bold text-lg mb-3">📚 Información</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>✅ El backend está configurado con Supabase</p>
          <p>✅ Sistema de autenticación con RUT chileno</p>
          <p>✅ Persistencia de metas, competencias y logros</p>
          <p>✅ Sistema de roles (estudiante, profesor, tesorero)</p>
          <p>📖 Ver <code className="bg-white px-2 py-1 rounded">SUPABASE_DOCUMENTATION.md</code> para más detalles</p>
        </div>
      </Card>
    </div>
  );
}
