import { useState, useEffect } from 'react';
import { Bug, Plus, TrendingUp, Target, Trophy, Calendar, DollarSign, Trash2, Zap, Award, BarChart3, PieChart } from 'lucide-react';
import { BarChart, Bar, PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, LineChart, Line, ReferenceLine, CartesianGrid } from 'recharts';

interface AntHuntProps {
  selectedLevel: number | null;
}

interface Expense {
  id: number;
  category: string;
  amount: number;
  date: string;
  emoji: string;
  frequency: 'diario' | 'semanal' | 'mensual' | 'trimestral' | 'anual';
}

interface Category {
  id: string;
  name: string;
  emoji: string;
}

const categories: Category[] = [
  { id: 'antojos', name: 'Antojos', emoji: '🍫' },
  { id: 'cafe', name: 'Café', emoji: '☕' },
  { id: 'transporte', name: 'Transporte', emoji: '🚗' },
  { id: 'entretenimiento', name: 'Entretenimiento', emoji: '🎮' },
  { id: 'mall', name: 'Mall', emoji: '🛍️' },
  { id: 'cine', name: 'Cine', emoji: '🎬' },
  { id: 'carrete', name: 'Carrete', emoji: '🎉' },
  { id: 'concierto', name: 'Concierto', emoji: '🎤' },
  { id: 'delivery', name: 'Delivery', emoji: '🍕' },
  { id: 'apps', name: 'Apps', emoji: '📱' },
  { id: 'suscripciones', name: 'Suscripciones', emoji: '⭐' },
  { id: 'imprevistos', name: 'Imprevistos', emoji: '⚠️' },
];

