import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Dumbbell, Clock, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface Workout {
  id: string;
  name: string;
  description: string;
  exercises: string[];
  studentId: string;
  studentName: string;
  trainerId: string;
  createdAt: Date;
  status: 'agendado' | 'concluido' | 'cancelado';
}

interface SimpleWorkoutCreatorProps {
  studentId: string;
  studentName: string;
  onWorkoutCreated: () => void;
}

export const SimpleWorkoutCreator = ({ studentId, studentName, onWorkoutCreated }: SimpleWorkoutCreatorProps) => {
  const [workoutName, setWorkoutName] = useState('');
  const [workoutDescription, setWorkoutDescription] = useState('');
  const [exercises, setExercises] = useState<string[]>(['']);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<string | null>(null);

  // Buscar treinos do aluno
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const workoutsQuery = query(
      collection(db, 'workouts'),
      where('studentId', '==', studentId),
      where('trainerId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(workoutsQuery, (snapshot) => {
      const workoutsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Workout[];
      
      setWorkouts(workoutsList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    });

    return () => unsubscribe();
  }, [studentId]);

  const addExerciseField = () => {
    setExercises([...exercises, '']);
  };

  const updateExercise = (index: number, value: string) => {
    const newExercises = [...exercises];
    newExercises[index] = value;
    setExercises(newExercises);
  };

  const removeExercise = (index: number) => {
    const newExercises = exercises.filter((_, i) => i !== index);
    setExercises(newExercises);
  };

  const handleCreateWorkout = async () => {
    if (!workoutName.trim()) {
      toast.error('Nome do treino é obrigatório');
      return;
    }

    const validExercises = exercises.filter(ex => ex.trim() !== '');
    if (validExercises.length === 0) {
      toast.error('Adicione pelo menos um exercício');
      return;
    }

    setLoading(true);
    
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Usuário não autenticado');

      const workout = {
        name: workoutName,
        description: workoutDescription,
        exercises: validExercises,
        studentId,
        studentName,
        trainerId: user.uid,
        createdAt: new Date(),
        status: 'agendado' as const
      };

      await addDoc(collection(db, 'workouts'), workout);
      
      toast.success('Treino criado com sucesso!');
      
      // Reset form
      setWorkoutName('');
      setWorkoutDescription('');
      setExercises(['']);
      onWorkoutCreated();
      
    } catch (error) {
      console.error('Erro ao criar treino:', error);
      toast.error('Erro ao criar treino');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWorkout = async (workoutId: string) => {
    try {
      await deleteDoc(doc(db, 'workouts', workoutId));
      toast.success('Treino removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover treino:', error);
      toast.error('Erro ao remover treino');
    }
  };

  const handleUpdateStatus = async (workoutId: string, newStatus: 'agendado' | 'concluido' | 'cancelado') => {
    try {
      await updateDoc(doc(db, 'workouts', workoutId), {
        status: newStatus,
        updatedAt: new Date()
      });
      toast.success('Status atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'agendado':
        return <Badge className="bg-blue-100 text-blue-800">Agendado</Badge>;
      case 'concluido':
        return <Badge className="bg-green-100 text-green-800">Concluído</Badge>;
      case 'cancelado':
        return <Badge variant="secondary">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Formulário de Criação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Criar Novo Treino - {studentName}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workoutName">Nome do Treino *</Label>
            <Input
              id="workoutName"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              placeholder="Ex: Treino A - Peito e Tríceps"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="workoutDescription">Descrição (opcional)</Label>
            <Textarea
              id="workoutDescription"
              value={workoutDescription}
              onChange={(e) => setWorkoutDescription(e.target.value)}
              placeholder="Observações sobre o treino..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Exercícios *</Label>
            {exercises.map((exercise, index) => (
              <div key={index} className="flex space-x-2">
                <Input
                  value={exercise}
                  onChange={(e) => updateExercise(index, e.target.value)}
                  placeholder={`Exercício ${index + 1} (ex: Supino reto 3x12)`}
                  className="flex-1"
                />
                {exercises.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeExercise(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addExerciseField}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Exercício
            </Button>
          </div>

          <Button 
            onClick={handleCreateWorkout} 
            className="w-full bg-black hover:bg-gray-800 text-white"
            disabled={loading}
          >
            {loading ? 'Criando...' : 'Criar Treino'}
          </Button>
        </CardContent>
      </Card>

      {/* Lista de Treinos */}
      {workouts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Dumbbell className="w-5 h-5" />
              <span>Treinos de {studentName}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workouts.map((workout) => (
                <div key={workout.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{workout.name}</h4>
                      {getStatusBadge(workout.status)}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        {formatDate(workout.createdAt)}
                      </span>
                    </div>
                  </div>

                  {workout.description && (
                    <p className="text-sm text-gray-600">{workout.description}</p>
                  )}

                  <div className="space-y-1">
                    <p className="text-sm font-medium">Exercícios:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {workout.exercises.map((exercise, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-2 h-2 bg-gray-400 rounded-full mr-2" />
                          {exercise}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex space-x-2">
                    {workout.status === 'agendado' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(workout.id, 'concluido')}
                          className="text-green-600 hover:text-green-700"
                        >
                          Marcar como Concluído
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(workout.id, 'cancelado')}
                          className="text-orange-600 hover:text-orange-700"
                        >
                          Cancelar
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteWorkout(workout.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};