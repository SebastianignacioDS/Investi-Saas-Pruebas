import { useState } from 'react';
import { TrendingUp, DollarSign, Clock, Target, PiggyBank, ArrowRight, Play, RotateCcw } from 'lucide-react';

interface InvestmentSimulatorProps {
  selectedLevel: number | null;
}

interface Stock {
  symbol: string;
  name: string;
  description: string;
  emoji: string;
  price: number; // Precio por acción en CLP
  baseReturn: number; // Retorno anual base
  volatility: number; // Volatilidad (0-1)
}

const stocks: Stock[] = [
  { symbol: 'AAPL', name: 'Apple', description: 'iPhones, Mac, AirPods', emoji: '🍎', price: 247427, baseReturn: 0.15, volatility: 0.25 },
  { symbol: 'MSFT', name: 'Microsoft', description: 'Windows, Xbox, IA', emoji: '💻', price: 441378, baseReturn: 0.18, volatility: 0.22 },
  { symbol: 'GOOGL', name: 'Google / Alphabet', description: 'YouTube, buscador, Android', emoji: '🔍', price: 283727, baseReturn: 0.16, volatility: 0.24 },
  { symbol: 'AMZN', name: 'Amazon', description: 'compras online, AWS', emoji: '📦', price: 210431, baseReturn: 0.14, volatility: 0.28 },
  { symbol: 'TSLA', name: 'Tesla', description: 'autos eléctricos', emoji: '🚗⚡', price: 430047, baseReturn: 0.25, volatility: 0.45 },
  { symbol: 'NVDA', name: 'Nvidia', description: 'chips para videojuegos e IA', emoji: '🎮🤖', price: 172430, baseReturn: 0.30, volatility: 0.40 },
  { symbol: 'META', name: 'Meta', description: 'Instagram, WhatsApp, Facebook', emoji: '📱', price: 600277, baseReturn: 0.17, volatility: 0.30 },
  { symbol: 'NFLX', name: 'Netflix', description: 'series y películas', emoji: '🎬', price: 85495, baseReturn: 0.12, volatility: 0.35 },
  { symbol: 'DIS', name: 'Disney', description: 'Películas, Marvel, Star Wars, parques', emoji: '🎬', price: 102772, baseReturn: 0.09, volatility: 0.20 },
  { symbol: 'MCD', name: 'McDonald\'s', description: 'Comida rápida, presente en todos lados', emoji: '🍟', price: 281165, baseReturn: 0.11, volatility: 0.15 },
  { symbol: 'NKE', name: 'Nike', description: 'ropa y zapatillas deportivas', emoji: '👟', price: 55142, baseReturn: 0.10, volatility: 0.18 },
  { symbol: 'KO', name: 'Coca-Cola', description: 'bebidas y marcas clásicas', emoji: '🥤', price: 63232, baseReturn: 0.08, volatility: 0.12 },
];