export function AntHunt({ selectedLevel }: AntHuntProps) {
  // Configuración de colores por nivel
  const levelColors = [
    { from: 'from-green-500', to: 'to-green-600', accent: 'bg-green-500', text: 'text-green-600', border: 'border-green-500', ring: 'ring-green-500' },
    { from: 'from-blue-500', to: 'to-blue-600', accent: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-500', ring: 'ring-blue-500' },
    { from: 'from-yellow-400', to: 'to-yellow-500', accent: 'bg-yellow-400', text: 'text-yellow-600', border: 'border-yellow-400', ring: 'ring-yellow-400' },
    { from: 'from-orange-500', to: 'to-orange-600', accent: 'bg-orange-500', text: 'text-orange-600', border: 'border-orange-500', ring: 'ring-orange-500' },
    { from: 'from-red-500', to: 'to-red-600', accent: 'bg-red-500', text: 'text-red-600', border: 'border-red-500', ring: 'ring-red-500' },
    { from: 'from-purple-500', to: 'to-purple-600', accent: 'bg-purple-500', text: 'text-purple-600', border: 'border-purple-500', ring: 'ring-purple-500' },
  ];

  const defaultColors = { from: 'from-[#be9525]', to: 'to-[#f3d374]', accent: 'bg-[#be9525]', text: 'text-[#be9525]', border: 'border-[#be9525]', ring: 'ring-[#be9525]' };
  const currentColors = selectedLevel !== null ? levelColors[selectedLevel] : defaultColors;

  // Estados
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [daysWithoutAnts, setDaysWithoutAnts] = useState(0);
  const [showImpactModal, setShowImpactModal] = useState(false);
  const [lastExpense, setLastExpense] = useState<Expense | null>(null);
  const [selectedFrequency, setSelectedFrequency] = useState<'diario' | 'semanal' | 'mensual' | 'trimestral' | 'anual'>('semanal');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth()); // 0-11
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | '3months'>('month');
  const [monthlyGoal, setMonthlyGoal] = useState<number>(20000); // Meta mensual por defecto
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [tempGoal, setTempGoal] = useState('');

  // Metas personales del usuario
  const personalGoals = [
    { id: 1, name: 'Zapatillas nuevas', emoji: '👟', progress: 45 },
    { id: 2, name: 'Ir al cine', emoji: '🎬', progress: 70 },
    { id: 3, name: 'Viaje de vacaciones', emoji: '✈️', progress: 25 },
  ];

  // Calcular estadísticas
  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const weekExpenses = expenses.filter(e => new Date(e.date) >= weekAgo);
  const monthExpenses = expenses.filter(e => new Date(e.date) >= monthAgo);

  const weekTotal = weekExpenses.reduce((sum, e) => sum + e.amount, 0);
  const monthTotal = monthExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Ranking de categorías
  const categoryTotals = categories.map(cat => {
    const total = expenses
      .filter(e => e.category === cat.id)
      .reduce((sum, e) => sum + e.amount, 0);
    return { ...cat, total };
  }).sort((a, b) => b.total - a.total);

  // Agregar gasto
  const addExpense = () => {
    if (!amount || parseFloat(amount) <= 0) return;

    const newExpense: Expense = {
      id: Date.now(),
      category: selectedCategory.id,
      amount: parseFloat(amount),
      date: date,
      emoji: selectedCategory.emoji,
      frequency: selectedFrequency
    };

    setExpenses([newExpense, ...expenses]);
    setAmount('');
    setShowAddModal(false);
    setDaysWithoutAnts(0); // Reinicia contador
    setLastExpense(newExpense);
    setShowImpactModal(true);
  };

  // Eliminar gasto
  const deleteExpense = (id: number) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  // Calcular días sin gastos hormiga
  useEffect(() => {
    const checkDaysWithoutAnts = () => {
      if (expenses.length === 0) {
        setDaysWithoutAnts(0);
        return;
      }

      const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const lastExpenseDate = new Date(sortedExpenses[0].date);
      const daysSince = Math.floor((today.getTime() - lastExpenseDate.getTime()) / (1000 * 60 * 60 * 24));
      
      setDaysWithoutAnts(daysSince);
    };

    checkDaysWithoutAnts();
  }, [expenses]);

  // Logros desbloqueados
  const achievements = [
    { id: 'exterminator', name: '🐜 Exterminador', requirement: 7, rarity: 'Raro', achieved: daysWithoutAnts >= 7 },
    { id: 'ninja', name: '🥷 Ahorrador Ninja', requirement: 14, rarity: 'Legendario', achieved: daysWithoutAnts >= 14 },
    { id: 'master', name: '🔥 Resistí la Tentación', requirement: 30, rarity: 'Maestro', achieved: daysWithoutAnts >= 30 },
  ];

  // Generar hormigas visuales
  const generateAnts = (count: number) => {
    const maxAnts = 50;
    const antsToShow = Math.min(count, maxAnts);
    return Array.from({ length: antsToShow }, (_, i) => (
      <span 
        key={i} 
        className="inline-block text-2xl animate-bounce"
        style={{ 
          animationDelay: `${i * 0.1}s`,
          animationDuration: `${1 + Math.random()}s`
        }}
      >
        🐜
      </span>
    ));
  };

  // Calcular proyecciones basadas en frecuencia
  const calculateProjections = (amount: number, frequency: string) => {
    let monthly = 0;
    let yearly = 0;

    switch(frequency) {
      case 'diario':
        monthly = amount * 30;
        yearly = amount * 365;
        break;
      case 'semanal':
        monthly = amount * 4;
        yearly = amount * 52;
        break;
      case 'mensual':
        monthly = amount;
        yearly = amount * 12;
        break;
      case 'trimestral':
        monthly = amount / 3;
        yearly = amount * 4;
        break;
      case 'anual':
        monthly = amount / 12;
        yearly = amount;
        break;
      default:
        monthly = amount * 4;
        yearly = amount * 52;
    }

    return { monthly, yearly };
  };

  // Obtener texto descriptivo de la frecuencia
  const getFrequencyText = (frequency: string) => {
    const texts = {
      diario: 'todos los días',
      semanal: 'cada semana',
      mensual: 'cada mes',
      trimestral: 'cada 3 meses',
      anual: 'una vez al año'
    };
    return texts[frequency as keyof typeof texts] || 'cada semana';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div
        className={`relative rounded-2xl p-8 text-white shadow-xl overflow-hidden mb-6 bg-gradient-to-r ${currentColors.from} ${currentColors.to}`}
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Bug className="w-10 h-10" />
                <h1 className="text-3xl font-bold">Caza Hormigas</h1>
              </div>
              <p className="text-white/90 text-lg">
                Los gastos pequeños son como hormigas: uno no importa, pero miles se comen tu plata 💸
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Registrar Gasto
            </button>
          </div>
        </div>
      </div>

      {/* Modal Agregar Gasto */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Plus className={`w-6 h-6 ${currentColors.text}`} />
              Registrar Gasto Hormiga
            </h2>

            {/* Categorías */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Categoría</label>
              <div className="grid grid-cols-4 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat)}
                    className={`p-3 rounded-xl border-2 transition-all hover:scale-105 ${
                      selectedCategory.id === cat.id
                        ? `${currentColors.border} bg-gradient-to-br ${currentColors.from} ${currentColors.to} text-white shadow-lg`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{cat.emoji}</div>
                    <div className={`text-xs font-semibold ${selectedCategory.id === cat.id ? 'text-white' : 'text-gray-700'}`}>
                      {cat.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Monto */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Monto</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={`w-full pl-9 pr-4 py-3 border-2 ${currentColors.border} rounded-xl focus:outline-none focus:ring-2 ${currentColors.ring}`}
                  placeholder="Ej: 2500"
                  min="0"
                />
              </div>
            </div>

            {/* Fecha */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`w-full px-4 py-3 border-2 ${currentColors.border} rounded-xl focus:outline-none focus:ring-2 ${currentColors.ring}`}
              />
            </div>

            {/* Frecuencia */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Frecuencia</label>
              <select
                value={selectedFrequency}
                onChange={(e) => setSelectedFrequency(e.target.value as 'diario' | 'semanal' | 'mensual' | 'trimestral' | 'anual')}
                className={`w-full px-4 py-3 border-2 ${currentColors.border} rounded-xl focus:outline-none focus:ring-2 ${currentColors.ring} bg-white text-gray-800 font-semibold`}
              >
                <option value="diario">📅 Diario</option>
                <option value="semanal">📆 Semanal</option>
                <option value="mensual">🗓️ Mensual</option>
                <option value="trimestral">📊 Trimestral (cada 3 meses)</option>
                <option value="anual">📋 Anual (una vez al año)</option>
              </select>
            </div>

            {/* Botones */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={addExpense}
                className={`flex-1 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all bg-gradient-to-r ${currentColors.from} ${currentColors.to}`}
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Impacto */}
      {showImpactModal && lastExpense && (() => {
        const projections = calculateProjections(lastExpense.amount, lastExpense.frequency);
        const frequencyText = getFrequencyText(lastExpense.frequency);
        
        return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <span className="text-6xl">{lastExpense.emoji}</span>
              </div>
              <h2 className={`text-3xl font-bold mb-2 bg-gradient-to-r ${currentColors.from} ${currentColors.to} bg-clip-text text-transparent`}>
                ¡Impacto de tu Gasto Hormiga!
              </h2>
              <p className="text-gray-600">
                {categories.find(c => c.id === lastExpense.category)?.name} • {new Date(lastExpense.date).toLocaleDateString('es-CL', { 
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
              <div className={`inline-block px-4 py-1 rounded-full mt-2 text-sm font-semibold text-white bg-gradient-to-r ${currentColors.from} ${currentColors.to}`}>
                Frecuencia: {lastExpense.frequency.charAt(0).toUpperCase() + lastExpense.frequency.slice(1)}
              </div>
            </div>

            {/* Gasto Registrado */}
            <div className={`bg-gradient-to-r ${currentColors.from} ${currentColors.to} rounded-xl p-6 text-white mb-6`}>
              <div className="text-center">
                <p className="text-lg mb-2">Gastaste</p>
                <p className="text-5xl font-bold">${lastExpense.amount.toLocaleString('es-CL')}</p>
                <p className="text-sm mt-2 text-white/80">
                  {frequencyText}
                </p>
              </div>
            </div>

            {/* Proyecciones */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
                📊 Impacto de este gasto hormiga:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mensual */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-300 shadow-sm">
                  <div className="text-center">
                    <p className="text-sm text-blue-700 font-semibold mb-1">💳 Gasto Mensual</p>
                    <p className="text-xs text-blue-600 mb-3">Si se mantiene esta frecuencia</p>
                    <p className="text-4xl font-bold text-blue-900 mb-2">
                      ${Math.round(projections.monthly).toLocaleString('es-CL')}
                    </p>
                    <p className="text-xs text-blue-700">por mes</p>
                  </div>
                </div>

                {/* Anual */}
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-5 border-2 border-red-300 shadow-sm">
                  <div className="text-center">
                    <p className="text-sm text-red-700 font-semibold mb-1">📅 Gasto Anual</p>
                    <p className="text-xs text-red-600 mb-3">Proyección a 12 meses</p>
                    <p className="text-4xl font-bold text-red-900 mb-2">
                      ${Math.round(projections.yearly).toLocaleString('es-CL')}</p>
                    <p className="text-xs text-red-700">por año</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparativa de escenarios */}
            <div className="mb-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-5 border-2 border-purple-200">
              <h3 className="text-sm font-bold text-purple-900 mb-3 text-center">
                🔄 Acumulado en diferentes períodos
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center text-xs">
                <div className="bg-white rounded-lg p-3 border border-purple-200">
                  <p className="font-semibold text-gray-700">Semanal</p>
                  <p className="font-bold text-purple-900 mt-1">
                    ${(() => {
                      let weekly = 0;
                      switch(lastExpense.frequency) {
                        case 'diario': weekly = lastExpense.amount * 7; break;
                        case 'semanal': weekly = lastExpense.amount; break;
                        case 'mensual': weekly = lastExpense.amount / 4; break;
                        case 'trimestral': weekly = lastExpense.amount / 12; break;
                        case 'anual': weekly = lastExpense.amount / 52; break;
                      }
                      return Math.round(weekly).toLocaleString('es-CL');
                    })()}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-purple-200">
                  <p className="font-semibold text-gray-700">Mensual</p>
                  <p className="font-bold text-purple-900 mt-1">
                    ${(() => {
                      let monthly = 0;
                      switch(lastExpense.frequency) {
                        case 'diario': monthly = lastExpense.amount * 30; break;
                        case 'semanal': monthly = lastExpense.amount * 4; break;
                        case 'mensual': monthly = lastExpense.amount; break;
                        case 'trimestral': monthly = lastExpense.amount / 3; break;
                        case 'anual': monthly = lastExpense.amount / 12; break;
                      }
                      return Math.round(monthly).toLocaleString('es-CL');
                    })()}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-purple-200">
                  <p className="font-semibold text-gray-700">Trimestral</p>
                  <p className="font-bold text-purple-900 mt-1">
                    ${(() => {
                      let quarterly = 0;
                      switch(lastExpense.frequency) {
                        case 'diario': quarterly = lastExpense.amount * 90; break;
                        case 'semanal': quarterly = lastExpense.amount * 12; break;
                        case 'mensual': quarterly = lastExpense.amount * 3; break;
                        case 'trimestral': quarterly = lastExpense.amount; break;
                        case 'anual': quarterly = lastExpense.amount / 4; break;
                      }
                      return Math.round(quarterly).toLocaleString('es-CL');
                    })()}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-purple-200">
                  <p className="font-semibold text-gray-700">Semestral</p>
                  <p className="font-bold text-purple-900 mt-1">
                    ${(() => {
                      let semiannual = 0;
                      switch(lastExpense.frequency) {
                        case 'diario': semiannual = lastExpense.amount * 180; break;
                        case 'semanal': semiannual = lastExpense.amount * 26; break;
                        case 'mensual': semiannual = lastExpense.amount * 6; break;
                        case 'trimestral': semiannual = lastExpense.amount * 2; break;
                        case 'anual': semiannual = lastExpense.amount / 2; break;
                      }
                      return Math.round(semiannual).toLocaleString('es-CL');
                    })()}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-purple-200">
                  <p className="font-semibold text-gray-700">Anual</p>
                  <p className="font-bold text-purple-900 mt-1">
                    ${(() => {
                      let yearly = 0;
                      switch(lastExpense.frequency) {
                        case 'diario': yearly = lastExpense.amount * 365; break;
                        case 'semanal': yearly = lastExpense.amount * 52; break;
                        case 'mensual': yearly = lastExpense.amount * 12; break;
                        case 'trimestral': yearly = lastExpense.amount * 4; break;
                        case 'anual': yearly = lastExpense.amount; break;
                      }
                      return Math.round(yearly).toLocaleString('es-CL');
                    })()}
                  </p>
                </div>
              </div>
            </div>

            {/* Mensaje de Impacto */}
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-5 border-2 border-orange-300 mb-6">
              <div className="flex items-start gap-3">
                <span className="text-3xl">😱</span>
                <div className="flex-1">
                  <p className="font-bold text-orange-900 mb-2">¡Chuta, ahí se te va toda la plata!</p>
                  <p className="text-sm text-orange-800">
                    Si mantienes este gasto <span className="font-bold">{frequencyText}</span>, en un año habrás gastado <span className="font-bold text-lg">${Math.round(projections.yearly).toLocaleString('es-CL')}</span>. ¿Te imaginas todo lo que podrías comprar con eso? 👟✈️🎬
                  </p>
                </div>
              </div>
            </div>

            {/* Botón Cerrar */}
            <button
              onClick={() => setShowImpactModal(false)}
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all bg-gradient-to-r ${currentColors.from} ${currentColors.to}`}
            >
              Entendido, ¡voy a cazar estas hormigas! 🐜
            </button>
          </div>
        </div>
        );
      })()}

      {/* Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Total Semanal */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className={`w-6 h-6 ${currentColors.text}`} />
              <h3 className="font-bold text-gray-800">Esta Semana</h3>
            </div>
            <span className="text-2xl">{weekExpenses.length > 0 ? '🐜' : '✅'}</span>
          </div>
          <div className={`text-3xl font-bold ${currentColors.text} mb-2`}>
            ${weekTotal.toLocaleString('es-CL')}
          </div>
          {weekExpenses.length > 0 && (
            <p className="text-sm text-gray-600">
              Tus hormigas se comieron esto en 7 días 😬
            </p>
          )}
          {weekExpenses.length === 0 && (
            <p className="text-sm text-green-600 font-semibold">
              ¡Cero gastos hormiga! 🎉
            </p>
          )}
          <div className="mt-4 flex gap-1 flex-wrap">
            {generateAnts(weekExpenses.length)}
          </div>
        </div>

        {/* Total Mensual */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className={`w-6 h-6 ${currentColors.text}`} />
              <h3 className="font-bold text-gray-800">Este Mes</h3>
            </div>
            <span className="text-2xl">{monthExpenses.length > 0 ? '🐜' : '✅'}</span>
          </div>
          <div className={`text-3xl font-bold ${currentColors.text} mb-2`}>
            ${monthTotal.toLocaleString('es-CL')}
          </div>
          <p className="text-sm text-gray-600">
            {monthExpenses.length} gastos pequeños
          </p>
          <div className="mt-4 flex gap-1 flex-wrap max-h-12 overflow-hidden">
            {generateAnts(monthExpenses.length)}
          </div>
        </div>

        {/* Días sin gastos */}
        <div className={`bg-gradient-to-br ${currentColors.from} ${currentColors.to} rounded-xl p-6 shadow-lg text-white`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6" />
              <h3 className="font-bold">Racha Actual</h3>
            </div>
            <span className="text-2xl">🔥</span>
          </div>
          <div className="text-4xl font-bold mb-2">
            {daysWithoutAnts} días
          </div>
          <p className="text-sm text-white/90">
            {daysWithoutAnts === 0 ? 'Empieza tu racha hoy' : 'Sin gastos hormiga'}
          </p>
        </div>
      </div>

      {/* Modal Configurar Meta de Gastos Hormiga */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Target className={`w-6 h-6 ${currentColors.text}`} />
              Meta de Gastos Hormiga
            </h2>
            <p className="text-gray-600 mb-6 text-sm">
              Establece cuánto dinero máximo quieres gastar al mes en gastos hormiga 🐜
            </p>

            {/* Input Meta */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Mensual</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">$</span>
                <input
                  type="number"
                  value={tempGoal}
                  onChange={(e) => setTempGoal(e.target.value)}
                  className={`w-full pl-10 pr-4 py-4 border-2 ${currentColors.border} rounded-xl focus:outline-none focus:ring-2 ${currentColors.ring} text-xl font-bold`}
                  placeholder="20000"
                  min="0"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">💡 Recomendado: Entre $10,000 y $30,000 al mes</p>
            </div>

            {/* Presets sugeridos */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">🎯 Metas sugeridas:</p>
              <div className="grid grid-cols-3 gap-2">
                {[10000, 20000, 30000].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setTempGoal(preset.toString())}
                    className={`py-3 px-2 rounded-lg border-2 transition-all hover:scale-105 ${
                      tempGoal === preset.toString()
                        ? `${currentColors.border} bg-gradient-to-r ${currentColors.from} ${currentColors.to} text-white font-bold`
                        : 'border-gray-200 text-gray-700 hover:border-gray-300 font-semibold'
                    }`}
                  >
                    ${(preset / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowGoalModal(false);
                  setTempGoal('');
                }}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (tempGoal && parseFloat(tempGoal) > 0) {
                    setMonthlyGoal(parseFloat(tempGoal));
                    setShowGoalModal(false);
                    setTempGoal('');
                  }
                }}
                className={`flex-1 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all bg-gradient-to-r ${currentColors.from} ${currentColors.to}`}
              >
                Guardar Meta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Meta de Gastos Hormiga */}
      <div className="bg-white rounded-xl p-6 shadow-lg mb-6 border-2 border-purple-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-bold text-gray-800">Meta de Gastos Hormiga 🎯</h3>
          </div>
          <button
            onClick={() => {
              setTempGoal(monthlyGoal.toString());
              setShowGoalModal(true);
            }}
            className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold rounded-lg transition-all text-sm"
          >
            ✏️ Editar Meta
          </button>
        </div>

        {/* Visualización de la Meta */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-purple-700 font-semibold">Tu límite mensual</p>
              <p className="text-3xl font-bold text-purple-900">${monthlyGoal.toLocaleString('es-CL')}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-purple-700 font-semibold">Gastado este mes</p>
              <p className={`text-3xl font-bold ${monthTotal > monthlyGoal ? 'text-red-600' : 'text-green-600'}`}>
                ${monthTotal.toLocaleString('es-CL')}
              </p>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="w-full bg-white rounded-full h-6 overflow-hidden border-2 border-purple-200 relative">
            <div
              className={`h-full transition-all duration-500 ${
                monthTotal > monthlyGoal
                  ? 'bg-gradient-to-r from-red-500 to-red-600'
                  : monthTotal > monthlyGoal * 0.8
                  ? 'bg-gradient-to-r from-orange-400 to-orange-500'
                  : 'bg-gradient-to-r from-green-500 to-emerald-500'
              }`}
              style={{ width: `${Math.min((monthTotal / monthlyGoal) * 100, 100)}%` }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-800">
                {((monthTotal / monthlyGoal) * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Mensaje de estado */}
          <div className="mt-4">
            {monthTotal <= monthlyGoal * 0.5 ? (
              <div className="flex items-center gap-2 text-green-800 bg-green-100 rounded-lg p-3">
                <span className="text-2xl">🌟</span>
                <div className="flex-1">
                  <p className="font-bold text-sm">¡Excelente control!</p>
                  <p className="text-xs">Te quedan ${(monthlyGoal - monthTotal).toLocaleString('es-CL')} disponibles</p>
                </div>
              </div>
            ) : monthTotal <= monthlyGoal * 0.8 ? (
              <div className="flex items-center gap-2 text-blue-800 bg-blue-100 rounded-lg p-3">
                <span className="text-2xl">👍</span>
                <div className="flex-1">
                  <p className="font-bold text-sm">Vas bien, pero ojo</p>
                  <p className="text-xs">Te quedan ${(monthlyGoal - monthTotal).toLocaleString('es-CL')} disponibles</p>
                </div>
              </div>
            ) : monthTotal <= monthlyGoal ? (
              <div className="flex items-center gap-2 text-orange-800 bg-orange-100 rounded-lg p-3">
                <span className="text-2xl">⚠️</span>
                <div className="flex-1">
                  <p className="font-bold text-sm">¡Cuidado! Casi llegas al límite</p>
                  <p className="text-xs">Solo te quedan ${(monthlyGoal - monthTotal).toLocaleString('es-CL')}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-800 bg-red-100 rounded-lg p-3">
                <span className="text-2xl">🚨</span>
                <div className="flex-1">
                  <p className="font-bold text-sm">¡Te pasaste de tu meta!</p>
                  <p className="text-xs">Sobrepasaste por ${(monthTotal - monthlyGoal).toLocaleString('es-CL')}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desglose rápido */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600 mb-1">Disponible</p>
            <p className={`font-bold ${monthTotal > monthlyGoal ? 'text-red-600' : 'text-green-600'}`}>
              ${Math.max(0, monthlyGoal - monthTotal).toLocaleString('es-CL')}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600 mb-1">Promedio diario</p>
            <p className="font-bold text-purple-600">
              ${Math.round(monthTotal / new Date().getDate()).toLocaleString('es-CL')}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600 mb-1">Proyección mes</p>
            <p className={`font-bold ${
              (monthTotal / new Date().getDate()) * 30 > monthlyGoal ? 'text-red-600' : 'text-blue-600'
            }`}>
              ${Math.round((monthTotal / new Date().getDate()) * 30).toLocaleString('es-CL')}
            </p>
          </div>
        </div>
      </div>

      {/* Evolución Temporal de Gastos Hormiga */}
      <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp className={`w-6 h-6 ${currentColors.text}`} />
            Tu Evolución en el Tiempo
          </h3>

          {/* Selector de Periodo */}
          <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setSelectedPeriod('week')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                selectedPeriod === 'week'
                  ? `bg-gradient-to-r ${currentColors.from} ${currentColors.to} text-white shadow-md`
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              🗓️ Esta semana
            </button>
            <button
              onClick={() => setSelectedPeriod('month')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                selectedPeriod === 'month'
                  ? `bg-gradient-to-r ${currentColors.from} ${currentColors.to} text-white shadow-md`
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              📅 Este mes
            </button>
            <button
              onClick={() => setSelectedPeriod('3months')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                selectedPeriod === '3months'
                  ? `bg-gradient-to-r ${currentColors.from} ${currentColors.to} text-white shadow-md`
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              📆 3 meses
            </button>
          </div>
        </div>

        {/* Gráfico de Línea Temporal */}
        {expenses.length > 0 ? (() => {
          // Preparar datos según el periodo seleccionado
          const now = new Date();
          let periodData: { date: string; total: number; count: number }[] = [];
          
          if (selectedPeriod === 'week') {
            // Últimos 7 días
            for (let i = 6; i >= 0; i--) {
              const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
              const dateStr = date.toISOString().split('T')[0];
              const dayExpenses = expenses.filter(e => e.date === dateStr);
              const total = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
              periodData.push({
                date: date.toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric' }),
                total,
                count: dayExpenses.length
              });
            }
          } else if (selectedPeriod === 'month') {
            // Últimas 4 semanas
            for (let i = 3; i >= 0; i--) {
              const weekStart = new Date(now.getTime() - (i * 7 + 6) * 24 * 60 * 60 * 1000);
              const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
              const weekExpenses = expenses.filter(e => {
                const expenseDate = new Date(e.date);
                return expenseDate >= weekStart && expenseDate <= weekEnd;
              });
              const total = weekExpenses.reduce((sum, e) => sum + e.amount, 0);
              periodData.push({
                date: `Sem ${4 - i}`,
                total,
                count: weekExpenses.length
              });
            }
          } else {
            // Últimos 3 meses
            for (let i = 2; i >= 0; i--) {
              const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
              const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
              const monthExpenses = expenses.filter(e => {
                const expenseDate = new Date(e.date);
                return expenseDate >= month && expenseDate < nextMonth;
              });
              const total = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
              periodData.push({
                date: month.toLocaleDateString('es-CL', { month: 'short' }),
                total,
                count: monthExpenses.length
              });
            }
          }

          // Meta de ahorro diaria/semanal/mensual basada en la meta personalizada
          const savingsGoal = personalGoals[0]; // Usar la primera meta
          const goalAmount = selectedPeriod === 'week' 
            ? monthlyGoal / 4 
            : selectedPeriod === 'month' 
            ? monthlyGoal 
            : monthlyGoal * 3;

          const maxValue = Math.max(...periodData.map(d => d.total), goalAmount);

          return (
            <div>
              {/* Información de Meta */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-4 border-2 border-purple-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{savingsGoal.emoji}</span>
                    <div>
                      <p className="font-bold text-purple-900">Tu meta de ahorro 🎯</p>
                      <p className="text-sm text-purple-700">
                        Cada hormiga te aleja de: <span className="font-bold">{savingsGoal.name}</span>
                      </p>
                      <p className="text-xs text-purple-600 mt-1">
                        Meta mensual: ${monthlyGoal.toLocaleString('es-CL')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-purple-600">
                      {selectedPeriod === 'week' ? 'Límite semanal' : selectedPeriod === 'month' ? 'Límite mensual' : 'Límite 3 meses'}
                    </p>
                    <p className="text-lg font-bold text-purple-900">${goalAmount.toLocaleString('es-CL')}</p>
                  </div>
                </div>
              </div>

              {/* Gráfico */}
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={periodData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    stroke="#6b7280"
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 rounded-lg shadow-lg border-2 border-purple-200">
                            <p className="font-bold text-gray-800 mb-1">{data.date}</p>
                            <p className={`text-lg font-bold ${currentColors.text}`}>
                              ${data.total.toLocaleString('es-CL')}
                            </p>
                            <p className="text-xs text-gray-600">{data.count} gastos hormiga 🐜</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  {/* Línea de Meta de Ahorro */}
                  <ReferenceLine 
                    y={goalAmount} 
                    stroke="#9333ea" 
                    strokeDasharray="5 5" 
                    strokeWidth={2}
                    label={
                      <text 
                        x="95%" 
                        y={100} 
                        fill="#9333ea" 
                        fontSize="12" 
                        fontWeight="bold"
                        textAnchor="end"
                      >
                        🎯 Meta: ${goalAmount.toLocaleString('es-CL')}
                      </text>
                    }
                  />
                  {/* Línea de Gastos */}
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke={selectedLevel !== null ? ['#22c55e', '#3b82f6', '#eab308', '#f97316', '#ef4444', '#a855f7'][selectedLevel] : '#be9525'}
                    strokeWidth={3}
                    dot={{ fill: selectedLevel !== null ? ['#22c55e', '#3b82f6', '#eab308', '#f97316', '#ef4444', '#a855f7'][selectedLevel] : '#be9525', r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>

              {/* Mensaje motivacional */}
              <div className="mt-4">
                {periodData.length > 0 && (() => {
                  const totalPeriod = periodData.reduce((sum, d) => d.total + sum, 0);
                  const isUnderGoal = totalPeriod < goalAmount;
                  const trend = periodData.length >= 2 && periodData[periodData.length - 1].total < periodData[0].total;
                  
                  return (
                    <div className={`rounded-xl p-4 border-2 ${
                      isUnderGoal 
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300' 
                        : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-300'
                    }`}>
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{isUnderGoal ? '🎉' : '😅'}</span>
                        <div className="flex-1">
                          {isUnderGoal ? (
                            <>
                              <p className="font-bold text-green-900 mb-1">
                                ¡Vas súper bien! 🚀
                              </p>
                              <p className="text-sm text-green-800">
                                {trend && "Mira cómo bajaron cuando empezaste a usar la app 😎. "}
                                Estás ${(goalAmount - totalPeriod).toLocaleString('es-CL')} por debajo de tu meta {
                                  selectedPeriod === 'week' ? 'semanal' : selectedPeriod === 'month' ? 'mensual' : 'trimestral'
                                }. 
                                ¡Sigue así y conseguirás {savingsGoal.name} más rápido!
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="font-bold text-orange-900 mb-1">
                                Ojo ahí 👀
                              </p>
                              <p className="text-sm text-orange-800">
                                Sobrepasaste tu meta {
                                  selectedPeriod === 'week' ? 'semanal' : selectedPeriod === 'month' ? 'mensual' : 'trimestral'
                                } por ${(totalPeriod - goalAmount).toLocaleString('es-CL')}. 
                                Cada hormiga te aleja de {savingsGoal.name} {savingsGoal.emoji}. ¡Puedes mejorar!
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          );
        })() : (
          <div className="text-center py-16 text-gray-500">
            <TrendingUp className="w-20 h-20 mx-auto mb-4 opacity-20" />
            <p className="font-semibold mb-2">Sin datos para graficar</p>
            <p className="text-sm">Registra tus primeros gastos hormiga para ver tu evolución en el tiempo</p>
          </div>
        )}
      </div>

      {/* Ranking de Hormigas y Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Trophy className={`w-6 h-6 ${currentColors.text}`} />
            Las que más se comen tu plata
          </h3>
          <div className="space-y-3">
            {categoryTotals.slice(0, 5).map((cat, index) => (
              <div key={cat.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                  index === 0 ? 'bg-yellow-500' : 
                  index === 1 ? 'bg-gray-400' : 
                  index === 2 ? 'bg-orange-600' : 'bg-gray-300'
                }`}>
                  {index + 1}
                </div>
                <span className="text-2xl">{cat.emoji}</span>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">{cat.name}</div>
                  <div className="text-xs text-gray-500">
                    {expenses.filter(e => e.category === cat.id).length} gastos
                  </div>
                </div>
                <div className={`font-bold text-lg ${currentColors.text}`}>
                  ${cat.total.toLocaleString('es-CL')}
                </div>
              </div>
            ))}
            {categoryTotals.every(cat => cat.total === 0) && (
              <div className="text-center py-8 text-gray-500">
                <Bug className="w-16 h-16 mx-auto mb-3 opacity-20" />
                <p>Aún no tienes gastos hormiga registrados</p>
              </div>
            )}
          </div>
        </div>

        {/* Gráficos Visuales */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart3 className={`w-6 h-6 ${currentColors.text}`} />
            Visualización de Gastos
          </h3>
          
          {expenses.length > 0 ? (
            <div className="space-y-6">
              {/* Gráfico de Pastel - Distribución por Categoría */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3 text-center">📊 Distribución por Categoría</p>
                <ResponsiveContainer width="100%" height={200}>
                  <RechartsPie>
                    <Pie
                      data={categoryTotals.filter(cat => cat.total > 0).map(cat => ({
                        name: cat.name,
                        value: cat.total,
                        emoji: cat.emoji
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.emoji} $${entry.value.toLocaleString('es-CL')}`}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryTotals.filter(cat => cat.total > 0).map((entry, index) => {
                        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788', '#FF8FA3', '#A8DADC'];
                        return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                      })}
                    </Pie>
                    <Tooltip formatter={(value: number) => `$${value.toLocaleString('es-CL')}`} />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>

              {/* Gráfico de Barras - Top 6 Categorías */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3 text-center">📈 Top 6 Categorías</p>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={categoryTotals.filter(cat => cat.total > 0).slice(0, 6)}>
                    <XAxis 
                      dataKey="emoji"
                      tick={(props) => {
                        const { x, y, payload } = props;
                        const total = expenses.reduce((sum, e) => sum + e.amount, 0);
                        const categoryData = categoryTotals.find(cat => cat.emoji === payload.value);
                        const percentage = total > 0 && categoryData ? ((categoryData.total / total) * 100).toFixed(1) : 0;
                        
                        return (
                          <g transform={`translate(${x},${y})`}>
                            <text 
                              x={0} 
                              y={0} 
                              dy={16} 
                              textAnchor="middle" 
                              fontSize="20"
                            >
                              {payload.value}
                            </text>
                            <text 
                              x={0} 
                              y={20} 
                              dy={16} 
                              textAnchor="middle" 
                              fontSize="11" 
                              fontWeight="bold"
                              fill={selectedLevel !== null ? ['#22c55e', '#3b82f6', '#eab308', '#f97316', '#ef4444', '#a855f7'][selectedLevel] : '#be9525'}
                            >
                              {percentage}%
                            </text>
                          </g>
                        );
                      }}
                      height={60}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`$${value.toLocaleString('es-CL')}`, 'Total']}
                      labelFormatter={(label) => categoryTotals.find(cat => cat.emoji === label)?.name || label}
                    />
                    <Bar 
                      dataKey="total" 
                      fill={selectedLevel !== null ? ['#22c55e', '#3b82f6', '#eab308', '#f97316', '#ef4444', '#a855f7'][selectedLevel] : '#be9525'}
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <PieChart className="w-20 h-20 mx-auto mb-4 opacity-20" />
              <p className="font-semibold mb-2">Sin datos para visualizar</p>
              <p className="text-sm">Registra tus primeros gastos hormiga para ver gráficos aquí</p>
            </div>
          )}
        </div>
      </div>

      {/* Logros Especiales */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Award className={`w-6 h-6 ${currentColors.text}`} />
          Logros Especiales Caza Hormigas
        </h3>
        <div className="space-y-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-xl border-2 transition-all ${
                achievement.achieved
                  ? `${currentColors.border} bg-gradient-to-r ${currentColors.from} ${currentColors.to} text-white`
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`text-xl font-bold ${achievement.achieved ? 'text-white' : 'text-gray-800'}`}>
                  {achievement.name}
                </div>
                {achievement.achieved && <span className="text-2xl">✅</span>}
              </div>
              <div className={`text-sm ${achievement.achieved ? 'text-white/90' : 'text-gray-600'}`}>
                {achievement.requirement} días sin gastos hormiga
              </div>
              <div className="mt-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  achievement.achieved
                    ? 'bg-white/20 text-white'
                    : achievement.rarity === 'Raro'
                    ? 'bg-blue-100 text-blue-700'
                    : achievement.rarity === 'Legendario'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  {achievement.rarity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conexión con Metas */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 shadow-lg mb-6 border-2 border-purple-200">
        <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center gap-2">
          <Target className="w-6 h-6" />
          💡 Conecta con tus metas
        </h3>
        
        {/* Metas Personales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {personalGoals.map((goal) => (
            <div key={goal.id} className="bg-white rounded-xl p-4 border-2 border-purple-200 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{goal.emoji}</span>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800">{goal.name}</h4>
                  <p className="text-xs text-purple-600">{goal.progress}% completado</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500"
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje motivacional */}
        <div className="bg-white/70 rounded-xl p-4 border-2 border-purple-300">
          <p className="text-purple-900 text-center font-bold text-lg">
            🚀 Sin gastos hormiga, llegarás a tus metas más rápido!
          </p>
          {monthTotal > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-purple-800 text-center">
                Si derrotas estas hormigas este mes, ahorrarías <span className="font-bold">${monthTotal.toLocaleString('es-CL')}</span>
              </p>
              <div className="flex justify-center gap-4 text-sm text-purple-700">
                <span>💰 3 meses: <span className="font-bold">${(monthTotal * 3).toLocaleString('es-CL')}</span></span>
                <span>💰 6 meses: <span className="font-bold">${(monthTotal * 6).toLocaleString('es-CL')}</span></span>
                <span>💰 1 año: <span className="font-bold">${(monthTotal * 12).toLocaleString('es-CL')}</span></span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Historial de Gastos */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <DollarSign className={`w-6 h-6 ${currentColors.text}`} />
            Historial de Gastos Hormiga
          </h3>
          
          {/* Filtro de Mes/Año */}
          <div className="flex gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className={`px-3 py-2 border-2 ${currentColors.border} rounded-lg focus:outline-none focus:ring-2 ${currentColors.ring} bg-white text-sm font-semibold`}
            >
              <option value={0}>Enero</option>
              <option value={1}>Febrero</option>
              <option value={2}>Marzo</option>
              <option value={3}>Abril</option>
              <option value={4}>Mayo</option>
              <option value={5}>Junio</option>
              <option value={6}>Julio</option>
              <option value={7}>Agosto</option>
              <option value={8}>Septiembre</option>
              <option value={9}>Octubre</option>
              <option value={10}>Noviembre</option>
              <option value={11}>Diciembre</option>
            </select>
            
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className={`px-3 py-2 border-2 ${currentColors.border} rounded-lg focus:outline-none focus:ring-2 ${currentColors.ring} bg-white text-sm font-semibold`}
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {(() => {
          // Filtrar gastos por mes y año seleccionados
          const filteredExpenses = expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === selectedMonth && expenseDate.getFullYear() === selectedYear;
          });

          const filteredTotal = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

          // Nombres de meses
          const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                             'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

          return (
            <>
              {/* Resumen del mes filtrado */}
              {filteredExpenses.length > 0 && (
                <div className={`bg-gradient-to-r ${currentColors.from} ${currentColors.to} rounded-xl p-4 mb-4 text-white`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/80">Total en {monthNames[selectedMonth]} {selectedYear}</p>
                      <p className="text-2xl font-bold">${filteredTotal.toLocaleString('es-CL')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-white/80">{filteredExpenses.length} gastos</p>
                      <div className="flex gap-1 mt-1 justify-end">
                        {generateAnts(Math.min(filteredExpenses.length, 10))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {filteredExpenses.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-auto">
                  {filteredExpenses.map((expense) => (
                    <div key={expense.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
                      <span className="text-2xl">{expense.emoji}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">
                          {categories.find(c => c.id === expense.category)?.name}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-2">
                          <span>
                            {new Date(expense.date).toLocaleDateString('es-CL', { 
                              weekday: 'short', 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-semibold">
                            {expense.frequency}
                          </span>
                        </div>
                      </div>
                      <div className={`font-bold ${currentColors.text}`}>
                        ${expense.amount.toLocaleString('es-CL')}
                      </div>
                      <button
                        onClick={() => deleteExpense(expense.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-all group"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="w-16 h-16 mx-auto mb-3 opacity-20" />
                  <p className="text-lg font-semibold mb-2">Sin gastos hormiga en {monthNames[selectedMonth]} {selectedYear}</p>
                  <p className="text-sm">¡Excelente trabajo manteniendo a raya las hormigas! 🎉</p>
                </div>
              )}
            </>
          );
        })()}
      </div>
    </div>
  );
}