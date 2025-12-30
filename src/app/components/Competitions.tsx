import { Swords, Users, Trophy, Clock, TrendingUp, Medal, Lock } from 'lucide-react';
import { Card } from './ui/card';

interface CompetitionsProps {
  selectedLevel: number | null;
  setSelectedLevel: (level: number | null) => void;
}

export function Competitions({ selectedLevel, setSelectedLevel }: CompetitionsProps) {
  // Configuración de colores por nivel
  const levelColors = [
    { 
      from: 'from-green-500', 
      to: 'to-green-600', 
      bg: 'from-green-500 to-green-600', 
      border: 'border-green-500', 
      iconColor: 'from-green-500 to-green-600',
      textColor: 'text-green-600',
      progressBar: 'from-green-500 to-green-600',
      prizeBg: 'bg-green-50',
      prizeBorder: 'border-green-200',
      prizeText: 'text-green-700'
    }, // Nivel I - Verde
    { 
      from: 'from-blue-500', 
      to: 'to-blue-600', 
      bg: 'from-blue-500 to-blue-600', 
      border: 'border-blue-500', 
      iconColor: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-600',
      progressBar: 'from-blue-500 to-blue-600',
      prizeBg: 'bg-blue-50',
      prizeBorder: 'border-blue-200',
      prizeText: 'text-blue-700'
    },   // Nivel II - Azul
    { 
      from: 'from-yellow-400', 
      to: 'to-yellow-500', 
      bg: 'from-yellow-400 to-yellow-500', 
      border: 'border-yellow-400', 
      iconColor: 'from-yellow-400 to-yellow-500',
      textColor: 'text-yellow-600',
      progressBar: 'from-yellow-400 to-yellow-500',
      prizeBg: 'bg-yellow-50',
      prizeBorder: 'border-yellow-200',
      prizeText: 'text-yellow-700'
    }, // Nivel III - Amarillo
    { 
      from: 'from-orange-500', 
      to: 'to-orange-600', 
      bg: 'from-orange-500 to-orange-600', 
      border: 'border-orange-500', 
      iconColor: 'from-orange-500 to-orange-600',
      textColor: 'text-orange-600',
      progressBar: 'from-orange-500 to-orange-600',
      prizeBg: 'bg-orange-50',
      prizeBorder: 'border-orange-200',
      prizeText: 'text-orange-700'
    }, // Nivel IV - Naranja
    { 
      from: 'from-red-500', 
      to: 'to-red-600', 
      bg: 'from-red-500 to-red-600', 
      border: 'border-red-500', 
      iconColor: 'from-red-500 to-red-600',
      textColor: 'text-red-600',
      progressBar: 'from-red-500 to-red-600',
      prizeBg: 'bg-red-50',
      prizeBorder: 'border-red-200',
      prizeText: 'text-red-700'
    },       // Nivel V - Rojo
    { 
      from: 'from-purple-500', 
      to: 'to-purple-600', 
      bg: 'from-purple-500 to-purple-600', 
      border: 'border-purple-500', 
      iconColor: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-600',
      progressBar: 'from-purple-500 to-purple-600',
      prizeBg: 'bg-purple-50',
      prizeBorder: 'border-purple-200',
      prizeText: 'text-purple-700'
    }, // Nivel VI - Morado
  ];

  // Color por defecto (dorado)
  const defaultColors = { 
    from: 'from-[#be9525]', 
    to: 'to-[#f3d374]', 
    bg: 'from-[#be9525] to-[#f3d374]', 
    border: 'border-[#be9525]', 
    iconColor: 'from-[#be9525] to-[#f3d374]',
    textColor: 'text-[#be9525]',
    progressBar: 'from-[#be9525] to-[#f3d374]',
    prizeBg: 'bg-yellow-50',
    prizeBorder: 'border-yellow-200',
    prizeText: 'text-yellow-700'
  };

  // Obtener colores actuales según el nivel seleccionado
  const currentColors = selectedLevel !== null ? levelColors[selectedLevel] : defaultColors;

  const activeCompetitions = [
    {
      id: 1,
      title: 'Desafío del Mes: Ahorro Máximo',
      description: 'Compite con otros cursos ahorrando la mayor cantidad posible',
      participants: 5,
      participantsLabel: 'Cursos participando',
      position: 12,
      endDate: '7 días',
      prize: 'Sorpresa',
      icon: '🏆',
      color: 'from-yellow-400 to-yellow-600',
      currentScore: 45000,
      topScore: 100000,
      isCurrency: true,
    },
    {
      id: 2,
      title: 'Carrera de Conocimientos',
      description: 'Responde preguntas sobre finanzas más rápido que tus compañeros',
      participants: 89,
      participantsLabel: 'participantes',
      position: 8,
      endDate: '12 días',
      prize: '300 pts + Certificado',
      icon: '🏁',
      color: 'from-purple-400 to-purple-600',
      currentScore: 620,
      topScore: 780,
      isCurrency: false,
    },
    {
      id: 3,
      title: 'Liga financiera estudiantil',
      description: 'Compite contra otros estudiantes en la carrera del ahorro',
      participants: 205,
      participantsLabel: 'participantes',
      position: 23,
      endDate: '3 días',
      prize: '400 pts + Trofeo digital',
      icon: '🏆',
      color: 'from-blue-400 to-blue-600',
      currentScore: 1450,
      topScore: 2100,
      isCurrency: false,
    },
  ];

  const upcomingCompetitions = [
    {
      id: 4,
      title: 'Inversión Estratégica',
      description: 'Simula inversiones y gana según tus decisiones',
      participants: 0,
      startDate: 'En 2 días',
      prize: '600 pts + Avatar especial',
      icon: '📈',
    },
    {
      id: 5,
      title: 'Presupuesto Perfecto',
      description: 'Demuestra tus habilidades de planificación financiera',
      participants: 0,
      startDate: 'En 1 semana',
      prize: '350 pts + Insignia',
      icon: '💰',
    },
  ];

  const leaderboard = [
    { position: 1, name: 'Carlos M.', score: 1200, avatar: 'CM', color: 'from-yellow-400 to-yellow-500' },
    { position: 2, name: 'María S.', score: 1150, avatar: 'MS', color: 'from-gray-300 to-gray-400' },
    { position: 3, name: 'Pedro R.', score: 1080, avatar: 'PR', color: 'from-orange-400 to-orange-500' },
    { position: 4, name: 'Ana L.', score: 1020, avatar: 'AL', color: 'from-blue-400 to-blue-500' },
    { position: 5, name: 'Luis G.', score: 950, avatar: 'LG', color: 'from-green-400 to-green-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header con Ruta de Progreso */}
      <div 
        className={`relative rounded-2xl p-8 text-white shadow-xl overflow-hidden transition-all duration-500 bg-gradient-to-r ${currentColors.bg}`}
      >
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2 drop-shadow-lg">Competencias Activas</h1>
              <p className="text-white/90 text-lg drop-shadow-md">Compite con otros estudiantes y demuestra tus habilidades</p>
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

          {/* Mejor Posición */}
          <div className="mt-6 flex items-center justify-between">
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/30">
              <p className="text-sm opacity-90">Mejor posición</p>
              <p className="text-2xl font-bold">#8</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={`p-6 bg-white border-2 transition-all duration-500 ${currentColors.border}`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${currentColors.iconColor} rounded-xl flex items-center justify-center transition-all duration-500`}>
              <Swords className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Competencias Activas</p>
              <p className="text-2xl font-bold text-gray-900">{activeCompetitions.length}</p>
            </div>
          </div>
        </Card>

        <Card className={`p-6 bg-white border-2 transition-all duration-500 ${currentColors.border}`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${currentColors.iconColor} rounded-xl flex items-center justify-center transition-all duration-500`}>
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Victorias Totales</p>
              <p className="text-2xl font-bold text-gray-900">7</p>
            </div>
          </div>
        </Card>

        <Card className={`p-6 bg-white border-2 transition-all duration-500 ${currentColors.border}`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${currentColors.iconColor} rounded-xl flex items-center justify-center transition-all duration-500`}>
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Ranking General</p>
              <p className="text-2xl font-bold text-gray-900">#45</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Competitions */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Mis Competencias</h2>
          {activeCompetitions.map((comp) => (
            <Card key={comp.id} className={`p-6 hover:shadow-xl transition-all duration-500 border-2 ${currentColors.border}`}>
              <div className="flex items-start gap-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${comp.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg`}>
                  {comp.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{comp.title}</h3>
                      <p className="text-sm text-gray-600">{comp.description}</p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold mb-1">
                        #{comp.position}
                      </div>
                      <p className="text-xs text-gray-500">Tu posición</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Tu progreso</span>
                      <span className={`font-semibold transition-all duration-500 ${currentColors.textColor}`}>
                        {comp.isCurrency 
                          ? `$${comp.currentScore.toLocaleString('es-CL')}/$${comp.topScore.toLocaleString('es-CL')}`
                          : `${comp.currentScore} / ${comp.topScore} pts`}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`bg-gradient-to-r ${currentColors.progressBar} h-full transition-all duration-500`}
                        style={{ width: `${(comp.currentScore / comp.topScore) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{comp.participants} {comp.participantsLabel}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Termina en {comp.endDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className={`mt-3 transition-all duration-500 ${currentColors.prizeBg} border ${currentColors.prizeBorder} rounded-lg p-3`}>
                    <p className="text-sm text-gray-700">
                      <span className={`font-semibold transition-all duration-500 ${currentColors.prizeText}`}>Premio: </span>
                      {comp.prize}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {/* Upcoming Competitions */}
          <h2 className="text-xl font-bold text-gray-900 mt-8">Próximamente</h2>
          {upcomingCompetitions.map((comp) => (
            <Card key={comp.id} className={`p-6 border-2 border-dashed transition-all duration-500 ${currentColors.border}`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center text-2xl">
                  {comp.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{comp.title}</h3>
                  <p className="text-sm text-gray-600">{comp.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="font-semibold text-[#be9525]">Inicia {comp.startDate}</span>
                    <span>•</span>
                    <span>Premio: {comp.prize}</span>
                  </div>
                </div>
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold transition-all">
                  Notificarme
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Leaderboard Sidebar */}
        <div className="lg:col-span-1">
          <Card className={`p-6 sticky top-6 border-2 transition-all duration-500 ${currentColors.border}`}>
            <div className="flex items-center gap-2 mb-6">
              <Medal className="w-6 h-6 text-[#be9525]" />
              <h2 className="text-xl font-bold text-gray-900">Top 5 Global (2do Medio A)</h2>
            </div>
            <div className="space-y-3">
              {leaderboard.map((user) => (
                <div
                  key={user.position}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    user.position <= 3 ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200' : 'bg-gray-50'
                  }`}
                >
                  <div className="relative">
                    <div className={`w-10 h-10 bg-gradient-to-br ${user.color} rounded-full flex items-center justify-center font-bold text-white text-sm`}>
                      {user.avatar}
                    </div>
                    {user.position <= 3 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
                        <span className="text-xs">
                          {user.position === 1 ? '🥇' : user.position === 2 ? '🥈' : '🥉'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                    <p className="text-xs text-gray-600">{user.score} pts</p>
                  </div>
                  <div className="text-lg font-bold text-gray-400">
                    #{user.position}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3 p-3 bg-[#be9525]/10 rounded-lg border-2 border-[#be9525]">
                <div className="w-10 h-10 bg-gradient-to-br from-[#be9525] to-[#f3d374] rounded-full flex items-center justify-center font-bold text-white text-sm">
                  TU
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">Tú</p>
                  <p className="text-xs text-gray-600">850 pts</p>
                </div>
                <div className="text-lg font-bold text-[#be9525]">
                  #12
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}