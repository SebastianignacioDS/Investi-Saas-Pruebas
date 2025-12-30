import { Gamepad2, Star, Clock, TrendingUp, Lock, Banknote } from 'lucide-react';
import { Card } from './ui/card';
import { useState } from 'react';
import { SavingsPathGame } from './games/SavingsPathGame';

interface MiniGamesProps {
  selectedLevel: number | null;
  setSelectedLevel: (level: number | null) => void;
}

export function MiniGames({ selectedLevel, setSelectedLevel }: MiniGamesProps) {
  const [activeGame, setActiveGame] = useState<number | null>(null);

  const handleGameComplete = (score: number) => {
    console.log('Game completed with score:', score);
    // Aquí podrías actualizar estadísticas, guardar puntaje, etc.
  };

  // Configuración de colores por nivel
  const levelColors = [
    { from: 'from-green-500', to: 'to-green-600', border: 'border-green-500', hover: 'hover:border-green-500', bg: 'bg-green-500', hoverBg: 'hover:from-green-600 hover:to-green-700', iconColor: 'from-green-500 to-green-600' }, // Nivel I - Verde
    { from: 'from-blue-500', to: 'to-blue-600', border: 'border-blue-500', hover: 'hover:border-blue-500', bg: 'bg-blue-500', hoverBg: 'hover:from-blue-600 hover:to-blue-700', iconColor: 'from-blue-500 to-blue-600' },   // Nivel II - Azul
    { from: 'from-yellow-400', to: 'to-yellow-500', border: 'border-yellow-400', hover: 'hover:border-yellow-400', bg: 'bg-yellow-400', hoverBg: 'hover:from-yellow-500 hover:to-yellow-600', iconColor: 'from-yellow-400 to-yellow-500' }, // Nivel III - Amarillo
    { from: 'from-orange-500', to: 'to-orange-600', border: 'border-orange-500', hover: 'hover:border-orange-500', bg: 'bg-orange-500', hoverBg: 'hover:from-orange-600 hover:to-orange-700', iconColor: 'from-orange-500 to-orange-600' }, // Nivel IV - Naranja
    { from: 'from-red-500', to: 'to-red-600', border: 'border-red-500', hover: 'hover:border-red-500', bg: 'bg-red-500', hoverBg: 'hover:from-red-600 hover:to-red-700', iconColor: 'from-red-500 to-red-600' },       // Nivel V - Rojo
    { from: 'from-purple-500', to: 'to-purple-600', border: 'border-purple-500', hover: 'hover:border-purple-500', bg: 'bg-purple-500', hoverBg: 'hover:from-purple-600 hover:to-purple-700', iconColor: 'from-purple-500 to-purple-600' }, // Nivel VI - Morado
  ];

  // Color por defecto (dorado)
  const defaultColors = { from: 'from-[#be9525]', to: 'to-[#f3d374]', border: 'border-[#be9525]', hover: 'hover:border-[#be9525]', bg: 'bg-[#be9525]', hoverBg: 'hover:from-[#9a7a1e] hover:to-[#d4b860]', iconColor: 'from-[#be9525] to-[#f3d374]' };

  // Obtener colores actuales según el nivel seleccionado
  const currentColors = selectedLevel !== null ? levelColors[selectedLevel] : defaultColors;

  // Configuración de niveles
  const levelConfig = [
    { roman: 'I', difficulty: 'Novato', color: 'text-green-500/10', bgColor: 'bg-green-500', borderColor: 'border-green-500', textColor: 'text-green-600' },
    { roman: 'II', difficulty: 'Aprendiz', color: 'text-blue-500/10', bgColor: 'bg-blue-500', borderColor: 'border-blue-500', textColor: 'text-blue-600' },
    { roman: 'III', difficulty: 'Explorador', color: 'text-yellow-400/10', bgColor: 'bg-yellow-400', borderColor: 'border-yellow-400', textColor: 'text-yellow-600' },
    { roman: 'IV', difficulty: 'Hábil', color: 'text-orange-500/10', bgColor: 'bg-orange-500', borderColor: 'border-orange-500', textColor: 'text-orange-600' },
    { roman: 'V', difficulty: 'Experto', color: 'text-red-500/10', bgColor: 'bg-red-500', borderColor: 'border-red-500', textColor: 'text-red-600' },
    { roman: 'VI', difficulty: 'Maestro', color: 'text-purple-500/10', bgColor: 'bg-purple-500', borderColor: 'border-purple-500', textColor: 'text-purple-600' },
  ];

  const currentLevel = selectedLevel !== null ? levelConfig[selectedLevel] : levelConfig[0];

  const games = [
    {
      id: 1,
      title: 'El Camino del Ahorro',
      description: 'Toma decisiones financieras y junta la mayor cantidad de dinero en 5 rondas',
      difficulty: currentLevel.difficulty,
      points: 50,
      time: '5 min',
      played: 12,
      bestScore: 850,
      icon: '💰',
      color: `${currentColors.from} ${currentColors.to}`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header con Ruta de Progreso */}
      <div 
        className={`relative rounded-2xl p-8 text-white shadow-xl overflow-hidden transition-all duration-500 bg-gradient-to-r ${currentColors.from} ${currentColors.to}`}
      >
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2 drop-shadow-lg">Mini-Juegos</h1>
              <p className="text-white/90 text-lg drop-shadow-md">Aprende jugando y gana puntos en cada nivel</p>
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

          {/* Ahorros */}
          <div className="mt-6 flex items-center justify-between">
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/30">
              <p className="text-sm opacity-90">Ahorros Totales</p>
              <p className="text-2xl font-bold">$2,450</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={`p-6 bg-white border-2 ${currentColors.border} transition-all duration-500`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${currentColors.iconColor} rounded-xl flex items-center justify-center transition-all duration-500`}>
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Partidas completadas</p>
              <p className="text-2xl font-bold text-gray-900">38</p>
            </div>
          </div>
        </Card>

        <Card className={`p-6 bg-white border-2 ${currentColors.border} transition-all duration-500`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${currentColors.iconColor} rounded-xl flex items-center justify-center transition-all duration-500`}>
              <Banknote className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Mejor Ahorro</p>
              <p className="text-2xl font-bold text-gray-900">$920</p>
            </div>
          </div>
        </Card>

        <Card className={`p-6 bg-white border-2 ${currentColors.border} transition-all duration-500`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${currentColors.iconColor} rounded-xl flex items-center justify-center transition-all duration-500`}>
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Racha Actual</p>
              <p className="text-2xl font-bold text-gray-900">5 días</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {games.map((game) => (
          <Card key={game.id} className={`p-6 hover:shadow-xl transition-all cursor-pointer border-2 ${currentColors.border} ${currentColors.hover} relative overflow-hidden`}>
            {/* Número Romano de Fondo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className={`text-9xl font-bold ${currentLevel.color}`}>{currentLevel.roman}</span>
            </div>
            
            <div className="flex items-start gap-4 relative z-10">
              <div className={`w-16 h-16 bg-gradient-to-br ${game.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg`}>
                {game.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{game.title}</h3>
                    <p className="text-sm text-gray-600">{game.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-md text-xs font-bold ${currentLevel.bgColor} text-white`}>
                    {game.difficulty}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{game.points} pts</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>{game.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Gamepad2 className="w-4 h-4 text-purple-500" />
                    <span>{game.played} veces</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Máximo dinero ahorrado</p>
                      <p className={`font-bold ${currentLevel.textColor}`}>${game.bestScore}</p>
                    </div>
                    <button className={`bg-gradient-to-r ${currentColors.from} ${currentColors.to} ${currentColors.hoverBg} text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all`} onClick={() => setActiveGame(game.id)}>
                      Jugar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Game Modal */}
      {activeGame === 1 && (
        <SavingsPathGame
          onClose={() => setActiveGame(null)}
          onComplete={handleGameComplete}
        />
      )}
    </div>
  );
}