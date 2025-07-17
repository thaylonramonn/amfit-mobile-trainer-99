import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, Target, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface WorkoutCompletionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (comments: string, rating: number) => void;
  exercises?: Array<{
    name: string;
    sets: number;
    reps: string;
  }>;
  totalTime?: number; // em minutos
  weekProgress?: {
    current: number;
    total: number;
  };
}

export const WorkoutCompletionDialog = ({ 
  open, 
  onOpenChange, 
  onSubmit,
  exercises = [],
  totalTime = 0,
  weekProgress = { current: 1, total: 5 }
}: WorkoutCompletionProps) => {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = async () => {
    setIsCompleting(true);
    
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSubmit('', 5); // Mock data
    setIsCompleting(false);
    onOpenChange(false);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  const getDayOfWeek = () => {
    const days = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
    const today = new Date().getDay();
    return days[today];
  };

  const getWeekDays = () => {
    const days = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];
    const today = new Date().getDay();
    
    return days.map((day, index) => ({
      day,
      isToday: index === today,
      isCompleted: index < weekProgress.current
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-montserrat text-center">
            Finalizar Treino
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Progresso da Semana */}
          <Card>
            <CardContent className="p-4">
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-amfit-primary mb-1">
                  {weekProgress.current}/{weekProgress.total}
                </div>
                <div className="text-sm text-amfit-text-secondary">
                  Treinos na semana
                </div>
              </div>
              
              {/* Dias da Semana */}
              <div className="flex justify-center space-x-2 mb-4">
                {getWeekDays().map((dayInfo, index) => (
                  <div
                    key={index}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-medium ${
                      dayInfo.isCompleted || dayInfo.isToday
                        ? 'bg-amfit-primary border-amfit-primary text-white'
                        : 'border-amfit-border text-amfit-text-secondary'
                    }`}
                  >
                    {dayInfo.isCompleted || dayInfo.isToday ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      dayInfo.day
                    )}
                  </div>
                ))}
              </div>
              
              <Progress 
                value={(weekProgress.current / weekProgress.total) * 100} 
                className="h-2"
              />
            </CardContent>
          </Card>

          {/* Exercícios de Hoje */}
          {exercises.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center mb-3">
                  <Target className="w-5 h-5 text-amfit-primary mr-2" />
                  <h3 className="font-semibold">
                    {exercises.length} exercícios de hoje
                  </h3>
                </div>
                
                <div className="space-y-2">
                  {exercises.map((exercise, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-2 bg-amfit-secondary rounded-lg"
                    >
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-amfit-primary mr-2" />
                        <span className="text-sm font-medium">{exercise.name}</span>
                      </div>
                      <span className="text-xs text-amfit-text-secondary">
                        {exercise.sets}×{exercise.reps}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tempo Total */}
          {totalTime > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amfit-primary mr-2" />
                  <div className="text-center">
                    <div className="text-lg font-bold text-amfit-primary">
                      {formatTime(totalTime)}
                    </div>
                    <div className="text-sm text-amfit-text-secondary">
                      Tempo total realizado
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Botões */}
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              className="flex-1"
              disabled={isCompleting}
            >
              Continuar Treino
            </Button>
            <Button 
              onClick={handleComplete}
              className="flex-1 bg-amfit-primary hover:bg-amfit-primary/90"
              disabled={isCompleting}
            >
              {isCompleting ? 'Finalizando...' : 'Finalizar Treino'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};