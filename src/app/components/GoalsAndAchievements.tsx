import { Target, Plus, Check, Trash2, CalendarDays, Trophy, Award, Medal, Star, Lock, Gift } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { useState } from 'react';

interface GoalsAndAchievementsProps {
  selectedLevel?: number | null;
}

export function GoalsAndAchievements({ selectedLevel }: GoalsAndAchievementsProps) {
  // Color based on level
  const getLevelColor = () => {
    switch (selectedLevel) {
      case 1: return 'border-green-500';
      case 2: return 'border-blue-500';
      case 3: return 'border-yellow-500';
      case 4: return 'border-orange-500';
      case 5: return 'border-red-500';
      case 6: return 'border-purple-500';
      default: return 'border-orange-200';
    }
  };

  const getLevelBgColor = () => {
    switch (selectedLevel) {
      case 1: return 'from-green-50 to-green-100';
      case 2: return 'from-blue-50 to-blue-100';
      case 3: return 'from-yellow-50 to-yellow-100';
      case 4: return 'from-orange-50 to-orange-100';
      case 5: return 'from-red-50 to-red-100';
      case 6: return 'from-purple-50 to-purple-100';
      default: return 'from-orange-50 to-red-50';
    }
  };

  const [activeTab, setActiveTab] = useState<'goals' | 'achievements'>('goals');
  const [selectedAchievementTab, setSelectedAchievementTab] = useState('totales');
  const [selectedTrophyCategory, setSelectedTrophyCategory] = useState('todos');

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

  //  Definición de logros por competencia
  const achievementsByCompetency = {
    globales: {
      name: 'Logros Globales',
      icon: '🔥',
      color: 'from-orange-500 to-red-600',
      achievements: [
        { id: 1, name: 'No la abandoné', icon: '🟢', description: 'Entraste por segundo día seguido. Ya es algo', unlocked: true, rarity: 'comun', date: '10 Dic 2024' },
        { id: 2, name: 'Sobreviví a una semana', icon: '🔥', description: 'Una semana sin rendirte. Ya no eres turista', unlocked: true, rarity: 'poco_comun', date: '17 Dic 2024' },
        { id: 3, name: 'Modo disciplina', icon: '💪', description: 'Dos semanas seguidas. Tu yo del futuro está orgulloso', unlocked: true, rarity: 'raro', date: '23 Dic 2024' },
        { id: 4, name: 'Cerebro financiero', icon: '🧠', description: 'Ya es un hábito. Tu plata empieza a notarlo', unlocked: false, rarity: 'epico', date: null },
        { id: 5, name: 'Tiburón en entrenamiento', icon: '🦈', description: 'Ya no juegas. Estás en modo pro', unlocked: false, rarity: 'legendario', date: null },
        { id: 6, name: 'Rico consistente', icon: '👑', description: 'La mayoría se rinde. Tú no', unlocked: false, rarity: 'maestro', date: null },
        { id: 37, name: 'Campeón de Competencias', icon: '🏆', description: 'Gana tu primera competencia', unlocked: false, rarity: 'raro', date: null },
        { id: 38, name: 'Experto en Finanzas', icon: '🎓', description: 'Completa todos los cursos disponibles', unlocked: false, rarity: 'legendario', date: null },
        { id: 39, name: 'Maestro de Mini-Juegos', icon: '🎮', description: 'Juega todos los mini-juegos al menos una vez', unlocked: false, rarity: 'raro', date: null },
        { id: 40, name: '🐜 Exterminador', icon: '🐜', description: 'Una semana sin gastos hormiga', unlocked: false, rarity: 'raro', date: null },
        { id: 41, name: '🥷 Ahorrador Ninja', icon: '🥷', description: '2 semanas sin gastos hormiga', unlocked: false, rarity: 'legendario', date: null },
        { id: 42, name: '🔥 Resistí la Tentación', icon: '🔥', description: '1 mes sin gastos hormiga', unlocked: false, rarity: 'maestro', date: null },
      ],
    },
    planificacion: {
      name: 'Planificación de metas',
      icon: '🎯',
      color: 'from-indigo-500 to-indigo-600',
      achievements: [
        { id: 7, name: 'Soñador', icon: '💭', description: 'Creaste tu primera meta', unlocked: true, rarity: 'comun', date: '10 Dic 2024' },
        { id: 8, name: 'Arquitecto', icon: '📐', description: 'Definiste una meta con monto y plazo', unlocked: true, rarity: 'poco_comun', date: '15 Dic 2024' },
        { id: 9, name: 'Cumplidor', icon: '✅', description: 'Completaste una meta', unlocked: true, rarity: 'raro', date: '28 Dic 2024' },
        { id: 10, name: 'Imparable', icon: '🔥', description: 'Cumpliste 3 metas seguidas', unlocked: false, rarity: 'epico', date: null },
      ],
    },
    presupuestos: {
      name: 'Creación de presupuestos',
      icon: '💰',
      color: 'from-green-500 to-green-600',
      achievements: [
        { id: 11, name: 'Primer plan', icon: '📝', description: 'Usaste el presupuesto por primera vez', unlocked: true, rarity: 'comun', date: '12 Dic 2024' },
        { id: 12, name: 'Ordenado', icon: '📊', description: 'Registraste gastos durante 7 días', unlocked: true, rarity: 'poco_comun', date: '19 Dic 2024' },
        { id: 13, name: 'Control total', icon: '✅', description: 'No te pasaste del presupuesto en un mes', unlocked: false, rarity: 'raro', date: null },
        { id: 14, name: 'Maestro del dinero', icon: '👑', description: 'Ajustaste tu presupuesto y mejoraste tus resultados', unlocked: false, rarity: 'maestro', date: null },
        { id: 43, name: 'Ya sé en qué gasto', icon: '🧾', description: 'Registraste todos tus ingresos y gastos por primera vez en el organizador de presupuestos', unlocked: true, rarity: 'comun', date: '12 Dic 2024' },
        { id: 44, name: 'No vivo a ciegas', icon: '📊', description: 'Abriste el gráfico de gastos por primera vez', unlocked: true, rarity: 'comun', date: '19 Dic 2024' },
        { id: 45, name: 'Hormigas controladas', icon: '🐜', description: 'Registraste gastos hormigas por primera vez', unlocked: true, rarity: 'comun', date: '14 Dic 2024' },
        { id: 46, name: 'Mes ordenado', icon: '💪', description: 'Terminaste un mes sin pasarte del presupuesto', unlocked: false, rarity: 'poco_comun', date: null },
        { id: 47, name: 'Adulto funcional', icon: '😎', description: 'Tienes más del 20% de tu plata en ahorro o inversión', unlocked: false, rarity: 'poco_comun', date: null },
        { id: 48, name: 'Cerebro financiero', icon: '👑', description: 'Mantienes tu presupuesto sano por 3 meses', unlocked: false, rarity: 'legendario', date: null },
      ],
    },
    priorizacion: {
      name: 'Priorización',
      icon: '🧮',
      color: 'from-yellow-500 to-yellow-600',
      achievements: [
        { id: 15, name: 'Elegí bien', icon: '🎯', description: 'Elegiste una meta sobre un gasto impulsivo', unlocked: true, rarity: 'comun', date: '14 Dic 2024' },
        { id: 16, name: 'Pensando a futuro', icon: '🔮', description: 'Ahorraste en vez de gastar', unlocked: true, rarity: 'poco_comun', date: '18 Dic 2024' },
        { id: 17, name: 'Estratega', icon: '🧠', description: 'Ajustaste tus gastos por una meta', unlocked: false, rarity: 'epico', date: null },
      ],
    },
    ahorro: {
      name: 'Ahorro',
      icon: '🏦',
      color: 'from-blue-500 to-blue-600',
      achievements: [
        { id: 18, name: 'Primer guardado', icon: '🪙', description: 'Salvaste tu primer peso. Ahorraste por primera vez', unlocked: true, rarity: 'comun', date: '10 Dic 2024' },
        { id: 19, name: 'No me lo gasté', icon: '🔥', description: 'Resististe la tentación 😏. Ahorraste 5 días seguidos', unlocked: true, rarity: 'poco_comun', date: '15 Dic 2024' },
        { id: 20, name: 'Modo disciplina', icon: '📅', description: 'Ya no es suerte, es hábito. Ahorraste 15 días seguidos', unlocked: true, rarity: 'raro', date: '25 Dic 2024' },
        { id: 49, name: 'Ahorro ninja', icon: '💪', description: 'Desaparecen gastos, no tu plata 🥷. Ahorraste 30 días seguidos', unlocked: false, rarity: 'epico', date: null },
        { id: 21, name: 'Meta cumplida', icon: '🎯', description: 'Ahorraste para algo que querías. Lograste una meta de ahorro', unlocked: true, rarity: 'epico', date: '22 Dic 2024' },
      ],
    },
    inversion: {
      name: 'Inversión',
      icon: '📈',
      color: 'from-purple-500 to-purple-600',
      achievements: [
        { id: 22, name: 'Primer brote', icon: '🌱', description: 'Plantaste tu primera semilla de dinero. Invertiste por primera vez', unlocked: true, rarity: 'comun', date: '20 Dic 2024' },
        { id: 23, name: 'Money Mode', icon: '🧠', description: 'Ya no juegas a la suerte. Llevas 1 mes invirtiendo', unlocked: true, rarity: 'poco_comun', date: '18 Ene 2025' },
        { id: 24, name: 'Detective del dinero', icon: '📊', description: 'Ya miras gráficos como un profesional. Llevas 3 meses invirtiendo', unlocked: false, rarity: 'raro', date: null },
        { id: 25, name: 'Tiburón', icon: '🦈', description: 'Ya hueles el dinero desde lejos. Llevas 6 meses invirtiendo', unlocked: false, rarity: 'epico', date: null },
        { id: 26, name: 'GOAT de las inversiones', icon: '😎', description: 'El Warren Buffett versión colegio. Llevas 1 año invirtiendo', unlocked: false, rarity: 'legendario', date: null },
      ],
    },
    deuda: {
      name: 'Deuda responsable',
      icon: '💳',
      color: 'from-red-500 to-red-600',
      achievements: [
        { id: 27, name: 'Sin apuros', icon: '⏸️', description: 'Esperaste para comprar algo', unlocked: true, rarity: 'comun', date: '13 Dic 2024' },
        { id: 28, name: 'Decisión inteligente', icon: '🧠', description: 'Elegiste no endeudarte', unlocked: true, rarity: 'poco_comun', date: '16 Dic 2024' },
        { id: 29, name: 'Buen manejo', icon: '✅', description: 'Pagaste lo que debías a tiempo', unlocked: false, rarity: 'epico', date: null },
      ],
    },
    riesgos: {
      name: 'Riesgos financieros',
      icon: '🚨',
      color: 'from-pink-500 to-pink-600',
      achievements: [
        { id: 30, name: 'Ojo de águila', icon: '🦅', description: 'Detectaste una estafa', unlocked: true, rarity: 'comun', date: '16 Dic 2024' },
        { id: 31, name: 'No caigo', icon: '🛡️', description: 'Evitaste una mala oferta', unlocked: true, rarity: 'raro', date: '21 Dic 2024' },
        { id: 32, name: 'Protector', icon: '👮', description: 'Alertaste a otros', unlocked: false, rarity: 'epico', date: null },
      ],
    },
  };

  const competencyTabs = [
    { id: 'totales', name: 'Logros totales', icon: '🌟' },
    { id: 'globales', name: 'Globales', icon: '🔥' },
    { id: 'planificacion', name: 'Planificación', icon: '🎯' },
    { id: 'presupuestos', name: 'Presupuestos', icon: '💰' },
    { id: 'priorizacion', name: 'Priorización', icon: '🧮' },
    { id: 'ahorro', name: 'Ahorro', icon: '🏦' },
    { id: 'inversion', name: 'Inversión', icon: '📈' },
    { id: 'deuda', name: 'Deuda', icon: '💳' },
    { id: 'riesgos', name: 'Riesgos', icon: '🚨' },
  ];

  // Todos los logros combinados
  const allAchievements = Object.entries(achievementsByCompetency).flatMap(([key, comp]) => 
    comp.achievements.map(achievement => ({
      ...achievement,
      competency: comp.name,
      competencyIcon: comp.icon,
      competencyColor: comp.color,
    }))
  );

  const currentCompetency = selectedAchievementTab === 'totales' 
    ? null 
    : achievementsByCompetency[selectedAchievementTab as keyof typeof achievementsByCompetency];
  
  const displayAchievements = selectedAchievementTab === 'totales' 
    ? allAchievements 
    : (currentCompetency?.achievements || []);
  
  const unlockedCount = selectedAchievementTab === 'totales'
    ? allAchievements.filter(a => a.unlocked).length
    : (currentCompetency?.achievements.filter(a => a.unlocked).length || 0);
  
  const totalCount = selectedAchievementTab === 'totales'
    ? allAchievements.length
    : (currentCompetency?.achievements.length || 0);

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

  // Logros antiguos ya no se usan
  const achievements = [
    {
      id: 1,
      title: 'Primer Ahorro',
      description: 'Completaste tu primera meta de ahorro',
      icon: '💰',
      earned: true,
      date: '15 Dic 2024',
      rarity: 'Común',
      color: 'from-green-400 to-green-600',
      points: 50,
    },
    {
      id: 2,
      title: 'Maestro del Presupuesto',
      description: 'Completaste el curso de Presupuesto Personal',
      icon: '📊',
      earned: true,
      date: '10 Dic 2024',
      rarity: 'Raro',
      color: 'from-blue-400 to-blue-600',
      points: 100,
    },
    {
      id: 3,
      title: 'Racha de Fuego',
      description: 'Mantén 7 días consecutivos de actividad',
      icon: '🔥',
      earned: true,
      date: '5 Dic 2024',
      rarity: 'Común',
      color: 'from-orange-400 to-red-600',
      points: 75,
    },
    {
      id: 4,
      title: 'Inversionista Junior',
      description: 'Completa el curso de Inversiones para Principiantes',
      icon: '📈',
      earned: false,
      date: null,
      rarity: 'Épico',
      color: 'from-purple-400 to-purple-600',
      points: 200,
    },
    {
      id: 5,
      title: 'Campeón de Competencias',
      description: 'Gana tu primera competencia',
      icon: '🏆',
      earned: false,
      date: null,
      rarity: 'Raro',
      color: 'from-yellow-400 to-yellow-600',
      points: 150,
    },
    {
      id: 6,
      title: 'Experto en Finanzas',
      description: 'Completa todos los cursos disponibles',
      icon: '🎓',
      earned: false,
      date: null,
      rarity: 'Legendario',
      color: 'from-pink-400 to-pink-600',
      points: 500,
    },
    {
      id: 7,
      title: 'Maestro de Mini-Juegos',
      description: 'Juega todos los mini-juegos al menos una vez',
      icon: '🎮',
      earned: false,
      date: null,
      rarity: 'Raro',
      color: 'from-indigo-400 to-indigo-600',
      points: 125,
    },
    {
      id: 8,
      title: 'Ahorrador Consistente',
      description: 'Ahorra durante 3 meses consecutivos',
      icon: '💸',
      earned: false,
      date: null,
      rarity: 'Épico',
      color: 'from-teal-400 to-teal-600',
      points: 250,
    },
    {
      id: 9,
      title: '蚂蚁 Exterminador',
      description: 'Una semana sin gastos hormiga',
      icon: '蚂蚁',
      earned: false,
      date: null,
      rarity: 'Raro',
      color: 'from-lime-400 to-lime-600',
      points: 100,
    },
    {
      id: 10,
      title: '🥷 Ahorrador Ninja',
      description: '2 semanas sin gastos hormiga',
      icon: '🥷',
      earned: false,
      date: null,
      rarity: 'Legendario',
      color: 'from-gray-700 to-gray-900',
      points: 300,
    },
    {
      id: 11,
      title: '🔥 Resistí la Tentación',
      description: '1 mes sin gastos hormiga',
      icon: '🔥',
      earned: false,
      date: null,
      rarity: 'Maestro',
      color: 'from-red-500 to-orange-600',
      points: 500,
    },
  ];

  const weeklyGoals = [
    { day: 'Lun', completed: true },
    { day: 'Mar', completed: true },
    { day: 'Mié', completed: true },
    { day: 'Jue', completed: false },
    { day: 'Vie', completed: false },
    { day: 'Sáb', completed: false },
    { day: 'Dom', completed: false },
  ];

  const earnedAchievements = achievements.filter(a => a.earned);
  const lockedAchievements = achievements.filter(a => !a.earned);
  const totalPoints = earnedAchievements.reduce((sum, a) => sum + a.points, 0);

  // Sistema de Trofeos
  const trophies = [
    {
      id: 1,
      name: 'Casi Rico',
      icon: '💰',
      category: 'oro',
      description: 'Ya sabes más de plata que el 90% de tu curso',
      requiredAchievements: [22, 23, 24, 25, 26],
      unlocked: false,
      dateUnlocked: null,
      points: 500,
    },
    {
      id: 2,
      name: 'Maestro del Ahorro',
      icon: '🏦',
      category: 'plata',
      description: 'Que no se te escape ni un peso 🪙😎',
      requiredAchievements: [18, 19, 20, 49, 21],
      unlocked: false,
      dateUnlocked: null,
      points: 300,
    },
    {
      id: 3,
      name: 'Visionario de Metas',
      icon: '🎯',
      category: 'bronce',
      description: 'Planifica tu futuro financiero',
      requiredAchievements: [7, 8, 9, 10],
      unlocked: false,
      dateUnlocked: null,
      points: 200,
    },
    {
      id: 4,
      name: 'Estratega Financiero',
      icon: '🧠',
      category: 'oro',
      description: 'Controla tus finanzas como un experto',
      requiredAchievements: [11, 12, 13, 14, 15, 16, 17],
      unlocked: false,
      dateUnlocked: null,
      points: 450,
    },
    {
      id: 5,
      name: 'Guardian del Dinero',
      icon: '🛡️',
      category: 'plata',
      description: 'Protege tus finanzas de riesgos',
      requiredAchievements: [27, 28, 29, 30, 31, 32],
      unlocked: false,
      dateUnlocked: null,
      points: 350,
    },
    {
      id: 6,
      name: 'Siempre Activo',
      icon: '⚡',
      category: 'diamante',
      description: 'La consistencia es tu superpoder',
      requiredAchievements: [1, 2, 3, 4, 5, 6],
      unlocked: false,
      dateUnlocked: null,
      points: 1000,
    },
    {
      id: 7,
      name: 'Iniciado',
      icon: '🏆',
      category: 'bronce',
      description: 'Da tus primeros pasos',
      requiredAchievements: [1, 7, 11, 18],
      unlocked: true,
      dateUnlocked: '20 Dic 2024',
      points: 100,
    },
    {
      id: 8,
      name: 'Disciplinado',
      icon: '🏆',
      category: 'plata',
      description: 'Mantén el ritmo constante',
      requiredAchievements: [1, 2, 19],
      unlocked: false,
      dateUnlocked: null,
      points: 250,
    },
    {
      id: 9,
      name: 'Deudas Bajo Control',
      icon: '💳',
      category: 'bronce',
      description: 'Maneja las deudas responsablemente',
      requiredAchievements: [27, 28, 29],
      unlocked: false,
      dateUnlocked: null,
      points: 200,
    },
    {
      id: 10,
      name: 'Detector de Fraudes',
      icon: '🕵️',
      category: 'plata',
      description: 'Identifica y evita riesgos',
      requiredAchievements: [30, 31, 32],
      unlocked: false,
      dateUnlocked: null,
      points: 300,
    },
    {
      id: 11,
      name: 'Presupuestador Pro',
      icon: '📊',
      category: 'oro',
      description: 'Domina los presupuestos',
      requiredAchievements: [11, 12, 13, 14],
      unlocked: false,
      dateUnlocked: null,
      points: 400,
    },
    {
      id: 12,
      name: 'Campeón Completo',
      icon: '👑',
      category: 'diamante',
      description: 'Completa todos los desafíos',
      requiredAchievements: Array.from({ length: 32 }, (_, i) => i + 1),
      unlocked: false,
      dateUnlocked: null,
      points: 2000,
    },
  ];

  // Calcular progreso de cada trofeo
  const trophiesWithProgress = trophies.map(trophy => {
    const completedAchievements = trophy.requiredAchievements.filter(achievementId => {
      const achievement = allAchievements.find(a => a.id === achievementId);
      return achievement?.unlocked;
    });
    
    const progress = (completedAchievements.length / trophy.requiredAchievements.length) * 100;
    const isUnlocked = progress === 100;
    
    return {
      ...trophy,
      unlocked: isUnlocked || trophy.unlocked,
      progress,
      completedCount: completedAchievements.length,
      totalRequired: trophy.requiredAchievements.length,
    };
  });

  const getTrophyColor = (category: string) => {
    switch (category) {
      case 'bronce': return {
        gradient: 'from-orange-700 via-amber-600 to-orange-700',
        bg: 'from-orange-50 to-amber-50',
        border: 'border-orange-400',
        text: 'text-orange-700',
        badge: 'bg-gradient-to-r from-orange-700 to-amber-600',
      };
      case 'plata': return {
        gradient: 'from-gray-400 via-gray-300 to-gray-400',
        bg: 'from-gray-50 to-slate-50',
        border: 'border-gray-400',
        text: 'text-gray-700',
        badge: 'bg-gradient-to-r from-gray-400 to-gray-300',
      };
      case 'oro': return {
        gradient: 'from-yellow-500 via-yellow-300 to-yellow-500',
        bg: 'from-yellow-50 to-amber-50',
        border: 'border-yellow-400',
        text: 'text-yellow-700',
        badge: 'bg-gradient-to-r from-yellow-500 to-yellow-300',
      };
      case 'diamante': return {
        gradient: 'from-cyan-400 via-blue-300 to-purple-400',
        bg: 'from-cyan-50 to-purple-50',
        border: 'border-cyan-400',
        text: 'text-cyan-700',
        badge: 'bg-gradient-to-r from-cyan-400 via-blue-300 to-purple-400',
      };
      default: return {
        gradient: 'from-gray-400 to-gray-500',
        bg: 'from-gray-50 to-gray-100',
        border: 'border-gray-400',
        text: 'text-gray-700',
        badge: 'bg-gradient-to-r from-gray-400 to-gray-500',
      };
    }
  };

  const trophyCategories = [
    { id: 'todos', name: 'Todos', icon: '🏆' },
    { id: 'bronce', name: 'Bronce', icon: '🥉' },
    { id: 'plata', name: 'Plata', icon: '🥈' },
    { id: 'oro', name: 'Oro', icon: '🥇' },
    { id: 'diamante', name: 'Diamante', icon: '💎' },
  ];

  const filteredTrophies = selectedTrophyCategory === 'todos'
    ? trophiesWithProgress
    : trophiesWithProgress.filter(t => t.category === selectedTrophyCategory);

  const unlockedTrophies = trophiesWithProgress.filter(t => t.unlocked);
  const totalTrophyPoints = unlockedTrophies.reduce((sum, t) => sum + t.points, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Logros & Trofeos</h1>
          <p className="text-gray-600">Celebra tus éxitos y conquista nuevos desafíos</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('goals')}
          className={`px-6 py-3 font-semibold transition-all relative ${
            activeTab === 'goals'
              ? 'text-[#be9525] border-b-2 border-[#be9525]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            <span>Mis Logros</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('achievements')}
          className={`px-6 py-3 font-semibold transition-all relative ${
            activeTab === 'achievements'
              ? 'text-[#be9525] border-b-2 border-[#be9525]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            <span>Trofeos</span>
            <span className="bg-[#be9525] text-white text-xs px-2 py-1 rounded-full">
              {unlockedTrophies.length}/{trophies.length}
            </span>
          </div>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'goals' ? (
        <>
          {/* Weekly Streak */}
          <Card className={`p-6 bg-gradient-to-br ${getLevelBgColor()} border-4 ${getLevelColor()}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-xl mb-1">Racha Semanal 🔥</h3>
                <p className="text-gray-600">Completa el domingo y obtén un cofre de recompensa</p>
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
                🎁 Completa todos los días y recibe un <span className="font-bold">Cofre Dorado</span> con recompensas exclusivas
              </p>
            </div>
          </Card>

          {/* Logros Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Mis Logros 🏆</h2>
            
            {/* Pestañas de Competencias */}
            <div className="mb-6 overflow-x-auto">
              <div className="flex gap-2 min-w-max pb-2">
                {competencyTabs.map((tab) => {
                  const isActive = selectedAchievementTab === tab.id;
                  
                  let unlockedInTab = 0;
                  let totalInTab = 0;
                  let tabColor = 'from-amber-500 to-yellow-500';
                  
                  if (tab.id === 'totales') {
                    unlockedInTab = allAchievements.filter(a => a.unlocked).length;
                    totalInTab = allAchievements.length;
                    tabColor = 'from-amber-500 to-yellow-500';
                  } else {
                    const tabData = achievementsByCompetency[tab.id as keyof typeof achievementsByCompetency];
                    unlockedInTab = tabData?.achievements.filter(a => a.unlocked).length || 0;
                    totalInTab = tabData?.achievements.length || 0;
                    tabColor = tabData?.color || 'from-gray-500 to-gray-600';
                  }
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedAchievementTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                        isActive
                          ? `bg-gradient-to-r ${tabColor} text-white shadow-lg scale-105`
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span className="text-xl">{tab.icon}</span>
                      <div className="flex flex-col items-start">
                        <span className="text-sm">{tab.name}</span>
                        <span className={`text-xs ${isActive ? 'text-white/90' : 'text-gray-500'}`}>
                          {unlockedInTab}/{totalInTab}
                        </span>
                      </div>
                    </button>
                  );
                })}</div>
            </div>

            {/* Header de la Competencia Seleccionada */}
            {selectedAchievementTab === 'totales' ? (
              <Card className="p-6 bg-gradient-to-r from-amber-500 to-yellow-500 text-white mb-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl border-2 border-white/50 shadow-lg">
                      🌟
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Todos tus logros</h3>
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
                
                <div className="mt-4 w-full bg-white/20 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-white h-full transition-all duration-500 rounded-full"
                    style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
                  ></div>
                </div>
              </Card>
            ) : currentCompetency && (
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
                
                <div className="mt-4 w-full bg-white/20 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-white h-full transition-all duration-500 rounded-full"
                    style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
                  ></div>
                </div>
              </Card>
            )}

            {/* Grid de Logros */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayAchievements.map((achievement) => {
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
              <div className="grid grid-cols-2 md:grid-cols-8 gap-4">
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
        </>
      ) : (
        <>
          {/* Trophy Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">Desbloqueados</p>
                  <p className="text-2xl font-bold text-gray-900">{unlockedTrophies.length}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
              <div className="flex items-center gap-3">
                <Lock className="w-8 h-8 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Bloqueados</p>
                  <p className="text-2xl font-bold text-gray-900">{trophies.length - unlockedTrophies.length}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="flex items-center gap-3">
                <Star className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Puntos Ganados</p>
                  <p className="text-2xl font-bold text-gray-900">{totalTrophyPoints}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Completado</p>
                  <p className="text-2xl font-bold text-gray-900">{Math.round((unlockedTrophies.length / trophies.length) * 100)}%</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Trophies */}
          <div className="mt-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Mis Trofeos 🏆</h2>

            {/* Pestañas de Categorías de Trofeos */}
            <div className="mb-6 overflow-x-auto">
              <div className="flex gap-2 min-w-max pb-2">
                {trophyCategories.map((tab) => {
                  const isActive = selectedTrophyCategory === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedTrophyCategory(tab.id)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span className="text-xl">{tab.icon}</span>
                      <div className="flex flex-col items-start">
                        <span className="text-sm">{tab.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grid de Trofeos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTrophies.map((trophy) => {
                const trophyColor = getTrophyColor(trophy.category);
                const requiredAchievementsList = trophy.requiredAchievements.map(id => allAchievements.find(a => a.id === id)).filter(Boolean);
                
                return (
                  <Card
                    key={trophy.id}
                    className={`p-6 relative overflow-hidden transition-all hover:shadow-xl ${
                      trophy.unlocked
                        ? `border-3 ${trophyColor.border} bg-gradient-to-br ${trophyColor.bg}`
                        : 'bg-gray-100 border-3 border-gray-300 border-dashed'
                    }`}
                  >
                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                      trophy.unlocked
                        ? `${trophyColor.badge} text-white`
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {trophy.category.charAt(0).toUpperCase() + trophy.category.slice(1)}
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-5xl shadow-lg ${
                        trophy.unlocked
                          ? `bg-gradient-to-br ${trophyColor.gradient}`
                          : 'bg-gray-300'
                      }`}>
                        {trophy.unlocked ? trophy.icon : '🔒'}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold text-xl ${trophy.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                          {trophy.name}
                        </h3>
                        <p className={`text-sm mt-1 ${trophy.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                          {trophy.description}
                        </p>
                        {trophy.unlocked && trophy.dateUnlocked && (
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            <Award className="w-3 h-3" />
                            <span>Obtenido el {trophy.dateUnlocked}</span>
                          </div>
                        )}
                        {!trophy.unlocked && (
                          <div className="flex items-center gap-2 mt-2">
                            <div className={`text-sm font-semibold ${trophyColor.text}`}>
                              Progreso: {trophy.completedCount}/{trophy.totalRequired}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {!trophy.unlocked && (
                      <div className="mb-4">
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className={`bg-gradient-to-r ${trophyColor.gradient} h-full transition-all duration-500`}
                            style={{ width: `${trophy.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 text-center">{Math.round(trophy.progress)}% completado</p>
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-bold text-gray-700 mb-3">Logros requeridos:</h4>
                      <div className="space-y-2">
                        {requiredAchievementsList.map((achievement: any) => (
                          <div
                            key={achievement.id}
                            className={`flex items-center gap-2 p-2 rounded-lg ${
                              achievement.unlocked
                                ? 'bg-green-50 border border-green-200'
                                : 'bg-gray-50 border border-gray-200'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${
                              achievement.unlocked
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-300'
                            }`}>
                              {achievement.unlocked ? achievement.icon : '🔒'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-semibold truncate ${
                                achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
                              }`}>
                                {achievement.name}
                              </p>
                              <p className={`text-xs truncate ${
                                achievement.unlocked ? 'text-gray-600' : 'text-gray-400'
                              }`}>
                                {achievement.description}
                              </p>
                            </div>
                            {achievement.unlocked && (
                              <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                      <span className={`text-sm font-bold ${
                        trophy.unlocked ? trophyColor.text : 'text-gray-400'
                      }`}>
                        +{trophy.points} pts
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Estadísticas Generales de Trofeos */}
            <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 mt-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Resumen de Trofeos</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {trophyCategories.filter(c => c.id !== 'todos').map((category) => {
                  const unlockedInCategory = trophiesWithProgress.filter(t => t.category === category.id && t.unlocked).length;
                  const totalInCategory = trophiesWithProgress.filter(t => t.category === category.id).length;
                  const percentage = totalInCategory > 0 ? Math.round((unlockedInCategory / totalInCategory) * 100) : 0;
                  
                  return (
                    <div key={category.id} className="text-center">
                      <div className="text-3xl mb-2">{category.icon}</div>
                      <div className="font-bold text-lg text-gray-900">{unlockedInCategory}/{totalInCategory}</div>
                      <div className="text-xs text-gray-600">{percentage}%</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2 overflow-hidden">
                        <div
                          className={`bg-gradient-to-r ${getTrophyColor(category.id).gradient} h-full transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}