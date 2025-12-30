import { LayoutDashboard, Gamepad2, BookOpen, Swords, Trophy, Settings, LogOut, User, Wrench, TrendingUp, Bug, Wallet } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  onLogout?: () => void;
  selectedLevel: number | null;
  grade: string;
  course: string;
  name: string;
}

export function Sidebar({ activeView, setActiveView, onLogout, selectedLevel, grade, course, name }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
    { id: 'minigames', label: 'Mini-Juegos', icon: Gamepad2 },
    { id: 'learnings', label: 'Mis Aprendizajes', icon: BookOpen },
    { id: 'competitions', label: 'Competencias Activas', icon: Swords },
    { id: 'goals', label: 'Logros & Trofeos', icon: Trophy },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  const toolsItems = [
    { id: 'investment-simulator', label: 'Mini-simulador de inversiones', icon: TrendingUp },
    { id: 'ant-hunt', label: 'Caza hormigas', icon: Bug },
    { id: 'budget-organizer', label: 'Organizador de presupuestos', icon: Wallet },
  ];

  // Configuración de colores por nivel
  const levelColors = [
    { from: 'from-green-500', to: 'to-green-600', activeText: 'text-green-600', progressBar: 'bg-green-300', border: 'border-green-500', bg: 'bg-green-50' }, // Nivel I - Verde
    { from: 'from-blue-500', to: 'to-blue-600', activeText: 'text-blue-600', progressBar: 'bg-blue-300', border: 'border-blue-500', bg: 'bg-blue-50' },   // Nivel II - Azul
    { from: 'from-yellow-400', to: 'to-yellow-500', activeText: 'text-yellow-600', progressBar: 'bg-yellow-300', border: 'border-yellow-400', bg: 'bg-yellow-50' }, // Nivel III - Amarillo
    { from: 'from-orange-500', to: 'to-orange-600', activeText: 'text-orange-600', progressBar: 'bg-orange-300', border: 'border-orange-500', bg: 'bg-orange-50' }, // Nivel IV - Naranja
    { from: 'from-red-500', to: 'to-red-600', activeText: 'text-red-600', progressBar: 'bg-red-300', border: 'border-red-500', bg: 'bg-red-50' },       // Nivel V - Rojo
    { from: 'from-purple-500', to: 'to-purple-600', activeText: 'text-purple-600', progressBar: 'bg-purple-300', border: 'border-purple-500', bg: 'bg-purple-50' }, // Nivel VI - Morado
  ];

  // Color por defecto (dorado)
  const defaultColors = { from: 'from-[#be9525]', to: 'to-[#f3d374]', activeText: 'text-[#be9525]', progressBar: 'bg-yellow-300', border: 'border-[#be9525]', bg: 'bg-amber-50' };
  
  // Obtener colores actuales basados en selección
  const currentColors = selectedLevel !== null ? levelColors[selectedLevel] : defaultColors;

  return (
    <aside className={`w-64 bg-white min-h-screen p-6 flex flex-col transition-all duration-500 border-4 ${currentColors.border}`}>
      {/* Logo */}
      <div className="mb-8">
        <div className="rounded-xl overflow-hidden shadow-lg">
          <img src="/images/logo.png" alt="Investï" className="w-full h-auto" />
        </div>
        <p className="text-gray-600 text-sm text-center mt-2">Tu camino hacia el ahorro</p>
      </div>

      {/* User Profile */}
      <div className={`${currentColors.bg} rounded-xl p-4 mb-6 border-2 ${currentColors.border} transition-all duration-500`}>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 bg-gradient-to-br ${currentColors.from} ${currentColors.to} rounded-full flex items-center justify-center font-bold text-white`}>
            SE
          </div>
          <div>
            <p className="font-semibold text-gray-800">{name}</p>
            <p className="text-gray-600 text-sm">Nivel 15 - Explorador - {grade} {course}</p>
          </div>
        </div>
        <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
          <div className={currentColors.progressBar + " h-full w-3/4 transition-all duration-500"}></div>
        </div>
        <p className="text-xs text-gray-600 mt-1">1500 / 1800 XP</p>
        
        {/* Ver Perfil Button */}
        <button
          onClick={() => setActiveView('profile')}
          className={`w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all font-semibold text-sm bg-gradient-to-r ${currentColors.from} ${currentColors.to} text-white hover:shadow-lg hover:scale-105`}
        >
          <User className="w-4 h-4" />
          <span>Ver perfil</span>
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? `${currentColors.bg} ${currentColors.activeText} font-semibold shadow-lg border-2 ${currentColors.border}`
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Herramientas Section */}
        <div className="pt-4 mt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 px-4 py-2 mb-2">
            <Wrench className="w-4 h-4 text-gray-500" />
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Herramientas</h3>
          </div>
          {toolsItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? `${currentColors.bg} ${currentColors.activeText} font-semibold shadow-lg border-2 ${currentColors.border}`
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <button
        className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-all mt-4"
        onClick={onLogout}
      >
        <LogOut className="w-5 h-5" />
        <span>Cerrar Sesión</span>
      </button>
    </aside>
  );
}