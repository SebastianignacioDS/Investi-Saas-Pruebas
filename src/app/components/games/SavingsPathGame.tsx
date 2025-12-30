import { useState } from 'react';
import { ArrowRight, DollarSign, TrendingUp, TrendingDown, Trophy, XCircle, Users, Target, Play } from 'lucide-react';
import { Card } from '../ui/card';

interface SavingsPathGameProps {
  onClose: () => void;
  onComplete: (score: number) => void;
}

type GameMode = 'individual' | 'team';
type GamePhase = 'setup' | 'initial-decision' | 'round1-intro' | 'round1' | 'random-event' | 'playing' | 'finished';

interface Player {
  id: number;
  name: string;
  money: number;
  initialChoice: 'A' | 'B' | null;
  perRoundIncome: number;
  decisions: boolean[];
  round1Choice: Round1Option | null;
  round1Data?: {
    carIncome?: number;
    houseValue?: number;
    studyLevel?: number;
    investmentAmount?: number;
    investmentValue?: number;
    loanAmount?: number;
    loanInterest?: number;
  };
}

interface Team {
  id: number;
  name: string;
  money: number;
  initialChoice: 'A' | 'B' | null;
  perRoundIncome: number;
  decisions: boolean[];
  round1Choice: Round1Option | null;
  round1Data?: {
    carIncome?: number;
    houseValue?: number;
    studyLevel?: number;
    investmentAmount?: number;
    investmentValue?: number;
    loanAmount?: number;
    loanInterest?: number;
  };
}

type Round1Option = 'car' | 'house' | 'study' | 'invest' | 'loan' | null;

interface Round1Selection {
  option: 'car' | 'house' | 'study' | 'invest' | 'loan';
  investAmount?: number;
}

