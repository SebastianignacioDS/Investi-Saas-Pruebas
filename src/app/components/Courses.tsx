import { Play, Lock, ChevronRight, BookOpen } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Courses() {
  const courses = [
    {
      id: 1,
      name: 'Matemáticas Avanzadas',
      description: 'Domina álgebra, geometría y cálculo',
      progress: 75,
      totalLessons: 24,
      completedLessons: 18,
      color: 'from-blue-500 to-indigo-600',
      image: 'https://images.unsplash.com/photo-1632571401005-458e9d244591?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRoZW1hdGljcyUyMHNjaWVuY2UlMjBzY2hvb2x8ZW58MXx8fHwxNzY2NDM1OTUwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 2,
      name: 'Historia Universal',
      description: 'Explora los eventos que cambiaron el mundo',
      progress: 45,
      totalLessons: 20,
      completedLessons: 9,
      color: 'from-green-500 to-emerald-600',
      image: 'https://images.unsplash.com/photo-1728743264694-4ac39fa29385?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rcyUyMGxlYXJuaW5nJTIwY2xhc3Nyb29tfGVufDF8fHx8MTc2NjQzNTk1MHww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 3,
      name: 'Ciencias Naturales',
      description: 'Descubre los secretos del universo',
      progress: 60,
      totalLessons: 18,
      completedLessons: 11,
      color: 'from-purple-500 to-pink-600',
      image: 'https://images.unsplash.com/photo-1667655861998-46fe4c29a4cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc3R1ZHlpbmclMjBlZHVjYXRpb258ZW58MXx8fHwxNzY2NDM1OTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 4,
      name: 'Lengua y Literatura',
      description: 'Mejora tu comprensión y expresión',
      progress: 30,
      totalLessons: 22,
      completedLessons: 7,
      color: 'from-amber-500 to-orange-600',
      image: 'https://images.unsplash.com/photo-1728743264694-4ac39fa29385?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rcyUyMGxlYXJuaW5nJTIwY2xhc3Nyb29tfGVufDF8fHx8MTc2NjQzNTk1MHww&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  const expandedCourse = courses[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Mis Cursos</h2>
        <p className="text-gray-600 mt-1">Continúa aprendiendo donde lo dejaste</p>
      </div>

      {/* Courses Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden hover:shadow-xl transition-shadow">
            <div className="relative h-40 overflow-hidden">
              <ImageWithFallback
                src={course.image}
                alt={course.name}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${course.color} opacity-60`}></div>
              <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold">
                {course.progress}%
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-xl mb-2">{course.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{course.description}</p>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{course.completedLessons} de {course.totalLessons} lecciones</span>
                  <span>{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>
              <Button className="w-full group">
                Continuar Aprendiendo
                <Play className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Expanded Course Details */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-xl">Matemáticas Avanzadas - Próximas Lecciones</h3>
          <Button variant="outline" size="sm">
            Ver Todas
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        <div className="space-y-3">
          {[
            { id: 1, title: 'Ecuaciones Cuadráticas - Parte 2', duration: '15 min', completed: false, locked: false },
            { id: 2, title: 'Factorización Avanzada', duration: '20 min', completed: false, locked: false },
            { id: 3, title: 'Sistemas de Ecuaciones', duration: '18 min', completed: false, locked: true },
            { id: 4, title: 'Funciones Lineales', duration: '22 min', completed: false, locked: true },
          ].map((lesson) => (
            <div
              key={lesson.id}
              className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                lesson.locked
                  ? 'bg-gray-50 border-gray-200 opacity-60'
                  : 'bg-white border-[#f3d374] hover:border-[#be9525] hover:shadow-md cursor-pointer'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    lesson.locked
                      ? 'bg-gray-300'
                      : 'bg-gradient-to-br from-[#be9525] to-[#f3d374]'
                  }`}
                >
                  {lesson.locked ? (
                    <Lock className="w-5 h-5 text-gray-600" />
                  ) : (
                    <Play className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold">{lesson.title}</h4>
                  <p className="text-sm text-gray-600">{lesson.duration}</p>
                </div>
              </div>
              {!lesson.locked && (
                <Button size="sm">Comenzar</Button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}