import { BookOpen, CheckCircle2, Lock, Play, Award, Zap, TrendingUp } from 'lucide-react';
import { Card } from './ui/card';

interface LearningsProps {
  selectedLevel: number | null;
  setSelectedLevel: (level: number | null) => void;
}

export function Learnings({ selectedLevel, setSelectedLevel }: LearningsProps) {
  // Configuración de colores por nivel
  const levelColors = [
    { from: '#22c55e', to: '#16a34a', bg: 'from-green-500 to-green-600', border: 'border-green-500', iconColor: 'from-green-500 to-green-600' }, // Nivel I - Verde
    { from: '#3b82f6', to: '#2563eb', bg: 'from-blue-500 to-blue-600', border: 'border-blue-500', iconColor: 'from-blue-500 to-blue-600' },   // Nivel II - Azul
    { from: '#facc15', to: '#eab308', bg: 'from-yellow-400 to-yellow-500', border: 'border-yellow-400', iconColor: 'from-yellow-400 to-yellow-500' }, // Nivel III - Amarillo
    { from: '#f97316', to: '#ea580c', bg: 'from-orange-500 to-orange-600', border: 'border-orange-500', iconColor: 'from-orange-500 to-orange-600' }, // Nivel IV - Naranja
    { from: '#ef4444', to: '#dc2626', bg: 'from-red-500 to-red-600', border: 'border-red-500', iconColor: 'from-red-500 to-red-600' },       // Nivel V - Rojo
    { from: '#a855f7', to: '#9333ea', bg: 'from-purple-500 to-purple-600', border: 'border-purple-500', iconColor: 'from-purple-500 to-purple-600' }, // Nivel VI - Morado
  ];

  // Color por defecto (dorado)
  const defaultColors = { from: '#be9525', to: '#f3d374', bg: 'from-[#be9525] to-[#f3d374]', border: 'border-[#be9525]', iconColor: 'from-[#be9525] to-[#f3d374]' };
  
  // Obtener colores actuales basados en selección
  const currentColors = selectedLevel !== null ? levelColors[selectedLevel] : defaultColors;

  const courses = [
    // NIVEL I - COMPLETOS
    {
      id: 1,
      title: 'Introducción a la educación financiera',
      description: 'Conceptos básicos del dinero',
      progress: 100,
      lessons: 8,
      completedLessons: 8,
      duration: '2 horas',
      status: 'completed',
      icon: '💰',
      color: 'from-green-400 to-green-600',
      xp: 100,
      level: 'I',
      levelName: 'Novato',
    },
    {
      id: 2,
      title: 'Fundamentos del ahorro',
      description: 'Creando tu primer presupuesto',
      progress: 100,
      lessons: 10,
      completedLessons: 10,
      duration: '3 horas',
      status: 'completed',
      icon: '📊',
      color: 'from-green-400 to-green-600',
      xp: 200,
      level: 'I',
      levelName: 'Novato',
    },
    {
      id: 3,
      title: 'Planificación & Priorización financiera',
      description: 'Aprende a organizar tus finanzas',
      progress: 100,
      lessons: 9,
      completedLessons: 9,
      duration: '2.5 horas',
      status: 'completed',
      icon: '📝',
      color: 'from-green-400 to-green-600',
      xp: 150,
      level: 'I',
      levelName: 'Novato',
    },
    // NIVEL II - COMPLETOS
    {
      id: 4,
      title: 'Inversiones para escolares',
      description: 'Tipos de inversión básicos',
      progress: 100,
      lessons: 12,
      completedLessons: 12,
      duration: '4 horas',
      status: 'completed',
      icon: '📈',
      color: 'from-blue-400 to-blue-600',
      xp: 300,
      level: 'II',
      levelName: 'Aprendiz',
    },
    {
      id: 5,
      title: 'Ahorro VS Inversión',
      description: 'Diferencias y cuándo usar cada uno',
      progress: 100,
      lessons: 8,
      completedLessons: 8,
      duration: '2 horas',
      status: 'completed',
      icon: '⚖️',
      color: 'from-blue-400 to-blue-600',
      xp: 400,
      level: 'II',
      levelName: 'Aprendiz',
    },
    {
      id: 6,
      title: 'Criptomonedas en simple',
      description: 'Introducción al mundo crypto',
      progress: 100,
      lessons: 10,
      completedLessons: 10,
      duration: '3 horas',
      status: 'completed',
      icon: '₿',
      color: 'from-blue-400 to-blue-600',
      xp: 350,
      level: 'II',
      levelName: 'Aprendiz',
    },
    // NIVEL III - NO COMPLETADOS
    {
      id: 7,
      title: 'Inversiones Avanzadas',
      description: 'Estrategias de inversión complejas',
      progress: 35,
      lessons: 15,
      completedLessons: 5,
      duration: '5 horas',
      status: 'in-progress',
      icon: '🚀',
      color: 'from-yellow-400 to-yellow-600',
      xp: 800,
      level: 'III',
      levelName: 'Explorador',
    },
    {
      id: 8,
      title: 'Bienestar financiero',
      description: 'Equilibrio entre vida y finanzas',
      progress: 50,
      lessons: 10,
      completedLessons: 5,
      duration: '3 horas',
      status: 'in-progress',
      icon: '🧘',
      color: 'from-yellow-400 to-yellow-600',
      xp: 500,
      level: 'III',
      levelName: 'Explorador',
    },
    {
      id: 9,
      title: 'Tipos de deudas, buenas y malas',
      description: 'Aprende a diferenciar las deudas',
      progress: 25,
      lessons: 8,
      completedLessons: 2,
      duration: '2.5 horas',
      status: 'in-progress',
      icon: '💳',
      color: 'from-yellow-400 to-yellow-600',
      xp: 550,
      level: 'III',
      levelName: 'Explorador',
    },
  ];

  const totalXP = courses.reduce((sum, course) => sum + course.xp, 0);
  const completedCourses = courses.filter(c => c.status === 'completed').length;
  const inProgressCourses = courses.filter(c => c.status === 'in-progress').length;

  // Filtrar cursos según el nivel seleccionado
  const filteredCourses = selectedLevel !== null 
    ? courses.filter(course => {
        const levelMap: { [key: string]: number } = {
          'I': 0,
          'II': 1,
          'III': 2,
          'IV': 3,
          'V': 4,
          'VI': 5
        };
        return levelMap[course.level] === selectedLevel;
      })
    : courses;

  // Recalcular estadísticas basadas en cursos filtrados
  const displayedTotalXP = filteredCourses.reduce((sum, course) => sum + course.xp, 0);
  const displayedCompletedCourses = filteredCourses.filter(c => c.status === 'completed').length;
  const displayedInProgressCourses = filteredCourses.filter(c => c.status === 'in-progress').length;

  return (
    <div className="space-y-6">
      {/* Header con Ruta de Progreso */}
      <div 
        className={`relative rounded-2xl p-8 text-white shadow-xl overflow-hidden transition-all duration-500 bg-gradient-to-r ${currentColors.bg}`}
      >
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2 drop-shadow-lg">Mis Aprendizajes</h1>
              <p className="text-white/90 text-lg drop-shadow-md">Continúa tu camino hacia el conocimiento financiero</p>
            </div>

            {/* Ruta de Progreso */}
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
                      onClick={() => level.locked ? null : setSelectedLevel(index)}
                      disabled={level.locked}
                      className={`w-8 h-8 ${level.color} rounded-full border-4 border-white shadow-lg flex items-center justify-center transition-all hover:scale-110 ${
                        level.active ? 'ring-4 ring-white/40' : 'opacity-50'
                      } ${selectedLevel === index ? 'ring-4 ring-white/60 scale-110' : ''} ${
                        level.locked ? 'cursor-not-allowed' : 'cursor-pointer'
                      } relative`}
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

          {/* XP Ganado */}
          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/30">
              <p className="text-sm opacity-90">XP Total del Nivel</p>
              <p className="text-2xl font-bold">{displayedTotalXP} XP</p>
            </div>
            
            {/* XP para siguiente nivel */}
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/30 flex-1 max-w-md">
              <p className="text-sm opacity-90 mb-2">XP para siguiente nivel</p>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xl font-bold">1500/1800</p>
                    <p className="text-sm font-semibold">83%</p>
                  </div>
                  <div className="w-full bg-white/30 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-white h-full transition-all duration-500"
                      style={{ width: '83%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={`p-6 bg-white border-2 transition-all duration-500 ${currentColors.border}`}>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 bg-gradient-to-br ${currentColors.iconColor} rounded-xl flex items-center justify-center transition-all duration-500`}>
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Rutas completadas</p>
              <p className="text-2xl font-bold text-gray-900">{displayedCompletedCourses}</p>
            </div>
          </div>
        </Card>

        <Card className={`p-6 bg-white border-2 transition-all duration-500 ${currentColors.border}`}>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 bg-gradient-to-br ${currentColors.iconColor} rounded-xl flex items-center justify-center transition-all duration-500`}>
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Rutas en progreso</p>
              <p className="text-2xl font-bold text-gray-900">{displayedInProgressCourses}</p>
            </div>
          </div>
        </Card>

        <Card className={`p-6 bg-white border-2 transition-all duration-500 ${currentColors.border}`}>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 bg-gradient-to-br ${currentColors.iconColor} rounded-xl flex items-center justify-center transition-all duration-500`}>
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total de rutas</p>
              <p className="text-2xl font-bold text-gray-900">{filteredCourses.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Courses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCourses.map((course) => (
          <Card
            key={course.id}
            className={`p-6 transition-all border-2 relative overflow-hidden ${
              course.status === 'locked'
                ? 'opacity-60 cursor-not-allowed border-gray-200'
                : course.level === 'I'
                ? 'hover:shadow-xl cursor-pointer border-green-500'
                : course.level === 'II'
                ? 'hover:shadow-xl cursor-pointer border-blue-500'
                : 'hover:shadow-xl cursor-pointer border-yellow-400'
            }`}
          >
            {/* Número Romano de Fondo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className={`text-9xl font-bold ${
                course.level === 'I' ? 'text-green-500/10' :
                course.level === 'II' ? 'text-blue-500/10' :
                'text-yellow-400/10'
              }`}>
                {course.level}
              </span>
            </div>

            {/* Etiqueta de Nivel en esquina superior derecha */}
            <span className={`absolute top-4 right-4 px-3 py-1 text-white text-xs font-bold rounded-md z-10 ${
              course.level === 'I' ? 'bg-green-500' :
              course.level === 'II' ? 'bg-blue-500' :
              'bg-yellow-400'
            }`}>
              {course.levelName}
            </span>

            <div className="flex items-start gap-4 relative z-10">
              <div className={`w-16 h-16 bg-gradient-to-br ${course.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg ${
                course.status === 'locked' ? 'opacity-50' : ''
              }`}>
                {course.status === 'locked' ? (
                  <Lock className="w-8 h-8 text-white" />
                ) : (
                  course.icon
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 pr-20">
                    <h3 className="font-bold text-lg text-gray-900">{course.title}</h3>
                    <p className="text-sm text-gray-600">{course.description}</p>
                  </div>
                </div>

                {course.status !== 'locked' && (
                  <>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Progreso</span>
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${
                            course.level === 'I' ? 'text-green-600' :
                            course.level === 'II' ? 'text-blue-600' :
                            'text-yellow-600'
                          }`}>
                            {course.progress}%
                          </span>
                          {course.status === 'completed' && (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            course.level === 'I' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                            course.level === 'II' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                            'bg-gradient-to-r from-yellow-400 to-yellow-500'
                          }`}
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                      <span>{course.completedLessons}/{course.lessons} lecciones</span>
                      <span>•</span>
                      <span>{course.duration}</span>
                      <span>•</span>
                      <span className={`font-semibold ${
                        course.level === 'I' ? 'text-green-600' :
                        course.level === 'II' ? 'text-blue-600' :
                        'text-yellow-600'
                      }`}>
                        {course.xp} XP
                      </span>
                    </div>

                    <button
                      className={`w-full mt-4 px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 ${
                        course.level === 'I'
                          ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                          : course.level === 'II'
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                          : 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white'
                      }`}
                    >
                      <Play className="w-4 h-4" />
                      {course.status === 'completed' ? 'Revisar' : 'Continuar'}
                    </button>
                  </>
                )}

                {course.status === 'locked' && (
                  <div className="mt-4 text-center py-3">
                    <p className="text-sm text-gray-500">Completa los cursos anteriores para desbloquear</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}