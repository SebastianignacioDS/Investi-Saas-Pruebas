import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Hero() {
  return (
    <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-full">
              ✨ New features available now
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Build faster with{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                powerful tools
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-lg">
              Transform your workflow with our comprehensive platform designed for modern teams.
              Collaborate seamlessly and achieve more together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="group">
                Start Free Trial
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </div>
            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="font-semibold">10,000+</div>
                <div className="text-gray-600">Active Users</div>
              </div>
              <div className="h-12 w-px bg-gray-300" />
              <div>
                <div className="font-semibold">4.9/5</div>
                <div className="text-gray-600">Rating</div>
              </div>
              <div className="h-12 w-px bg-gray-300" />
              <div>
                <div className="font-semibold">99.9%</div>
                <div className="text-gray-600">Uptime</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl blur-3xl opacity-20" />
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1718220216044-006f43e3a9b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b3Jrc3BhY2UlMjBwcm9kdWN0aXZpdHl8ZW58MXx8fHwxNzY2MzYxODk3fDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Dashboard Preview"
              className="relative rounded-2xl shadow-2xl w-full object-cover aspect-[4/3]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