const timeOptions = [
  { label: '1 mes', months: 1 },
  { label: '3 meses', months: 3 },
  { label: '6 meses', months: 6 },
  { label: '1 año', months: 12 },
  { label: '2 años', months: 24 },
  { label: '3 años', months: 36 },
  { label: '5 años', months: 60 },
  { label: '10 años', months: 120 },
  { label: '15 años', months: 180 },
  { label: '20 años', months: 240 },
];
const riskProfiles = [
  { 
    id: 'negative', 
    label: 'Escenario Difícil', 
    subtitle: '(no todo sube)',
    emoji: '📉', 
    minReturn: -0.20, 
    maxReturn: -0.05,
    description: '"El mercado anda mal. Algunos pierden, otros aguantan."'
  },
  { 
    id: 'conservative', 
    label: 'Escenario Tranquilo', 
    subtitle: '(lo normal)',
    emoji: '📊', 
    minReturn: 0.05, 
    maxReturn: 0.12,
    description: '"Nada loco, pero vas creciendo."'
  },
  { 
    id: 'optimistic', 
    label: 'Escenario Boom', 
    subtitle: '(todo sube)',
    emoji: '📈', 
    minReturn: 0.15, 
    maxReturn: 0.35,
    description: '"Las inversiones están en modo fiesta." 🎉'
  },
];
const goals = [
  { id: 'phone', label: 'Comprar un celular', emoji: '📱' },
  { id: 'headphones', label: 'Comprar audífonos', emoji: '🎧' },
  { id: 'laptop', label: 'Comprar un notebook', emoji: '💻' },
  { id: 'console', label: 'Comprar una consola', emoji: '🎮' },
  { id: 'sneakers', label: 'Comprar zapatillas', emoji: '👟' },
  { id: 'clothes', label: 'Comprar ropa', emoji: '👕' },
  { id: 'backpack', label: 'Comprar mochila o accesorios', emoji: '🎒' },
  { id: 'bike', label: 'Comprar una bicicleta', emoji: '🚲' },
  { id: 'scooter', label: 'Comprar un scooter', emoji: '🛴' },
  { id: 'instrument', label: 'Comprar un instrumento musical', emoji: '🎸' },
  { id: 'trip', label: 'Viaje de estudios', emoji: '✈️' },
  { id: 'concert', label: 'Ir a un concierto', emoji: '🎤' },
];

