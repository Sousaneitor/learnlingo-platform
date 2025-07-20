'use client';

import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Flame, 
  Star, 
  Trophy, 
  User, 
  Settings, 
  Book, 
  Play,
  Lock,
  CheckCircle,
  Calendar,
  TrendingUp,
  Target,
  Award,
  Zap,
  Crown,
  Users,
  MessageCircle,
  Volume2,
  Moon,
  Sun,
  Mic,
  MicOff,
  Pause,
  SkipForward,
  RotateCcw,
  Send,
  Bot,
  BarChart3,
  PieChart,
  Activity,
  Gamepad2,
  Sword,
  Shield,
  Gem,
  Timer,
  Volume1,
  VolumeX,
  Headphones,
  Brain,
  Lightbulb,
  Rocket,
  Sparkles,
  ChevronRight,
  X,
  Plus,
  Minus,
  ArrowLeft,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

interface User {
  name: string;
  level: number;
  xp: number;
  lives: number;
  streak: number;
  gems: number;
  currentCourse: string;
  completedLessons: number;
  totalLessons: number;
  studyStreak: number;
  rank: string;
  battleWins: number;
  battleLosses: number;
  accuracy: number;
  studyTime: number;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  xpReward: number;
  estimatedTime: number;
  isPremium: boolean;
  isCompleted: boolean;
  isLocked: boolean;
  progress: number;
  category: string;
  exercises: Exercise[];
  audioUrl?: string;
}

interface Exercise {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'pronunciation' | 'listening' | 'translation';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  audioUrl?: string;
  explanation?: string;
  points: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  target: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'correction' | 'tip' | 'exercise';
}

interface BattlePlayer {
  id: string;
  name: string;
  level: number;
  avatar: string;
  score: number;
  accuracy: number;
}

