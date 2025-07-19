'use client';

import React, { useState, useEffect } from 'react';

interface User {
  name: string;
  level: number;
  xp: number;
  lives: number;
  streak: number;
  gems: number;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  xpReward: number;
  estimatedTime: number;
  isPremium: boolean;
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [user] = useState<User>({
    name: 'María González',
    level: 15,
    xp: 2450,
    lives: 4,
    streak: 7,
    gems: 150,
  });

  const [lessons] = useState<Lesson[]>([
    {
      id: '1',
      title: 'Saludos Básicos',
      description: 'Aprende a saludar en inglés',
      difficulty: 'Principiante',
      xpReward: 20,
      estimatedTime: 15,
      isPremium: false
    },
    {
      id: '2',
      title: 'Familia y Amigos',
      description: 'Vocabulario sobre relaciones personales',
      difficulty: 'Principiante',
      xpReward: 25,
      estimatedTime: 18,
      isPremium: false
    }
  ]);

  const [apiData, setApiData] = useState<any>(null);
  const [apiError, setApiError] = useState<string>('');

  useEffect(() => {
    setMounted(true);
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://learnlingo-platform.onrender.com/api';
    
    fetch(`${apiUrl}/database-test`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        setApiData(data);
        setApiError('');
      })
      .catch(err => {
        console.error('Error conectando con API:', err);
        setApiError(`Error: ${err.message}`);
      });
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-500">Cargando...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto p-6 pb-4">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl">👤</span>
              </div>
              <div>
                <h2 className="text-gray-900 font-semibold text-lg">{user.name}</h2>
                <p className="text-gray-500 text-sm">Nivel {user.level} • Inglés</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-3 rounded-xl border border-red-200">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-red-500">❤️</span>
                <span className="text-red-700 font-semibold text-sm">{user.lives}</span>
              </div>
              <p className="text-red-600 text-xs font-medium">Vidas</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded-xl border border-orange-200">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-orange-500">🔥</span>
                <span className="text-orange-700 font-semibold text-sm">{user.streak}</span>
              </div>
              <p className="text-orange-600 text-xs font-medium">Racha</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-blue-500">⭐</span>
                <span className="text-blue-700 font-semibold text-sm">{user.gems}</span>
              </div>
              <p className="text-blue-600 text-xs font-medium">Gemas</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-3 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-emerald-500">🏆</span>
                <span className="text-emerald-700 font-semibold text-sm">{user.xp}</span>
              </div>
              <p className="text-emerald-600 text-xs font-medium">XP Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        {/* API Connection Status */}
        {apiData ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <h3 className="text-green-800 font-semibold mb-2">✅ Conectado con Backend</h3>
            <p className="text-green-700 text-sm">{apiData.message}</p>
            <p className="text-green-600 text-xs mt-1">
              Usuarios: {apiData.stats?.users} | Cursos: {apiData.stats?.courses}
            </p>
          </div>
        ) : apiError ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <h3 className="text-red-800 font-semibold mb-2">❌ Error de Conexión</h3>
            <p className="text-red-700 text-sm">{apiError}</p>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <h3 className="text-yellow-800 font-semibold mb-2">⏳ Conectando...</h3>
            <p className="text-yellow-700 text-sm">Conectando con el backend</p>
          </div>
        )}

        {/* Lessons */}
        <div className="mb-6">
          <h3 className="text-gray-900 text-xl font-semibold mb-6">Lecciones Disponibles</h3>
          
          <div className="space-y-4">
            {lessons.map((lesson) => (
              <div 
                key={lesson.id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-sm">
                    <span className="text-white text-2xl">📚</span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-semibold text-gray-900">{lesson.title}</h4>
                      <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                        {lesson.difficulty}
                      </div>
                      {lesson.isPremium && (
                        <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          PRO
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{lesson.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>⏱️ {lesson.estimatedTime} min</span>
                      <span>⭐ +{lesson.xpReward} XP</span>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
