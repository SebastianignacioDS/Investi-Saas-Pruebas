import { Card } from './ui/card';
import { Button } from './ui/button';
import { CheckCircle, Award, TrendingUp, Gamepad2, Clock, Star, Trophy, Gift, Zap, Target, BookOpen, AlertCircle, Flame, Lock, ChevronRight, CheckCircle2, ClipboardCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { auth } from '../../utils/supabase';
import { SelfAssessment } from './SelfAssessment';
import { MiniGames } from './MiniGames';
import { Progress } from './ui/progress';

// CompetencyResult type
interface CompetencyResult {
  competency: string;
  currentLevel: string;
  selfEvaluation: number;
  results: any;
}

interface DashboardProps {
  selectedLevel: number | null;
  setSelectedLevel: (level: number | null) => void;
  setCompetencyResults: (results: CompetencyResult[]) => void;
}

export function Dashboard({ selectedLevel, setSelectedLevel, setCompetencyResults }: DashboardProps) {
  const [showAssessment, setShowAssessment] = useState(false);

  // Configuración de colores por nivel
  const levelColors = [
    { from: '#22c55e', to: '#16a34a', bg: 'from-green-500 to-green-600', border: 'border-green-500', checkboxColor: '#16a34a', iconColor: 'from-green-500 to-green-600' }, // Nivel I - Verde
    { from: '#3b82f6', to: '#2563eb', bg: 'from-blue-500 to-blue-600', border: 'border-blue-500', checkboxColor: '#2563eb', iconColor: 'from-blue-500 to-blue-600' },   // Nivel II - Azul
    { from: '#facc15', to: '#eab308', bg: 'from-yellow-400 to-yellow-500', border: 'border-yellow-400', checkboxColor: '#eab308', iconColor: 'from-yellow-400 to-yellow-500' }, // Nivel III - Amarillo
    { from: '#f97316', to: '#ea580c', bg: 'from-orange-500 to-orange-600', border: 'border-orange-500', checkboxColor: '#ea580c', iconColor: 'from-orange-500 to-orange-600' }, // Nivel IV - Naranja
    { from: '#ef4444', to: '#dc2626', bg: 'from-red-500 to-red-600', border: 'border-red-500', checkboxColor: '#dc2626', iconColor: 'from-red-500 to-red-600' },       // Nivel V - Rojo
    { from: '#a855f7', to: '#9333ea', bg: 'from-purple-500 to-purple-600', border: 'border-purple-500', checkboxColor: '#9333ea', iconColor: 'from-purple-500 to-purple-600' }, // Nivel VI - Morado
  ];

  // Color por defecto (dorado)
  const defaultColors = { from: '#be9525', to: '#f3d374', bg: 'from-[#be9525] to-[#f3d374]', border: 'border-[#be9525]', checkboxColor: '#be9525', iconColor: 'from-[#be9525] to-[#f3d374]' };
  
  // Obtener colores actuales basados en selección
  const currentColors = selectedLevel !== null ? levelColors[selectedLevel] : defaultColors;

  const stats = [
    { label: 'Tu racha 🔥', value: '7 días', icon: Flame, color: 'from-orange-500 to-red-500' },
    { label: 'Tu marcador 🏁', value: '2,450', icon: Trophy, color: 'from-[#be9525] to-[#f3d374]' },
    { label: 'Aprendizajes Completados 🎯', value: '12/15', icon: Target, color: 'from-blue-500 to-indigo-600' },
    { label: 'Trofeos 🏆', value: '8', icon: Award, color: 'from-purple-500 to-pink-600' },
  ];

  // Cursos organizados por nivel
  const coursesByLevel = {
    0: [ // Nivel I - Novato (Verde) - TODOS COMPLETADOS
      { name: 'Introducción a la educación financiera', progress: 100, lesson: 'Conceptos básicos del dinero', level: 'Novato', levelRoman: 'I', color: 'border-green-500', bgColor: 'bg-green-500', textColor: 'text-green-600', romanColor: 'text-green-500/10' },
      { name: 'Fundamentos del ahorro', progress: 100, lesson: 'Creando tu primer presupuesto', level: 'Novato', levelRoman: 'I', color: 'border-green-500', bgColor: 'bg-green-500', textColor: 'text-green-600', romanColor: 'text-green-500/10' },
      { name: 'Planificación & Priorización financiera', progress: 100, lesson: 'Aprende a organizar tus finanzas', level: 'Novato', levelRoman: 'I', color: 'border-green-500', bgColor: 'bg-green-500', textColor: 'text-green-600', romanColor: 'text-green-500/10' },
    ],
    1: [ // Nivel II - Aprendiz (Azul) - TODOS COMPLETADOS
      { name: 'Inversiones para escolares', progress: 100, lesson: 'Tipos de inversión básicos', level: 'Aprendiz', levelRoman: 'II', color: 'border-blue-500', bgColor: 'bg-blue-500', textColor: 'text-blue-600', romanColor: 'text-blue-500/10' },
      { name: 'Ahorro VS Inversión', progress: 100, lesson: 'Diferencias y cuándo usar cada uno', level: 'Aprendiz', levelRoman: 'II', color: 'border-blue-500', bgColor: 'bg-blue-500', textColor: 'text-blue-600', romanColor: 'text-blue-500/10' },
      { name: 'Criptomonedas en simple', progress: 100, lesson: 'Introducción al mundo crypto', level: 'Aprendiz', levelRoman: 'II', color: 'border-blue-500', bgColor: 'bg-blue-500', textColor: 'text-blue-600', romanColor: 'text-blue-500/10' },
    ],
    2: [ // Nivel III - Explorador (Amarillo) - EN PROGRESO
      { name: 'Inversiones Avanzadas', progress: 35, lesson: 'Estrategias de inversión complejas', level: 'Explorador', levelRoman: 'III', color: 'border-yellow-400', bgColor: 'bg-yellow-400', textColor: 'text-yellow-600', romanColor: 'text-yellow-400/10' },
      { name: 'Bienestar financiero', progress: 50, lesson: 'Equilibrio entre vida y finanzas', level: 'Explorador', levelRoman: 'III', color: 'border-yellow-400', bgColor: 'bg-yellow-400', textColor: 'text-yellow-600', romanColor: 'text-yellow-400/10' },
      { name: 'Tipos de deudas, buenas y malas', progress: 25, lesson: 'Aprende a diferenciar las deudas', level: 'Explorador', levelRoman: 'III', color: 'border-yellow-400', bgColor: 'bg-yellow-400', textColor: 'text-yellow-600', romanColor: 'text-yellow-400/10' },
    ],
  };

  // Obtener cursos según el nivel seleccionado, por defecto Nivel I
  const recentCourses = selectedLevel !== null && coursesByLevel[selectedLevel as keyof typeof coursesByLevel] 
    ? coursesByLevel[selectedLevel as keyof typeof coursesByLevel] 
    : coursesByLevel[0];

  const todayGoals = [
    { task: 'Completar 1 ruta de aprendizaje', completed: true },
    { task: 'Juega al minijuego "El Camino del Ahorro"', completed: true },
    { task: 'Revisar presupuesto mensual', completed: false },
    { task: 'Leer artículo sobre inversiones', completed: false },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div 
        className={`relative rounded-2xl p-8 text-white shadow-xl overflow-hidden transition-all duration-500 bg-gradient-to-r ${currentColors.bg}`}
      >
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">🏁</span>
              <h2 className="text-3xl font-bold drop-shadow-lg">¡Bienvenido de nuevo, Sebastian!</h2>
            </div>
            <p className="text-amber-100 text-lg drop-shadow-md">La Carrera del Ahorro continúa hoy</p>
          </div>
          
          {/* Progress Track */}
          <div className="hidden lg:flex items-end">
            <div className="flex items-center gap-3">
              {[
                { color: 'bg-green-500', name: 'Novato', active: true, roman: 'I', locked: false },
                { color: 'bg-blue-500', name: 'Aprendiz', active: true, roman: 'II', locked: false },
                { color: 'bg-yellow-400', name: 'Explorador', active: true, roman: 'III', locked: false },
                { color: 'bg-orange-500', name: 'Hábil', active: false, roman: 'IV', locked: true },
                { color: 'bg-red-500', name: 'Experto', active: false, roman: 'V', locked: true },
                { color: 'bg-purple-500', name: 'Maestro', active: false, roman: 'VI', locked: true },
              ].map((level, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex flex-col items-center relative">
                    <button
                      onClick={() => setSelectedLevel(index)}
                      className={`w-8 h-8 ${level.color} rounded-full border-4 border-white shadow-lg flex items-center justify-center transition-all hover:scale-110 ${
                        level.active ? 'ring-4 ring-white/40' : 'opacity-50'
                      } ${selectedLevel === index ? 'ring-4 ring-white/60 scale-110' : ''} relative`}
                    >
                      {level.locked ? (
                        <Lock className="w-4 h-4 text-white" />
                      ) : (
                        <span className="text-white text-xs font-bold">{level.roman}</span>
                      )}
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className={`p-6 hover:shadow-lg transition-all border-2 ${currentColors.border}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-12 h-12 bg-gradient-to-br ${currentColors.iconColor} rounded-xl flex items-center justify-center transition-all duration-500`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {stat.label === 'Tu marcador 🏁' && (
                    <span className="font-bold text-xs text-gray-700">TOP 67</span>
                  )}
                  {stat.label === 'Tu racha 🔥' && (
                    <span className="font-bold text-xs text-gray-700">Record 26 días</span>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Evaluación de Conocimientos - Call to Action */}
      <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <ClipboardCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-xl mb-1">Evaluación de progreso</h3>
              <p className="text-gray-600">Conoce tu nivel real y desbloquea el siguiente tramo de tu camino financiero.</p>
            </div>
          </div>
          <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white" onClick={() => setShowAssessment(true)}>
            Iniciar evaluación
          </Button>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Courses */}
        <Card className={`lg:col-span-2 p-6 border-2 ${currentColors.border} transition-all`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-xl">Rutas de aprendizaje</h3>
            <Button variant="ghost" size="sm">
              Ver todos
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          {/* Si el nivel está bloqueado (IV, V, VI) mostrar estado bloqueado */}
          {selectedLevel !== null && selectedLevel >= 3 ? (
            <div className="flex flex-col items-center justify-center py-16 px-8">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all duration-500 bg-gradient-to-br ${currentColors.bg}`}>
                <Lock className="w-12 h-12 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">Contenido bloqueado</h4>
              <p className="text-gray-600 text-center">
                Debes seguir avanzando para desbloquear más rutas
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentCourses.map((course, index) => (
                <div key={index} className={`p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer relative border-2 ${course.color} overflow-hidden`}>
                  {/* Número Romano de Fondo */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className={`text-9xl font-bold ${course.romanColor}`}>{course.levelRoman}</span>
                  </div>
                  <span className={`absolute top-4 right-4 px-3 py-1 ${course.bgColor} text-white text-xs font-bold rounded-md z-10`}>
                    {course.level}
                  </span>
                  <div className="mb-2 relative z-10">
                    <h4 className="font-semibold pr-20">{course.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{course.lesson}</p>
                  </div>
                  <Progress value={course.progress} className="h-2 relative z-10" />
                  <div className="flex items-center justify-center gap-2 mt-2 relative z-10">
                    <span className={`text-sm font-semibold ${course.textColor}`}>{course.progress}%</span>
                    {course.progress === 100 && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Today's Goals */}
        <Card className={`p-6 border-2 ${currentColors.border} transition-all`}>
          <h3 className="font-bold text-xl mb-6">Desafíos diarios</h3>
          <div className="space-y-3">
            {todayGoals.map((goal, index) => (
              <div key={index} className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={goal.completed}
                  readOnly
                  style={{ accentColor: currentColors.checkboxColor }}
                  className="mt-1 w-5 h-5 rounded border-gray-300 transition-all duration-500 cursor-pointer"
                />
                <span className={`flex-1 ${goal.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                  {goal.task}
                </span>
              </div>
            ))}
          </div>
          <div className={`mt-6 p-4 rounded-lg text-white transition-all duration-500 bg-gradient-to-r ${currentColors.bg}`}>
            <p className="text-sm opacity-90">Progreso del día</p>
            <p className="text-2xl font-bold mt-1">50%</p>
            <Progress value={50} className="mt-2 h-2 bg-white/20" />
          </div>
        </Card>
      </div>

      {/* Recent Achievements */}
      <Card className={`p-6 border-2 ${currentColors.border} transition-all`}>
        <h3 className="font-bold text-xl mb-4">Logros Recientes 🎉</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full mx-auto flex items-center justify-center mb-2">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <p className="font-semibold text-sm">Racha de 7 días</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full mx-auto flex items-center justify-center mb-2">
              <Award className="w-8 h-8 text-white" />
            </div>
            <p className="font-semibold text-sm">10 Lecciones</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mx-auto flex items-center justify-center mb-2">
              <Target className="w-8 h-8 text-white" />
            </div>
            <p className="font-semibold text-sm">Meta Cumplida</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mx-auto flex items-center justify-center mb-2">
              <Flame className="w-8 h-8 text-white" />
            </div>
            <p className="font-semibold text-sm">¡Imparable!</p>
          </div>
        </div>
      </Card>

      {/* Self Assessment Modal */}
      {showAssessment && (
        <SelfAssessment 
          onClose={() => setShowAssessment(false)} 
          onComplete={(results) => {
            console.log('Resultados de la autoevaluación:', results);
            // Aquí puedes guardar los resultados en el estado o enviarlos a una API
            setCompetencyResults(results);
            setShowAssessment(false);
          }}
        />
      )}
    </div>
  );
}