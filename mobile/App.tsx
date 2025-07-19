import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Constants from 'expo-constants';

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

export default function App() {
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
    },
    {
      id: '3',
      title: 'Inglés de Negocios',
      description: 'Vocabulario profesional y empresarial',
      difficulty: 'Avanzado',
      xpReward: 50,
      estimatedTime: 30,
      isPremium: true
    }
  ]);

  const [apiData, setApiData] = useState<any>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    // Probar conexión con backend
    const apiUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api';
    
    fetch(`${apiUrl}/database-test`)
      .then(res => res.json())
      .then(data => {
        setApiData(data);
        setIsConnected(true);
      })
      .catch(err => {
        console.error('Error conectando con API:', err);
        setIsConnected(false);
      });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>👤</Text>
            </View>
            <View>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userLevel}>Nivel {user.level} • Inglés</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: '#fef2f2', borderColor: '#fecaca' }]}>
            <Text style={styles.statValue}>❤️ {user.lives}</Text>
            <Text style={[styles.statLabel, { color: '#dc2626' }]}>Vidas</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#fff7ed', borderColor: '#fed7aa' }]}>
            <Text style={styles.statValue}>🔥 {user.streak}</Text>
            <Text style={[styles.statLabel, { color: '#ea580c' }]}>Racha</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }]}>
            <Text style={styles.statValue}>⭐ {user.gems}</Text>
            <Text style={[styles.statLabel, { color: '#2563eb' }]}>Gemas</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }]}>
            <Text style={styles.statValue}>🏆 {user.xp}</Text>
            <Text style={[styles.statLabel, { color: '#16a34a' }]}>XP</Text>
          </View>
        </View>

        {/* Connection Status */}
        <View style={[
          styles.connectionCard,
          { backgroundColor: isConnected ? '#f0fdf4' : '#fef2f2' }
        ]}>
          <Text style={[
            styles.connectionTitle,
            { color: isConnected ? '#16a34a' : '#dc2626' }
          ]}>
            {isConnected ? '✅ Conectado con Backend' : '❌ Sin Conexión'}
          </Text>
          {apiData && (
            <Text style={styles.connectionText}>
              Usuarios: {apiData.stats?.users} | Cursos: {apiData.stats?.courses}
            </Text>
          )}
        </View>

        {/* Lessons */}
        <View style={styles.lessonsContainer}>
          <Text style={styles.sectionTitle}>Lecciones Disponibles</Text>
          
          {lessons.map((lesson) => (
            <TouchableOpacity key={lesson.id} style={styles.lessonCard}>
              <View style={styles.lessonIcon}>
                <Text style={styles.lessonIconText}>📚</Text>
              </View>
              
              <View style={styles.lessonContent}>
                <View style={styles.lessonHeader}>
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                  <View style={[
                    styles.difficultyBadge,
                    {
                      backgroundColor: lesson.difficulty === 'Principiante' ? '#dcfce7' : 
                                     lesson.difficulty === 'Intermedio' ? '#fef3c7' : '#fee2e2'
                    }
                  ]}>
                    <Text style={[
                      styles.difficultyText,
                      {
                        color: lesson.difficulty === 'Principiante' ? '#166534' : 
                               lesson.difficulty === 'Intermedio' ? '#92400e' : '#991b1b'
                      }
                    ]}>
                      {lesson.difficulty}
                    </Text>
                  </View>
                  {lesson.isPremium && (
                    <View style={styles.premiumBadge}>
                      <Text style={styles.premiumText}>PRO</Text>
                    </View>
                  )}
                </View>
                
                <Text style={styles.lessonDescription}>{lesson.description}</Text>
                
                <View style={styles.lessonMeta}>
                  <Text style={styles.metaText}>⏱️ {lesson.estimatedTime} min</Text>
                  <Text style={styles.metaText}>⭐ +{lesson.xpReward} XP</Text>
                </View>
              </View>
              
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    backgroundColor: '#374151',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    color: '#ffffff',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  userLevel: {
    fontSize: 14,
    color: '#6b7280',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  connectionCard: {
    margin: 20,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  connectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  connectionText: {
    fontSize: 12,
    color: '#6b7280',
  },
  lessonsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 20,
  },
  lessonCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  lessonIcon: {
    width: 56,
    height: 56,
    backgroundColor: '#374151',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  lessonIconText: {
    fontSize: 24,
  },
  lessonContent: {
    flex: 1,
  },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '500',
  },
  premiumBadge: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  premiumText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  lessonDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  lessonMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  arrow: {
    fontSize: 18,
    color: '#9ca3af',
  },
});