export default function UltimateLearnLingo() {
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('learn');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [lessonStarted, setLessonStarted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [aiTyping, setAiTyping] = useState(false);
  const [battleMode, setBattleMode] = useState(false);
  const [battleOpponent, setBattleOpponent] = useState<BattlePlayer | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  const [user] = useState<User>({
    name: 'María González',
    level: 15,
    xp: 2450,
    lives: 4,
    streak: 7,
    gems: 150,
    currentCourse: 'Inglés Avanzado',
    completedLessons: 23,
    totalLessons: 40,
    studyStreak: 12,
    rank: 'Gold League',
    battleWins: 8,
    battleLosses: 2,
    accuracy: 87,
    studyTime: 1420 // minutes
  });

  const [lessons] = useState<Lesson[]>([
    {
      id: '1',
      title: 'Past Perfect Mastery',
      description: 'Master advanced grammar with interactive exercises',
      difficulty: 'Avanzado',
      xpReward: 50,
      estimatedTime: 25,
      isPremium: false,
      isCompleted: true,
      isLocked: false,
      progress: 100,
      category: 'Grammar',
      audioUrl: '/audio/past-perfect-intro.mp3',
      exercises: [
        {
          id: 'ex1',
          type: 'multiple-choice',
          question: 'Choose the correct Past Perfect form:',
          options: ['I had studied', 'I have studied', 'I was studying', 'I studied'],
          correctAnswer: 0,
          explanation: 'Past Perfect uses "had" + past participle',
          points: 10
        },
        {
          id: 'ex2',
          type: 'pronunciation',
          question: 'Pronounce: "I had finished my homework before dinner"',
          correctAnswer: 'pronunciation-score',
          audioUrl: '/audio/pronunciation-example.mp3',
          points: 15
        }
      ]
    },
    {
      id: '2',
      title: 'Business Presentations Pro',
      description: 'Professional communication with AI feedback',
      difficulty: 'Avanzado',
      xpReward: 75,
      estimatedTime: 35,
      isPremium: true,
      isCompleted: false,
      isLocked: false,
      progress: 45,
      category: 'Speaking',
      exercises: [
        {
          id: 'ex3',
          type: 'fill-blank',
          question: 'Complete: "Let me _____ the key points of our proposal"',
          correctAnswer: 'summarize',
          points: 12
        }
      ]
    }
  ]);

  const [achievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'Grammar Genius',
      description: 'Perfect score in 10 grammar exercises',
      icon: '🧠',
      unlocked: true,
      progress: 10,
      target: 10,
      rarity: 'epic'
    },
    {
      id: '2',
      title: 'Speed Demon',
      description: 'Complete lesson under 10 minutes',
      icon: '⚡',
      unlocked: false,
      progress: 3,
      target: 5,
      rarity: 'rare'
    },
    {
      id: '3',
      title: 'Battle Champion',
      description: 'Win 10 vocabulary battles',
      icon: '⚔️',
      unlocked: false,
      progress: 8,
      target: 10,
      rarity: 'legendary'
    }
  ]);

  useEffect(() => {
    setMounted(true);
    
    // Initialize chat with AI welcome message
    setChatMessages([
      {
        id: '1',
        content: '¡Hola! Soy tu tutor de IA. ¿En qué puedo ayudarte hoy? 🤖✨',
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      }
    ]);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const startLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setCurrentExercise(0);
    setLessonStarted(true);
  };

  const nextExercise = () => {
    if (selectedLesson && currentExercise < selectedLesson.exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
    } else {
      // Lesson completed
      setLessonStarted(false);
      setSelectedLesson(null);
      setCurrentExercise(0);
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: chatInput,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setAiTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(chatInput),
        sender: 'ai',
        timestamp: new Date(),
        type: Math.random() > 0.7 ? 'tip' : 'text'
      };
      
      setChatMessages(prev => [...prev, aiResponse]);
      setAiTyping(false);
    }, 1500);
  };

  const getAIResponse = (input: string): string => {
    const responses = [
      "¡Excelente pregunta! Vamos a practicar eso juntos. 💪",
      "Te recomiendo enfocarte en la pronunciación. ¿Quieres que practiquemos? 🎯",
      "Ese es un error común. La clave está en... 🔑",
      "¡Perfecto! Has mejorado mucho en esa área. Sigamos con el siguiente nivel. 🚀",
      "Analicemos esa estructura gramatical paso a paso. 📚"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const startBattle = () => {
    setBattleMode(true);
    setBattleOpponent({
      id: '1',
      name: 'Alex Johnson',
      level: 14,
      avatar: '👨‍💼',
      score: 0,
      accuracy: 85
    });
  };

  const getRarityColor = (rarity: string) => {
    switch(rarity) {
      case 'common': return 'border-gray-300 bg-gray-50';
      case 'rare': return 'border-blue-300 bg-blue-50';
      case 'epic': return 'border-purple-300 bg-purple-50';
      case 'legendary': return 'border-yellow-300 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <div className="text-gray-600 font-medium">Cargando LearnLingo Ultimate...</div>
        </div>
      </div>
    );
  }

  const themeClasses = darkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-gray-900';

  // Lesson Player Modal
  if (lessonStarted && selectedLesson) {
    const exercise = selectedLesson.exercises[currentExercise];
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl`}>
          {/* Lesson Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">{selectedLesson.title}</h2>
              <p className="text-gray-500">
                Ejercicio {currentExercise + 1} de {selectedLesson.exercises.length}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={`p-3 rounded-xl ${audioEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'} hover:scale-105 transition-all`}
              >
                {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
              <button
                onClick={() => {
                  setLessonStarted(false);
                  setSelectedLesson(null);
                }}
                className="p-3 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span>Progreso</span>
              <span>{Math.round((currentExercise / selectedLesson.exercises.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(currentExercise / selectedLesson.exercises.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Exercise Content */}
          <div className="mb-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">{exercise.question}</h3>
              {exercise.audioUrl && (
                <button className="mx-auto flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-all">
                  <Headphones className="w-4 h-4" />
                  Escuchar
                </button>
              )}
            </div>

            {/* Exercise Types */}
            {exercise.type === 'multiple-choice' && exercise.options && (
              <div className="grid gap-3">
                {exercise.options.map((option, index) => (
                  <button
                    key={index}
                    className={`p-4 rounded-xl border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left ${darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : ''}`}
                  >
                    <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </button>
                ))}
              </div>
            )}

            {exercise.type === 'fill-blank' && (
              <div className="text-center">
                <input
                  type="text"
                  placeholder="Escribe tu respuesta..."
                  className={`w-full max-w-md px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none text-center text-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                />
              </div>
            )}

            {exercise.type === 'pronunciation' && (
              <div className="text-center space-y-4">
                <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <p className="text-lg mb-4">{exercise.question}</p>
                  <button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                      isRecording 
                        ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                        : 'bg-indigo-500 hover:bg-indigo-600'
                    } text-white shadow-lg hover:scale-105`}
                  >
                    {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                  </button>
                  <p className="text-sm text-gray-500 mt-2">
                    {isRecording ? 'Grabando...' : 'Toca para grabar'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentExercise(Math.max(0, currentExercise - 1))}
              disabled={currentExercise === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              Anterior
            </button>

            <button
              onClick={nextExercise}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              {currentExercise === selectedLesson.exercises.length - 1 ? 'Completar' : 'Siguiente'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* AI Feedback */}
          <div className={`mt-6 p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-blue-50'} border ${darkMode ? 'border-gray-600' : 'border-blue-200'}`}>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-sm mb-1">AI Tutor</p>
                <p className="text-sm">¡Excelente trabajo! Tu pronunciación ha mejorado un 15% desde la última vez. 🎉</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Battle Mode Modal
  if (battleMode && battleOpponent) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-8 max-w-4xl w-full shadow-2xl`}>
          {/* Battle Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">⚔️ Batalla de Vocabulario</h2>
            <p className="text-gray-500">¡Responde más rápido que tu oponente!</p>
          </div>

          {/* Players */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Player 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl">
                👩‍💼
              </div>
              <h3 className="font-bold">{user.name}</h3>
              <p className="text-sm text-gray-500">Nivel {user.level}</p>
              <div className="mt-2 px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                Puntos: 450
              </div>
            </div>

            {/* VS */}
            <div className="flex items-center justify-center">
              <div className="text-4xl font-bold text-red-500 animate-pulse">VS</div>
            </div>

            {/* Player 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl">
                {battleOpponent.avatar}
              </div>
              <h3 className="font-bold">{battleOpponent.name}</h3>
              <p className="text-sm text-gray-500">Nivel {battleOpponent.level}</p>
              <div className="mt-2 px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                Puntos: 380
              </div>
            </div>
          </div>

          {/* Battle Question */}
          <div className="text-center mb-8">
            <div className="mb-4 flex justify-center">
              <div className="px-4 py-2 bg-yellow-100 text-yellow-600 rounded-full font-medium">
                ⏰ Tiempo: 15s
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-6">¿Cuál es el significado de "Serendipity"?</h3>
            
            <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
              {[
                'Casualidad afortunada',
                'Tristeza profunda',
                'Momento de inspiración',
                'Sensación de nostalgia'
              ].map((option, index) => (
                <button
                  key={index}
                  className="p-4 rounded-xl border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left font-medium"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Battle Actions */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setBattleMode(false)}
              className="px-6 py-3 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
            >
              Rendirse
            </button>
            <button className="px-6 py-3 rounded-xl bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-all">
              Usar Power-up ⚡
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${themeClasses}`}>
      {/* Header */}
      <div className={`backdrop-blur-xl ${darkMode ? 'bg-gray-800/70' : 'bg-white/70'} shadow-lg border-b ${darkMode ? 'border-gray-700' : 'border-white/20'} sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Crown className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {user.name}
                </h2>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} font-medium`}>
                  Nivel {user.level} • {user.rank}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-24 bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full transition-all duration-1000"
                      style={{ width: `${(user.xp % 100)}%` }}
                    ></div>
                  </div>
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {user.xp % 100}/100 XP
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAnalytics(true)}
                className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'} shadow-lg transition-all duration-200 hover:scale-105`}
              >
                <BarChart3 className="w-5 h-5" />
              </button>
              <button
                onClick={startBattle}
                className={`p-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg transition-all duration-200 hover:scale-105`}
              >
                <Sword className="w-5 h-5" />
              </button>
              <button
                onClick={toggleDarkMode}
                className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'} shadow-lg transition-all duration-200 hover:scale-105`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: Heart, value: user.lives, label: 'Vidas', color: 'from-red-500 to-pink-500', bgColor: 'from-red-50 to-pink-50' },
              { icon: Flame, value: user.streak, label: 'Racha', color: 'from-orange-500 to-red-500', bgColor: 'from-orange-50 to-red-50' },
              { icon: Gem, value: user.gems, label: 'Gemas', color: 'from-blue-500 to-indigo-500', bgColor: 'from-blue-50 to-indigo-50' },
              { icon: Trophy, value: user.xp, label: 'XP Total', color: 'from-emerald-500 to-green-500', bgColor: 'from-emerald-50 to-green-50' },
              { icon: Sword, value: `${user.battleWins}W`, label: 'Batallas', color: 'from-purple-500 to-indigo-500', bgColor: 'from-purple-50 to-indigo-50' }
            ].map((stat, index) => (
              <div 
                key={index}
                className={`${darkMode ? 'bg-gray-800/50' : `bg-gradient-to-br ${stat.bgColor}`} backdrop-blur-sm p-4 rounded-2xl border ${darkMode ? 'border-gray-700' : 'border-white/20'} shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group cursor-pointer`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                    <stat.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-lg">{stat.value}</span>
                </div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Learning Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Daily Challenge Banner */}
            <div className={`${darkMode ? 'bg-gradient-to-r from-purple-900 to-indigo-900' : 'bg-gradient-to-r from-purple-600 to-indigo-600'} rounded-2xl p-6 text-white shadow-xl`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">🎯 Desafío Diario</h3>
                  <p className="opacity-90">Completa 3 lecciones y gana 100 gemas extra</p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="w-32 bg-white/20 rounded-full h-2">
                      <div className="bg-white h-2 rounded-full w-2/3"></div>
                    </div>
                    <span className="text-sm">2/3</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">22:45</div>
                  <div className="text-sm opacity-75">Tiempo restante</div>
                </div>
              </div>
            </div>

            {/* Lessons Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Continúa Aprendiendo</h3>
                <div className="flex gap-2">
                  <button className={`px-4 py-2 rounded-xl ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} hover:bg-gray-200 transition-all text-sm`}>
                    Todas
                  </button>
                  <button className="px-4 py-2 rounded-xl bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-all text-sm">
                    Recomendadas
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                {lessons.map((lesson) => (
                  <div 
                    key={lesson.id}
                    className={`group ${darkMode ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-sm rounded-2xl p-6 shadow-xl border ${darkMode ? 'border-gray-700' : 'border-white/20'} hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]`}
                  >
                    <div className="flex items-center gap-6">
                      {/* Enhanced Lesson Icon */}
                      <div className="relative">
                        <div className={`w-20 h-20 rounded-2xl ${
                          lesson.category === 'Grammar' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' :
                          lesson.category === 'Speaking' ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
                          'bg-gradient-to-br from-purple-500 to-pink-600'
                        } flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                          {lesson.isCompleted ? (
                            <CheckCircle className="w-10 h-10 text-white" />
                          ) : (
                            <Play className="w-10 h-10 text-white" />
                          )}
                        </div>
                        
                        {/* AI Difficulty Indicator */}
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                          <Brain className="w-4 h-4 text-white" />
                        </div>
                        
                        {/* Progress Ring */}
                        {lesson.progress > 0 && lesson.progress < 100 && (
                          <div className="absolute -bottom-2 -right-2">
                            <div className="relative w-8 h-8">
                              <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" stroke="#e5e7eb" strokeWidth="2" fill="none" />
                                <circle 
                                  cx="12" cy="12" r="10" 
                                  stroke="#3b82f6" strokeWidth="2" fill="none"
                                  strokeDasharray={`${2 * Math.PI * 10}`}
                                  strokeDashoffset={`${2 * Math.PI * 10 * (1 - lesson.progress / 100)}`}
                                  className="transition-all duration-500"
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-bold text-blue-600">{lesson.progress}%</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Enhanced Lesson Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h4 className="font-bold text-lg">{lesson.title}</h4>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                            lesson.difficulty === 'Principiante' ? 'bg-green-100 text-green-700 border-green-200' :
                            lesson.difficulty === 'Intermedio' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                            'bg-red-100 text-red-700 border-red-200'
                          }`}>
                            {lesson.difficulty}
                          </div>
                          {lesson.isPremium && (
                            <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                              <Crown className="w-3 h-3" />
                              PRO
                            </div>
                          )}
                          <div className={`px-2 py-1 rounded-lg text-xs font-medium ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                            {lesson.category}
                          </div>
                        </div>
                        
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-3 text-sm`}>{lesson.description}</p>
                        
                        {/* Enhanced Lesson Stats */}
                        <div className="flex items-center gap-6 text-sm mb-4">
                          <div className="flex items-center gap-1">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            <span>+{lesson.xpReward} XP</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Timer className="w-4 h-4 text-blue-500" />
                            <span>{lesson.estimatedTime} min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Brain className="w-4 h-4 text-purple-500" />
                            <span>{lesson.exercises.length} ejercicios</span>
                          </div>
                          {lesson.isCompleted && (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span>Completado</span>
                            </div>
                          )}
                        </div>

                        {/* AI Recommendations */}
                        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-blue-50'} border ${darkMode ? 'border-gray-600' : 'border-blue-200'} mb-3`}>
                          <div className="flex items-center gap-2 text-sm">
                            <Lightbulb className="w-4 h-4 text-blue-500" />
                            <span className="font-medium">AI recomienda:</span>
                            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                              {lesson.difficulty === 'Avanzado' ? 'Practica pronunciación primero' : 'Perfecto para tu nivel actual'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Action Buttons */}
                      <div className="flex flex-col items-center gap-3">
                        <button 
                          onClick={() => startLesson(lesson)}
                          disabled={lesson.isLocked}
                          className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                            lesson.isLocked
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : lesson.isCompleted
                              ? darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl hover:scale-105'
                          }`}
                        >
                          {lesson.isCompleted ? (
                            <>
                              <RefreshCw className="w-4 h-4" />
                              Revisar
                            </>
                          ) : lesson.isLocked ? (
                            <>
                              <Lock className="w-4 h-4" />
                              Bloqueado
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4" />
                              {lesson.progress > 0 ? 'Continuar' : 'Empezar'}
                            </>
                          )}
                        </button>
                        
                        {/* Quick Actions */}
                        <div className="flex gap-2">
                          {lesson.audioUrl && (
                            <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}>
                              <Volume2 className="w-4 h-4" />
                            </button>
                          )}
                          <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}>
                            <BookMarkup className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - AI Chat & Features */}
          <div className="space-y-6">
            {/* AI Chat Tutor */}
            <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-sm rounded-2xl shadow-xl border ${darkMode ? 'border-gray-700' : 'border-white/20'} overflow-hidden`}>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <h4 className="font-bold flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  AI Tutor
                  <span className="ml-auto w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                </h4>
              </div>
              
              <div className="h-80 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((message) => (
                  <div 
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] p-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                        : message.type === 'tip'
                        ? darkMode ? 'bg-yellow-900/50 text-yellow-200' : 'bg-yellow-50 text-yellow-800'
                        : darkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      {message.type === 'tip' && (
                        <div className="flex items-center gap-1 mb-1">
                          <Lightbulb className="w-3 h-3" />
                          <span className="text-xs font-medium">Consejo</span>
                        </div>
                      )}
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-60 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {aiTyping && (
                  <div className="flex justify-start">
                    <div className={`p-3 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                    placeholder="Pregunta algo..."
                    className={`flex-1 px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'} focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm`}
                  />
                  <button
                    onClick={sendChatMessage}
                    disabled={!chatInput.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-sm rounded-2xl p-6 shadow-xl border ${darkMode ? 'border-gray-700' : 'border-white/20'}`}>
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-500" />
                Progreso Hoy
              </h4>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Lecciones</span>
                    <span className="font-medium">2/3</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full w-2/3"></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Tiempo de estudio</span>
                    <span className="font-medium">25/30 min</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full w-5/6"></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Precisión</span>
                    <span className="font-medium">{user.accuracy}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: `${user.accuracy}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Achievements */}
            <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-sm rounded-2xl p-6 shadow-xl border ${darkMode ? 'border-gray-700' : 'border-white/20'}`}>
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                Logros Recientes
              </h4>
              
              <div className="space-y-3">
                {achievements.slice(0, 3).map((achievement) => (
                  <div key={achievement.id} className={`p-3 rounded-xl border-2 ${getRarityColor(achievement.rarity)} ${achievement.unlocked ? 'opacity-100' : 'opacity-60'}`}>
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">{achievement.title}</h5>
                        <p className="text-xs text-gray-500">{achievement.description}</p>
                        <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                          <div 
                            className={`h-1 rounded-full ${achievement.unlocked ? 'bg-yellow-500' : 'bg-gray-400'}`}
                            style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Game Center */}
            <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-sm rounded-2xl p-6 shadow-xl border ${darkMode ? 'border-gray-700' : 'border-white/20'}`}>
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-purple-500" />
                Game Center
              </h4>
              
              <div className="space-y-3">
                <button
                  onClick={startBattle}
                  className="w-full p-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <Sword className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-medium">Batalla Rápida</div>
                      <div className="text-sm opacity-75">vs jugadores online</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button className="w-full p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-medium">Desafío Diario</div>
                      <div className="text-sm opacity-75">+100 gemas extra</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button className="w-full p-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-medium">Torneo Semanal</div>
                      <div className="text-sm opacity-75">Termina en 2 días</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Modal */}
      {showAnalytics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">📊 Análisis Avanzado</h2>
              <button
                onClick={() => setShowAnalytics(false)}
                className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Learning Curve */}
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-2xl p-6`}>
                <h3 className="font-bold text-lg mb-4">Curva de Aprendizaje</h3>
                <div className="h-40 flex items-end justify-between gap-2">
                  {[65, 72, 68, 85, 91, 87, 94].map((height, index) => (
                    <div key={index} className="flex-1 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-lg transition-all duration-1000 hover:from-indigo-600 hover:to-purple-600" style={{ height: `${height}%` }}></div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Lun</span>
                  <span>Mar</span>
                  <span>Mié</span>
                  <span>Jue</span>
                  <span>Vie</span>
                  <span>Sáb</span>
                  <span>Dom</span>
                </div>
              </div>

              {/* Study Time Distribution */}
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-2xl p-6`}>
                <h3 className="font-bold text-lg mb-4">Distribución de Tiempo</h3>
                <div className="space-y-3">
                  {[
                    { category: 'Grammar', time: 45, color: 'bg-blue-500' },
                    { category: 'Speaking', time: 30, color: 'bg-green-500' },
                    { category: 'Vocabulary', time: 35, color: 'bg-purple-500' },
                    { category: 'Listening', time: 25, color: 'bg-orange-500' }
                  ].map((item) => (
                    <div key={item.category}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.category}</span>
                        <span>{item.time}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className={`${item.color} h-2 rounded-full transition-all duration-1000`} style={{ width: `${item.time}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Metrics */}
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-2xl p-6`}>
                <h3 className="font-bold text-lg mb-4">Métricas de Rendimiento</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-500">{user.accuracy}%</div>
                    <div className="text-sm text-gray-500">Precisión</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-500">{Math.round(user.studyTime / 60)}h</div>
                    <div className="text-sm text-gray-500">Tiempo Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-500">{user.streak}</div>
                    <div className="text-sm text-gray-500">Racha Actual</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-500">{user.level}</div>
                    <div className="text-sm text-gray-500">Nivel</div>
                  </div>
                </div>
              </div>

              {/* AI Insights */}
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-2xl p-6`}>
                <h3 className="font-bold text-lg mb-4">Insights de IA</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Brain className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Fortaleza Detectada</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">Excelente progreso en gramática avanzada</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Recomendación</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">Practica más conversación para balancear habilidades</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Rocket className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Proyección</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">A este ritmo, alcanzarás nivel 20 en 3 semanas</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-30">
        <button className="w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-200 flex items-center justify-center group">
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className={`fixed bottom-0 left-0 right-0 ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-xl border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} md:hidden z-40`}>
        <div className="grid grid-cols-4 gap-1 p-2">
          {[
            { id: 'learn', icon: Book, label: 'Aprender' },
            { id: 'battle', icon: Sword, label: 'Batalla' },
            { id: 'progress', icon: TrendingUp, label: 'Progreso' },
            { id: 'profile', icon: User, label: 'Perfil' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'battle') startBattle();
                else if (tab.id === 'progress') setShowAnalytics(true);
                // Add other navigation logic here
              }}
              className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'text-indigo-600 bg-indigo-50'
                  : darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Power-ups and Boosters (Floating Panel) */}
      <div className="fixed top-1/2 left-6 transform -translate-y-1/2 z-30 hidden lg:block">
        <div className={`${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-xl rounded-2xl p-4 shadow-xl border ${darkMode ? 'border-gray-700' : 'border-white/20'}`}>
          <h5 className="font-bold text-sm mb-3">Power-ups</h5>
          <div className="space-y-2">
            <button className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-all group">
              <Zap className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            </button>
            <button className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-all group">
              <Heart className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
            <button className="w-12 h-12 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-all group">
              <Shield className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            </button>
            <button className="w-12 h-12 bg-gradient-to-r from-pink-400 to-red-500 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-all group">
              <Flame className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Notification Toast System */}
      <div className="fixed top-20 right-6 z-50 space-y-2">
        {/* Achievement Unlocked Toast */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-2xl border border-yellow-200 transform translate-x-full animate-[slideIn_0.5s_ease-out_forwards] max-w-sm`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h6 className="font-bold text-sm">¡Logro Desbloqueado!</h6>
              <p className="text-xs text-gray-600">Grammar Genius completado</p>
            </div>
          </div>
        </div>

        {/* XP Gained Toast */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-2xl border border-green-200 transform translate-x-full animate-[slideIn_0.5s_ease-out_0.2s_forwards] max-w-sm`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h6 className="font-bold text-sm">+50 XP Ganados</h6>
              <p className="text-xs text-gray-600">¡Excelente trabajo!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Streak Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 hidden">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-8 max-w-md w-full text-center shadow-2xl`}>
          <div className="text-6xl mb-4">🔥</div>
          <h2 className="text-2xl font-bold mb-2">¡Racha de {user.streak} días!</h2>
          <p className="text-gray-600 mb-6">¡Increíble constancia! Sigue así para mantener tu racha.</p>
          
          <div className="grid grid-cols-7 gap-2 mb-6">
            {Array.from({ length: 7 }, (_, i) => (
              <div 
                key={i}
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  i < user.streak 
                    ? 'bg-gradient-to-br from-orange-400 to-red-500 text-white' 
                    : 'bg-gray-200'
                }`}
              >
                {i < user.streak && <Flame className="w-4 h-4" />}
              </div>
            ))}
          </div>
          
          <button className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all">
            ¡Continuar Aprendiendo!
          </button>
        </div>
      </div>

      {/* Voice Recognition Feedback */}
      <div className="fixed bottom-24 right-6 z-30 hidden">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-2xl border ${darkMode ? 'border-gray-700' : 'border-white/20'} max-w-xs`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
              <Mic className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium text-sm">Análisis de Pronunciación</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Claridad</span>
              <span className="font-medium">92%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div className="bg-green-500 h-1 rounded-full w-[92%]"></div>
            </div>
            
            <div className="flex justify-between text-xs">
              <span>Velocidad</span>
              <span className="font-medium">Perfect</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div className="bg-blue-500 h-1 rounded-full w-full"></div>
            </div>
            
            <div className="flex justify-between text-xs">
              <span>Acento</span>
              <span className="font-medium">85%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div className="bg-purple-500 h-1 rounded-full w-[85%]"></div>
            </div>
          </div>
          
          <div className="mt-3 text-xs text-gray-600">
            💡 Consejo: Pronuncia "th" con más claridad
          </div>
        </div>
      </div>

      {/* Daily Goal Progress */}
      <div className="fixed top-32 left-6 z-30 hidden lg:block">
        <div className={`${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-xl rounded-2xl p-4 shadow-xl border ${darkMode ? 'border-gray-700' : 'border-white/20'} max-w-xs`}>
          <h5 className="font-bold text-sm mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-500" />
            Meta Diaria
          </h5>
          
          <div className="relative w-20 h-20 mx-auto mb-3">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="#e5e7eb" strokeWidth="2" fill="none" />
              <circle 
                cx="12" cy="12" r="10" 
                stroke="#3b82f6" strokeWidth="2" fill="none"
                strokeDasharray={`${2 * Math.PI * 10}`}
                strokeDashoffset={`${2 * Math.PI * 10 * (1 - 0.67)}`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold">67%</span>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-gray-600">2 de 3 lecciones</p>
            <p className="text-xs font-medium">¡Solo una más!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Fix for BookMarkup component - use Book instead
const BookMarkup = Book;
