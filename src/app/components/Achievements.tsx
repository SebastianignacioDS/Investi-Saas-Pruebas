import { Trophy, Medal, Award, Crown, Flame, Star } from 'lucide-react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';

export function Achievements() {
  const unlockedAchievements = [
    {
      id: 1,
      title: 'Primera Victoria',
      description: 'Completa tu primera lección',
      icon: Trophy,
      color: 'from-[#be9525] to-[#f3d374]',
      rarity: 'Común',
      points: 50,
      date: '2024-09-15',
    },
    {
      id: 2,
      title: 'Racha de Fuego',
      description: 'Mantén 7 días consecutivos de estudio',
      icon: Flame,
      color: 'from-orange-500 to-red-600',
      rarity: 'Raro',
      points: 150,
      date: '2024-10-20',
    },
    {
      id: 3,
      title: 'Estudioso',
      description: 'Completa 10 lecciones en cualquier curso',
      icon: Award,
      color: 'from-blue-500 to-indigo-600',
      rarity: 'Común',
      points: 100,
      date: '2024-11-05',
    },
    {
      id: 4,
      title: 'Maestro Matemático',
      description: 'Obtén 100% en 5 exámenes de matemáticas',
      icon: Crown,
      color: 'from-purple-500 to-pink-600',
      rarity: 'Épico',
      points: 300,
      date: '2024-11-18',
    },
    {
      id: 5,
      title: 'Estrella Brillante',
      description: 'Alcanza el nivel 10',
      icon: Star,
      color: 'from-yellow-400 to-orange-500',
      rarity: 'Raro',
      points: 200,
      date: '2024-12-01',
    },
    {
      id: 6,
      title: 'Explorador',
      description: 'Completa lecciones en 3 cursos diferentes',
      icon: Medal,
      color: 'from-green-500 to-emerald-600',
      rarity: 'Común',
      points: 100,
      date: '2024-12-10',
    },
  ];

  const lockedAchievements = [
    {
      id: 7,
      title: 'Leyenda',
      description: 'Mantén 30 días consecutivos de estudio',
      icon: Crown,
      color: 'from-gray-400 to-gray-500',
      rarity: 'Legendario',
      points: 500,
      progress: 23,
      total: 30,
    },
    {
      id: 8,
      title: 'Coleccionista',
      description: 'Desbloquea 20 logros',
      icon: Trophy,
      color: 'from-gray-400 to-gray-500',
      rarity: 'Épico',
      points: 400,
      progress: 8,
      total: 20,
    },
    {
      id: 9,
      title: 'Genio Universal',
      description: 'Completa todos los cursos disponibles',
      icon: Award,
      color: 'from-gray-400 to-gray-500',
      rarity: 'Legendario',
      points: 1000,
      progress: 2,
      total: 6,
    },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Común':
        return 'bg-gray-100 text-gray-700';
      case 'Raro':
        return 'bg-blue-100 text-blue-700';
      case 'Épico':
        return 'bg-purple-100 text-purple-700';
      case 'Legendario':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Logros y Medallas 🏆</h2>
        <p className="text-gray-600 mt-1">Tu colección de logros y recompensas</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200">
          <p className="text-gray-600 text-sm mb-1">Puntos Totales</p>
          <p className="text-3xl font-bold text-yellow-600">2,450</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
          <p className="text-gray-600 text-sm mb-1">Logros Desbloqueados</p>
          <p className="text-3xl font-bold text-purple-600">8/15</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
          <p className="text-gray-600 text-sm mb-1">Racha Actual</p>
          <p className="text-3xl font-bold text-blue-600">7 días</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
          <p className="text-gray-600 text-sm mb-1">Nivel Actual</p>
          <p className="text-3xl font-bold text-green-600">12</p>
        </Card>
      </div>

      {/* Unlocked Achievements */}
      <div>
        <h3 className="font-bold text-xl mb-4">Logros Desbloqueados ✨</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {unlockedAchievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <Card
                key={achievement.id}
                className="p-6 hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${achievement.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRarityColor(achievement.rarity)}`}>
                        {achievement.rarity}
                      </span>
                    </div>
                    <h4 className="font-bold mb-1">{achievement.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                      <span className="text-sm text-yellow-600 font-semibold">+{achievement.points} pts</span>
                      <span className="text-xs text-gray-500">{achievement.date}</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Locked Achievements */}
      <div>
        <h3 className="font-bold text-xl mb-4">Próximos Desafíos 🎯</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {lockedAchievements.map((achievement) => {
            const Icon = achievement.icon;
            const progressPercentage = (achievement.progress / achievement.total) * 100;
            return (
              <Card key={achievement.id} className="p-6 bg-gray-50 border-2 border-dashed border-gray-300">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${achievement.color} rounded-2xl flex items-center justify-center flex-shrink-0 opacity-50`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRarityColor(achievement.rarity)}`}>
                        {achievement.rarity}
                      </span>
                    </div>
                    <h4 className="font-bold mb-1 text-gray-700">{achievement.title}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">
                      Progreso: {achievement.progress}/{achievement.total}
                    </span>
                    <span className="font-semibold text-[#be9525]">{Math.round(progressPercentage)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                  <p className="text-xs text-gray-500 mt-2">+{achievement.points} pts al desbloquear</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}