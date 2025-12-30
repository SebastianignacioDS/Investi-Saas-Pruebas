import { useState, useEffect } from 'react';
import { Wallet, Plus, TrendingUp, TrendingDown, DollarSign, Target, Zap, Calculator, Sliders, AlertCircle, CheckCircle, PieChart as PieChartIcon, BarChart3, Trash2, Edit2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface BudgetOrganizerProps {
  selectedLevel: number | null;
}

interface Income {
  id: number;
  category: string;
  amount: number;
  description: string;
  emoji: string;
}

interface Expense {
  id: number;
  category: string;
  type: 'fijo' | 'variable' | 'meta';
  amount: number;
  description: string;
  emoji: string;
}

const incomeCategories = [
  { id: 'mesada', name: 'Mesadas', emoji: '💰' },
  { id: 'becas', name: 'Becas', emoji: '🎓' },
  { id: 'trabajos', name: 'Trabajos', emoji: '💼' },
  { id: 'otros', name: 'Otros', emoji: '✨' },
];

const expenseCategories = {
  fijo: [
    { id: 'transporte', name: 'Transporte', emoji: '🚌' },
    { id: 'telefono', name: 'Teléfono', emoji: '📱' },
    { id: 'internet', name: 'Internet', emoji: '🌐' },
    { id: 'plan', name: 'Plan celular', emoji: '📞' },
    { id: 'tarjeta', name: 'Tarjeta', emoji: '💳' },
  ],
  variable: [
    { id: 'antojos', name: 'Antojos', emoji: '🍫' },
    { id: 'carrete', name: 'Carrete', emoji: '🎉' },
    { id: 'apps', name: 'Apps', emoji: '📲' },
    { id: 'juegos', name: 'Juegos', emoji: '🎮' },
    { id: 'cine', name: 'Cine', emoji: '🎬' },
    { id: 'salidas', name: 'Salidas', emoji: '🍕' },
    { id: 'novio', name: 'Novia/o', emoji: '💕' },
  ],
  meta: [
    { id: 'ahorro', name: 'Ahorro', emoji: '💰' },
    { id: 'inversion', name: 'Inversión', emoji: '📈' },
    { id: 'objetivos', name: 'Objetivos', emoji: '🎯' },
  ],
};

export function BudgetOrganizer({ selectedLevel }: BudgetOrganizerProps) {
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
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showSavingsModal, setShowSavingsModal] = useState(false);
  const [selectedIncomeCategory, setSelectedIncomeCategory] = useState(incomeCategories[0]);
  const [selectedExpenseCategory, setSelectedExpenseCategory] = useState(expenseCategories.fijo[0]);
  const [selectedExpenseType, setSelectedExpenseType] = useState<'fijo' | 'variable' | 'meta'>('fijo');
  const [selectedSavingsCategory, setSelectedSavingsCategory] = useState(expenseCategories.meta[0]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [simulationReduction, setSimulationReduction] = useState(0);

  // Calcular totales
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  // Los gastos ahora solo incluyen fijos y variables, NO las metas
  const totalExpenses = expenses.filter(e => e.type === 'fijo' || e.type === 'variable').reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calcular por tipo
  const fixedExpenses = expenses.filter(e => e.type === 'fijo').reduce((sum, e) => sum + e.amount, 0);
  const variableExpenses = expenses.filter(e => e.type === 'variable').reduce((sum, e) => sum + e.amount, 0);
  const savingsGoals = expenses.filter(e => e.type === 'meta').reduce((sum, e) => sum + e.amount, 0);
  
  // Ahorro & Inversión suma como ingreso adicional (vale 1.5x más)
  const savingsBonus = savingsGoals * 1.5;
  const totalIncomeWithSavings = totalIncome + savingsBonus;
  
  // Balance: Ingresos + Bonus de Ahorro - Gastos
  const balance = totalIncome - totalExpenses;

  // Agregar ingreso
  const addIncome = () => {
    if (!amount || parseFloat(amount) <= 0) return;

    const newIncome: Income = {
      id: Date.now(),
      category: selectedIncomeCategory.id,
      amount: parseFloat(amount),
      description: description || selectedIncomeCategory.name,
      emoji: selectedIncomeCategory.emoji,
    };

    setIncomes([newIncome, ...incomes]);
    setAmount('');
    setDescription('');
    setShowIncomeModal(false);
  };

  // Agregar gasto
  const addExpense = () => {
    if (!amount || parseFloat(amount) <= 0) return;

    const newExpense: Expense = {
      id: Date.now(),
      category: selectedExpenseCategory.id,
      type: selectedExpenseType,
      amount: parseFloat(amount),
      description: description || selectedExpenseCategory.name,
      emoji: selectedExpenseCategory.emoji,
    };

    setExpenses([newExpense, ...expenses]);
    setAmount('');
    setDescription('');
    setShowExpenseModal(false);
  };

  // Agregar ahorro/inversión
  const addSavings = () => {
    if (!amount || parseFloat(amount) <= 0) return;

    const newSavings: Expense = {
      id: Date.now(),
      category: selectedSavingsCategory.id,
      type: 'meta',
      amount: parseFloat(amount),
      description: description || selectedSavingsCategory.name,
      emoji: selectedSavingsCategory.emoji,
    };

    setExpenses([newSavings, ...expenses]);
    setAmount('');
    setDescription('');
    setShowSavingsModal(false);
  };

  // Eliminar ingreso
  const deleteIncome = (id: number) => {
    setIncomes(incomes.filter(i => i.id !== id));
  };

  // Eliminar gasto
  const deleteExpense = (id: number) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  // Datos para gráfico de pastel
  const categoryData = expenses.reduce((acc, expense) => {
    const existing = acc.find(item => item.category === expense.category);
    if (existing) {
      existing.value += expense.amount;
    } else {
      acc.push({
        category: expense.category,
        name: expenseCategories[expense.type].find(cat => cat.id === expense.category)?.name || expense.category,
        emoji: expense.emoji,
        value: expense.amount,
      });
    }
    return acc;
  }, [] as { category: string; name: string; emoji: string; value: number }[]);

  const sortedCategoryData = categoryData.sort((a, b) => b.value - a.value);

  // Colores para gráfico de pastel
  const pieColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788'];

  // Salud financiera
  const getFinancialHealth = () => {
    // Si no hay ingresos pero SÍ hay ahorro/inversión → MODO RICO
    if (totalIncome === 0 && savingsGoals > 0) {
      return { 
        status: 'modo rico', 
        message: '¡Modo Rico! Estás ahorrando sin gastar 🚀💰', 
        color: 'purple', 
        emoji: '👑', 
        position: 100 
      };
    }
    
    // Si no hay ingresos pero sí hay gastos (fijos o variables) → EN PELIGRO
    if (totalIncome === 0 && totalExpenses > 0) {
      return { 
        status: 'en peligro', 
        message: '¡EN PELIGRO! Tienes gastos sin ingresos 🚨', 
        color: 'red', 
        emoji: '🔴', 
        position: 0 
      };
    }
    
    // Si no hay ingresos, ni gastos, ni ahorro → neutral
    if (totalIncome === 0) {
      return { 
        status: 'inestable', 
        message: 'Registra tus ingresos para comenzar', 
        color: 'gray', 
        emoji: '📊', 
        position: 40 
      };
    }
    
    const savingsRate = (savingsGoals / totalIncome) * 100;
    const expenseRate = (totalExpenses / totalIncome) * 100;
    const balanceRate = ((totalIncome - totalExpenses) / totalIncome) * 100;
    
    let healthPosition = 0;
    let status = '';
    let message = '';
    let color = '';
    let emoji = '';

    // 🎯 ESCALA NUEVA SEGÚN ESPECIFICACIONES:
    
    // 100% - Ahorras 30% o más
    if (savingsRate >= 30) {
      healthPosition = 100;
      status = 'modo rico';
      message = '¡MODO RICO! Ahorras 30% o más 👑🚀';
      color = 'purple';
      emoji = '👑';
    }
    // 90% - Ahorras 20-29%
    else if (savingsRate >= 20) {
      healthPosition = 90;
      status = 'buena salud';
      message = '¡Buena Salud! Ahorras 20% o más 💪✨';
      color = 'green';
      emoji = '💚';
    }
    // 80% - Ahorras 10-19%
    else if (savingsRate >= 10) {
      healthPosition = 80;
      status = 'buena salud';
      message = '¡Buena Salud! Ahorras 10% o más 💚';
      color = 'green';
      emoji = '💚';
    }
    // 70% - Ingresos 30% mayores a gastos (pero ahorra menos de 10%)
    else if (balanceRate >= 30 && savingsRate < 10) {
      healthPosition = 70;
      status = 'en equilibrio';
      message = 'En Equilibrio. Ingresos 30% mayor a gastos ⚖️';
      color = 'blue';
      emoji = '💙';
    }
    // 60% - Ingresos 20% mayores a gastos
    else if (balanceRate >= 20 && balanceRate < 30) {
      healthPosition = 60;
      status = 'en equilibrio';
      message = 'En Equilibrio. Ingresos 20% mayor a gastos 💙';
      color = 'blue';
      emoji = '💙';
    }
    // 50% - Ingresos 10% mayores a gastos
    else if (balanceRate >= 10 && balanceRate < 20) {
      healthPosition = 50;
      status = 'inestable';
      message = 'Inestable. Ingresos 10% mayor a gastos ⚠️';
      color = 'yellow';
      emoji = '💛';
    }
    // 40% - Ingresos = Gastos (estables, sin ahorro)
    else if (balanceRate >= 0 && balanceRate < 10) {
      healthPosition = 40;
      status = 'inestable';
      message = 'Inestable. Ingresos estables con gastos 💛';
      color = 'yellow';
      emoji = '💛';
    }
    // 30% - Gastos 10-19% mayores a ingresos
    else if (expenseRate >= 110 && expenseRate < 120) {
      healthPosition = 30;
      status = 'en peligro';
      message = '¡En Peligro! Gastos 10% mayor a ingresos 🚨';
      color = 'orange';
      emoji = '🟠';
    }
    // 10% - Gastos 20-29% mayores a ingresos
    else if (expenseRate >= 120 && expenseRate < 130) {
      healthPosition = 10;
      status = 'en peligro';
      message = '¡PELIGRO! Gastos 20% mayor a ingresos 🔴';
      color = 'red';
      emoji = '🔴';
    }
    // 0% - Gastos 30%+ mayores a ingresos
    else if (expenseRate >= 130) {
      healthPosition = 0;
      status = 'en peligro';
      message = '¡CRÍTICO! Gastos 30%+ mayor a ingresos 🔴';
      color = 'red';
      emoji = '🔴';
    }

    return { status, message, color, emoji, position: healthPosition };
  };

  const financialHealth = getFinancialHealth();

  // Simulación de reducción
  const simulatedVariableExpenses = Math.max(0, variableExpenses - simulationReduction);
  const simulatedTotalExpenses = fixedExpenses + simulatedVariableExpenses + savingsGoals;
  const simulatedBalance = totalIncome - simulatedTotalExpenses;
  const balanceDifference = simulatedBalance - balance;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className={`relative rounded-2xl p-8 text-white shadow-xl overflow-hidden mb-6 bg-gradient-to-r ${currentColors.from} ${currentColors.to}`}>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Wallet className="w-10 h-10" />
                <h1 className="text-3xl font-bold">Organizador de Presupuesto</h1>
              </div>
              <p className="text-white/90 text-lg">
                Organiza tu plata, cumple tus metas y llega más lejos 💰
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowIncomeModal(true)}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-3 rounded-xl font-bold transition-all hover:scale-105 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Ingreso
              </button>
              <button
                onClick={() => setShowExpenseModal(true)}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-3 rounded-xl font-bold transition-all hover:scale-105 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Gasto
              </button>
              <button
                onClick={() => setShowSavingsModal(true)}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-3 rounded-xl font-bold transition-all hover:scale-105 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Ahorro o Inversión
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Agregar Ingreso */}
      {showIncomeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <TrendingUp className={`w-6 h-6 ${currentColors.text}`} />
              Registrar Ingreso
            </h2>

            {/* Categorías de Ingreso */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Categoría</label>
              <div className="grid grid-cols-3 gap-3">
                {incomeCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedIncomeCategory(cat)}
                    className={`p-3 rounded-xl border-2 transition-all hover:scale-105 ${
                      selectedIncomeCategory.id === cat.id
                        ? `${currentColors.border} bg-gradient-to-br ${currentColors.from} ${currentColors.to} text-white shadow-lg`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{cat.emoji}</div>
                    <div className={`text-xs font-semibold ${selectedIncomeCategory.id === cat.id ? 'text-white' : 'text-gray-700'}`}>
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
                  placeholder="Ej: 50000"
                  min="0"
                />
              </div>
            </div>

            {/* Descripción */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción (opcional)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full px-4 py-3 border-2 ${currentColors.border} rounded-xl focus:outline-none focus:ring-2 ${currentColors.ring}`}
                placeholder="Ej: Mesada de diciembre"
              />
            </div>

            {/* Botones */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowIncomeModal(false);
                  setAmount('');
                  setDescription('');
                }}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={addIncome}
                className={`flex-1 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all bg-gradient-to-r ${currentColors.from} ${currentColors.to}`}
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Agregar Gasto */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <TrendingDown className={`w-6 h-6 ${currentColors.text}`} />
              Registrar Gasto
            </h2>

            {/* Tipo de Gasto */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Tipo de Gasto</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setSelectedExpenseType('fijo');
                    setSelectedExpenseCategory(expenseCategories.fijo[0]);
                  }}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    selectedExpenseType === 'fijo'
                      ? `${currentColors.border} bg-gradient-to-br ${currentColors.from} ${currentColors.to} text-white shadow-lg`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-xl mb-1">🏠</div>
                  <div className={`text-xs font-semibold ${selectedExpenseType === 'fijo' ? 'text-white' : 'text-gray-700'}`}>
                    Fijos
                  </div>
                </button>
                <button
                  onClick={() => {
                    setSelectedExpenseType('variable');
                    setSelectedExpenseCategory(expenseCategories.variable[0]);
                  }}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    selectedExpenseType === 'variable'
                      ? `${currentColors.border} bg-gradient-to-br ${currentColors.from} ${currentColors.to} text-white shadow-lg`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-xl mb-1">🐜</div>
                  <div className={`text-xs font-semibold ${selectedExpenseType === 'variable' ? 'text-white' : 'text-gray-700'}`}>
                    Variables
                  </div>
                </button>
              </div>
            </div>

            {/* Categorías de Gasto */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Categoría</label>
              <div className="grid grid-cols-3 gap-3">
                {expenseCategories[selectedExpenseType].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedExpenseCategory(cat)}
                    className={`p-3 rounded-xl border-2 transition-all hover:scale-105 ${
                      selectedExpenseCategory.id === cat.id
                        ? `${currentColors.border} bg-gradient-to-br ${currentColors.from} ${currentColors.to} text-white shadow-lg`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{cat.emoji}</div>
                    <div className={`text-xs font-semibold ${selectedExpenseCategory.id === cat.id ? 'text-white' : 'text-gray-700'}`}>
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
                  placeholder="Ej: 15000"
                  min="0"
                />
              </div>
            </div>

            {/* Descripción */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción (opcional)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full px-4 py-3 border-2 ${currentColors.border} rounded-xl focus:outline-none focus:ring-2 ${currentColors.ring}`}
                placeholder="Ej: Pase escolar"
              />
            </div>

            {/* Botones */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowExpenseModal(false);
                  setAmount('');
                  setDescription('');
                }}
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

      {/* Modal Agregar Ahorro o Inversión */}
      {showSavingsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Target className={`w-6 h-6 ${currentColors.text}`} />
              Registrar Ahorro o Inversión
            </h2>

            {/* Categorías de Ahorro/Inversión */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">¿Qué quieres hacer con tu plata?</label>
              <div className="grid grid-cols-3 gap-3">
                {expenseCategories.meta.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedSavingsCategory(cat)}
                    className={`p-3 rounded-xl border-2 transition-all hover:scale-105 ${
                      selectedSavingsCategory.id === cat.id
                        ? `${currentColors.border} bg-gradient-to-br ${currentColors.from} ${currentColors.to} text-white shadow-lg`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{cat.emoji}</div>
                    <div className={`text-xs font-semibold ${selectedSavingsCategory.id === cat.id ? 'text-white' : 'text-gray-700'}`}>
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
                  placeholder="Ej: 20000"
                  min="0"
                />
              </div>
            </div>

            {/* Descripción */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción (opcional)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full px-4 py-3 border-2 ${currentColors.border} rounded-xl focus:outline-none focus:ring-2 ${currentColors.ring}`}
                placeholder="Ej: Ahorro para vacaciones"
              />
            </div>

            {/* Mensaje motivacional */}
            <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-300">
              <p className="text-sm text-green-800 text-center font-semibold">
                🚀 ¡Cada peso que ahorras o inviertes es un paso hacia tu futuro! 💪
              </p>
            </div>

            {/* Botones */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSavingsModal(false);
                  setAmount('');
                  setDescription('');
                }}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={addSavings}
                className={`flex-1 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all bg-gradient-to-r ${currentColors.from} ${currentColors.to}`}
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resumen General */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {/* Total Ingresos */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h3 className="font-bold text-gray-800 text-sm">Ingresos</h3>
            </div>
            <span className="text-2xl">💵</span>
          </div>
          <div className="text-3xl font-bold text-green-600 mb-1">
            ${totalIncome.toLocaleString('es-CL')}
          </div>
          <p className="text-xs text-gray-600">Este mes tienes esto</p>
        </div>

        {/* Total Gastos */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              <h3 className="font-bold text-gray-800 text-sm">Gastos</h3>
            </div>
            <span className="text-2xl">💸</span>
          </div>
          <div className="text-3xl font-bold text-red-600 mb-1">
            ${totalExpenses.toLocaleString('es-CL')}
          </div>
          <p className="text-xs text-gray-600">Total comprometido</p>
        </div>

        {/* Ahorro & Inversión */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className={`w-5 h-5 ${currentColors.text}`} />
              <h3 className="font-bold text-gray-800 text-sm">Ahorro & Inversión</h3>
            </div>
            <span className="text-2xl">🐷</span>
          </div>
          <div className={`text-3xl font-bold ${currentColors.text} mb-1`}>
            ${savingsGoals.toLocaleString('es-CL')}
          </div>
          <p className="text-xs text-gray-600">
            {totalIncome > 0 ? `${((savingsGoals / totalIncome) * 100).toFixed(1)}%` : '0%'} de tus ingresos
          </p>
        </div>

        {/* Balance */}
        <div className={`bg-gradient-to-br ${balance >= 0 ? 'from-green-500 to-emerald-600' : 'from-red-500 to-red-600'} rounded-xl p-6 shadow-lg text-white`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              <h3 className="font-bold text-sm">Balance</h3>
            </div>
            <span className="text-2xl">{balance >= 0 ? '✅' : '⚠️'}</span>
          </div>
          <div className="text-3xl font-bold mb-1">
            ${Math.abs(balance).toLocaleString('es-CL')}
          </div>
          <p className="text-xs text-white/90">{balance >= 0 ? 'Disponible' : 'En rojo'}</p>
        </div>
      </div>

      {/* Barra de Salud Financiera */}
      <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">❤️</span>
          Salud Financiera
        </h3>

        <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <span className="text-5xl">{financialHealth.emoji}</span>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {financialHealth.status.charAt(0).toUpperCase() + financialHealth.status.slice(1)}
                </p>
                <p className="text-gray-700">{financialHealth.message}</p>
              </div>
            </div>
          </div>

          {/* Barra de salud con gradiente y indicador móvil */}
          {totalIncome > 0 && (() => {
            return (
              <div>
                {/* Etiquetas de los 5 niveles */}
                <div className="flex justify-between text-xs font-semibold text-gray-600 mb-2">
                  <span className="text-red-600">🔴 En Peligro</span>
                  <span className="text-yellow-600">💛 Inestable</span>
                  <span className="text-blue-600">💙 En Equilibrio</span>
                  <span className="text-green-600">💚 Buena Salud</span>
                  <span className="text-purple-600">👑 Modo Rico</span>
                </div>

                {/* Barra con gradiente de 5 niveles */}
                <div className="relative w-full h-6 rounded-full overflow-hidden shadow-inner mb-4" style={{
                  background: 'linear-gradient(to right, #ef4444 0%, #ef4444 40%, #f59e0b 40%, #f59e0b 60%, #3b82f6 60%, #3b82f6 80%, #22c55e 80%, #22c55e 90%, #a855f7 90%, #a855f7 100%)'
                }}>
                  {/* Indicador móvil */}
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-500 ease-out"
                    style={{ left: `${financialHealth.position}%` }}
                  >
                    <div className="relative">
                      {/* Triángulo apuntando hacia abajo */}
                      <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-white shadow-lg"></div>
                      {/* Línea vertical */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-6 bg-white shadow-lg"></div>
                    </div>
                  </div>
                </div>

                {/* Leyenda de niveles */}
                <div className="grid grid-cols-5 gap-2 mb-4 text-xs">
                  <div className="text-center p-2 bg-red-50 rounded border border-red-200">
                    <p className="font-bold text-red-700">0-40%</p>
                    <p className="text-red-600 text-[10px]">En Peligro</p>
                    <p className="text-red-500 text-[9px] mt-1">Gastos &gt; Ingresos</p>
                  </div>
                  <div className="text-center p-2 bg-yellow-50 rounded border border-yellow-200">
                    <p className="font-bold text-yellow-700">40-60%</p>
                    <p className="text-yellow-600 text-[10px]">Inestable</p>
                    <p className="text-yellow-500 text-[9px] mt-1">Ing. 0-20% &gt; Gastos</p>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded border border-blue-200">
                    <p className="font-bold text-blue-700">60-80%</p>
                    <p className="text-blue-600 text-[10px]">Equilibrio</p>
                    <p className="text-blue-500 text-[9px] mt-1">Ing. 20-30% &gt; Gastos</p>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded border border-green-200">
                    <p className="font-bold text-green-700">80-90%</p>
                    <p className="text-green-600 text-[10px]">Buena Salud</p>
                    <p className="text-green-500 text-[9px] mt-1">Ahorro 10-20%</p>
                  </div>
                  <div className="text-center p-2 bg-purple-50 rounded border border-purple-200">
                    <p className="font-bold text-purple-700">90-100%</p>
                    <p className="text-purple-600 text-[10px]">Modo Rico</p>
                    <p className="text-purple-500 text-[9px] mt-1">Ahorro 20%+</p>
                  </div>
                </div>

                {/* Estadísticas detalladas */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-700 font-semibold mb-1">Gastos Fijos</p>
                    <p className="text-lg font-bold text-blue-900">{((fixedExpenses / totalIncome) * 100).toFixed(0)}%</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-xs text-orange-700 font-semibold mb-1">Variables</p>
                    <p className="text-lg font-bold text-orange-900">{((variableExpenses / totalIncome) * 100).toFixed(0)}%</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-xs text-green-700 font-semibold mb-1">Ahorro/Metas</p>
                    <p className="text-lg font-bold text-green-900">{((savingsGoals / totalIncome) * 100).toFixed(0)}%</p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Gráficos y Desglose */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfico de Pastel */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <PieChartIcon className={`w-6 h-6 ${currentColors.text}`} />
            ¿En qué se te va la plata?
          </h3>

          {sortedCategoryData.length > 0 ? (
            <div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={sortedCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.emoji} ${((entry.value / totalExpenses) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sortedCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `$${value.toLocaleString('es-CL')}`} />
                </PieChart>
              </ResponsiveContainer>

              {/* Top categoría */}
              {sortedCategoryData.length > 0 && (
                <div className="mt-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border-2 border-orange-300">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{sortedCategoryData[0].emoji}</span>
                    <div className="flex-1">
                      <p className="font-bold text-orange-900">
                        {sortedCategoryData[0].name} es tu gasto #1 🐜😬
                      </p>
                      <p className="text-sm text-orange-800">
                        ${sortedCategoryData[0].value.toLocaleString('es-CL')} ({((sortedCategoryData[0].value / totalExpenses) * 100).toFixed(1)}% del total)
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <PieChartIcon className="w-20 h-20 mx-auto mb-4 opacity-20" />
              <p className="font-semibold mb-2">Sin gastos registrados</p>
              <p className="text-sm">Agrega tus gastos para ver la distribución</p>
            </div>
          )}
        </div>

        {/* Desglose por Tipo */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart3 className={`w-6 h-6 ${currentColors.text}`} />
            Desglose de Gastos
          </h3>

          <div className="space-y-4">
            {/* Gastos Fijos */}
            <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏠</span>
                  <div>
                    <p className="font-bold text-blue-900">Gastos Fijos</p>
                    <p className="text-xs text-blue-700">Obligatorios cada mes</p>
                  </div>
                </div>
                <p className="text-xl font-bold text-blue-900">${fixedExpenses.toLocaleString('es-CL')}</p>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-full"
                  style={{ width: `${totalIncome > 0 ? (fixedExpenses / totalIncome) * 100 : 0}%` }}
                ></div>
              </div>
              <p className="text-xs text-blue-700 mt-1 text-right">
                {totalIncome > 0 ? ((fixedExpenses / totalIncome) * 100).toFixed(1) : 0}% de tus ingresos
              </p>
            </div>

            {/* Gastos Variables */}
            <div className="bg-orange-50 rounded-xl p-4 border-2 border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🐜</span>
                  <div>
                    <p className="font-bold text-orange-900">Gastos Variables</p>
                    <p className="text-xs text-orange-700">Puedes controlarlos</p>
                  </div>
                </div>
                <p className="text-xl font-bold text-orange-900">${variableExpenses.toLocaleString('es-CL')}</p>
              </div>
              <div className="w-full bg-orange-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-full"
                  style={{ width: `${totalIncome > 0 ? (variableExpenses / totalIncome) * 100 : 0}%` }}
                ></div>
              </div>
              <p className="text-xs text-orange-700 mt-1 text-right">
                {totalIncome > 0 ? ((variableExpenses / totalIncome) * 100).toFixed(1) : 0}% de tus ingresos
              </p>
            </div>

            {/* Ahorro y Metas */}
            <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <p className="font-bold text-green-900">Ahorro & Inversión</p>
                    <p className="text-xs text-green-700">Tu futuro 🚀</p>
                  </div>
                </div>
                <p className="text-xl font-bold text-green-900">${savingsGoals.toLocaleString('es-CL')}</p>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-full"
                  style={{ width: `${totalIncome > 0 ? (savingsGoals / totalIncome) * 100 : 0}%` }}
                ></div>
              </div>
              <p className="text-xs text-green-700 mt-1 text-right">
                {totalIncome > 0 ? ((savingsGoals / totalIncome) * 100).toFixed(1) : 0}% de tus ingresos
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Simulación "¿Qué pasa si...?" */}
      {variableExpenses > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Sliders className={`w-6 h-6 ${currentColors.text}`} />
            Simulación: ¿Qué pasa si...?
          </h3>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-300">
            <p className="text-purple-900 font-semibold mb-4">
              ¿Qué pasa si reduzco mis gastos variables (antojos, carrete, etc)?
            </p>

            {/* Slider */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-purple-800">Reducción mensual:</label>
                <span className={`text-2xl font-bold ${currentColors.text}`}>
                  ${simulationReduction.toLocaleString('es-CL')}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={variableExpenses}
                step="1000"
                value={simulationReduction}
                onChange={(e) => setSimulationReduction(parseInt(e.target.value))}
                className="w-full h-3 bg-purple-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-purple-700 mt-1">
                <span>$0</span>
                <span>${variableExpenses.toLocaleString('es-CL')}</span>
              </div>
            </div>

            {/* Resultados de la simulación */}
            {simulationReduction > 0 && (
              <div className="space-y-3">
                <div className="bg-white rounded-xl p-4 border-2 border-green-300">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">💰</span>
                    <div className="flex-1">
                      <p className="font-bold text-green-900 mb-1">¡Ahorrarías más dinero!</p>
                      <p className="text-sm text-green-800">
                        Tendrías <span className="font-bold">${balanceDifference.toLocaleString('es-CL')}</span> extra cada mes
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border-2 border-blue-300">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🎯</span>
                    <div className="flex-1">
                      <p className="font-bold text-blue-900 mb-1">Llegas más rápido a tus metas</p>
                      <p className="text-sm text-blue-800">
                        Si ahorras ${simulationReduction.toLocaleString('es-CL')} cada mes, en 6 meses tendrías ${(simulationReduction * 6).toLocaleString('es-CL')} 🚀
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border-2 border-purple-300">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">📈</span>
                    <div className="flex-1">
                      <p className="font-bold text-purple-900 mb-1">Podrías invertir</p>
                      <p className="text-sm text-purple-800">
                        Con ese extra podrías empezar a invertir y hacer crecer tu dinero 😎
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Listado de Ingresos */}
      {incomes.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
            Mis Ingresos
          </h3>
          <div className="space-y-2">
            {incomes.map((income) => (
              <div key={income.id} className="flex items-center gap-4 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-all">
                <span className="text-2xl">{income.emoji}</span>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">{income.description}</div>
                  <div className="text-xs text-gray-500">
                    {incomeCategories.find(c => c.id === income.category)?.name}
                  </div>
                </div>
                <div className="font-bold text-green-600">
                  +${income.amount.toLocaleString('es-CL')}
                </div>
                <button
                  onClick={() => deleteIncome(income.id)}
                  className="p-2 hover:bg-red-100 rounded-lg transition-all group"
                >
                  <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Listado de Gastos */}
      {expenses.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingDown className="w-6 h-6 text-red-600" />
            Mis Gastos
          </h3>

          {/* Filtrado por tipo */}
          <div className="grid grid-cols-1 gap-4">
            {/* Gastos Fijos */}
            {expenses.filter(e => e.type === 'fijo').length > 0 && (
              <div>
                <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                  <span>🏠</span> Gastos Fijos
                </h4>
                <div className="space-y-2">
                  {expenses.filter(e => e.type === 'fijo').map((expense) => (
                    <div key={expense.id} className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all">
                      <span className="text-2xl">{expense.emoji}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{expense.description}</div>
                        <div className="text-xs text-gray-500">
                          {expenseCategories[expense.type].find(c => c.id === expense.category)?.name}
                        </div>
                      </div>
                      <div className="font-bold text-blue-600">
                        -${expense.amount.toLocaleString('es-CL')}
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
              </div>
            )}

            {/* Gastos Variables */}
            {expenses.filter(e => e.type === 'variable').length > 0 && (
              <div>
                <h4 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
                  <span>🐜</span> Gastos Variables
                </h4>
                <div className="space-y-2">
                  {expenses.filter(e => e.type === 'variable').map((expense) => (
                    <div key={expense.id} className="flex items-center gap-4 p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-all">
                      <span className="text-2xl">{expense.emoji}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{expense.description}</div>
                        <div className="text-xs text-gray-500">
                          {expenseCategories[expense.type].find(c => c.id === expense.category)?.name}
                        </div>
                      </div>
                      <div className="font-bold text-orange-600">
                        -${expense.amount.toLocaleString('es-CL')}
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
              </div>
            )}

            {/* Metas */}
            {expenses.filter(e => e.type === 'meta').length > 0 && (
              <div>
                <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                  <span>🎯</span> Ahorro y Metas
                </h4>
                <div className="space-y-2">
                  {expenses.filter(e => e.type === 'meta').map((expense) => (
                    <div key={expense.id} className="flex items-center gap-4 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-all">
                      <span className="text-2xl">{expense.emoji}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{expense.description}</div>
                        <div className="text-xs text-gray-500">
                          {expenseCategories[expense.type].find(c => c.id === expense.category)?.name}
                        </div>
                      </div>
                      <div className="font-bold text-green-600">
                        -${expense.amount.toLocaleString('es-CL')}
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
              </div>
            )}
          </div>
        </div>
      )}

      {/* Estado vacío */}
      {incomes.length === 0 && expenses.length === 0 && (
        <div className="bg-white rounded-xl p-12 shadow-lg text-center">
          <Wallet className="w-24 h-24 mx-auto mb-4 text-gray-300" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">¡Empieza a organizar tu presupuesto!</h3>
          <p className="text-gray-600 mb-6">
            Registra tus ingresos y gastos para tener control total de tu plata 💰
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setShowIncomeModal(true)}
              className={`px-6 py-3 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all bg-gradient-to-r ${currentColors.from} ${currentColors.to}`}
            >
              Agregar Ingreso
            </button>
            <button
              onClick={() => setShowExpenseModal(true)}
              className="px-6 py-3 rounded-xl font-bold text-gray-700 border-2 border-gray-300 hover:bg-gray-50 transition-all"
            >
              Agregar Gasto
            </button>
          </div>
        </div>
      )}
    </div>
  );
}