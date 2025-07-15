import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SkipForward, CheckCircle } from 'lucide-react';
import { BackButton } from '@/components/ui/back-button';
import { WorkoutCompletionDialog } from '@/components/ui/workout-completion-dialog';
import { toast } from 'sonner';

// Mock workout data - in real app this would come from Firebase
const mockWorkout = {
  id: '123',
  name: 'Treino A - Peito e Tríceps',
  exercises: [
    {
      id: 1,
      name: 'Supino Reto',
      videoUrl: 'https://www.youtube.com/embed/gRVjAtPip0Y',
      description: 'Exercício fundamental para desenvolvimento do peitoral maior. Deite no banco, mantenha os pés firmes no chão.',
      instructions: [
        'Deite no banco com os pés apoiados no chão',
        'Segure a barra com pegada um pouco mais larga que os ombros',
        'Desça a barra controladamente até o peito',
        'Empurre a barra de volta à posição inicial'
      ],
      sets: 4,
      reps: '8-12',
      muscleGroup: 'Peito'
    },
    {
      id: 2,
      name: 'Tríceps Testa',
      videoUrl: 'https://www.youtube.com/embed/d_KZxkY_0cM',
      description: 'Exercício isolado para tríceps, executado deitado no banco.',
      instructions: [
        'Deite no banco segurando a barra com pegada fechada',
        'Mantenha os braços perpendiculares ao corpo',
        'Flexione apenas os antebraços, descendo a barra até a testa',
        'Retorne à posição inicial estendendo os braços'
      ],
      sets: 3,
      reps: '10-15',
      muscleGroup: 'Tríceps'
    },
    {
      id: 3,
      name: 'Flexão de Braço',
      videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4',
      description: 'Exercício funcional que trabalha peito, ombros e tríceps.',
      instructions: [
        'Posicione as mãos no chão, um pouco mais largas que os ombros',
        'Mantenha o corpo alinhado da cabeça aos pés',
        'Desça o corpo até o peito quase tocar o chão',
        'Empurre o corpo de volta à posição inicial'
      ],
      sets: 3,
      reps: '15-20',
      muscleGroup: 'Peito'
    }
  ]
};

const WorkoutSession = () => {
  const { workoutId } = useParams();
  const navigate = useNavigate();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedSets, setCompletedSets] = useState<number[]>([]);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);

  const currentExercise = mockWorkout.exercises[currentExerciseIndex];
  const progress = ((currentExerciseIndex + 1) / mockWorkout.exercises.length) * 100;
  const isLastExercise = currentExerciseIndex === mockWorkout.exercises.length - 1;

  const handleNextExercise = () => {
    if (isLastExercise) {
      setShowCompletionDialog(true);
    } else {
      setCurrentExerciseIndex(prev => prev + 1);
      setCompletedSets([]);
    }
  };

  const handleSetComplete = (setIndex: number) => {
    if (!completedSets.includes(setIndex)) {
      setCompletedSets(prev => [...prev, setIndex]);
      toast.success(`Série ${setIndex + 1} concluída!`);
    }
  };

  const handleWorkoutComplete = (comments: string, rating: number) => {
    // TODO: Save to Firebase and notify trainer
    toast.success('Treino concluído com sucesso!');
    setTimeout(() => navigate('/trainee-dashboard'), 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-amfit-text-primary text-amfit-text-white p-4">
        <div className="flex items-center space-x-3">
          <BackButton 
            onClick={() => navigate('/trainee-dashboard')}
            className="text-white hover:bg-white/20" 
          />
          <div className="flex-1">
            <h1 className="text-xl font-montserrat font-bold">{mockWorkout.name}</h1>
            <p className="text-sm opacity-90">
              Exercício {currentExerciseIndex + 1} de {mockWorkout.exercises.length}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Exercise Content */}
      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="font-montserrat flex items-center justify-between">
              {currentExercise.name}
              <span className="text-sm text-amfit-text-secondary font-normal">
                {currentExercise.muscleGroup}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Video */}
            <div className="aspect-video rounded-lg overflow-hidden bg-black">
              <iframe
                src={currentExercise.videoUrl}
                title={currentExercise.name}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Descrição</h3>
              <p className="text-amfit-text-secondary">{currentExercise.description}</p>
            </div>

            {/* Instructions */}
            <div>
              <h3 className="font-semibold mb-2">Como executar</h3>
              <ol className="list-decimal list-inside space-y-1 text-amfit-text-secondary">
                {currentExercise.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>

            {/* Sets and Reps */}
            <div className="bg-amfit-button/10 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">Séries e Repetições</h3>
                <span className="text-amfit-text-secondary">
                  {currentExercise.sets} x {currentExercise.reps}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: currentExercise.sets }, (_, index) => (
                  <Button
                    key={index}
                    variant={completedSets.includes(index) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSetComplete(index)}
                    className={completedSets.includes(index) ? "bg-green-500 hover:bg-green-600" : ""}
                  >
                    {completedSets.includes(index) ? (
                      <CheckCircle className="w-4 h-4 mr-1" />
                    ) : null}
                    Série {index + 1}
                  </Button>
                ))}
              </div>
            </div>

            {/* Next Exercise Button */}
            <Button
              onClick={handleNextExercise}
              variant="amfit"
              size="amfit"
              className="w-full"
              disabled={completedSets.length === 0}
            >
              <SkipForward className="w-5 h-5 mr-2" />
              {isLastExercise ? 'Finalizar Treino' : 'Próximo Exercício'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Workout Completion Dialog */}
      <WorkoutCompletionDialog
        open={showCompletionDialog}
        onOpenChange={setShowCompletionDialog}
        onSubmit={handleWorkoutComplete}
      />
    </div>
  );
};

export default WorkoutSession;