export function InvestmentSimulator({ selectedLevel }: InvestmentSimulatorProps) {
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
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [amount, setAmount] = useState(50000);
  const [timeOption, setTimeOption] = useState(timeOptions[2]); // 1 año por defecto
  const [riskProfile, setRiskProfile] = useState(riskProfiles[1]); // Balanceado
  const [monthlyContribution, setMonthlyContribution] = useState(0);
  const [enableMonthly, setEnableMonthly] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(goals[2]); // Tener más plata
  const [goalAmount, setGoalAmount] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  // Calcular cuántas acciones se pueden comprar (precio ya en CLP)
  const calculateShares = () => {
    if (!selectedStock) return { shares: 0 };
    const shares = amount / selectedStock.price;
    return { shares };
  };

  // Función para calcular la simulación
  const runSimulation = () => {
    if (!selectedStock) return;

    const years = timeOption.months / 12;
    
    // Generar retorno aleatorio dentro del rango del escenario seleccionado
    const randomReturn = riskProfile.minReturn + (Math.random() * (riskProfile.maxReturn - riskProfile.minReturn));
    const finalReturn = randomReturn;

    // Cálculo de valor final sin aportes mensuales
    const compoundedValue = amount * Math.pow(1 + finalReturn, years);

    // Cálculo con aportes mensuales
    let totalWithContributions = compoundedValue;
    if (enableMonthly && monthlyContribution > 0) {
      const monthlyRate = finalReturn / 12;
      const futureValueContributions = monthlyContribution * ((Math.pow(1 + monthlyRate, timeOption.months) - 1) / monthlyRate);
      totalWithContributions = compoundedValue + futureValueContributions;
    }

    const profit = totalWithContributions - amount - (enableMonthly ? monthlyContribution * timeOption.months : 0);
    const profitPercentage = (profit / (amount + (enableMonthly ? monthlyContribution * timeOption.months : 0))) * 100;

    setSimulationResult({
      initialInvestment: amount,
      monthlyContributions: enableMonthly ? monthlyContribution : 0,
      totalContributed: amount + (enableMonthly ? monthlyContribution * timeOption.months : 0),
      finalValue: totalWithContributions,
      profit: profit,
      profitPercentage: profitPercentage,
      returnRate: finalReturn * 100,
      isPositive: profit > 0,
    });
    setShowResults(true);
  };

  const resetSimulation = () => {
    setShowResults(false);
    setSimulationResult(null);
    setSelectedStock(null);
    setAmount(50000);
    setTimeOption(timeOptions[2]);
    setRiskProfile(riskProfiles[1]);
    setEnableMonthly(false);
    setMonthlyContribution(0);
    setSelectedGoal(goals[2]);
    setGoalAmount(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div
        className={`relative rounded-2xl p-8 text-white shadow-xl overflow-hidden mb-6 bg-gradient-to-r ${currentColors.from} ${currentColors.to}`}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-10 h-10" />
            <h1 className="text-3xl font-bold">Mini-Simulador de Inversiones</h1>
          </div>
          <p className="text-white/90 text-lg mb-1">
            Aprende a invertir de forma segura con dinero virtual
          </p>
          <p className="text-white/80 text-sm italic">
            (Esto es solo una simulación y no implica ganancias futuras)
          </p>
        </div>
      </div>

      {!showResults ? (
        <div className="space-y-6">
          {/* Selección de Empresa */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-3xl">📈</span> Elige una empresa para invertir
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stocks.map((stock) => (
                <button
                  key={stock.symbol}
                  onClick={() => setSelectedStock(stock)}
                  className={`p-4 rounded-xl border-2 transition-all hover:shadow-lg ${
                    selectedStock?.symbol === stock.symbol
                      ? `${currentColors.border} bg-gradient-to-br ${currentColors.from} ${currentColors.to} text-white shadow-xl scale-105`
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="text-4xl mb-2">{stock.emoji}</div>
                  <div className={`font-bold mb-1 ${selectedStock?.symbol === stock.symbol ? 'text-white' : 'text-gray-800'}`}>
                    {stock.name} ({stock.symbol})
                  </div>
                  <div className={`text-sm mb-2 ${selectedStock?.symbol === stock.symbol ? 'text-white/90' : 'text-gray-600'}`}>
                    {stock.description}
                  </div>
                  <div className={`text-lg font-bold ${selectedStock?.symbol === stock.symbol ? 'text-white' : currentColors.text}`}>
                    ${stock.price.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </div>
                  <div className={`text-xs ${selectedStock?.symbol === stock.symbol ? 'text-white/80' : 'text-gray-500'}`}>
                    por acción
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Parámetros de Inversión */}
          {selectedStock && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monto a Invertir */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <DollarSign className={`w-6 h-6 ${currentColors.text}`} />
                  Inversión Inicial
                </h3>
                
                {/* Slider continuo */}
                <input
                  type="range"
                  min="5000"
                  max="500000"
                  step="1000"
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value))}
                  className="w-full mb-4 accent-current"
                  style={{ accentColor: selectedLevel !== null ? undefined : '#be9525' }}
                />
                
                <div className="flex justify-between text-xs text-gray-500 mb-6">
                  <span>$5.000</span>
                  <span>$500.000</span>
                </div>
                
                {/* Monto seleccionado grande */}
                <div className={`text-center text-4xl font-bold ${currentColors.text} mb-4`}>
                  ${amount.toLocaleString('es-CL')}
                </div>

                {/* Información de conversión y acciones */}
                <div className={`bg-gradient-to-br ${currentColors.from} ${currentColors.to} rounded-xl p-4 mb-4`}>
                  <div className="text-center text-white">
                    <div className="text-sm font-semibold mb-2 opacity-90">
                      💱 Con ${amount.toLocaleString('es-CL')} CLP puedes comprar:
                    </div>
                    <div className="text-3xl font-bold mb-1">
                      {calculateShares().shares.toFixed(2)} acciones
                    </div>
                    <div className="text-sm opacity-90">
                      de {selectedStock.name} ({selectedStock.symbol})
                    </div>
                  </div>
                </div>
                
                {/* Input para monto personalizado */}
                <div className="mt-4">
                  <label className="text-sm text-gray-600 mb-2 block font-semibold">
                    O ingresa un monto personalizado:
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value)) {
                          if (value >= 5000 && value <= 500000) {
                            setAmount(value);
                          } else if (value < 5000) {
                            setAmount(5000);
                          } else if (value > 500000) {
                            setAmount(500000);
                          }
                        }
                      }}
                      min="5000"
                      max="500000"
                      className={`w-full pl-7 pr-4 py-3 border-2 ${currentColors.border} rounded-lg focus:outline-none focus:ring-2 ${currentColors.ring} transition-all`}
                      placeholder="Ej: 125000"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Mínimo: $5.000 • Máximo: $500.000
                  </p>
                </div>
              </div>

              {/* Tiempo */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Clock className={`w-6 h-6 ${currentColors.text}`} />
                  ¿Por cuánto tiempo inviertes?
                </h3>
                <select
                  value={timeOption.label}
                  onChange={(e) => {
                    const selected = timeOptions.find(option => option.label === e.target.value);
                    if (selected) setTimeOption(selected);
                  }}
                  className={`w-full p-4 rounded-lg border-2 ${currentColors.border} text-gray-800 font-semibold text-lg bg-white focus:outline-none focus:ring-2 ${currentColors.ring} transition-all cursor-pointer hover:shadow-md`}
                >
                  {timeOptions.map((option) => (
                    <option key={option.label} value={option.label}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-3">
                  Selecciona el período de tu inversión
                </p>
              </div>

              {/* Tipo de Inversión */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <Target className={`w-6 h-6 ${currentColors.text}`} />
                  Escenarios del Mini-Simulador
                </h3>
                <div className="space-y-4 mt-6">
                  {riskProfiles.map((profile) => (
                    <button
                      key={profile.id}
                      onClick={() => setRiskProfile(profile)}
                      className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                        riskProfile.id === profile.id
                          ? `${currentColors.border} bg-gradient-to-r ${currentColors.from} ${currentColors.to} text-white font-bold shadow-lg scale-105`
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <span className="text-3xl">{profile.emoji}</span>
                        <div className="flex-1">
                          <div className={`font-bold text-lg ${riskProfile.id === profile.id ? 'text-white' : 'text-gray-800'}`}>
                            {profile.label}
                          </div>
                          <div className={`text-sm italic ${riskProfile.id === profile.id ? 'text-white/80' : 'text-gray-500'}`}>
                            {profile.subtitle}
                          </div>
                        </div>
                        <div className={`text-sm font-bold ${riskProfile.id === profile.id ? 'text-white' : 'text-gray-700'}`}>
                          {profile.minReturn > 0 ? '+' : ''}{(profile.minReturn * 100).toFixed(0)}% a {profile.maxReturn > 0 ? '+' : ''}{(profile.maxReturn * 100).toFixed(0)}%
                        </div>
                      </div>
                      <div className={`text-sm italic ${riskProfile.id === profile.id ? 'text-white/90' : 'text-gray-600'}`}>
                        {profile.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Aporte Mensual */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <PiggyBank className={`w-6 h-6 ${currentColors.text}`} />
                  Aporte mensual
                </h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableMonthly}
                      onChange={(e) => {
                        setEnableMonthly(e.target.checked);
                        if (e.target.checked) setMonthlyContribution(10000);
                        else setMonthlyContribution(0);
                      }}
                      className="w-5 h-5"
                    />
                    <span className="text-gray-700">Activar aportes mensuales</span>
                  </label>
                  {enableMonthly && (
                    <div>
                      <input
                        type="number"
                        value={monthlyContribution}
                        onChange={(e) => setMonthlyContribution(parseInt(e.target.value) || 0)}
                        className="w-full p-3 border-2 border-gray-200 rounded-lg"
                        placeholder="Monto mensual"
                        min="0"
                      />
                      <p className="text-sm text-gray-600 mt-2">
                        Total aportado: ${(monthlyContribution * timeOption.months).toLocaleString('es-CL')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Objetivo */}
          {selectedStock && (
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Target className={`w-6 h-6 ${currentColors.text}`} />
                ¿Para qué estás invirtiendo?
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {goals.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => setSelectedGoal(goal)}
                    className={`p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                      selectedGoal.id === goal.id
                        ? `${currentColors.border} bg-gradient-to-br ${currentColors.from} ${currentColors.to} text-white shadow-xl`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{goal.emoji}</div>
                    <div className={`text-sm font-semibold ${selectedGoal.id === goal.id ? 'text-white' : 'text-gray-700'}`}>
                      {goal.label}
                    </div>
                  </button>
                ))}
              </div>

              {/* Campo para ingresar monto de la meta */}
              <div className="mt-6 border-t-2 border-gray-200 pt-6">
                <label className="block text-gray-700 font-semibold mb-3">
                  💰 ¿Cuánto cuesta tu meta?
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                  <input
                    type="number"
                    value={goalAmount === 0 ? '' : goalAmount}
                    onChange={(e) => setGoalAmount(parseInt(e.target.value) || 0)}
                    className={`w-full pl-7 pr-4 py-3 border-2 ${currentColors.border} rounded-lg focus:outline-none focus:ring-2 ${currentColors.ring} transition-all text-lg font-semibold`}
                    placeholder="Ej: 500000"
                    min="0"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {selectedGoal.emoji} Tu meta: <strong>{selectedGoal.label}</strong>
                  {goalAmount > 0 && <span> por <strong>${goalAmount.toLocaleString('es-CL')}</strong></span>}
                </p>
              </div>
            </div>
          )}

          {/* Botón Simular */}
          {selectedStock && (
            <div className="flex justify-center">
              <button
                onClick={runSimulation}
                className={`px-8 py-4 rounded-xl font-bold text-white text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 bg-gradient-to-r ${currentColors.from} ${currentColors.to} flex items-center gap-3`}
              >
                <Play className="w-6 h-6" />
                Simular Inversión
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      ) : (
        // Resultados de la Simulación
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Resultados de tu Simulación</h2>
              <p className="text-gray-600">
                Inversión en {selectedStock?.name} ({selectedStock?.symbol}) por {timeOption.label}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
                <div className="text-sm text-blue-600 font-semibold mb-1">Inversión Inicial</div>
                <div className="text-2xl font-bold text-blue-900">
                  ${simulationResult?.initialInvestment.toLocaleString('es-CL')}
                </div>
              </div>

              {enableMonthly && (
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200">
                  <div className="text-sm text-purple-600 font-semibold mb-1">Aportes Mensuales</div>
                  <div className="text-2xl font-bold text-purple-900">
                    ${simulationResult?.monthlyContributions.toLocaleString('es-CL')} x {timeOption.months}
                  </div>
                  <div className="text-sm text-purple-700 mt-1">
                    Total: ${(simulationResult?.monthlyContributions * timeOption.months).toLocaleString('es-CL')}
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200">
                <div className="text-sm text-gray-600 font-semibold mb-1">Total Invertido</div>
                <div className="text-2xl font-bold text-gray-900">
                  ${simulationResult?.totalContributed.toLocaleString('es-CL')}
                </div>
              </div>

              <div
                className={`bg-gradient-to-br ${
                  simulationResult?.isPositive ? 'from-green-50 to-green-100' : 'from-red-50 to-red-100'
                } rounded-xl p-6 border-2 ${simulationResult?.isPositive ? 'border-green-200' : 'border-red-200'}`}
              >
                <div
                  className={`text-sm font-semibold mb-1 ${
                    simulationResult?.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  Ganancia/Pérdida
                </div>
                <div
                  className={`text-2xl font-bold ${simulationResult?.isPositive ? 'text-green-900' : 'text-red-900'}`}
                >
                  {simulationResult?.isPositive ? '+' : ''}${simulationResult?.profit.toLocaleString('es-CL', { maximumFractionDigits: 0 })}
                </div>
                <div
                  className={`text-sm mt-1 ${simulationResult?.isPositive ? 'text-green-700' : 'text-red-700'}`}
                >
                  {simulationResult?.profitPercentage.toFixed(2)}%
                </div>
              </div>

              <div className={`bg-gradient-to-br ${currentColors.from} ${currentColors.to} rounded-xl p-6 border-2 border-white shadow-xl lg:col-span-2`}>
                <div className="text-sm text-white/90 font-semibold mb-1">Valor Final de tu Inversión</div>
                <div className="text-4xl font-bold text-white">
                  ${simulationResult?.finalValue.toLocaleString('es-CL', { maximumFractionDigits: 0 })}
                </div>
                <div className="text-sm text-white/90 mt-2">
                  Retorno estimado: {simulationResult?.returnRate.toFixed(2)}% anual
                </div>
              </div>
            </div>

            {/* Tiempo para alcanzar la meta (si hay meta definida) */}
            {goalAmount > 0 && simulationResult?.isPositive && (
              <div className={`bg-gradient-to-br from-amber-50 to-yellow-50 border-2 ${currentColors.border} rounded-xl p-6 mb-6`}>
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className={`w-6 h-6 ${currentColors.text}`} />
                  <span className="text-2xl">{selectedGoal.emoji}</span> ¿Cuándo alcanzarás tu meta?
                </h3>
                
                {(() => {
                  // Calcular la ganancia mensual promedio
                  const monthlyReturn = simulationResult.returnRate / 100 / 12;
                  const monthlyGain = simulationResult.finalValue * monthlyReturn;
                  const totalMonthlyIncome = monthlyGain + (enableMonthly ? monthlyContribution : 0);
                  
                  // Calcular cuánto falta para la meta
                  const amountNeeded = goalAmount - simulationResult.finalValue;
                  
                  if (amountNeeded <= 0) {
                    return (
                      <div className="bg-green-100 border-2 border-green-400 rounded-lg p-5">
                        <div className="text-center">
                          <div className="text-5xl mb-3">🎉</div>
                          <p className="text-2xl font-bold text-green-800 mb-2">
                            ¡Ya cumpliste tu meta!
                          </p>
                          <p className="text-green-700 mb-3">
                            Tu inversión de <strong>${simulationResult.finalValue.toLocaleString('es-CL')}</strong> ya es suficiente para <strong>{selectedGoal.label}</strong> por <strong>${goalAmount.toLocaleString('es-CL')}</strong>
                          </p>
                          <p className="text-green-600 text-sm">
                            Te sobran: <strong>${(simulationResult.finalValue - goalAmount).toLocaleString('es-CL')}</strong>
                          </p>
                        </div>
                      </div>
                    );
                  }
                  
                  // Si no alcanza con el escenario actual, calcular meses adicionales
                  let monthsToGoal = 0;
                  let currentValue = simulationResult.finalValue;
                  
                  if (totalMonthlyIncome > 0) {
                    // Con crecimiento mensual
                    while (currentValue < goalAmount && monthsToGoal < 600) { // Max 50 años
                      currentValue = currentValue * (1 + monthlyReturn) + (enableMonthly ? monthlyContribution : 0);
                      monthsToGoal++;
                    }
                  } else {
                    // Sin crecimiento (escenario negativo o sin aportes)
                    monthsToGoal = -1; // Indicador de que no es posible
                  }
                  
                  if (monthsToGoal === -1 || monthsToGoal >= 600) {
                    return (
                      <div className="bg-orange-100 border-2 border-orange-400 rounded-lg p-5">
                        <div className="text-center">
                          <div className="text-4xl mb-3">⚠️</div>
                          <p className="text-xl font-bold text-orange-800 mb-2">
                            Difícil alcanzar tu meta con este escenario
                          </p>
                          <p className="text-orange-700 mb-3">
                            Te faltan <strong>${amountNeeded.toLocaleString('es-CL')}</strong> para cumplir tu meta de <strong>{selectedGoal.label}</strong>
                          </p>
                          <p className="text-orange-600 text-sm">
                            💡 Considera: invertir más inicialmente, activar aportes mensuales o elegir un escenario más optimista.
                          </p>
                        </div>
                      </div>
                    );
                  }
                  
                  // Convertir meses a años y meses
                  const years = Math.floor(monthsToGoal / 12);
                  const months = monthsToGoal % 12;
                  const totalTimeMonths = timeOption.months + monthsToGoal;
                  const totalYears = Math.floor(totalTimeMonths / 12);
                  const totalMonths = totalTimeMonths % 12;
                  
                  return (
                    <div>
                      <div className="bg-white rounded-lg p-5 mb-4 border-2 border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Tu meta:</p>
                            <p className="text-xl font-bold text-gray-900">
                              {selectedGoal.emoji} {selectedGoal.label}
                            </p>
                            <p className="text-lg font-semibold text-gray-700">
                              ${goalAmount.toLocaleString('es-CL')
}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Tu inversión actual alcanza:</p>
                            <p className="text-xl font-bold text-gray-900">
                              ${simulationResult.finalValue.toLocaleString('es-CL')}</p>
                            <p className="text-sm text-red-600">
                              Te faltan: ${amountNeeded.toLocaleString('es-CL')}
                            </p>
                          </div>
                        </div>
                        
                        <div className={`bg-gradient-to-r ${currentColors.from} ${currentColors.to} rounded-lg p-4 text-white text-center`}>
                          <p className="text-sm opacity-90 mb-1">⏰ Tiempo adicional necesario:</p>
                          <p className="text-4xl font-bold mb-2">
                            {years > 0 && `${years} ${years === 1 ? 'año' : 'años'}`}
                            {years > 0 && months > 0 && ' y '}
                            {months > 0 && `${months} ${months === 1 ? 'mes' : 'meses'}`}
                          </p>
                          <p className="text-sm opacity-90">
                            Tiempo total: {totalYears > 0 && `${totalYears} ${totalYears === 1 ? 'año' : 'años'}`}
                            {totalYears > 0 && totalMonths > 0 && ' y '}
                            {totalMonths > 0 && `${totalMonths} ${totalMonths === 1 ? 'mes' : 'meses'}`}
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <p className="text-sm text-blue-900 mb-2 font-semibold">📊 Proyección mensual:</p>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Ganancia mensual estimada: <strong>${monthlyGain.toLocaleString('es-CL', { maximumFractionDigits: 0 })}</strong></li>
                          {enableMonthly && <li>• Aporte mensual: <strong>${monthlyContribution.toLocaleString('es-CL')}</strong></li>}
                          <li>• Crecimiento total por mes: <strong>${totalMonthlyIncome.toLocaleString('es-CL', { maximumFractionDigits: 0 })}</strong></li>
                          <li>• Escenario: <strong>{riskProfile.label}</strong> ({riskProfile.emoji})</li>
                        </ul>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Mensaje Educativo */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                <span className="text-2xl">💡</span> ¿Qué aprendiste?
              </h3>
              <ul className="space-y-2 text-blue-800">
                {simulationResult?.isPositive ? (
                  <>
                    <li>✅ Las inversiones pueden generar ganancias con el tiempo</li>
                    <li>✅ Invertir más tiempo generalmente da mejores resultados</li>
                    {enableMonthly && <li>✅ Los aportes mensuales aumentan significativamente tus ganancias</li>}
                    <li>✅ El perfil {riskProfile.label.toLowerCase()} tiene riesgos y beneficios específicos</li>
                  </>
                ) : (
                  <>
                    <li>⚠️ Las inversiones también pueden generar pérdidas</li>
                    <li>⚠️ Mayor riesgo = mayor volatilidad en los resultados</li>
                    <li>⚠️ Es importante diversificar y no arriesgar todo tu dinero</li>
                    <li>⚠️ En la vida real, se invierte pensando en el largo plazo</li>
                  </>
                )}
              </ul>
            </div>

            {/* Botones de Acción */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={resetSimulation}
                className="px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 transition-all font-semibold text-gray-700 flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Simular de Nuevo
              </button>
              <button
                onClick={runSimulation}
                className={`px-6 py-3 rounded-lg bg-gradient-to-r ${currentColors.from} ${currentColors.to} text-white font-semibold hover:shadow-lg transition-all flex items-center gap-2`}
              >
                <Play className="w-5 h-5" />
                Volver a Calcular
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}