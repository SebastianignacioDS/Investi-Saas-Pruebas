import { useState } from 'react';
import { User, Target, Trophy, BookOpen, Award, Star, TrendingUp, Calendar, Plus, Check, X, Trash2, Edit2, ChevronUp, ChevronDown, Lock } from 'lucide-react';
import { Card } from './ui/card';
import { CompetencyResult } from '../App';

interface ProfileProps {
  selectedLevel: number | null;
  setSelectedLevel: (level: number | null) => void;
  competencyResults: CompetencyResult[];
  setActiveView: (view: string) => void;
  grade: string;
  course: string;
  name: string;
}

interface Goal {
  id: number;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  icon: string;
  deadline: string;
  category: 'short' | 'medium' | 'long';
}

export function Profile({ selectedLevel, setSelectedLevel, competencyResults, setActiveView, grade, course, name }: ProfileProps) {
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showEditCourseGoal, setShowEditCourseGoal] = useState(false);
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetAmount: 0,
    deadline: '',
    icon: '',
  });

  // Simulación de permisos - cambiar a true si el usuario es Profesor Jefe o Tesorero
  const hasEditPermission = false; // Cambiar a true para probar con permisos

  const [courseGoal, setCourseGoal] = useState({
    title: 'Gira de Estudios',
    description: 'Meta colaborativa de todo el curso',
    targetAmount: 5000000,
    currentAmount: 1000000,
    deadline: 'Sep 2025',
    participants: 32,
  });
  
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      title: 'Zapatillas nuevas',
      description: 'Nike Air Jordan',
      targetAmount: 89990,
      currentAmount: 45000,
      icon: '👟',
      deadline: '15 Feb 2025',
      category: 'short',
    },
    {
      id: 2,
      title: 'Ir al cine',
      description: 'Ver la nueva película de Marvel',
      targetAmount: 8000,
      currentAmount: 8000,
      icon: '🎬',
      deadline: '28 Dic 2024',
      category: 'short',
    },
    {
      id: 3,
      title: 'Viaje de vacaciones',
      description: 'Viaje a la playa en verano',
      targetAmount: 250000,
      currentAmount: 87000,
      icon: '✈️',
      deadline: '15 Ene 2026',
      category: 'long',
    },
  ]);

  // Configuración de colores por nivel
  const levelColors = [
    { 
      from: 'from-green-500', 
      to: 'to-green-600', 
      bg: 'from-green-500 to-green-600', 
      border: 'border-green-500',
      bgLight: 'bg-green-50',
      text: 'text-green-600',
      progressBar: 'from-green-500 to-green-600'
    }, // Nivel I - Verde
    { 
      from: 'from-blue-500', 
      to: 'to-blue-600', 
      bg: 'from-blue-500 to-blue-600', 
      border: 'border-blue-500',
      bgLight: 'bg-blue-50',
      text: 'text-blue-600',
      progressBar: 'from-blue-500 to-blue-600'
    }, // Nivel II - Azul
    { 
      from: 'from-yellow-400', 
      to: 'to-yellow-500', 
      bg: 'from-yellow-400 to-yellow-500', 
      border: 'border-yellow-400',
      bgLight: 'bg-yellow-50',
      text: 'text-yellow-600',
      progressBar: 'from-yellow-400 to-yellow-500'
    }, // Nivel III - Amarillo
    { 
      from: 'from-orange-500', 
      to: 'to-orange-600', 
      bg: 'from-orange-500 to-orange-600', 
      border: 'border-orange-500',
      bgLight: 'bg-orange-50',
      text: 'text-orange-600',
      progressBar: 'from-orange-500 to-orange-600'
    }, // Nivel IV - Naranja
    { 
      from: 'from-red-500', 
      to: 'to-red-600', 
      bg: 'from-red-500 to-red-600', 
      border: 'border-red-500',
      bgLight: 'bg-red-50',
      text: 'text-red-600',
      progressBar: 'from-red-500 to-red-600'
    }, // Nivel V - Rojo
    { 
      from: 'from-purple-500', 
      to: 'to-purple-600', 
      bg: 'from-purple-500 to-purple-600', 
      border: 'border-purple-500',
      bgLight: 'bg-purple-50',
      text: 'text-purple-600',
      progressBar: 'from-purple-500 to-purple-600'
    }, // Nivel VI - Morado
  ];

  // Color por defecto (dorado)
  const defaultColors = { 
    from: 'from-[#be9525]', 
    to: 'to-[#f3d374]', 
    bg: 'from-[#be9525] to-[#f3d374]', 
    border: 'border-[#be9525]',
    bgLight: 'bg-amber-50',
    text: 'text-[#be9525]',
    progressBar: 'from-[#be9525] to-[#f3d374]'
  };

  // Obtener colores actuales según el nivel seleccionado
  const currentColors = selectedLevel !== null ? levelColors[selectedLevel] : defaultColors;

  const trophies = [
    { id: 1, name: 'Primer Ahorro', icon: '🏆', description: 'Completaste tu primera meta de ahorro', date: '10 Dic 2024', rarity: 'gold' },
    { id: 2, name: 'Racha Perfecta', icon: '🔥', description: '7 días seguidos ahorrando', date: '18 Dic 2024', rarity: 'silver' },
    { id: 3, name: 'Sabio Financiero', icon: '🎓', description: 'Completaste 10 lecciones', date: '20 Dic 2024', rarity: 'bronze' },
    { id: 4, name: 'Campeón de Ahorro', icon: '💰', description: 'Ahorraste $100.000 en total', date: '22 Dic 2024', rarity: 'gold' },
    { id: 5, name: 'Competidor Elite', icon: '⚔️', description: 'Ganaste 3 competencias', date: '23 Dic 2024', rarity: 'silver' },
    { id: 6, name: 'Maestro del Presupuesto', icon: '📊', description: 'Planificaste 5 presupuestos perfectos', date: '23 Dic 2024', rarity: 'bronze' },
  ];

  const stats = {
    learningsCompleted: 12,
    totalLearnings: 15,
    trophiesEarned: 8,
    totalTrophies: 12,
    currentStreak: 12,
    totalSaved: 142000,
    goalsCompleted: 1,
    totalGoals: 3,
  };

  const deleteGoal = (id: number) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const moveGoalUp = (index: number) => {
    if (index > 0) {
      const newGoals = [...goals];
      [newGoals[index - 1], newGoals[index]] = [newGoals[index], newGoals[index - 1]];
      setGoals(newGoals);
    }
  };

  const moveGoalDown = (index: number) => {
    if (index < goals.length - 1) {
      const newGoals = [...goals];
      [newGoals[index], newGoals[index + 1]] = [newGoals[index + 1], newGoals[index]];
      setGoals(newGoals);
    }
  };

  const goalTemplates = [
    { title: 'Comprar un celular', icon: '📱', defaultAmount: 300000 },
    { title: 'Audífonos', icon: '🎧', defaultAmount: 50000 },
    { title: 'Zapatillas nuevas', icon: '👟', defaultAmount: 80000 },
    { title: 'Ir al cine', icon: '🎬', defaultAmount: 8000 },
    { title: 'Viaje de vacaciones', icon: '✈️', defaultAmount: 250000 },
    { title: 'Notebook', icon: '💻', defaultAmount: 500000 },
    { title: 'Salir a comer', icon: '🍽️', defaultAmount: 15000 },
    { title: 'Carrete', icon: '🎉', defaultAmount: 20000 },
  ];

  const handleSelectGoalTemplate = (template: typeof goalTemplates[0]) => {
    setNewGoal({
      ...newGoal,
      title: template.title,
      icon: template.icon,
      targetAmount: template.defaultAmount,
    });
  };

  const handleSaveGoal = () => {
    if (newGoal.title && newGoal.targetAmount > 0 && newGoal.deadline && newGoal.description) {
      const newGoalItem: Goal = {
        id: goals.length + 1,
        title: newGoal.title,
        description: newGoal.description,
        targetAmount: newGoal.targetAmount,
        currentAmount: 0,
        icon: newGoal.icon,
        deadline: newGoal.deadline,
        category: 'short',
      };
      setGoals([...goals, newGoalItem]);
      setShowAddGoal(false);
      setNewGoal({
        title: '',
        description: '',
        targetAmount: 0,
        deadline: '',
        icon: '',
      });
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'gold': return 'from-yellow-400 to-yellow-500';
      case 'silver': return 'from-gray-300 to-gray-400';
      case 'bronze': return 'from-orange-400 to-orange-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Modal para Editar Meta del Curso */}
      {showEditCourseGoal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Editar Meta del Curso 🎓</h2>
                  <p className="text-sm text-white/90 mt-1">Solo disponible para Profesor Jefe y Tesorero</p>
                </div>
                <button
                  onClick={() => setShowEditCourseGoal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Nombre de la meta */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre de la meta</label>
                <input
                  type="text"
                  value={courseGoal.title}
                  onChange={(e) => setCourseGoal({ ...courseGoal, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 transition-all"
                  placeholder="Ej: Gira de Estudios"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
                <input
                  type="text"
                  value={courseGoal.description}
                  onChange={(e) => setCourseGoal({ ...courseGoal, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 transition-all"
                  placeholder="Ej: Meta colaborativa de todo el curso"
                />
              </div>

              {/* Monto objetivo */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Monto objetivo total</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                  <input
                    type="number"
                    value={courseGoal.targetAmount}
                    onChange={(e) => setCourseGoal({ ...courseGoal, targetAmount: parseInt(e.target.value) || 0 })}
                    className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 transition-all"
                    placeholder="5000000"
                  />
                </div>
                {courseGoal.targetAmount > 0 && (
                  <div className="mt-2 p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-700 font-semibold">
                      Monto total: ${courseGoal.targetAmount.toLocaleString('es-CL')} CLP
                    </p>
                    <p className="text-xs text-purple-600 mt-1">
                      Aporte por estudiante (aprox.): ${Math.round(courseGoal.targetAmount / courseGoal.participants).toLocaleString('es-CL')}
                    </p>
                  </div>
                )}
              </div>

              {/* Fecha límite */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha límite</label>
                <input
                  type="text"
                  value={courseGoal.deadline}
                  onChange={(e) => setCourseGoal({ ...courseGoal, deadline: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 transition-all"
                  placeholder="Ej: Sep 2025"
                />
              </div>

              {/* Número de participantes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Número de estudiantes participando</label>
                <input
                  type="number"
                  value={courseGoal.participants}
                  onChange={(e) => setCourseGoal({ ...courseGoal, participants: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 transition-all"
                  placeholder="32"
                />
              </div>

              {/* Aviso de permisos */}
              <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">⚠️</div>
                  <div>
                    <p className="text-sm font-semibold text-amber-800">Permisos requeridos</p>
                    <p className="text-xs text-amber-700 mt-1">
                      Solo el <strong>Profesor Jefe</strong> o el <strong>Tesorero del curso</strong> pueden editar la meta colaborativa del curso.
                    </p>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowEditCourseGoal(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    setShowEditCourseGoal(false);
                    // Aquí se guardarían los cambios
                  }}
                  className="flex-1 px-6 py-3 rounded-lg font-semibold text-white transition-all bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg hover:scale-105"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Agregar Nueva Meta */}
      {showAddGoal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className={`p-6 bg-gradient-to-r ${currentColors.bg} text-white rounded-t-2xl transition-all duration-500`}>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Crear Nueva Meta 🎯</h2>
                <button
                  onClick={() => {
                    setShowAddGoal(false);
                    setNewGoal({ title: '', description: '', targetAmount: 0, deadline: '', icon: '' });
                  }}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Seleccionar tipo de meta */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Selecciona tu meta</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {goalTemplates.map((template, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectGoalTemplate(template)}
                      className={`p-4 rounded-xl border-2 transition-all hover:shadow-lg ${
                        newGoal.title === template.title
                          ? `${currentColors.border} ${currentColors.bgLight} shadow-lg`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">{template.icon}</div>
                      <p className="text-xs font-semibold text-gray-700 text-center">{template.title}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Descripción de la meta */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
                <input
                  type="text"
                  placeholder="Ej: Para mi cumpleaños"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-all"
                />
              </div>

              {/* Presupuesto */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Presupuesto necesario</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                  <input
                    type="number"
                    placeholder="50000"
                    value={newGoal.targetAmount || ''}
                    onChange={(e) => setNewGoal({ ...newGoal, targetAmount: parseInt(e.target.value) || 0 })}
                    className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-all"
                  />
                </div>
                {newGoal.targetAmount > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    ${newGoal.targetAmount.toLocaleString('es-CL')} CLP
                  </p>
                )}
              </div>

              {/* Fecha límite */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha límite</label>
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-all"
                />
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddGoal(false);
                    setNewGoal({ title: '', description: '', targetAmount: 0, deadline: '', icon: '' });
                  }}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveGoal}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white transition-all bg-gradient-to-r ${currentColors.bg} hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
                  disabled={!newGoal.title || !newGoal.description || newGoal.targetAmount <= 0 || !newGoal.deadline}
                >
                  Crear Meta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header con Información del Perfil */}
      <div 
        className={`relative rounded-2xl p-8 text-white shadow-xl overflow-hidden transition-all duration-500 bg-gradient-to-r ${currentColors.bg}`}
      >
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white shadow-2xl">
                <span className="text-4xl font-bold">SE</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2 drop-shadow-lg">{name} Estudiante</h1>
                <p className="text-white/90 text-lg drop-shadow-md">Nivel 15 - Explorador - {grade} {course}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-white" />
                    <span className="font-semibold">750 XP</span>
                  </div>
                  <div className="w-1 h-6 bg-white/30"></div>
                  <div className="flex items-center gap-1">
                    <Trophy className="w-5 h-5" />
                    <span className="font-semibold">{stats.trophiesEarned} Trofeos</span>
                  </div>
                  <div className="w-1 h-6 bg-white/30"></div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-semibold">{stats.currentStreak} días</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ruta de Progreso */}
            <div className="flex items-center gap-3">
              {[
                { color: 'bg-green-500', name: 'Novato', active: true, roman: 'I' },
                { color: 'bg-blue-500', name: 'Aprendiz', active: true, roman: 'II' },
                { color: 'bg-yellow-400', name: 'Explorador', active: true, roman: 'III' },
                { color: 'bg-orange-500', name: 'Hábil', active: false, roman: 'IV' },
                { color: 'bg-red-500', name: 'Experto', active: false, roman: 'V' },
                { color: 'bg-purple-500', name: 'Maestro', active: false, roman: 'VI' },
              ].map((level, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex flex-col items-center relative">
                    <button
                      onClick={() => setSelectedLevel(index)}
                      className={`w-8 h-8 ${level.color} rounded-full border-4 border-white shadow-lg flex items-center justify-center transition-all hover:scale-110 ${
                        level.active ? 'ring-4 ring-white/40' : 'opacity-50'
                      } ${selectedLevel === index ? 'ring-4 ring-white/60 scale-110' : ''}`}
                    >
                      <span className="text-white text-xs font-bold">{level.roman}</span>
                    </button>
                    {selectedLevel === index && (
                      <div className="absolute top-full mt-2 bg-white/90 text-gray-800 px-4 py-2 rounded-full shadow-lg font-bold text-sm whitespace-nowrap animate-in fade-in duration-200">
                        {level.name}
                      </div>
                    )}
                  </div>
                  {index < 5 && (
                    <div className={`w-12 h-1 ${level.active ? 'bg-white' : 'bg-white/30'} mx-1`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={`p-6 bg-white border-2 transition-all duration-500 ${currentColors.border}`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${currentColors.bg} rounded-xl flex items-center justify-center transition-all duration-500`}>
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Aprendizajes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.learningsCompleted}/{stats.totalLearnings}</p>
            </div>
          </div>
        </Card>

        <Card className={`p-6 bg-white border-2 transition-all duration-500 ${currentColors.border}`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${currentColors.bg} rounded-xl flex items-center justify-center transition-all duration-500`}>
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Trofeos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.trophiesEarned}/{stats.totalTrophies}</p>
            </div>
          </div>
        </Card>

        <Card className={`p-6 bg-white border-2 transition-all duration-500 ${currentColors.border}`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${currentColors.bg} rounded-xl flex items-center justify-center transition-all duration-500`}>
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Metas Logradas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.goalsCompleted}/{stats.totalGoals}</p>
            </div>
          </div>
        </Card>

        <Card className={`p-6 bg-white border-2 transition-all duration-500 ${currentColors.border}`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${currentColors.bg} rounded-xl flex items-center justify-center transition-all duration-500`}>
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Ahorrado</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalSaved.toLocaleString('es-CL')}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Mis Metas de Ahorro */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Mis metas 🎯
          </h2>
          <button
            onClick={() => setShowAddGoal(!showAddGoal)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white transition-all bg-gradient-to-r ${currentColors.bg} hover:shadow-lg hover:scale-105`}
          >
            <Plus className="w-5 h-5" />
            <span>Nueva Meta</span>
          </button>
        </div>

        {/* Meta de Curso - Gira de Estudios */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-xl font-bold text-gray-900">Meta del Curso 🎓</h3>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">2do Medio A</span>
          </div>
          <Card className={`p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-400 relative overflow-hidden shadow-lg`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-30"></div>
            
            {/* Botón de Editar en esquina superior derecha */}
            <button
              onClick={() => {
                if (hasEditPermission) {
                  setShowEditCourseGoal(true);
                } else {
                  setShowAccessDenied(true);
                }
              }}
              className="absolute top-3 right-3 z-10 p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all hover:scale-110 shadow-lg"
              title="Editar meta del curso (Solo Profesor Jefe y Tesorero)"
            >
              <Edit2 className="w-4 h-4" />
            </button>

            <div className="relative z-10">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-4xl shadow-xl">
                  🎓
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">Gira de Estudios</h3>
                  <p className="text-sm text-gray-700 mt-1">Meta colaborativa de todo el curso</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-3 py-1 bg-purple-500 text-white rounded-full text-xs font-semibold">
                      🏆 Colaborativa
                    </span>
                    <span className="text-sm text-gray-600">32 estudiantes participando</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-700 font-semibold">Progreso del curso</span>
                    <span className="font-bold text-purple-700">
                      $1.000.000 / $5.000.000
                    </span>
                  </div>
                  <div className="w-full bg-white rounded-full h-4 overflow-hidden border-2 border-purple-300">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500"
                      style={{ width: '20%' }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 font-semibold">20% completado - ¡Quedan $4.000.000!</p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t-2 border-purple-200">
                  <div className="bg-white/60 rounded-lg p-3">
                    <p className="text-xs text-gray-600">Tu aporte individual</p>
                    <p className="text-lg font-bold text-purple-700">$31.250</p>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3">
                    <p className="text-xs text-gray-600">Fecha límite</p>
                    <p className="text-lg font-bold text-purple-700">Sep 2025</p>
                  </div>
                </div>

                <button 
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-white transition-all bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg hover:scale-105"
                >
                  <Plus className="w-5 h-5" />
                  Aportar a la meta del curso
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Mis Metas Personales */}
        <h3 className="text-xl font-bold text-gray-900 mb-3">Mis Metas Personales 💪</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal, index) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const isCompleted = progress >= 100;

            return (
              <Card key={goal.id} className={`p-6 hover:shadow-xl transition-all border-2 ${currentColors.border} relative overflow-hidden`}>
                {/* Número de Prioridad */}
                <div className={`absolute top-3 left-3 w-8 h-8 bg-gradient-to-br ${currentColors.bg} rounded-full flex items-center justify-center shadow-lg transition-all duration-500`}>
                  <span className="text-white font-bold text-sm">{index + 1}</span>
                </div>

                {isCompleted && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-green-500 text-white rounded-full p-2">
                      <Check className="w-5 h-5" />
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-4 mb-4 mt-2">
                  <div className={`w-16 h-16 bg-gradient-to-br ${currentColors.bg} rounded-2xl flex items-center justify-center text-3xl shadow-lg transition-all duration-500`}>
                    {goal.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">{goal.title}</h3>
                    <p className="text-sm text-gray-600">{goal.description}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Ahorro</span>
                      <span className={`font-semibold transition-all duration-500 ${currentColors.text}`}>
                        ${goal.currentAmount.toLocaleString('es-CL')} / ${goal.targetAmount.toLocaleString('es-CL')}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`bg-gradient-to-r ${currentColors.progressBar} h-full transition-all duration-500`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{Math.round(progress)}% completado</p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Fecha: {goal.deadline}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                    <button 
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-semibold transition-all bg-gradient-to-r ${currentColors.bg} text-white hover:shadow-lg text-sm`}
                    >
                      <Plus className="w-4 h-4" />
                      Agregar ahorro
                    </button>
                    <button 
                      onClick={() => deleteGoal(goal.id)}
                      className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => moveGoalUp(index)}
                      className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => moveGoalDown(index)}
                      className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Mis Competencias */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Mis Competencias 📚</h2>
        
        {competencyResults.length === 0 ? (
          // Si no hay resultados de autoevaluación, mostrar mensaje
          <Card className="p-8 text-center border-2 border-dashed border-gray-300">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Descubre tu nivel en cada competencia</h3>
              <p className="text-gray-600 mb-6">Completa la evaluación de progreso para conocer tu nivel real en las 7 competencias financieras</p>
              <button 
                onClick={() => setActiveView('dashboard')}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all"
              >
                Ir a la evaluación
              </button>
            </div>
          </Card>
        ) : (
          // Si hay resultados, mostrarlos
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {competencyResults.map((competence) => {
              // Mapeo de íconos y colores por nombre de competencia
              const competencyConfig: Record<string, { icon: string; color: string; maxScore: number }> = {
                'Planificación de metas': { icon: '🧠', color: 'from-blue-500 to-blue-600', maxScore: 12 }, // 3 preguntas
                'Creación de presupuestos': { icon: '💰', color: 'from-green-500 to-green-600', maxScore: 12 }, // 3 preguntas
                'Priorización': { icon: '🧮', color: 'from-yellow-500 to-yellow-600', maxScore: 12 }, // 3 preguntas
                'Inversión': { icon: '📈', color: 'from-orange-500 to-orange-600', maxScore: 12 }, // 3 preguntas
                'Ahorro': { icon: '🏦', color: 'from-red-500 to-red-600', maxScore: 12 }, // 3 preguntas
                'Deuda responsable': { icon: '💳', color: 'from-purple-500 to-purple-600', maxScore: 12 }, // 3 preguntas
                'Riesgos financieros': { icon: '🚨', color: 'from-pink-500 to-pink-600', maxScore: 12 }, // 3 preguntas
              };

              const config = competencyConfig[competence.name] || { icon: '📚', color: 'from-gray-500 to-gray-600', maxScore: 8 };

              // Sistema de niveles gamificados (I-VI)
              const gamificationLevels = [
                { roman: 'I', name: 'Novato', color: 'bg-green-500', borderColor: 'border-green-500', bgColor: 'text-green-500/10' },
                { roman: 'II', name: 'Aprendiz', color: 'bg-blue-500', borderColor: 'border-blue-500', bgColor: 'text-blue-500/10' },
                { roman: 'III', name: 'Explorador', color: 'bg-yellow-400', borderColor: 'border-yellow-400', bgColor: 'text-yellow-400/10' },
                { roman: 'IV', name: 'Hábil', color: 'bg-orange-500', borderColor: 'border-orange-500', bgColor: 'text-orange-500/10' },
                { roman: 'V', name: 'Experto', color: 'bg-red-500', borderColor: 'border-red-500', bgColor: 'text-red-500/10' },
                { roman: 'VI', name: 'Maestro', color: 'bg-purple-500', borderColor: 'border-purple-500', bgColor: 'text-purple-500/10' },
              ];
              
              const currentLevel = gamificationLevels[competence.level - 1];
              const maxLevel = 6;
              const isMaxLevel = competence.level === maxLevel;
              
              return (
                <Card key={competence.id} className={`p-6 hover:shadow-xl transition-all border-2 ${currentLevel.borderColor} bg-white relative overflow-hidden`}>
                  {/* Número Romano de fondo CENTRADO grande y transparente */}
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl font-bold ${currentLevel.bgColor} select-none pointer-events-none`}>
                    {currentLevel.roman}
                  </div>

                  {/* Badge de nombre del nivel en esquina superior derecha */}
                  <div className={`absolute top-3 right-3 ${currentLevel.color} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10`}>
                    {currentLevel.name}
                  </div>

                  <div className="flex items-start gap-4 mb-4 relative z-10">
                    <div className={`w-14 h-14 bg-gradient-to-br ${config.color} rounded-xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}>
                      {config.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 mb-1">{competence.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-600">
                          Nivel {currentLevel.roman}
                        </span>
                        <span className="text-xs text-gray-500">
                          • Puntaje: {competence.score}/{config.maxScore}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Mis Trofeos */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Mis Trofeos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trophies.map((trophy) => (
            <Card key={trophy.id} className={`p-6 hover:shadow-xl transition-all border-2 ${currentColors.border}`}>
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${getRarityColor(trophy.rarity)} rounded-2xl flex items-center justify-center text-3xl shadow-lg`}>
                  {trophy.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{trophy.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{trophy.description}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <Award className="w-3 h-3" />
                    <span>Obtenido el {trophy.date}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Trofeos Bloqueados */}
        <div className="mt-6">
          <h3 className="text-lg font-bold text-gray-700 mb-3">Próximos Trofeos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Inversionista Junior', description: 'Completa el módulo de inversiones', icon: '📈' },
              { name: 'Súper Ahorrador', description: 'Ahorra $500.000 en total', icon: '💎' },
              { name: 'Mentor Financiero', description: 'Ayuda a 5 compañeros', icon: '🎯' },
            ].map((locked, index) => (
              <Card key={index} className="p-6 bg-gray-100 border-2 border-gray-300 border-dashed opacity-60">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-xl flex items-center justify-center text-2xl">
                    🔒
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-700">{locked.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{locked.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de Acceso Denegado */}
      {showAccessDenied && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Acceso Denegado 🔒</h2>
                  <p className="text-sm text-white/90 mt-1">No tienes permisos suficientes</p>
                </div>
                <button
                  onClick={() => setShowAccessDenied(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6">
              {/* Icono de candado grande centrado */}
              <div className="flex justify-center">
                <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center shadow-lg">
                  <Lock className="w-16 h-16 text-red-600" />
                </div>
              </div>

              {/* Mensaje principal */}
              <div className="text-center space-y-3">
                <h3 className="text-xl font-bold text-gray-900">Función restringida</h3>
                <p className="text-gray-700">
                  Solo el <strong className="text-red-600">Profesor Jefe</strong> o el <strong className="text-red-600">Tesorero del curso</strong> pueden editar la meta colaborativa.
                </p>
              </div>

              {/* Información adicional */}
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">ℹ️</div>
                  <div>
                    <p className="text-sm font-semibold text-red-800">¿Necesitas editar esta meta?</p>
                    <p className="text-xs text-red-700 mt-1">
                      Contacta a tu Profesor Jefe o al Tesorero del curso para solicitar cambios en la meta colaborativa.
                    </p>
                  </div>
                </div>
              </div>

              {/* Botón de cerrar */}
              <button
                onClick={() => setShowAccessDenied(false)}
                className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}