export function SavingsPathGame({ onClose, onComplete }: SavingsPathGameProps) {
  // Estados de configuración
  const [gamePhase, setGamePhase] = useState<GamePhase>('setup');
  const [numRounds, setNumRounds] = useState(5);
  const [gameMode, setGameMode] = useState<GameMode>('individual');
  const [numPlayers, setNumPlayers] = useState(2);
  const [numTeams, setNumTeams] = useState(2);
  
  // Estados del juego
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [pendingChoice, setPendingChoice] = useState<'A' | 'B' | null>(null);
  const [hoveredOption, setHoveredOption] = useState<'A' | 'B' | null>(null);
  const [selectedRound1Options, setSelectedRound1Options] = useState<Round1Selection[]>([]);
  const [investmentAmount, setInvestmentAmount] = useState<number>(0);
  const [currentRandomEvents, setCurrentRandomEvents] = useState<Array<{entity: Player | Team, events: any[]}>>([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  // Colores para cada jugador/equipo
  const playerColors = [
    { bg: 'from-blue-500 to-blue-600', text: 'text-blue-600', border: 'border-blue-500', ring: 'ring-blue-200', name: 'AZUL' },
    { bg: 'from-green-500 to-green-600', text: 'text-green-600', border: 'border-green-500', ring: 'ring-green-200', name: 'VERDE' },
    { bg: 'from-red-500 to-red-600', text: 'text-red-600', border: 'border-red-500', ring: 'ring-red-200', name: 'ROJO' },
    { bg: 'from-yellow-500 to-yellow-600', text: 'text-yellow-600', border: 'border-yellow-500', ring: 'ring-yellow-200', name: 'AMARILLO' },
    { bg: 'from-purple-500 to-purple-600', text: 'text-purple-600', border: 'border-purple-500', ring: 'ring-purple-200', name: 'MORADO' },
    { bg: 'from-pink-500 to-pink-600', text: 'text-pink-600', border: 'border-pink-500', ring: 'ring-pink-200', name: 'ROSA' },
    { bg: 'from-indigo-500 to-indigo-600', text: 'text-indigo-600', border: 'border-indigo-500', ring: 'ring-indigo-200', name: 'ÍNDIGO' },
    { bg: 'from-orange-500 to-orange-600', text: 'text-orange-600', border: 'border-orange-500', ring: 'ring-orange-200', name: 'NARANJA' },
    { bg: 'from-teal-500 to-teal-600', text: 'text-teal-600', border: 'border-teal-500', ring: 'ring-teal-200', name: 'TURQUESA' },
    { bg: 'from-cyan-500 to-cyan-600', text: 'text-cyan-600', border: 'border-cyan-500', ring: 'ring-cyan-200', name: 'CIAN' },
  ];

  const getPlayerColor = (index: number) => {
    return playerColors[index % playerColors.length];
  };

  // Iniciar juego después de la configuración
  const handleStartGame = () => {
    if (gameMode === 'individual') {
      const newPlayers: Player[] = [];
      for (let i = 0; i < numPlayers; i++) {
        newPlayers.push({
          id: i + 1,
          name: `Jugador ${i + 1}`,
          money: 0,
          initialChoice: null,
          perRoundIncome: 0,
          decisions: [],
          round1Choice: null,
        });
      }
      setPlayers(newPlayers);
    } else {
      const newTeams: Team[] = [];
      for (let i = 0; i < numTeams; i++) {
        newTeams.push({
          id: i + 1,
          name: `Equipo ${i + 1}`,
          money: 0,
          initialChoice: null,
          perRoundIncome: 0,
          decisions: [],
          round1Choice: null,
        });
      }
      setTeams(newTeams);
    }
    setGamePhase('initial-decision');
  };

  // Manejar decisión inicial (Ronda 0)
  const handleInitialChoice = (choice: 'A' | 'B') => {
    const updatedEntities = gameMode === 'individual' ? [...players] : [...teams];
    const currentEntity = updatedEntities[currentPlayerIndex];

    if (choice === 'A') {
      currentEntity.money = 1000;
      currentEntity.perRoundIncome = 150;
      currentEntity.initialChoice = 'A';
    } else {
      currentEntity.money = 500;
      currentEntity.perRoundIncome = 300;
      currentEntity.initialChoice = 'B';
    }

    updatedEntities[currentPlayerIndex] = currentEntity;

    if (gameMode === 'individual') {
      setPlayers(updatedEntities as Player[]);
    } else {
      setTeams(updatedEntities as Team[]);
    }

    // Siguiente jugador/equipo o comenzar el juego
    if (currentPlayerIndex < (gameMode === 'individual' ? numPlayers : numTeams) - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
    } else {
      setCurrentPlayerIndex(0);
      setGamePhase('round1-intro');
    }
  };

  // Renderizado de la pantalla de configuración
  if (gamePhase === 'setup') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-3xl w-full p-8 bg-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>

          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-[#be9525] to-[#f3d374] rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">El Camino del Ahorro</h2>
            <p className="text-gray-600">Configura tu partida</p>
          </div>

          <div className="space-y-6">
            {/* 1. Modo de Juego */}
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200">
              <label className="flex items-center gap-2 font-bold text-gray-900 mb-3">
                <Users className="w-5 h-5 text-purple-600" />
                1. Modo de Juego
              </label>
              <select
                value={gameMode}
                onChange={(e) => setGameMode(e.target.value as GameMode)}
                className="w-full p-4 rounded-lg border-2 border-purple-300 text-gray-900 font-semibold text-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer hover:shadow-md"
              >
                <option value="individual">👤 Jugadores Individuales</option>
                <option value="team">👥 Equipos</option>
              </select>
            </div>

            {/* 2. Número de Jugadores o Equipos */}
            {gameMode === 'individual' ? (
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
                <label className="flex items-center gap-2 font-bold text-gray-900 mb-3">
                  👤 2. Número de Jugadores
                </label>
                <select
                  value={numPlayers}
                  onChange={(e) => setNumPlayers(parseInt(e.target.value))}
                  className="w-full p-4 rounded-lg border-2 border-green-300 text-gray-900 font-semibold text-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all cursor-pointer hover:shadow-md"
                >
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num} jugadores
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-600 mt-2">Mínimo 2, máximo 10 jugadores</p>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border-2 border-orange-200">
                <label className="flex items-center gap-2 font-bold text-gray-900 mb-3">
                  👥 2. Número de Equipos
                </label>
                <select
                  value={numTeams}
                  onChange={(e) => setNumTeams(parseInt(e.target.value))}
                  className="w-full p-4 rounded-lg border-2 border-orange-300 text-gray-900 font-semibold text-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all cursor-pointer hover:shadow-md"
                >
                  {[2, 3, 4, 5, 6, 7].map((num) => (
                    <option key={num} value={num}>
                      {num} equipos
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-600 mt-2">Mínimo 2, máximo 7 equipos</p>
              </div>
            )}

            {/* 3. Número de Rondas */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
              <label className="flex items-center gap-2 font-bold text-gray-900 mb-3">
                <Target className="w-5 h-5 text-blue-600" />
                3. Número de Rondas
              </label>
              <select
                value={numRounds}
                onChange={(e) => setNumRounds(parseInt(e.target.value))}
                className="w-full p-4 rounded-lg border-2 border-blue-300 text-gray-900 font-semibold text-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer hover:shadow-md"
              >
                {[3, 4, 5, 6, 7].map((num) => (
                  <option key={num} value={num}>
                    {num} rondas
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-600 mt-2">De 3 a 7 rondas de decisiones</p>
            </div>

            {/* Botón Iniciar */}
            <button
              onClick={handleStartGame}
              className="w-full bg-gradient-to-r from-[#be9525] to-[#f3d374] hover:from-[#9a7a1e] hover:to-[#d4b860] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
            >
              <Play className="w-6 h-6" />
              Iniciar Partida
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </Card>
      </div>
    );
  }

  // Renderizado de la Ronda 0 (Decisión Inicial)
  if (gamePhase === 'initial-decision') {
    const currentEntity = gameMode === 'individual' ? players[currentPlayerIndex] : teams[currentPlayerIndex];
    const totalEntities = gameMode === 'individual' ? numPlayers : numTeams;
    const currentColor = getPlayerColor(currentPlayerIndex);

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <Card className="max-w-5xl w-full p-8 bg-white relative my-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              🏁 Elige cómo empiezas tu Carrera del Dinero
            </h2>
            <p className="text-gray-700 mb-1">
              Tienes dos formas de comenzar.
            </p>
            <p className="text-gray-700 mb-1">
              No hay una correcta o incorrecta...
            </p>
            <p className="text-gray-600">
              solo una que se adapta mejor a cómo piensas 💭
            </p>
          </div>

          {/* Jugador actual */}
          <div className={`bg-gradient-to-r ${currentColor.bg} text-white px-4 py-3 rounded-xl mb-4 text-center`}>
            <p className="font-bold text-3xl mb-2">
              TURNO DEL {gameMode === 'individual' ? 'JUGADOR' : 'EQUIPO'} {currentPlayerIndex + 1} - {currentColor.name}
            </p>
            <p className="text-lg opacity-90">
              {currentPlayerIndex + 1} de {totalEntities}
            </p>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-6">
            {Array.from({ length: totalEntities }).map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full transition-all ${
                  index < currentPlayerIndex
                    ? 'bg-green-500'
                    : index === currentPlayerIndex
                    ? 'bg-[#be9525]'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Opciones A y B */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* OPCIÓN A */}
            <button
              onClick={() => setPendingChoice('A')}
              disabled={pendingChoice !== null}
              className={`bg-white rounded-2xl p-6 transition-all text-left ${
                pendingChoice === 'A'
                  ? 'border-4 border-green-500 shadow-2xl scale-105 ring-4 ring-green-200'
                  : pendingChoice === null
                  ? 'border-4 border-green-300 hover:border-green-500 hover:shadow-xl hover:scale-102'
                  : 'border-4 border-gray-300 opacity-50 cursor-not-allowed'
              }`}
              onMouseEnter={() => setHoveredOption('A')}
              onMouseLeave={() => setHoveredOption(null)}
            >
              <div className="mb-4">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-6xl">A</span>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 mb-4 border-2 border-green-200">
                  <p className="text-gray-700 mb-2">💰 Partes con <strong className="text-green-600 text-xl">$1.000</strong></p>
                  <p className="text-gray-700">📥 Recibes <strong className="text-green-600 text-xl">$150</strong> cada ronda</p>
                </div>

                <p className="text-gray-600 italic mb-4">
                  Es como tener un sueldo fijo.
                </p>

                <div className="space-y-3">
                  <div>
                    <p className="font-bold text-green-700 mb-2">Lo bueno 😎</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Tienes m��s plata desde el principio</li>
                      <li>• Es más difícil quedar en cero</li>
                      <li>• Puedes equivocarte sin tanto miedo</li>
                      <li> Todo se siente más "tranqui"</li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-bold text-red-700 mb-2">Lo no tan bueno 😬</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• La plata crece lento</li>
                      <li>• Aunque empieces con más, después otros te pasan</li>
                      <li>• No te haces rico, solo te mantienes</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                  <p className="text-sm text-gray-700">
                    🛌 Es la opción <strong>"jugar seguro"</strong>
                  </p>
                </div>
              </div>
            </button>

            {/* OPCIÓN B */}
            <button
              onClick={() => setPendingChoice('B')}
              disabled={pendingChoice !== null}
              className={`bg-white rounded-2xl p-6 transition-all text-left ${
                pendingChoice === 'B'
                  ? 'border-4 border-blue-500 shadow-2xl scale-105 ring-4 ring-blue-200'
                  : pendingChoice === null
                  ? 'border-4 border-blue-300 hover:border-blue-500 hover:shadow-xl hover:scale-102'
                  : 'border-4 border-gray-300 opacity-50 cursor-not-allowed'
              }`}
              onMouseEnter={() => setHoveredOption('B')}
              onMouseLeave={() => setHoveredOption(null)}
            >
              <div className="mb-4">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-6xl text-white font-bold">B</span>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 mb-4 border-2 border-blue-200">
                  <p className="text-gray-700 mb-2">💰 Partes con <strong className="text-blue-600 text-xl">$500</strong></p>
                  <p className="text-gray-700">📥 Recibes <strong className="text-blue-600 text-xl">$300</strong> cada ronda</p>
                </div>

                <p className="text-gray-600 italic mb-4">
                  Es como invertir en algo que puede crecer mucho.
                </p>

                <div className="space-y-3">
                  <div>
                    <p className="font-bold text-green-700 mb-2">Lo bueno 🚀</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Cada ronda ganas mucha más plata</li>
                      <li>• Si aguantas, terminas con mucho más dinero</li>
                      <li>• Es la opción para pensar en el futuro</li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-bold text-red-700 mb-2">Lo no tan bueno 😰</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Empiezas con poca plata</li>
                      <li>• Si gastas mal, puedes quedar en cero</li>
                      <li>Da un poco más de nervios</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-4 bg-orange-50 border-l-4 border-orange-400 p-3 rounded">
                  <p className="text-sm text-gray-700">
                    🔥 Es la opción <strong>"arriesgar para ganar más"</strong>
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Botones de Confirmación */}
          {pendingChoice !== null && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-xl p-6 mb-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-2xl">⚠️</span>
                <h4 className="font-bold text-gray-900 text-lg">¿Confirmas tu elección?</h4>
              </div>
              <p className="text-center text-gray-700 mb-4">
                Has seleccionado la <strong className={pendingChoice === 'A' ? 'text-green-600' : 'text-blue-600'}>Opción {pendingChoice}</strong>. 
                Esta decisión no se puede cambiar.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    handleInitialChoice(pendingChoice);
                    setPendingChoice(null);
                  }}
                  className={`flex-1 bg-gradient-to-r ${
                    pendingChoice === 'A' 
                      ? 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' 
                      : 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                  } text-white px-6 py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2`}
                >
                  ✓ Confirmar Opción {pendingChoice}
                </button>
                <button
                  onClick={() => setPendingChoice(null)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg font-bold transition-all"
                >
                  ✗ Cancelar
                </button>
              </div>
            </div>
          )}
        </Card>
      </div>
    );
  }

  // Introducción de Ronda 1
  if (gamePhase === 'round1-intro') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-3xl w-full p-8 bg-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>

          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🏁</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🏁 RONDA 1 — "Tu primera decisión de dinero"
            </h2>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border-2 border-purple-200 mb-6">
            <div className="space-y-4 text-center">
              <p className="text-xl text-gray-800 font-semibold">
                "Ahora van a decidir qué hacer con su dinero."
              </p>
              <p className="text-xl text-gray-800 font-semibold">
                Cada cosa tiene algo bueno... y algo malo.
              </p>
              <p className="text-2xl text-purple-700 font-bold mt-6">
                No gana el que compra más, gana el que piensa mejor. 🧠
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-gray-900 text-lg mb-3 text-center">
              💡 Consejo importante:
            </h3>
            <p className="text-gray-700 text-center">
              Cada decisión tiene consecuencias. Piensa bien antes de elegir.
            </p>
          </div>

          <button
            onClick={() => setGamePhase('round1')}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
          >
            Comenzar Ronda 1
            <ArrowRight className="w-6 h-6" />
          </button>
        </Card>
      </div>
    );
  }

  // Ronda 1 - Selección de opciones
  if (gamePhase === 'round1') {
    const currentEntity = gameMode === 'individual' ? players[currentPlayerIndex] : teams[currentPlayerIndex];
    const totalEntities = gameMode === 'individual' ? numPlayers : numTeams;
    const currentColor = getPlayerColor(currentPlayerIndex);

    // Calcular dinero gastado en selecciones actuales
    const calculateSpentMoney = () => {
      let spent = 0;
      selectedRound1Options.forEach(selection => {
        switch (selection.option) {
          case 'car':
            spent += 150;
            break;
          case 'house':
            spent += 300;
            break;
          case 'study':
            spent += 50;
            break;
          case 'invest':
            // Usar el investmentAmount actual si esta opción está seleccionada
            spent += investmentAmount || 0;
            break;
          case 'loan':
            // Préstamo no gasta dinero, lo agrega
            spent -= 500;
            break;
        }
      });
      return spent;
    };

    const spentMoney = calculateSpentMoney();
    const remainingMoney = currentEntity.money - spentMoney;

    // Función para agregar/quitar opciones
    const toggleOption = (option: 'car' | 'house' | 'study' | 'invest' | 'loan') => {
      const isSelected = selectedRound1Options.some(opt => opt.option === option);
      
      if (isSelected) {
        // Quitar la opción
        setSelectedRound1Options(selectedRound1Options.filter(opt => opt.option !== option));
        if (option === 'invest') {
          setInvestmentAmount(0);
        }
      } else {
        // Agregar la opción (máximo 3)
        if (selectedRound1Options.length < 3) {
          setSelectedRound1Options([...selectedRound1Options, { option }]);
        }
      }
    };

    const handleConfirmAllChoices = () => {
      const updatedEntities = gameMode === 'individual' ? [...players] : [...teams];
      const entity = updatedEntities[currentPlayerIndex];

      // Aplicar todas las opciones seleccionadas
      selectedRound1Options.forEach(selection => {
        switch (selection.option) {
          case 'car':
            entity.money -= 150;
            if (!entity.round1Data) entity.round1Data = {};
            entity.round1Data.carIncome = 100;
            break;
          case 'house':
            entity.money -= 300;
            if (!entity.round1Data) entity.round1Data = {};
            entity.round1Data.houseValue = 300;
            break;
          case 'study':
            entity.money -= 50;
            if (!entity.round1Data) entity.round1Data = {};
            entity.round1Data.studyLevel = 0;
            break;
          case 'invest':
            const amount = selection.investAmount || investmentAmount;
            entity.money -= amount;
            if (!entity.round1Data) entity.round1Data = {};
            entity.round1Data.investmentAmount = amount;
            entity.round1Data.investmentValue = amount;
            break;
          case 'loan':
            entity.money += 500;
            if (!entity.round1Data) entity.round1Data = {};
            entity.round1Data.loanAmount = 500;
            entity.round1Data.loanInterest = 0.1;
            break;
        }
      });

      if (gameMode === 'individual') {
        setPlayers(updatedEntities as Player[]);
      } else {
        setTeams(updatedEntities as Team[]);
      }

      // Siguiente jugador o terminar la ronda
      if (currentPlayerIndex < totalEntities - 1) {
        setCurrentPlayerIndex(currentPlayerIndex + 1);
        setSelectedRound1Options([]);
        setInvestmentAmount(0);
      } else {
        // Generar eventos aleatorios para todos los jugadores
        const entities = gameMode === 'individual' ? players : teams;
        const eventsData = entities.map((entity) => {
          const events: any[] = [];
          
          // Recopilar todas las opciones que el jugador eligió
          const availableOptions: string[] = [];
          if (entity.round1Data?.carIncome) availableOptions.push('car');
          if (entity.round1Data?.houseValue) availableOptions.push('house');
          if (entity.round1Data?.studyLevel !== undefined) availableOptions.push('study');
          if (entity.round1Data?.investmentValue) availableOptions.push('invest');
          if (entity.round1Data?.loanAmount) availableOptions.push('loan');
          
          // Si el jugador hizo al menos una elección, generar UN SOLO evento aleatorio
          if (availableOptions.length > 0) {
            // Seleccionar una opción al azar de las que eligió
            const randomOption = availableOptions[Math.floor(Math.random() * availableOptions.length)];
            // Decidir si es positivo o negativo (50/50)
            const isPositive = Math.random() > 0.5;
            
            // Generar el evento basado en la opción seleccionada
            switch (randomOption) {
              case 'car':
                events.push({
                  type: 'car',
                  category: 'AUTO',
                  positive: isPositive,
                  emoji: isPositive ? '🚘' : '🚓',
                  title: isPositive ? '¡Haces viajes por app de uber, que crack!' : '¡Multa por exceso de velocidad!',
                  description: isPositive ? 'Usaste tu auto de manera inteligente para generar ingresos' : 'Tuviste un gasto inesperado con el auto',
                  amount: isPositive ? 150 : -100,
                  lesson: isPositive ? 'Usar un activo para generar ingresos.' : 'Los activos también tienen costos.'
                });
                break;
              
              case 'house':
                events.push({
                  type: 'house',
                  category: 'CASA',
                  positive: isPositive,
                  emoji: isPositive ? '🏢' : '🌧️',
                  title: isPositive ? '¡El barrio mejora!' : '¡Reparaciones inesperadas!',
                  description: isPositive ? 'Tu casa sube de valor +30%' : 'Necesitas hacer reparaciones en tu propiedad',
                  amount: isPositive ? Math.floor(entity.round1Data.houseValue! * 0.3) : -50,
                  lesson: isPositive ? 'Las propiedades pueden ganar valor.' : 'Ser dueño cuesta.'
                });
                break;
              
              case 'study':
                events.push({
                  type: 'study',
                  category: 'ESTUDIAR',
                  positive: isPositive,
                  emoji: isPositive ? '🧠' : '😴',
                  title: isPositive ? '¡Te ganas una beca!' : '¡Repruebas!',
                  description: isPositive ? 'Tu esfuerzo académico fue recompensado con una beca' : 'No todo esfuerzo sale perfecto',
                  amount: isPositive ? 100 : -50,
                  lesson: isPositive ? 'Invertir en ti mismo da frutos.' : 'No todo esfuerzo sale perfecto.'
                });
                break;
              
              case 'invest':
                const percentage = isPositive ? 0.15 : -0.1;
                const amount = Math.floor(entity.round1Data.investmentValue! * percentage);
                events.push({
                  type: 'invest',
                  category: 'INVERTIR',
                  positive: isPositive,
                  emoji: isPositive ? '💹' : '📉',
                  title: isPositive ? '¡El mercado sube!' : '¡El mercado cae!',
                  description: isPositive ? 'Tu inversión generó ganancias +15%' : 'Tu inversión tuvo pérdidas -10%',
                  amount: amount,
                  percentage: percentage * 100,
                  lesson: isPositive ? 'Invertir puede multiplicar tu plata.' : 'Invertir tiene riesgo.'
                });
                break;
              
              case 'loan':
                events.push({
                  type: 'loan',
                  category: 'PRÉSTAMO',
                  positive: isPositive,
                  emoji: isPositive ? '💵' : '⏰',
                  title: isPositive ? '¡Invertiste bien el dinero prestado!' : '¡Te atrasas en el pago!',
                  description: isPositive ? 'Por ser buen pagador recibes una bonificación del banco' : 'Pagas una penalización extra por atraso',
                  amount: isPositive ? 200 : -100,
                  lesson: isPositive ? 'Usar deuda bien puede ayudar.' : 'Las deudas castigan los errores.'
                });
                break;
            }
          }
          
          return { entity, events };
        });
        
        setCurrentRandomEvents(eventsData);
        setCurrentEventIndex(0);
        setCurrentPlayerIndex(0);
        setSelectedRound1Options([]);
        setInvestmentAmount(0);
        setGamePhase('random-event');
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <Card className="max-w-6xl w-full p-8 bg-white relative my-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <XCircle className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              🏁 RONDA 1 — "Tu primera decisión de dinero"
            </h2>
            <p className="text-sm text-orange-600 font-semibold">
              * Puedes elegir un máximo de 3 opciones
            </p>
          </div>

          {/* Jugador actual y dinero disponible */}
          <div className={`bg-gradient-to-r ${currentColor.bg} text-white px-4 py-4 rounded-xl mb-4`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-2xl mb-1">
                  {gameMode === 'individual' ? 'JUGADOR' : 'EQUIPO'} {currentPlayerIndex + 1} - {currentColor.name}
                </p>
                <p className="text-sm opacity-90">{currentPlayerIndex + 1} de {totalEntities}</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">Dinero disponible:</p>
                <p className="text-3xl font-bold">${remainingMoney}</p>
                {spentMoney > 0 && (
                  <p className="text-sm opacity-80 mt-1">
                    (De ${currentEntity.money} - gastado ${spentMoney})
                  </p>
                )}
                {spentMoney < 0 && (
                  <p className="text-sm opacity-80 mt-1 text-green-200">
                    (De ${currentEntity.money} + préstamo ${Math.abs(spentMoney)})
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Opciones de Ronda 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* OPCIÓN 1: AUTO */}
            <button
              onClick={() => toggleOption('car')}
              disabled={remainingMoney < 150}
              className={`bg-white rounded-xl p-5 transition-all text-left border-3 ${
                selectedRound1Options.some(opt => opt.option === 'car')
                  ? 'border-emerald-500 shadow-xl scale-105 ring-4 ring-emerald-200'
                  : 'border-gray-300 hover:border-emerald-400 hover:shadow-lg'
              } ${remainingMoney < 150 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="text-8xl mb-3 text-center">🚗</div>
              <h3 className="font-bold text-xl text-gray-900 mb-2">AUTO</h3>
              <p className="text-sm text-gray-600 mb-3 italic">
                Tener un pequeño auto te puede generar ingresos todos los meses, o solo gastos...
              </p>
              <div className="space-y-2 text-sm">
                <p className="text-red-600 font-semibold">💰 Pagas $150</p>
                <p className="text-green-600 font-semibold">📥 Ganas $100 cada ronda</p>
              </div>
              {remainingMoney < 150 && (
                <p className="text-xs text-red-500 mt-2">No tienes suficiente dinero</p>
              )}
            </button>

            {/* OPCIÓN 2: CASA */}
            <button
              onClick={() => toggleOption('house')}
              disabled={remainingMoney < 300}
              className={`bg-white rounded-xl p-5 transition-all text-left border-3 ${
                selectedRound1Options.some(opt => opt.option === 'house')
                  ? 'border-blue-500 shadow-xl scale-105 ring-4 ring-blue-200'
                  : 'border-gray-300 hover:border-blue-400 hover:shadow-lg'
              } ${remainingMoney < 300 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="text-8xl mb-3 text-center">🏠</div>
              <h3 className="font-bold text-xl text-gray-900 mb-2">CASA</h3>
              <p className="text-sm text-gray-600 mb-3 italic">
                Comprar algo que vale más con el tiempo.
              </p>
              <div className="space-y-2 text-sm">
                <p className="text-red-600 font-semibold">💰 Pagas $300</p>
                <p className="text-green-600 font-semibold">📈 Sube 20% cada ronda</p>
              </div>
              {remainingMoney < 300 && (
                <p className="text-xs text-red-500 mt-2">No tienes suficiente dinero</p>
              )}
            </button>

            {/* OPCIÓN 3: ESTUDIAR */}
            <button
              onClick={() => toggleOption('study')}
              disabled={remainingMoney < 50}
              className={`bg-white rounded-xl p-5 transition-all text-left border-3 ${
                selectedRound1Options.some(opt => opt.option === 'study')
                  ? 'border-purple-500 shadow-xl scale-105 ring-4 ring-purple-200'
                  : 'border-gray-300 hover:border-purple-400 hover:shadow-lg'
              } ${remainingMoney < 50 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="text-8xl mb-3 text-center">🎓</div>
              <h3 className="font-bold text-xl text-gray-900 mb-2">ESTUDIAR</h3>
              <p className="text-sm text-gray-600 mb-3 italic">
                Aprender algo que te permite ganar más cada año.
              </p>
              <div className="space-y-2 text-sm">
                <p className="text-red-600 font-semibold">💰 Pagas $50</p>
                <p className="text-green-600 font-semibold">📥 $25 → $50 → $100 → $200</p>
                <p className="text-blue-600 text-xs">Luego te gradúas: +$50</p>
              </div>
              {remainingMoney < 50 && (
                <p className="text-xs text-red-500 mt-2">No tienes suficiente dinero</p>
              )}
            </button>

            {/* OPCIÓN 4: INVERTIR */}
            <button
              onClick={() => toggleOption('invest')}
              className={`bg-white rounded-xl p-5 transition-all text-left border-3 ${
                selectedRound1Options.some(opt => opt.option === 'invest')
                  ? 'border-orange-500 shadow-xl scale-105 ring-4 ring-orange-200'
                  : 'border-gray-300 hover:border-orange-400 hover:shadow-lg'
              }`}
            >
              <div className="text-8xl mb-3 text-center">📈</div>
              <h3 className="font-bold text-xl text-gray-900 mb-2">INVERTIR</h3>
              <p className="text-sm text-gray-600 mb-3 italic">
                Inviertes tu dinero a cambio de riesgo-retorno.
              </p>
              <div className="space-y-2 text-sm">
                <p className="text-gray-700 font-semibold">💰 Tú decides cuánto</p>
                <p className="text-orange-600 font-semibold">📊 Puede subir o bajar (-10% a +40%)</p>
              </div>
              {selectedRound1Options.some(opt => opt.option === 'invest') && (
                <div className="mt-3 relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-600 font-bold text-lg">
                    $
                  </span>
                  <input
                    type="number"
                    value={investmentAmount === 0 ? '' : investmentAmount}
                    onChange={(e) => setInvestmentAmount(parseInt(e.target.value) || 0)}
                    max={remainingMoney}
                    min="0"
                    className="w-full pl-8 pr-3 py-2 border-2 border-orange-300 rounded-lg focus:border-orange-500 focus:outline-none text-lg font-semibold"
                    placeholder="0"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}
            </button>

            {/* OPCIÓN 5: PRÉSTAMO */}
            <button
              onClick={() => toggleOption('loan')}
              className={`bg-white rounded-xl p-5 transition-all text-left border-3 ${
                selectedRound1Options.some(opt => opt.option === 'loan')
                  ? 'border-red-500 shadow-xl scale-105 ring-4 ring-red-200'
                  : 'border-gray-300 hover:border-red-400 hover:shadow-lg'
              }`}
            >
              <div className="text-8xl mb-3 text-center">💳</div>
              <h3 className="font-bold text-xl text-gray-900 mb-2">PRÉSTAMO</h3>
              <p className="text-sm text-gray-600 mb-3 italic">
                Le pides dinero prestado al banco.
              </p>
              <div className="space-y-2 text-sm">
                <p className="text-green-600 font-semibold">💰 Te dan $500 ahora</p>
                <p className="text-red-600 font-semibold">📈 Deuda aumenta 10% cada ronda</p>
              </div>
            </button>

            {/* Opción: No hacer nada */}
            <button
              onClick={() => setSelectedRound1Options([])}
              className="bg-gray-100 rounded-xl p-5 transition-all text-center border-3 border-gray-300 hover:border-gray-400 hover:shadow-lg"
            >
              <div className="text-8xl mb-3">⏸️</div>
              <h3 className="font-bold text-xl text-gray-700 mb-2">NO HACER NADA</h3>
              <p className="text-sm text-gray-600">Guardas tu dinero</p>
            </button>
          </div>

          {/* Botón de confirmación */}
          {selectedRound1Options.length > 0 && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-xl p-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-2xl">⚠️</span>
                <h4 className="font-bold text-gray-900 text-lg">¿Confirmas tu decisión?</h4>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleConfirmAllChoices}
                  disabled={selectedRound1Options.some(opt => opt.option === 'invest') && (investmentAmount <= 0 || investmentAmount > remainingMoney)}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ✓ Confirmar
                </button>
                <button
                  onClick={() => {
                    setSelectedRound1Options([]);
                    setInvestmentAmount(0);
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg font-bold transition-all"
                >
                  ✗ Cancelar
                </button>
              </div>
            </div>
          )}
        </Card>
      </div>
    );
  }

  // Fase de juego (por ahora placeholder)
  if (gamePhase === 'playing') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-3xl w-full p-8 bg-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Jugando...</h2>
            <p className="text-gray-600 mb-6">Ronda {currentRound + 1} de {numRounds}</p>
            
            {/* Mostrar estado de jugadores/equipos */}
            <div className="space-y-4">
              {gameMode === 'individual' ? (
                players.map((player) => (
                  <div key={player.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{player.name}</span>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Dinero: ${player.money}</p>
                        <p className="text-xs text-gray-500">
                          Opción {player.initialChoice} (+${player.perRoundIncome}/ronda)
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                teams.map((team) => (
                  <div key={team.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{team.name}</span>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Dinero: ${team.money}</p>
                        <p className="text-xs text-gray-500">
                          Opción {team.initialChoice} (+${team.perRoundIncome}/ronda)
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <p className="text-sm text-gray-500 mt-6 italic">
              (Las rondas de juego se implementarán en el siguiente paso)
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // Fase de eventos aleatorios
  if (gamePhase === 'random-event' && currentRandomEvents.length > 0 && currentEventIndex < currentRandomEvents.length) {
    const currentData = currentRandomEvents[currentEventIndex];
    const currentEntity = currentData.entity;
    const entityIndex = gameMode === 'individual' 
      ? players.findIndex(p => p.id === currentEntity.id)
      : teams.findIndex(t => t.id === currentEntity.id);
    const currentColor = getPlayerColor(entityIndex);

    const handleNextEvent = () => {
      // Aplicar los eventos al jugador actual
      const updatedEntities = gameMode === 'individual' ? [...players] : [...teams];
      const entity = updatedEntities[entityIndex];
      
      currentData.events.forEach(event => {
        entity.money += event.amount;
      });

      if (gameMode === 'individual') {
        setPlayers(updatedEntities as Player[]);
      } else {
        setTeams(updatedEntities as Team[]);
      }

      // Siguiente jugador o terminar eventos
      if (currentEventIndex < currentRandomEvents.length - 1) {
        setCurrentEventIndex(currentEventIndex + 1);
      } else {
        setGamePhase('playing');
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <Card className="max-w-4xl w-full p-8 bg-white relative my-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-6xl">🎲</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              🎲 Evento Aleatorio
            </h2>
            <p className="text-gray-600 italic">(lo que pasa en la vida aunque no lo planees)</p>
          </div>

          {/* Texto introductorio */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-purple-200 mb-6">
            <div className="space-y-3 text-center">
              <p className="text-lg text-gray-800 font-semibold">
                "En la vida real no todo depende de ti."
              </p>
              <p className="text-lg text-gray-800 font-semibold">
                A veces pasan cosas buenas… y a veces malas.
              </p>
              <p className="text-lg text-purple-700 font-bold">
                Los que tienen un plan y ahorros sobreviven mejor."
              </p>
            </div>
          </div>

          {/* Jugador actual */}
          <div className={`bg-gradient-to-r ${currentColor.bg} text-white px-4 py-3 rounded-xl mb-6 text-center`}>
            <p className="font-bold text-2xl mb-1">
              {gameMode === 'individual' ? 'JUGADOR' : 'EQUIPO'} {entityIndex + 1} - {currentColor.name}
            </p>
            <p className="text-lg opacity-90">Dinero actual: ${currentEntity.money}</p>
          </div>

          {/* Eventos del jugador */}
          <div className="space-y-4 mb-6">
            {currentData.events.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <p className="text-xl text-gray-600">😌 No tienes eventos esta ronda</p>
                <p className="text-sm text-gray-500 mt-2">No tomaste ninguna decisión financiera</p>
              </div>
            ) : (
              currentData.events.map((event, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl p-6 border-3 shadow-lg ${
                    event.positive
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-400'
                      : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-400'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-6xl">{event.emoji}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {event.category}
                          </h3>
                          <p className={`text-xl font-bold flex items-center gap-2 ${
                            event.positive ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {event.positive ? '🟢' : '🔴'} {event.positive ? 'Evento positivo' : 'Evento negativo'}
                          </p>
                        </div>
                        <div className={`text-3xl font-bold ${
                          event.positive ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {event.amount > 0 ? '+' : ''}${event.amount}
                        </div>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        {event.title}
                      </h4>
                      <p className="text-gray-700 mb-3">{event.description}</p>
                      <div className="bg-white rounded-lg p-3 border-l-4 border-purple-500">
                        <p className="text-sm text-purple-700">
                          <strong>👉</strong> {event.lesson}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Balance total */}
          {currentData.events.length > 0 && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 font-semibold">Balance de eventos:</p>
                  <p className="text-sm text-gray-600">Impacto total en tu dinero</p>
                </div>
                <div className="text-right">
                  <p className={`text-3xl font-bold ${
                    currentData.events.reduce((sum, e) => sum + e.amount, 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {currentData.events.reduce((sum, e) => sum + e.amount, 0) > 0 ? '+' : ''}
                    ${currentData.events.reduce((sum, e) => sum + e.amount, 0)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Nuevo total: ${currentEntity.money + currentData.events.reduce((sum, e) => sum + e.amount, 0)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Botón continuar */}
          <button
            onClick={handleNextEvent}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
          >
            Continuar
            <ArrowRight className="w-6 h-6" />
          </button>
        </Card>
      </div>
    );
  }

  return null;
}