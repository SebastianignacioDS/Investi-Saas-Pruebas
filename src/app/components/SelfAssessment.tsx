import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ArrowLeft, Check, X, Target, TrendingUp, Lightbulb, BarChart3 } from 'lucide-react';

interface SelfAssessmentProps {
  onClose: () => void;
  onComplete: (results: CompetencyResult[]) => void;
}

interface CompetencyResult {
  id: number;
  name: string;
  score: number;
  level: number;
  levelName: string;
}

export function SelfAssessment({ onClose, onComplete }: SelfAssessmentProps) {
  const [showIntro, setShowIntro] = useState(true);
  const [currentCompetency, setCurrentCompetency] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const competencies = [
    {
      id: 1,
      name: 'Planificación de metas',
      icon: '🧠',
      color: 'from-blue-500 to-blue-600',
      questions: [
        {
          id: 'p1',
          text: 'Cuando quiero algo caro (celular, viaje, etc):',
          options: [
            { value: 1, text: 'Lo compro apenas puedo' },
            { value: 2, text: 'Ahorro sin mucho orden' },
            { value: 3, text: 'Me pongo una meta y trato de cumplirla' },
            { value: 4, text: 'Defino monto, plazo y plan' },
          ],
        },
        {
          id: 'p2',
          text: '¿Tienes ahora una meta financiera clara?',
          options: [
            { value: 1, text: 'No' },
            { value: 2, text: 'Sí, pero sin plan' },
            { value: 3, text: 'Sí, con plazo' },
            { value: 4, text: 'Sí, con plan detallado' },
          ],
        },
        {
          id: 'p3',
          text: 'Cuando piensas en una meta (por ejemplo comprar algo o viajar), tú…',
          options: [
            { value: 1, text: 'Solo la tienes en tu cabeza' },
            { value: 2, text: 'Sabes cuánto cuesta, pero no cuándo la lograrás' },
            { value: 3, text: 'Sabes cuánto cuesta y en cuánto tiempo' },
            { value: 4, text: 'Sabes cuánto cuesta, en cuánto tiempo y cuánto debes ahorrar' },
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'Creación de presupuestos',
      icon: '💰',
      color: 'from-green-500 to-green-600',
      questions: [
        {
          id: 'cp1',
          text: '¿Sabes cuánto dinero entra y sale de tu bolsillo?',
          options: [
            { value: 1, text: 'No' },
            { value: 2, text: 'Más o menos' },
            { value: 3, text: 'Sí' },
            { value: 4, text: 'Sí y lo registro' },
          ],
        },
        {
          id: 'cp2',
          text: 'Si hoy recibes $100.000, tú:',
          options: [
            { value: 1, text: 'Lo gastas' },
            { value: 2, text: 'Gastas casi todo' },
            { value: 3, text: 'Gastas y ahorras' },
            { value: 4, text: 'Lo repartes en categorías' },
          ],
        },
        {
          id: 'cp3',
          text: 'Si a mitad de mes te das cuenta de que estás gastando más de lo que puedes, tú…',
          options: [
            { value: 1, text: 'Sigues igual' },
            { value: 2, text: 'Tratas de gastar un poco menos' },
            { value: 3, text: 'Recortas algunos gastos' },
            { value: 4, text: 'Ajustas tu presupuesto para no quedarte sin dinero' },
          ],
        },
      ],
    },
    {
      id: 3,
      name: 'Priorización',
      icon: '🧮',
      color: 'from-yellow-500 to-yellow-600',
      questions: [
        {
          id: 'pr1',
          text: 'Si tienes dinero limitado y quieres 2 cosas:',
          options: [
            { value: 1, text: 'Compras la que quieres más' },
            { value: 2, text: 'Compras la más barata' },
            { value: 3, text: 'Evalúas cuál es más importante' },
            { value: 4, text: 'Evalúas impacto y plazo' },
          ],
        },
        {
          id: 'pr2',
          text: '¿Qué haces cuando aparece un gasto inesperado?',
          options: [
            { value: 1, text: 'Me desordena todo' },
            { value: 2, text: 'Uso lo que tengo' },
            { value: 3, text: 'Ajusto otros gastos' },
            { value: 4, text: 'Tengo un fondo para eso' },
          ],
        },
        {
          id: 'pr3',
          text: 'Si tienes que elegir entre gastar ahora o guardar para algo más importante después, tú…',
          options: [
            { value: 1, text: 'Gastas ahora' },
            { value: 2, text: 'A veces guardas' },
            { value: 3, text: 'Generalmente eliges guardar' },
            { value: 4, text: 'Casi siempre priorizas la meta más importante' },
          ],
        },
      ],
    },
    {
      id: 4,
      name: 'Inversión',
      icon: '📈',
      color: 'from-orange-500 to-orange-600',
      questions: [
        {
          id: 'i1',
          text: '¿Qué significa invertir?',
          options: [
            { value: 1, text: 'Apostar' },
            { value: 2, text: 'Guardar plata' },
            { value: 3, text: 'Hacer crecer el dinero' },
            { value: 4, text: 'Hacer crecer el dinero controlando riesgo' },
          ],
        },
        {
          id: 'i2',
          text: 'Si una de tus inversiones baja un 10%, tú…',
          options: [
            { value: 1, text: 'Vendes todo para no perder más' },
            { value: 2, text: 'Vendes una parte' },
            { value: 3, text: 'Esperas a ver qué pasa' },
            { value: 4, text: 'Compras más porque está más barata' },
          ],
        },
        {
          id: 'i3',
          text: 'Si tienes $100.000 para invertir, tú…',
          options: [
            { value: 1, text: 'Lo pondrías todo en una sola opción' },
            { value: 2, text: 'Lo dividirías en un par de opciones' },
            { value: 3, text: 'Lo repartirías en varias' },
            { value: 4, text: 'Lo repartirías según riesgo y objetivo' },
          ],
        },
      ],
    },
    {
      id: 5,
      name: 'Ahorro',
      icon: '🏦',
      color: 'from-red-500 to-red-600',
      questions: [
        {
          id: 'a1',
          text: '¿Qué haces con el dinero que no gastas?',
          options: [
            { value: 1, text: 'Me lo gasto después' },
            { value: 2, text: 'Lo dejo en la cuenta' },
            { value: 3, text: 'Lo separo' },
            { value: 4, text: 'Lo destino a una meta' },
          ],
        },
        {
          id: 'a2',
          text: '¿Ahorras con constancia?',
          options: [
            { value: 1, text: 'Nunca' },
            { value: 2, text: 'A veces' },
            { value: 3, text: 'Casi siempre' },
            { value: 4, text: 'Siempre' },
          ],
        },
        {
          id: 'a3',
          text: 'Si un mes ganas más dinero de lo normal, tú…',
          options: [
            { value: 1, text: 'Lo gastas' },
            { value: 2, text: 'Gastas un poco más' },
            { value: 3, text: 'Ahorras una parte' },
            { value: 4, text: 'Ahorras casi todo para tus metas' },
          ],
        },
      ],
    },
    {
      id: 6,
      name: 'Deuda responsable',
      icon: '💳',
      color: 'from-purple-500 to-purple-600',
      questions: [
        {
          id: 'd1',
          text: 'Comprar en cuotas significa:',
          options: [
            { value: 1, text: 'Pagar lo mismo' },
            { value: 2, text: 'Pagar más' },
            { value: 3, text: 'Pagar menos' },
            { value: 4, text: 'No sé' },
          ],
        },
        {
          id: 'd2',
          text: 'Si usas tarjeta de crédito:',
          options: [
            { value: 1, text: 'Pagas lo mínimo' },
            { value: 2, text: 'A veces el total' },
            { value: 3, text: 'Siempre el total' },
            { value: 4, text: 'No uso crédito' },
          ],
        },
        {
          id: 'd3',
          text: 'Si quieres algo (juego, zapatillas, comida, salida) y no tienes la plata ahora, tú…',
          options: [
            { value: 1, text: 'Pides prestado o lo compras igual' },
            { value: 2, text: 'Pides plata y la devuelves después' },
            { value: 3, text: 'Esperas a juntar una parte' },
            { value: 4, text: 'Esperas y ahorras hasta tenerlo' },
          ],
        },
      ],
    },
    {
      id: 7,
      name: 'Riesgos financieros',
      icon: '🚨',
      color: 'from-pink-500 to-pink-600',
      questions: [
        {
          id: 'r1',
          text: 'Si algo promete "ganancia segura":',
          options: [
            { value: 1, text: 'Me meto' },
            { value: 2, text: 'Lo dudo' },
            { value: 3, text: 'Desconfío' },
            { value: 4, text: 'Lo investigo' },
          ],
        },
        {
          id: 'r2',
          text: 'Si alguien te pide dinero por WhatsApp:',
          options: [
            { value: 1, text: 'Le transfiero' },
            { value: 2, text: 'Le pregunto' },
            { value: 3, text: 'Verifico' },
            { value: 4, text: 'No envío' },
          ],
        },
        {
          id: 'r3',
          text: 'Si ves una oferta en redes sociales que parece increíble (producto muy barato o sorteo), tú…',
          options: [
            { value: 1, text: 'Compras o participas de inmediato' },
            { value: 2, text: 'Lo compartes con tus amigos primero' },
            { value: 3, text: 'Investigas un poco antes' },
            { value: 4, text: 'Verificas la fuente y buscas opiniones antes de decidir' },
          ],
        },
      ],
    },
  ];

  const getLevelFromScore = (score: number, numQuestions: number): { level: number; name: string } => {
    // Calcular el promedio de puntuación (score / numQuestions)
    const average = score / numQuestions;
    
    // Mapear el promedio a niveles I-IV
    if (average <= 1.5) return { level: 1, name: 'Novato' };
    if (average <= 2.5) return { level: 2, name: 'Aprendiz' };
    if (average <= 3.5) return { level: 3, name: 'Explorador' };
    if (average <= 4.0) return { level: 4, name: 'Hábil' };
    
    return { level: 1, name: 'Novato' };
  };

  const calculateResults = (): CompetencyResult[] => {
    return competencies.map((comp) => {
      // Sumar todas las respuestas de las preguntas de esta competencia
      let score = 0;
      comp.questions.forEach((q) => {
        score += answers[q.id] || 0;
      });
      
      const numQuestions = comp.questions.length;
      const maxScore = numQuestions * 4; // Cada pregunta tiene máximo 4 puntos
      const { level, name } = getLevelFromScore(score, numQuestions);

      return {
        id: comp.id,
        name: comp.name,
        score,
        level,
        levelName: name,
      };
    });
  };

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const canProceed = () => {
    const comp = competencies[currentCompetency];
    return comp.questions.every((q) => answers[q.id] !== undefined);
  };

  const handleNext = () => {
    if (currentCompetency < competencies.length - 1) {
      setCurrentCompetency(currentCompetency + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentCompetency > 0) {
      setCurrentCompetency(currentCompetency - 1);
    }
  };

  const handleFinish = () => {
    const results = calculateResults();
    onComplete(results);
  };

  if (showResults) {
    const results = calculateResults();
    
    // Colores por nivel
    const levelColorClasses = [
      { bg: 'from-green-500 to-green-600', text: 'text-green-600', border: 'border-green-500', badge: 'bg-green-500' }, // Nivel I - Novato
      { bg: 'from-blue-500 to-blue-600', text: 'text-blue-600', border: 'border-blue-500', badge: 'bg-blue-500' },     // Nivel II - Aprendiz
      { bg: 'from-yellow-400 to-yellow-500', text: 'text-yellow-600', border: 'border-yellow-400', badge: 'bg-yellow-400' }, // Nivel III - Explorador
      { bg: 'from-orange-500 to-orange-600', text: 'text-orange-600', border: 'border-orange-500', badge: 'bg-orange-500' }, // Nivel IV - Hábil
      { bg: 'from-red-500 to-red-600', text: 'text-red-600', border: 'border-red-500', badge: 'bg-red-500' },         // Nivel V - Experto
      { bg: 'from-purple-500 to-purple-600', text: 'text-purple-600', border: 'border-purple-500', badge: 'bg-purple-500' }, // Nivel VI - Maestro
    ];

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-[#be9525] to-[#f3d374] rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">¡Autoevaluación Completada!</h2>
            <p className="text-gray-600">Aquí están tus resultados por competencia</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {results.map((result, index) => {
              const colors = levelColorClasses[result.level - 1]; // level es 1-6, array es 0-5
              const comp = competencies[index];
              const maxScore = comp.questions.length * 4; // Calcular puntaje máximo según número de preguntas
              
              return (
                <Card key={result.id} className={`p-6 border-2 ${colors.border} hover:shadow-lg transition-all`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${comp.color} rounded-xl flex items-center justify-center text-2xl`}>
                      {comp.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">{result.name}</h3>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-gray-600">Puntaje:</span>
                        <span className={`font-bold ${colors.text}`}>{result.score}/{maxScore}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Nivel:</span>
                        <span className={`px-3 py-1 bg-gradient-to-r ${colors.bg} text-white text-sm font-semibold rounded-full`}>
                          {result.level} - {result.levelName}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="flex gap-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleFinish}
              className="flex-1 bg-gradient-to-r from-[#be9525] to-[#f3d374] hover:from-[#9a7a1e] hover:to-[#d4b860]"
            >
              Guardar Resultados
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (showIntro) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto p-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" onClick={onClose}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Salir
            </Button>
          </div>

          {/* Main Title */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-[#be9525] to-[#f3d374] rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Antes de empezar, queremos conocerte.</h1>
          </div>

          {/* Main Content */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-8 mb-8 border-2 border-[#be9525]/20">
            <p className="text-lg mb-4 text-gray-700">
              Esta evaluación <span className="font-semibold text-gray-900">no es una prueba ni tiene nota.</span>
            </p>
            <p className="text-lg mb-4 text-gray-700">
              Nos ayuda a entender cómo manejas tu dinero hoy para darte los mejores <span className="font-semibold text-[#be9525]">retos, cursos y metas</span> para ti.
            </p>
            <div className="border-t-2 border-[#be9525]/20 my-6"></div>
            <p className="text-lg mb-2 text-gray-700">
              <span className="font-semibold text-gray-900">No hay respuestas buenas o malas.</span>
            </p>
            <p className="text-lg text-gray-700">
              Mientras más honesto seas, mejor será tu experiencia.
            </p>
          </div>

          {/* Subtitle Section */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-[#be9525]" />
              <h2 className="text-2xl font-bold text-gray-900">Vamos a medir tus habilidades financieras actuales</h2>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-[#be9525]/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Cómo ahorras</h3>
                  <p className="text-gray-600 text-sm">Evaluaremos tus hábitos de ahorro</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-[#be9525]/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Cómo tomas decisiones</h3>
                  <p className="text-gray-600 text-sm">Tu proceso de toma de decisiones financieras</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-[#be9525]/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Qué tanto sabes de dinero</h3>
                  <p className="text-gray-600 text-sm">Tu nivel actual de conocimiento financiero</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-[#be9525]/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Qué nivel te conviene comenzar</h3>
                  <p className="text-gray-600 text-sm">Encontraremos tu punto de partida ideal</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-8 border-2 border-indigo-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900">En solo unos minutos sabremos:</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#be9525]"></div>
                    <p className="text-gray-700">Tu nivel actual en 7 competencias financieras</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#be9525]"></div>
                    <p className="text-gray-700">Los mejores cursos y retos para ti</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#be9525]"></div>
                    <p className="text-gray-700">Un camino personalizado de aprendizaje</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <Button 
            onClick={() => setShowIntro(false)}
            className="w-full bg-gradient-to-r from-[#be9525] to-[#f3d374] hover:from-[#9a7a1e] hover:to-[#d4b860] text-white py-6 text-lg font-semibold"
          >
            Comenzar Evaluación
          </Button>
        </Card>
      </div>
    );
  }

  const comp = competencies[currentCompetency];
  const progress = ((currentCompetency + 1) / competencies.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onClose}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            Salir
          </Button>
          <div className="text-sm text-gray-600">
            Competencia {currentCompetency + 1} de {competencies.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#be9525] to-[#f3d374] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Competency Header */}
        <div className="text-center mb-8">
          <div className={`w-20 h-20 bg-gradient-to-br ${comp.color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-4xl`}>
            {comp.icon}
          </div>
          <h2 className="text-2xl font-bold mb-2">{comp.name}</h2>
          <p className="text-gray-600">Responde las siguientes preguntas</p>
        </div>

        {/* Questions */}
        <div className="space-y-8 mb-8">
          {comp.questions.map((question, qIndex) => (
            <div key={question.id}>
              <h3 className="font-semibold text-lg mb-4">
                {qIndex + 1}. {question.text}
              </h3>
              <div className="space-y-3">
                {question.options.map((option) => {
                  const isSelected = answers[question.id] === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(question.id, option.value)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        isSelected
                          ? 'border-[#be9525] bg-gradient-to-r from-[#be9525]/10 to-[#f3d374]/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-[#be9525] bg-[#be9525]' : 'border-gray-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className={isSelected ? 'font-semibold text-gray-900' : 'text-gray-700'}>
                          {option.text}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          <Button
            onClick={handlePrevious}
            variant="outline"
            disabled={currentCompetency === 0}
            className="flex-1"
          >
            Anterior
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex-1 bg-gradient-to-r from-[#be9525] to-[#f3d374] hover:from-[#9a7a1e] hover:to-[#d4b860] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentCompetency === competencies.length - 1 ? 'Ver Resultados' : 'Siguiente'}
          </Button>
        </div>
      </Card>
    </div>
  );
}