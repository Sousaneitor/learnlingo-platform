// seed.js - Datos iniciales para LearnLingo
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Creando datos iniciales...');

  // Crear curso de inglés
  const englishCourse = await prisma.course.create({
    data: {
      name: 'Inglés',
      description: 'Aprende inglés desde cero hasta nivel avanzado',
      language: 'en',
      flag: '🇺🇸',
      difficulty: 'BEGINNER',
      order: 1
    }
  });

  console.log('📚 Curso creado:', englishCourse.name);

  // Crear lecciones
  const lessons = [
    {
      title: 'Saludos Básicos',
      description: 'Aprende a saludar en inglés',
      difficulty: 'BEGINNER',
      xpReward: 20,
      estimatedTime: 15,
      order: 1,
      isPremium: false
    },
    {
      title: 'Familia y Amigos',
      description: 'Vocabulario sobre relaciones personales',
      difficulty: 'BEGINNER', 
      xpReward: 25,
      estimatedTime: 18,
      order: 2,
      isPremium: false
    },
    {
      title: 'Inglés de Negocios',
      description: 'Vocabulario profesional y empresarial',
      difficulty: 'ADVANCED',
      xpReward: 50,
      estimatedTime: 30,
      order: 3,
      isPremium: true
    }
  ];

  for (const lessonData of lessons) {
    const lesson = await prisma.lesson.create({
      data: {
        ...lessonData,
        courseId: englishCourse.id
      }
    });

    // Crear preguntas para cada lección
    await prisma.question.create({
      data: {
        lessonId: lesson.id,
        type: 'MULTIPLE_CHOICE',
        question: '¿Cómo se dice "Hola" en inglés?',
        options: ['Hello', 'Goodbye', 'Thank you', 'Please'],
        correctAnswer: 0,
        explanation: '"Hello" es la forma más común de saludar en inglés.',
        points: 10,
        order: 1
      }
    });

    console.log('📝 Lección creada:', lesson.title);
  }

  // Crear usuario de prueba
  const hashedPassword = await bcrypt.hash('password123', 12);
  const testUser = await prisma.user.create({
    data: {
      email: 'test@learnlingo.app',
      password: hashedPassword,
      name: 'Usuario de Prueba',
      preferredLanguage: 'es',
      profile: {
        create: {
          bio: 'Aprendiendo idiomas con LearnLingo',
          studyGoal: 5
        }
      },
      subscription: {
        create: {
          planType: 'FREE',
          isActive: true
        }
      }
    }
  });

  console.log('👤 Usuario de prueba creado:', testUser.email);
  console.log('✅ Datos iniciales creados exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });