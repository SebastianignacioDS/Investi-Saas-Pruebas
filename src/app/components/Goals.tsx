import { Target, Plus, Check, Trash2, CalendarDays, Trophy, Award, Medal, Star, ChevronDown, Gift, Lock } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { useState } from 'react';

export function Goals() {
  const [showAchievements, setShowAchievements] = useState(true);
  const [showTrophies, setShowTrophies] = useState(true);
  const [selectedAchievementTab, setSelectedAchievementTab] = useState('planificacion');
  
  const weeklyGoals = [
    { day: 'Lun', completed: true },
    { day: 'Mar', completed: true },
    { day: 'Mié', completed: true },
    { day: 'Jue', completed: false },
    { day: 'Vie', completed: false },
    { day: 'Sáb', completed: false },
    { day: 'Dom', completed: false },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'comun': return { bg: 'from-green-500 to-green-600', border: 'border-green-500', text: 'text-green-600', bgLight: 'bg-green-50' };
      case 'poco_comun': return { bg: 'from-blue-500 to-blue-600', border: 'border-blue-500', text: 'text-blue-600', bgLight: 'bg-blue-50' };
      case 'raro': return { bg: 'from-yellow-400 to-yellow-500', border: 'border-yellow-400', text: 'text-yellow-600', bgLight: 'bg-yellow-50' };
      case 'epico': return { bg: 'from-orange-500 to-orange-600', border: 'border-orange-500', text: 'text-orange-600', bgLight: 'bg-orange-50' };
      case 'legendario': return { bg: 'from-red-500 to-red-600', border: 'border-red-500', text: 'text-red-600', bgLight: 'bg-red-50' };
      case 'maestro': return { bg: 'from-purple-500 to-purple-600', border: 'border-purple-500', text: 'text-purple-600', bgLight: 'bg-purple-50' };
      default: return { bg: 'from-gray-400 to-gray-500', border: 'border-gray-400', text: 'text-gray-600', bgLight: 'bg-gray-50' };
    }
  };

  // Definición de logros por competencia
  const achievementsByCompetency = {
    planificacion: {
      name: 'Planificación de metas',
      icon: '🎯',
      color: 'from-blue-500 to-blue-600',
      achievements: [
        { id: 1, name: 'Soñador', icon: '💭', description: 'Creaste tu primera meta', unlocked: true, rarity: 'comun', date: '10 Dic 2024' },
        { id: 2, name: 'Arquitecto', icon: '📐', description: 'Definiste una meta con monto y plazo', unlocked: true, rarity: 'poco_comun', date: '15 Dic 2024' },
        { id: 3, name: 'Cumplidor', icon: '✅', description: 'Completaste una meta', unlocked: true, rarity: 'raro', date: '28 Dic 2024' },
        { id: 4, name: 'Imparable', icon: '🔥', description: 'Cumpliste 3 metas seguidas', unlocked: false, rarity: 'epico', date: null },
      ],
    },
    presupuestos: {
      name: 'Creación de presupuestos',
      icon: '💰',
      color: 'from-green-500 to-green-600',
      achievements: [
        { id: 5, name: 'Contable Novato', icon: '📝', description: 'Creaste tu primer presupuesto', unlocked: true, rarity: 'comun', date: '12 Dic 2024' },
        { id: 6, name: 'Organizador', icon: '📊', description: 'Registraste 7 días seguidos', unlocked: true, rarity: 'poco_comun', date: '19 Dic 2024' },
        { id: 7, name: 'Equilibrista', icon: '⚖️', description: 'Balance perfecto ingresos/gastos', unlocked: false, rarity: 'raro', date: null },
        { id: 8, name: 'Maestro del Orden', icon: '👑', description: '30 días de presupuesto perfecto', unlocked: false, rarity: 'legendario', date: null },
      ],
    },
    priorizacion: {
      name: 'Priorización',
      icon: '🧮',
      color: 'from-yellow-500 to-yellow-600',
      achievements: [
        { id: 9, name: 'Decisor', icon: '🤔', description: 'Elegiste entre dos opciones', unlocked: true, rarity: 'comun', date: '14 Dic 2024' },
        { id: 10, name: 'Estratega', icon: '🎯', description: 'Priorizaste 5 veces correctamente', unlocked: false, rarity: 'poco_comun', date: null },
        { id: 11, name: 'Sabio Financiero', icon: '🧙', description: 'Siempre priorizas lo importante', unlocked: false, rarity: 'epico', date: null },
        { id: 12, name: 'Gran Maestro', icon: '🏆', description: 'Decisiones perfectas por 30 días', unlocked: false, rarity: 'maestro', date: null },
      ],
    },
    inversion: {
      name: 'Inversión',
      icon: '📈',
      color: 'from-orange-500 to-orange-600',
      achievements: [
        { id: 13, name: 'Primer Paso', icon: '👣', description: 'Completaste lección de inversión básica', unlocked: true, rarity: 'comun', date: '20 Dic 2024' },
        { id: 14, name: 'Diversificador', icon: '🌈', description: 'Entendiste el concepto de diversificación', unlocked: false, rarity: 'raro', date: null },
        { id: 15, name: 'Analista', icon: '📉', description: 'Analizaste riesgos correctamente', unlocked: false, rarity: 'epico', date: null },
        { id: 16, name: 'Inversionista Elite', icon: '💎', description: 'Dominio completo de inversiones', unlocked: false, rarity: 'maestro', date: null },
      ],
    },
    ahorro: {
      name: 'Ahorro',
      icon: '🏦',
      color: 'from-red-500 to-red-600',
      achievements: [
        { id: 17, name: 'Primera Moneda', icon: '🪙', description: 'Ahorraste por primera vez', unlocked: true, rarity: 'comun', date: '10 Dic 2024' },
        { id: 18, name: 'Constante', icon: '📅', description: '7 días seguidos ahorrando', unlocked: true, rarity: 'poco_comun', date: '17 Dic 2024' },
        { id: 19, name: 'Ahorrador Pro', icon: '💰', description: 'Ahorraste $100.000 en total', unlocked: true, rarity: 'raro', date: '22 Dic 2024' },
        { id: 20, name: 'Cofre del Tesoro', icon: '💎', description: 'Ahorraste $500.000 en total', unlocked: false, rarity: 'legendario', date: null },
      ],
    },
    deuda: {
      name: 'Deuda responsable',
      icon: '💳',
      color: 'from-purple-500 to-purple-600',
      achievements: [
        { id: 21, name: 'Consciente', icon: '🧠', description: 'Aprendiste sobre intereses', unlocked: true, rarity: 'comun', date: '13 Dic 2024' },
        { id: 22, name: 'Precavido', icon: '⚠️', description: 'Evitaste una deuda innecesaria', unlocked: false, rarity: 'poco_comun', date: null },
        { id: 23, name: 'Pagador Responsable', icon: '✅', description: 'Pagaste todo a tiempo por 3 meses', unlocked: false, rarity: 'epico', date: null },
        { id: 24, name: 'Libre de Deudas', icon: '🦅', description: 'Sin deudas por 6 meses', unlocked: false, rarity: 'maestro', date: null },
      ],
    },
    riesgos: {
      name: 'Riesgos financieros',
      icon: '🚨',
      color: 'from-pink-500 to-pink-600',
      achievements: [
        { id: 25, name: 'Detector', icon: '🔍', description: 'Identificaste un riesgo', unlocked: true, rarity: 'comun', date: '16 Dic 2024' },
        { id: 26, name: 'Escéptico', icon: '🤨', description: 'Evitaste una estafa', unlocked: true, rarity: 'raro', date: '21 Dic 2024' },
        { id: 27, name: 'Guardián', icon: '🛡️', description: 'Protegiste tus finanzas 10 veces', unlocked: false, rarity: 'epico', date: null },
        { id: 28, name: 'Invulnerable', icon: '🔒', description: 'Seguridad financiera máxima', unlocked: false, rarity: 'maestro', date: null },
      ],
    },
  };

  const competencyTabs = [
    { id: 'planificacion', name: 'Planificación', icon: '🎯' },
    { id: 'presupuestos', name: 'Presupuestos', icon: '💰' },
    { id: 'priorizacion', name: 'Priorización', icon: '🧮' },
    { id: 'inversion', name: 'Inversión', icon: '📈' },
    { id: 'ahorro', name: 'Ahorro', icon: '🏦' },
    { id: 'deuda', name: 'Deuda', icon: '💳' },
    { id: 'riesgos', name: 'Riesgos', icon: '🚨' },
  ];

  const currentCompetency = achievementsByCompetency[selectedAchievementTab as keyof typeof achievementsByCompetency];
  const unlockedCount = currentCompetency.achievements.filter(a => a.unlocked).length;
  const totalCount = currentCompetency.achievements.length;

  const getRarityName = (rarity: string) => {
    switch (rarity) {
      case 'comun': return 'Común';
      case 'poco_comun': return 'Poco común';
      case 'raro': return 'Raro';
      case 'epico': return 'Épico';
      case 'legendario': return 'Legendario';
      case 'maestro': return 'Maestro';
      default: return 'Común';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Logros & Trofeos</h2>
          <p className="text-gray-600 mt-1">Celebra tus éxitos y conquista nuevos desafíos</p>
        </div>
      </div>

      {/* Weekly Streak */}
      <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-bold text-xl mb-1">Racha Semanal 🔥</h3>
            <p className="text-gray-600">Completa día 7 y obtén un cofre de recompensa</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-orange-600">3/7</p>
            <p className="text-sm text-gray-600">días completados</p>
          </div>
        </div>
        <div className="flex gap-2">
          {weeklyGoals.map((goal, index) => (
            <div key={index} className="flex-1">
              {index === 6 ? (
                // Día 7 - Cofre de recompensa
                <div className="relative">
                  <div className="h-12 rounded-lg flex items-center justify-center font-semibold transition-all bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-xl border-2 border-yellow-300 animate-pulse">
                    <Gift className="w-6 h-6" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">
                    🎁
                  </div>
                </div>
              ) : (
                <div
                  className={`h-12 rounded-lg flex items-center justify-center font-semibold transition-all ${
                    goal.completed
                      ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg'
                      : 'bg-white border-2 border-gray-200 text-gray-400'
                  }`}
                >
                  {goal.completed ? <Check className="w-5 h-5" /> : goal.day}
                </div>
              )}
              <p className="text-center text-xs mt-1 text-gray-600">{goal.day}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-white/50 rounded-lg border border-orange-200">
          <p className="text-sm text-orange-700 font-medium text-center">
            🎁 Completa los 7 días y recibe un <span className="font-bold">Cofre Dorado</span> con recompensas exclusivas
          </p>
        </div>
      </Card>

      {/* Mis Logros */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Mis Logros 🏆</h2>
        
        {/* Pestañas de Competencias */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max pb-2">
            {competencyTabs.map((tab) => {
              const isActive = selectedAchievementTab === tab.id;
              const tabData = achievementsByCompetency[tab.id as keyof typeof achievementsByCompetency];
              const unlockedInTab = tabData.achievements.filter(a => a.unlocked).length;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedAchievementTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                    isActive
                      ? `bg-gradient-to-r ${tabData.color} text-white shadow-lg scale-105`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <div className="flex flex-col items-start">
                    <span className="text-sm">{tab.name}</span>
                    <span className={`text-xs ${isActive ? 'text-white/90' : 'text-gray-500'}`}>
                      {unlockedInTab}/{tabData.achievements.length}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Header de la Competencia Seleccionada */}
        <Card className={`p-6 bg-gradient-to-r ${currentCompetency.color} text-white mb-6 shadow-xl`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl border-2 border-white/50 shadow-lg">
                {currentCompetency.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold">{currentCompetency.name}</h3>
                <p className="text-white/90">
                  {unlockedCount} de {totalCount} logros desbloqueados
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{Math.round((unlockedCount / totalCount) * 100)}%</div>
              <p className="text-white/90 text-sm">Completado</p>
            </div>
          </div>
          
          {/* Barra de Progreso */}
          <div className="mt-4 w-full bg-white/20 rounded-full h-3 overflow-hidden">
            <div
              className="bg-white h-full transition-all duration-500 rounded-full"
              style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
            ></div>
          </div>
        </Card>

        {/* Grid de Logros */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentCompetency.achievements.map((achievement) => {
            const rarityColors = getRarityColor(achievement.rarity);
            
            return (
              <Card
                key={achievement.id}
                className={`p-6 relative overflow-hidden transition-all hover:shadow-xl ${
                  achievement.unlocked
                    ? `border-2 ${rarityColors.border} ${rarityColors.bgLight}`
                    : 'bg-gray-100 border-2 border-gray-300 border-dashed opacity-60'
                }`}
              >
                {/* Badge de Rareza en esquina superior derecha */}
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                  achievement.unlocked
                    ? `bg-gradient-to-r ${rarityColors.bg} text-white`
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {getRarityName(achievement.rarity)}
                </div>

                <div className="flex items-center gap-4">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-lg ${
                    achievement.unlocked
                      ? `bg-gradient-to-br ${rarityColors.bg}`
                      : 'bg-gray-300'
                  }`}>
                    {achievement.unlocked ? achievement.icon : '🔒'}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg ${achievement.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                      {achievement.name}
                    </h3>
                    <p className={`text-sm mt-1 ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                      {achievement.description}
                    </p>
                    {achievement.unlocked && achievement.date && (
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <Award className="w-3 h-3" />
                        <span>Obtenido el {achievement.date}</span>
                      </div>
                    )}
                    {!achievement.unlocked && (
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                        <Lock className="w-3 h-3" />
                        <span>Bloqueado</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Estadísticas Generales de Logros */}
        <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 mt-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Resumen de Logros</h3>
          <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
            {Object.entries(achievementsByCompetency).map(([key, comp]) => {
              const unlockedInComp = comp.achievements.filter(a => a.unlocked).length;
              const totalInComp = comp.achievements.length;
              const percentage = Math.round((unlockedInComp / totalInComp) * 100);
              
              return (
                <div key={key} className="text-center">
                  <div className="text-3xl mb-2">{comp.icon}</div>
                  <div className="font-bold text-lg text-gray-900">{unlockedInComp}/{totalInComp}</div>
                  <div className="text-xs text-gray-600">{percentage}%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2 overflow-hidden">
                    <div
                      className={`bg-gradient-to-r ${comp.color} h-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
