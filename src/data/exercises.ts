export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroup: string;
  videoUrl: string;
  instructions: string[];
  defaultSets?: number;
  defaultReps?: string;
}

export const exerciseDatabase: Exercise[] = [
  {
    id: 'supino-reto',
    name: 'Supino Reto',
    description: 'Exercício para peito com barra',
    muscleGroup: 'Peito',
    videoUrl: 'https://www.youtube.com/embed/gRVjAtPip0Y',
    instructions: [
      'Deite no banco com os pés firmes no chão',
      'Segure a barra com pegada um pouco mais larga que os ombros',
      'Desça a barra controladamente até o peito',
      'Empurre de volta à posição inicial'
    ],
    defaultSets: 4,
    defaultReps: '8-12'
  },
  {
    id: 'supino-inclinado',
    name: 'Supino Inclinado',
    description: 'Exercício para peito superior',
    muscleGroup: 'Peito',
    videoUrl: 'https://www.youtube.com/embed/DbFgADa2IwE',
    instructions: [
      'Ajuste o banco em 30-45 graus',
      'Deite e posicione os pés firmes',
      'Segure a barra e desça controladamente',
      'Empurre de volta concentrando no peito superior'
    ],
    defaultSets: 3,
    defaultReps: '10-15'
  },
  {
    id: 'agachamento',
    name: 'Agachamento',
    description: 'Exercício fundamental para pernas',
    muscleGroup: 'Pernas',
    videoUrl: 'https://www.youtube.com/embed/Dy28eq2PjcM',
    instructions: [
      'Fique em pé com os pés na largura dos ombros',
      'Desça como se fosse sentar numa cadeira',
      'Mantenha o peito erguido e joelhos alinhados',
      'Volte à posição inicial empurrando pelos calcanhares'
    ],
    defaultSets: 4,
    defaultReps: '12-15'
  },
  {
    id: 'deadlift',
    name: 'Levantamento Terra',
    description: 'Exercício completo para posterior',
    muscleGroup: 'Costas',
    videoUrl: 'https://www.youtube.com/embed/ytGaGIn3SjE',
    instructions: [
      'Posicione os pés na largura dos quadris',
      'Segure a barra com pegada dupla',
      'Mantenha as costas retas',
      'Levante empurrando o chão com os pés'
    ],
    defaultSets: 4,
    defaultReps: '6-8'
  },
  {
    id: 'puxada-frontal',
    name: 'Puxada Frontal',
    description: 'Exercício para latíssimo do dorso',
    muscleGroup: 'Costas',
    videoUrl: 'https://www.youtube.com/embed/CAwf7n6Luuc',
    instructions: [
      'Sente na máquina com as coxas presas',
      'Segure a barra com pegada larga',
      'Puxe até a altura do peito',
      'Controle a volta à posição inicial'
    ],
    defaultSets: 4,
    defaultReps: '8-12'
  },
  {
    id: 'remada-sentada',
    name: 'Remada Sentada',
    description: 'Exercício para meio das costas',
    muscleGroup: 'Costas',
    videoUrl: 'https://www.youtube.com/embed/GZbfZ033f74',
    instructions: [
      'Sente com os pés na plataforma',
      'Segure o cabo com postura ereta',
      'Puxe em direção ao abdômen',
      'Concentre a contração nas omoplatas'
    ],
    defaultSets: 3,
    defaultReps: '10-15'
  },
  {
    id: 'rosca-direta',
    name: 'Rosca Direta',
    description: 'Exercício para bíceps',
    muscleGroup: 'Bíceps',
    videoUrl: 'https://www.youtube.com/embed/ykJmrZ5v0Oo',
    instructions: [
      'Fique em pé com halteres nas mãos',
      'Mantenha os cotovelos colados ao corpo',
      'Flexione os braços contraindo o bíceps',
      'Desça controladamente'
    ],
    defaultSets: 3,
    defaultReps: '12-15'
  },
  {
    id: 'triceps-testa',
    name: 'Tríceps Testa',
    description: 'Exercício isolado para tríceps',
    muscleGroup: 'Tríceps',
    videoUrl: 'https://www.youtube.com/embed/d_KZxkY_0cM',
    instructions: [
      'Deite no banco com halteres ou barra',
      'Mantenha os cotovelos fixos',
      'Desça até próximo da testa',
      'Estenda concentrando no tríceps'
    ],
    defaultSets: 3,
    defaultReps: '12-15'
  },
  {
    id: 'desenvolvimento-ombros',
    name: 'Desenvolvimento de Ombros',
    description: 'Exercício para deltoides',
    muscleGroup: 'Ombros',
    videoUrl: 'https://www.youtube.com/embed/qEwKCR5JCog',
    instructions: [
      'Sente com as costas apoiadas',
      'Segure os halteres na altura dos ombros',
      'Empurre para cima até estender os braços',
      'Desça controladamente'
    ],
    defaultSets: 3,
    defaultReps: '10-12'
  },
  {
    id: 'abdominal-tradicional',
    name: 'Abdominal Tradicional',
    description: 'Exercício básico para abdômen',
    muscleGroup: 'Abdômen',
    videoUrl: 'https://www.youtube.com/embed/jDwoBqPH0jk',
    instructions: [
      'Deite com joelhos flexionados',
      'Mãos atrás da cabeça sem puxar o pescoço',
      'Contraia o abdômen e suba o tronco',
      'Desça controladamente'
    ],
    defaultSets: 3,
    defaultReps: '15-20'
  }
];

export const muscleGroups = [
  'Peito',
  'Costas', 
  'Pernas',
  'Ombros',
  'Bíceps',
  'Tríceps',
  'Abdômen'
];

export function getExercisesByMuscleGroup(muscleGroup: string): Exercise[] {
  return exerciseDatabase.filter(exercise => exercise.muscleGroup === muscleGroup);
}

export function getExerciseById(id: string): Exercise | undefined {
  return exerciseDatabase.find(exercise => exercise.id === id);
}