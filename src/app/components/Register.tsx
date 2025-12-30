import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { auth } from '../../utils/supabase';
import { AlertCircle, Loader, CheckCircle } from 'lucide-react';

interface RegisterProps {
  onRegister: (profile: any) => void;
  onBackToLogin: () => void;
}

export function Register({ onRegister, onBackToLogin }: RegisterProps) {
  const [name, setName] = useState('');
  const [rut, setRut] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    rut: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: ''
  });

  // Validate RUT format (XXXXXXX-X)
  const validateRut = (value: string): boolean => {
    const rutPattern = /^\d{6,8}-[\dkK]$/;
    return rutPattern.test(value);
  };

  // Format RUT as user types
  const handleRutChange = (value: string) => {
    // Remove all non-digit and non-k characters
    let cleaned = value.replace(/[^\dkK]/g, '');
    
    // Add hyphen before last character if there are enough digits
    if (cleaned.length > 1) {
      cleaned = cleaned.slice(0, -1) + '-' + cleaned.slice(-1);
    }
    
    setRut(cleaned);
  };

  // Validate password strength
  const validatePassword = (value: string): boolean => {
    const hasMinLength = value.length >= 8;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    return hasMinLength && hasUpperCase && hasNumber;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    const newErrors = {
      name: '',
      rut: '',
      email: '',
      password: '',
      confirmPassword: '',
      general: ''
    };

    // Validate name
    if (!name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    // Validate RUT
    if (!validateRut(rut)) {
      newErrors.rut = 'RUT inválido. Formato: 1234567-8';
    }

    // Validate email
    if (!email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Correo electrónico inválido';
    }

    // Validate password
    if (!validatePassword(password)) {
      newErrors.password = 'La contraseña debe tener mínimo 8 caracteres, una mayúscula y un número';
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);

    // If no errors, proceed with registration
    if (!newErrors.name && !newErrors.rut && !newErrors.email && !newErrors.password && !newErrors.confirmPassword) {
      setLoading(true);
      setErrors({ name: '', rut: '', email: '', password: '', confirmPassword: '', general: '' });
      
      try {
        const result = await auth.register({
          rut: rut,
          password: password,
          name: name,
          email: email
        });

        if (result.success) {
          setSuccess(true);
          console.log('✅ Registro exitoso, intentando auto-login...');
          
          // Auto-login después de registro exitoso
          try {
            // Esperar un momento para que se complete el registro
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log('🔐 Intentando login con RUT:', rut);
            const loginResult = await auth.login(rut, password);
            
            console.log('📋 Resultado del login:', loginResult);
            
            if (loginResult.success && loginResult.profile) {
              console.log('✅ Auto-login exitoso, llamando onRegister...');
              onRegister(loginResult.profile);
            } else {
              console.error('❌ Login exitoso pero sin perfil:', loginResult);
              // Mostrar error y permitir login manual
              setErrors({ 
                ...newErrors, 
                general: 'Registro exitoso. Por favor, inicia sesión manualmente.' 
              });
              setLoading(false);
            }
          } catch (loginErr: any) {
            console.error('❌ Error en auto-login después de registro:', loginErr);
            // Si falla el auto-login, mostrar mensaje y permitir login manual
            setErrors({ 
              ...newErrors, 
              general: `Registro exitoso. Error al iniciar sesión automáticamente: ${loginErr.message}. Por favor, inicia sesión manualmente.` 
            });
            setLoading(false);
          }
        }
      } catch (err: any) {
        console.error('Error al registrar:', err);
        
        // Verificar si es un error de usuario duplicado
        if (err.message && err.message.includes('already been registered')) {
          newErrors.general = 'Este RUT ya está registrado. Por favor, inicia sesión en su lugar.';
          newErrors.rut = 'Este RUT ya tiene una cuenta';
        } else if (err.message && err.message.includes('User already registered')) {
          newErrors.general = 'Este RUT ya está registrado. Por favor, inicia sesión en su lugar.';
          newErrors.rut = 'Este RUT ya tiene una cuenta';
        } else {
          newErrors.general = err.message || 'Error al registrar usuario. Por favor, intenta nuevamente.';
        }
        
        setErrors(newErrors);
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/bg-login.png)' }}
      >
        {/* Dark overlay for better readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Register Form */}
        <Card className="w-full p-10 shadow-2xl backdrop-blur-sm bg-white">
          {/* Logo centered at top */}
          <div className="flex justify-center mb-0">
            <img src="/images/logo.png" alt="Investi Logo" className="h-20 object-contain" />
          </div>

          {/* Welcome Text */}
          <div className="mb-8 text-center -mt-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Regístrate en <span className="text-[#be9525]">Investï</span>
            </h2>
            <p className="text-gray-600">Comienza tu camino hacia el ahorro</p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre Completo
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Juan Pérez"
                className={`w-full px-4 py-3 border-2 ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-[#be9525] focus:border-[#be9525] transition-all outline-none`}
                required
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* RUT Field */}
            <div>
              <label htmlFor="rut" className="block text-sm font-semibold text-gray-700 mb-2">
                RUT (tu usuario será el RUT)
              </label>
              <input
                id="rut"
                type="text"
                value={rut}
                onChange={(e) => handleRutChange(e.target.value)}
                placeholder="12345678-9"
                maxLength={10}
                className={`w-full px-4 py-3 border-2 ${errors.rut ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-[#be9525] focus:border-[#be9525] transition-all outline-none`}
                required
              />
              {errors.rut && <p className="text-red-500 text-xs mt-1">{errors.rut}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className={`w-full px-4 py-3 border-2 ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-[#be9525] focus:border-[#be9525] transition-all outline-none`}
                required
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                className={`w-full px-4 py-3 border-2 ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-[#be9525] focus:border-[#be9525] transition-all outline-none`}
                required
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              <p className="text-gray-500 text-xs mt-1">Crea una contraseña segura (mín. 8 caracteres)</p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Repetir Contraseña
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  // Validate in real-time
                  if (e.target.value && password && e.target.value !== password) {
                    setErrors(prev => ({ ...prev, confirmPassword: 'Las contraseñas no coinciden' }));
                  } else {
                    setErrors(prev => ({ ...prev, confirmPassword: '' }));
                  }
                }}
                placeholder="Repite tu contraseña"
                className={`w-full px-4 py-3 border-2 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-[#be9525] focus:border-[#be9525] transition-all outline-none`}
                required
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#be9525] to-[#f3d374] hover:from-[#9a7a1e] hover:to-[#d4b860] text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all text-lg border-2 border-[#be9525]"
            >
              {loading ? <Loader className="animate-spin" /> : 'Comenzar mi viaje'}
            </Button>
          </form>

          {/* Back to Login Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <button 
                onClick={onBackToLogin}
                className="text-[#be9525] hover:text-[#9a7a1e] font-semibold transition-colors"
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-semibold">¡Registro exitoso! Iniciando sesión...</span>
            </div>
          )}

          {/* Error Message */}
          {errors.general && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700 mb-2">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-semibold">{errors.general}</span>
              </div>
              {(errors.general.includes('ya está registrado') || errors.general.includes('already registered')) && (
                <button
                  onClick={onBackToLogin}
                  className="w-full mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Ir a Iniciar Sesión
                </button>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-white/80 text-sm">© 2025 Investï Plataforma de educación financiera para escolares</p>
      </div>
    </div>
  );
}