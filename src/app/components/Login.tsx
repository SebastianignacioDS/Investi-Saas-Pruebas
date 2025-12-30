import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { auth } from '../../utils/supabase';
import { AlertCircle, Loader, Zap } from 'lucide-react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface LoginProps {
  onLogin: (profile: any) => void;
  onShowRegister: () => void;
}

export function Login({ onLogin, onShowRegister }: LoginProps) {
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [cleaningDB, setCleaningDB] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetRut, setResetRut] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const formatRUT = (value: string) => {
    // Remover todo excepto números y K/k
    const cleaned = value.replace(/[^0-9kK]/g, '');
    
    // Si está vacío, retornar vacío
    if (cleaned.length === 0) return '';
    
    // Si tiene más de 9 caracteres (8 dígitos + 1 verificador), limitar
    if (cleaned.length > 9) return rut;
    
    // Si tiene más de 1 caracter, agregar el guión antes del último
    if (cleaned.length > 1) {
      const body = cleaned.slice(0, -1);
      const verifier = cleaned.slice(-1).toUpperCase();
      return `${body}-${verifier}`;
    }
    
    return cleaned;
  };

  const handleRUTChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRUT(e.target.value);
    setRut(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!rut || !password) {
      setError('Por favor, ingresa tu RUT y contraseña.');
      setLoading(false);
      return;
    }

    try {
      // Login con el backend de Supabase
      const result = await auth.login(rut, password);
      
      if (result.success) {
        // Login exitoso, pasamos el perfil al componente padre
        onLogin(result.profile);
      }
    } catch (err: any) {
      console.error('Error al iniciar sesión:', err);
      setError(err.message || 'RUT o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    setError('');

    try {
      console.log('🟢 Intentando login con cuenta demo desde Login component...');
      
      // Login con cuenta demo - se creará automáticamente si no existe
      const result = await auth.loginDemo();
      
      if (result.success) {
        // Login exitoso, pasamos el perfil al componente padre
        onLogin(result.profile);
      }
    } catch (err: any) {
      console.error('🔴 Error al iniciar sesión con cuenta demo:', err);
      setError(err.message || 'Error al iniciar sesión con cuenta demo. Por favor, intenta nuevamente.');
      setDemoLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleResetPassword = async () => {
    setResetLoading(true);
    setError('');
    setSuccessMessage('');

    if (!resetRut || !resetEmail) {
      setError('Por favor, ingresa tu RUT y email.');
      setResetLoading(false);
      return;
    }

    try {
      console.log('🟢 Intentando resetear contraseña desde Login component...');
      
      // Resetear contraseña - usando RUT y email
      const result = await auth.resetPassword(resetRut, resetEmail);
      
      if (result.success) {
        // Reset exitoso, mostrar mensaje de éxito
        setSuccessMessage('Se ha enviado un correo para resetear tu contraseña. Revisa tu bandeja de entrada.');
        setShowForgotPassword(false);
        setResetRut('');
        setResetEmail('');
      }
    } catch (err: any) {
      console.error('🔴 Error al resetear contraseña:', err);
      
      // Si hay un error, mostrar mensaje de error
      setError(err.message || 'Error al resetear contraseña. Por favor, verifica que el RUT y email sean correctos.');
    } finally {
      setResetLoading(false);
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

      {/* Decorative circles - removed as we now have a background image */}

      <div className="w-full max-w-md relative z-10">
        {/* Login Form */}
        <Card className="w-full p-10 shadow-2xl backdrop-blur-sm bg-white">
          {/* Logo centered at top */}
          <div className="flex justify-center mb-0">
            <img src="/images/logo.png" alt="Investi Logo" className="h-20 object-contain" />
          </div>

          {/* Welcome Text */}
          <div className="mb-8 text-center -mt-2">
            <p className="text-sm text-gray-500 mb-1">presenta</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              La carrera del <span className="text-[#be9525]">Ahorro</span>
            </h2>
            <p className="text-gray-600">Aprende a ahorrar y toma mejores decisiones financieras junto a Investï</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                Usuario
              </label>
              <input
                id="username"
                type="text"
                value={rut}
                onChange={handleRUTChange}
                placeholder="Ingresa tu RUT"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#be9525] focus:border-[#be9525] transition-all outline-none"
                required
              />
            </div>

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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#be9525] focus:border-[#be9525] transition-all outline-none"
                required
              />
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-[#be9525] hover:text-[#9a7a1e] font-semibold transition-colors"
                onClick={handleForgotPassword}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#be9525] to-[#f3d374] hover:from-[#9a7a1e] hover:to-[#d4b860] text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all text-lg border-2 border-[#be9525]"
            >
              {loading ? <Loader className="animate-spin" /> : 'Iniciar sesión'}
            </Button>

            {/* Demo Sign In Button */}
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={demoLoading}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {demoLoading ? (
                <Loader className="animate-spin" />
              ) : (
                <Zap className="w-5 h-5" />
              )}
              {demoLoading ? 'Conectando...' : 'Iniciar sesión con cuenta demo'}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{' '}
              <button className="text-[#be9525] hover:text-[#9a7a1e] font-semibold transition-colors" onClick={onShowRegister}>
                Regístrate aquí
              </button>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 text-center text-sm text-red-500">
              <AlertCircle className="inline-block mr-1" />
              {error}
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mt-4 text-center text-sm text-green-500">
              <Zap className="inline-block mr-1" />
              {successMessage}
            </div>
          )}
        </Card>

        {/* Forgot Password Form */}
        {showForgotPassword && (
          <Card className="w-full p-10 shadow-2xl backdrop-blur-sm bg-white mt-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recuperar Contraseña</h3>
            <div className="space-y-6">
              <div>
                <label htmlFor="resetRut" className="block text-sm font-semibold text-gray-700 mb-2">
                  RUT
                </label>
                <input
                  id="resetRut"
                  type="text"
                  value={resetRut}
                  onChange={(e) => setResetRut(e.target.value)}
                  placeholder="Ingresa tu RUT"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#be9525] focus:border-[#be9525] transition-all outline-none"
                />
              </div>

              <div>
                <label htmlFor="resetEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="resetEmail"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Ingresa tu email"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#be9525] focus:border-[#be9525] transition-all outline-none"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="button"
                onClick={handleResetPassword}
                disabled={resetLoading}
                className="w-full bg-gradient-to-r from-[#be9525] to-[#f3d374] hover:from-[#9a7a1e] hover:to-[#d4b860] text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all text-lg border-2 border-[#be9525]"
              >
                {resetLoading ? <Loader className="animate-spin" /> : 'Recuperar contraseña'}
              </Button>

              {/* Cancel Button */}
              <Button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetRut('');
                  setResetEmail('');
                  setError('');
                }}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg transition-all"
              >
                Cancelar
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-white/80 text-sm">© 2025 Investï Plataforma de educación financiera para escolares</p>
      </div>
    </div>
  );
}