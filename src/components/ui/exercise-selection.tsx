import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Play, Plus, X } from 'lucide-react';
import { Exercise, exerciseDatabase, muscleGroups, getExercisesByMuscleGroup } from '@/data/exercises';

interface ExerciseSelectionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExerciseSelect: (exercise: Exercise, sets: number, reps: string) => void;
}

export function ExerciseSelection({ open, onOpenChange, onExerciseSelect }: ExerciseSelectionProps) {
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState('12-15');
  const [showVideoDialog, setShowVideoDialog] = useState(false);

  const handleExerciseClick = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setSets(exercise.defaultSets || 3);
    setReps(exercise.defaultReps || '12-15');
  };

  const handleAddExercise = () => {
    if (selectedExercise) {
      onExerciseSelect(selectedExercise, sets, reps);
      setSelectedExercise(null);
      setSelectedMuscleGroup('');
      onOpenChange(false);
    }
  };

  const exercisesToShow = selectedMuscleGroup 
    ? getExercisesByMuscleGroup(selectedMuscleGroup)
    : exerciseDatabase;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Selecionar Exercício</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Muscle Group Filter */}
            <div>
              <Label className="text-sm font-medium">Grupo Muscular:</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                <Button
                  variant={selectedMuscleGroup === '' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedMuscleGroup('')}
                >
                  Todos
                </Button>
                {muscleGroups.map((group) => (
                  <Button
                    key={group}
                    variant={selectedMuscleGroup === group ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedMuscleGroup(group)}
                  >
                    {group}
                  </Button>
                ))}
              </div>
            </div>

            {/* Exercise List */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {exercisesToShow.map((exercise) => (
                <Card 
                  key={exercise.id}
                  className={`cursor-pointer transition-colors ${
                    selectedExercise?.id === exercise.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => handleExerciseClick(exercise)}
                >
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold">{exercise.name}</h4>
                        <p className="text-sm text-muted-foreground">{exercise.description}</p>
                        <Badge variant="secondary" className="mt-1">{exercise.muscleGroup}</Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedExercise(exercise);
                          setShowVideoDialog(true);
                        }}
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Exercise Configuration */}
            {selectedExercise && (
              <Card className="bg-blue-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{selectedExercise.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sets">Séries:</Label>
                      <Input
                        id="sets"
                        type="number"
                        value={sets}
                        onChange={(e) => setSets(Number(e.target.value))}
                        min="1"
                        max="10"
                      />
                    </div>
                    <div>
                      <Label htmlFor="reps">Repetições:</Label>
                      <Input
                        id="reps"
                        value={reps}
                        onChange={(e) => setReps(e.target.value)}
                        placeholder="12-15"
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button onClick={handleAddExercise} className="flex-1">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar ao Treino
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Dialog */}
      <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              {selectedExercise?.name}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowVideoDialog(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {selectedExercise && (
            <div className="space-y-4">
              {/* Video */}
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={selectedExercise.videoUrl}
                  title={selectedExercise.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                />
              </div>
              
              {/* Instructions */}
              <div>
                <h4 className="font-semibold mb-2">Como Executar:</h4>
                <ol className="list-decimal list-inside space-y-1">
                  {selectedExercise.instructions.map((instruction, index) => (
                    <li key={index} className="text-sm">{instruction}</li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}