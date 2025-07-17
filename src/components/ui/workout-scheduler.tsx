import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Clock, Users, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { Exercise } from '@/data/exercises';

interface WorkoutSchedulerProps {
  workoutExercises: Array<{
    exercise: Exercise;
    sets: number;
    reps: string;
  }>;
  onScheduleWorkout: (studentId: string, date: Date, time: string) => void;
  preSelectedStudent?: string;
}

export const WorkoutScheduler = ({ workoutExercises, onScheduleWorkout, preSelectedStudent }: WorkoutSchedulerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(preSelectedStudent || '');
  const [isOpen, setIsOpen] = useState(false);
  const [students, setStudents] = useState<any[]>([]);

  // Update selected student when preSelectedStudent changes
  useEffect(() => {
    if (preSelectedStudent) {
      setSelectedStudent(preSelectedStudent);
    }
  }, [preSelectedStudent]);

  // Buscar estudantes do trainer atual
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    // Primeiro buscar o trainerCode do usuário atual
    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribeUser = onSnapshot(userDocRef, (userDoc) => {
      if (userDoc.exists()) {
        const trainerCode = userDoc.data().trainerCode;
        if (trainerCode) {
          // Buscar estudantes com esse trainerCode
          const studentsQuery = query(
            collection(db, 'users'),
            where('trainerCode', '==', trainerCode),
            where('userType', '==', 'trainee')
          );
          
          const unsubscribeStudents = onSnapshot(studentsQuery, (snapshot) => {
            const studentsList = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            console.log('🎯 Estudantes encontrados para scheduler:', studentsList);
            setStudents(studentsList);
          });

          return () => unsubscribeStudents();
        }
      }
    });

    return () => unsubscribeUser();
  }, []);

  const handleSchedule = () => {
    if (!selectedStudent || !selectedDate || !selectedTime || workoutExercises.length === 0) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    onScheduleWorkout(selectedStudent, selectedDate, selectedTime);
    
    // Reset form
    setSelectedDate(undefined);
    setSelectedTime('');
    setSelectedStudent('');
    setIsOpen(false);
    
    toast.success('Treino agendado com sucesso!');
  };

  const timeSlots = [
    '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="amfit" size="amfit" className="w-full">
          <Clock className="w-5 h-5 mr-2" />
          Agendar Treino
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-montserrat">Agendar Treino para Aluno</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Student Selection - Only show if no pre-selected student */}
          {!preSelectedStudent && (
            <div className="space-y-2">
              <Label htmlFor="student">Selecionar Aluno *</Label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha o aluno" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        {student.name}
                      </div>
                    </SelectItem>
                  ))}
                  {students.length === 0 && (
                    <div className="p-2 text-center text-amfit-text-secondary text-sm">
                      Nenhum aluno encontrado
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Show selected student info if pre-selected */}
          {preSelectedStudent && (
            <div className="bg-amfit-button/10 p-3 rounded-lg">
              <p className="text-sm font-medium">
                Aluno selecionado: {students.find(s => s.id === preSelectedStudent)?.name || 'Carregando...'}
              </p>
            </div>
          )}

          {/* Date Selection */}
          <div className="space-y-2">
            <Label>Data do Treino *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP", { locale: ptBR }) : "Selecione a data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label htmlFor="time">Horário do Treino *</Label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha o horário" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {time}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Workout Summary */}
          {workoutExercises.length > 0 && (
            <div className="bg-amfit-button/10 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Resumo do Treino:</h4>
              <div className="space-y-1 text-sm">
                {workoutExercises.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>• {item.exercise.name}</span>
                    <span>{item.sets}×{item.reps}</span>
                  </div>
                ))}
                {workoutExercises.length > 3 && (
                  <div className="text-amfit-text-secondary">
                    + {workoutExercises.length - 3} exercícios
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button 
              onClick={handleSchedule} 
              className="flex-1 bg-amfit-button hover:bg-amfit-button/90"
            >
              Agendar Treino
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};