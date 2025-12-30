import { useState } from 'react';
import { Card } from './ui/card';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface ResetPasswordProps {
  onBackToLogin: () => void;
}

export function ResetPassword({ onBackToLogin }: ResetPasswordProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!newPassword || !confirmPassword) {
      setError('Por favor, completa todos los campos.');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient(
        `https://${projectId}.supabase.co`,
        publicAnonKey
      );

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        throw updateError;
      }

      setSuccess(true);
      setTimeout(() => {
        onBackToLogin();
      }, 3000);
    } catch (err: any) {
      console.error('Error al resetear contraseña:', err);
      setError(err.message || 'Error al actualizar la contraseña. Por favor, solicita un nuevo enlace.');
    } finally {
      setLoading(false);
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
        <Card className="w-full p-10 shadow-2xl backdrop-blur-sm bg-white">
          {/* Logo centered at top */}
          <div className="flex justify-center mb-6">
            <img src="/images/logo.png" alt="Investi Logo" className="h-20 object-contain" />
          </div>

          {success ? (
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                ¡Contraseña actualizada!
              </h2>
              <p className="text-gray-600 mb-6">
                Tu contraseña ha sido actualizada exitosamente. Redirigiendo al login...
              </p>
            </div>
          ) : (
            <>
              {/* Welcome Text */}
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Nueva <span className="text-[#be9525]">Contraseña</span>
                </h2>
                <p className="text-gray-600">Ingresa tu nueva contraseña para continuar</p>
              </div>

              {/* Reset Password Form */}
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    Nueva Contraseña
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Ingresa tu nueva contraseña"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#be9525] focus:border-[#be9525] transition-all outline-none"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirmar Contraseña
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirma tu nueva contraseña"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#be9525] focus:border-[#be9525] transition-all outline-none"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#be9525] to-[#f3d374] hover:from-[#9a7a1e] hover:to-[#d4b860] text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all text-lg border-2 border-[#be9525]"
                >
                  {loading ? <Loader className="animate-spin" /> : 'Actualizar contraseña'}
                </button>

                {/* Back to Login Button */}
                <button
                  type="button"
                  onClick={onBackToLogin}
                  className="w-full text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Volver al login
                </button>
              </form>

              {/* Error Message */}
              {error && (
                <div className="mt-4 flex items-center gap-2 text-sm text-red-500">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}
            </>
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