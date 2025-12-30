import { User, Bell, Globe, Lock, GraduationCap, BookOpen, Database } from 'lucide-react';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { profile } from '../../utils/supabase';
import { useState, useEffect } from 'react';

interface SettingsProps {
  grade: string;
  setGrade: (grade: string) => void;
  course: string;
  setCourse: (course: string) => void;
  name: string;
  setName: (name: string) => void;
  setActiveView?: (view: string) => void;
}

export function Settings({ grade, setGrade, course, setCourse, name, setName, setActiveView }: SettingsProps) {
  const [saving, setSaving] = useState(false);

  // Función para guardar cambios en el backend
  const handleSaveChanges = async (field: string, value: string) => {
    setSaving(true);
    try {
      await profile.update({ [field]: value });
    } catch (error) {
      console.error('Error al guardar cambios:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleNameChange = (newName: string) => {
    setName(newName);
    handleSaveChanges('name', newName);
  };

  const handleGradeChange = (newGrade: string) => {
    setGrade(newGrade);
    handleSaveChanges('grade', newGrade);
  };

  const handleCourseChange = (newCourse: string) => {
    setCourse(newCourse);
    handleSaveChanges('course', newCourse);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Configuración</h2>
        <p className="text-gray-600 mt-1">Personaliza tu experiencia de aprendizaje</p>
      </div>

      {/* Profile Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-[#be9525] to-[#f3d374] rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold text-xl">Perfil</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              defaultValue="ana@ejemplo.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Grado</label>
            <select 
              value={grade}
              onChange={(e) => handleGradeChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option>6to Básico</option>
              <option>7mo Básico</option>
              <option>8vo Básico</option>
              <option>1ero Medio</option>
              <option>2do Medio</option>
              <option>3ro Medio</option>
              <option>4to Medio</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Curso</label>
            <select 
              value={course}
              onChange={(e) => handleCourseChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option>A</option>
              <option>B</option>
              <option>C</option>
              <option>D</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold text-xl">Notificaciones</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Recordatorios de lecciones</p>
              <p className="text-sm text-gray-600">Recibe recordatorios diarios para estudiar</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Nuevos logros</p>
              <p className="text-sm text-gray-600">Notificaciones cuando desbloquees logros</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Metas completadas</p>
              <p className="text-sm text-gray-600">Celebra cuando alcances tus objetivos</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </Card>

      {/* Language & Region */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold text-xl">Idioma y Región</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Idioma</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option>Español</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Supabase Backend Testing */}
      {setActiveView && (
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-xl">Backend y Base de Datos</h3>
          </div>
          <p className="text-gray-700 mb-4">
            Investï está conectado a Supabase para persistencia de datos, autenticación real con RUT y sincronización entre dispositivos.
          </p>
          <button
            onClick={() => setActiveView('supabase-test')}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <Database className="w-5 h-5" />
            Probar Conexión a Supabase
          </button>
        </Card>
      )}
    </div>
  );
}