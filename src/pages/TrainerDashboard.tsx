import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Dumbbell, FileText, Home, Settings, LogOut, X, Plus, Users, Clock, CheckCircle, ClipboardList, UserCheck, Copy } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { toast } from 'sonner';
import { UserMenu } from '@/components/ui/user-menu';
import { BackButton } from '@/components/ui/back-button';
import { NotificationSystem } from '@/components/ui/notification-system';
import { StudentManagement } from '@/components/ui/student-management';
import { ExerciseSelection } from '@/components/ui/exercise-selection';
import { WorkoutScheduler } from '@/components/ui/workout-scheduler';
import { NotificationPermission } from '@/components/ui/notification-permission';
import { Exercise } from '@/data/exercises';
import { ptBR } from 'date-fns/locale';
import { useTrainerInfo } from '@/hooks/use-trainer-info';
import { StudentSelector } from '@/components/ui/student-selector';
import { ComprehensiveEvaluationForm } from '@/components/ui/comprehensive-evaluation-form';
import { useEvaluations } from '@/hooks/use-evaluations';
import { Label } from '@/components/ui/label';

const TrainerDashboard = () => {
  const navigate = useNavigate();
  const { trainerInfo, loading: trainerLoading } = useTrainerInfo();
  const { evaluations, loading: evaluationsLoading, addEvaluation } = useEvaluations();
  const [activeTab, setActiveTab] = useState('home');
  const [showExerciseSelection, setShowExerciseSelection] = useState(false);
  const [workoutExercises, setWorkoutExercises] = useState<Array<{
    exercise: Exercise;
    sets: number;
    reps: string;
  }>>([]);
  const [selectedStudentForWorkout, setSelectedStudentForWorkout] = useState('');
  const [selectedStudentForAssessment, setSelectedStudentForAssessment] = useState('');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logout realizado com sucesso!');
      navigate('/');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  const handleExerciseSelect = (exercise: Exercise, sets: number, reps: string) => {
    setWorkoutExercises(prev => [...prev, { exercise, sets, reps }]);
  };

  const removeExercise = (index: number) => {
    setWorkoutExercises(prev => prev.filter((_, i) => i !== index));
  };

  const handleScheduleWorkout = (studentId: string, date: Date, time: string) => {
    if (workoutExercises.length === 0) {
      toast.error('Adicione pelo menos um exercício');
      return;
    }
    
    // TODO: Save to Firebase with scheduling info
    const workoutData = {
      exercises: workoutExercises,
      studentId,
      scheduledDate: date,
      scheduledTime: time,
      createdAt: new Date(),
      id: Math.random().toString(36).substr(2, 9)
    };
    
    console.log('Workout scheduled:', workoutData);
    
    // Send notification to student (in real app, this would be through Firebase)
    const studentName = mockStudents.find(s => s.id === studentId)?.name || 'Aluno';
    
    toast.success(`Treino agendado para ${studentName} em ${date.toLocaleDateString('pt-BR')} às ${time}`);
    
    setWorkoutExercises([]);
    setTimeout(() => setActiveTab('home'), 2000);
  };

  // Mock students data (cleared for production)
  const mockStudents = [];

  return (
    <div className="min-h-screen bg-gradient-surface">
      <NotificationPermission />
      {/* Modern Black & White Header */}
      <div className="bg-amfit-primary text-amfit-text-on-dark p-4 sm:p-6 shadow-large">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {activeTab !== 'home' && (
              <BackButton 
                onClick={() => setActiveTab('home')}
                className="text-white hover:bg-white/20 rounded-lg" 
              />
            )}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-8 bg-amfit-orange rounded-full" />
              <h1 className="text-lg sm:text-xl font-inter font-bold tracking-wide">AM Fit</h1>
              <div className="bg-white/10 px-2 py-1 rounded-lg backdrop-blur-sm">
                <span className="text-xs sm:text-sm font-medium">Personal</span>
              </div>
              <span className="text-lg">🏋️</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <NotificationSystem />
            <UserMenu />
          </div>
        </div>
      </div>

      {/* Main Content - Mobile Optimized */}
      <div className="flex-1 p-4 sm:p-6 pb-24 max-w-6xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="space-y-4 sm:space-y-6">
            {activeTab === 'home' && (
              <div className="space-y-4 sm:space-y-6">
                <Card className="border-0 shadow-medium bg-white">
                  <CardHeader className="pb-4">
                    <CardTitle className="font-inter font-semibold text-lg sm:text-xl flex items-center text-amfit-text-primary">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amfit-primary rounded-xl flex items-center justify-center mr-3">
                        <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      Resumo do Dia
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                      <div className="bg-white border border-amfit-border p-3 sm:p-4 rounded-xl text-center">
                        <Users className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 text-amfit-text-secondary" />
                        <h3 className="font-bold text-xl sm:text-2xl text-amfit-text-primary">0</h3>
                        <p className="text-xs sm:text-sm text-amfit-text-secondary font-medium">Alunos Ativos</p>
                      </div>
                      
                      <div className="bg-white border border-amfit-border p-3 sm:p-4 rounded-xl text-center">
                        <Dumbbell className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 text-amfit-text-secondary" />
                        <h3 className="font-bold text-xl sm:text-2xl text-amfit-text-primary">0</h3>
                        <p className="text-xs sm:text-sm text-amfit-text-secondary font-medium">Treinos Hoje</p>
                      </div>
                      
                      <div className="bg-white border border-amfit-border p-3 sm:p-4 rounded-xl text-center">
                        <Clock className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 text-amfit-orange" />
                        <h3 className="font-bold text-xs sm:text-sm text-amfit-text-primary">Nenhum</h3>
                        <p className="text-xs sm:text-sm text-amfit-text-secondary font-medium">Próximo Treino</p>
                      </div>
                      
                      <div className="bg-white border border-amfit-border p-3 sm:p-4 rounded-xl text-center">
                        <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 text-amfit-text-secondary" />
                        <h3 className="font-bold text-xl sm:text-2xl text-amfit-text-primary">{evaluations.length}</h3>
                        <p className="text-xs sm:text-sm text-amfit-text-secondary font-medium">Avaliações</p>
                      </div>
                    </div>
                    
                    <div className="p-3 sm:p-4 bg-amfit-secondary border border-amfit-border rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-amfit-text-primary">Seu Código Personal</p>
                        <div className="w-2 h-2 bg-amfit-orange rounded-full animate-pulse" />
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-lg sm:text-xl font-mono font-bold text-amfit-text-primary">
                          {trainerLoading ? (
                            <span className="animate-pulse bg-gray-300 h-6 w-32 rounded"></span>
                          ) : trainerInfo?.trainerCode ? (
                            trainerInfo.trainerCode
                          ) : (
                            <span className="text-red-500 text-sm">Erro ao carregar código</span>
                          )}
                        </p>
                        {trainerInfo?.trainerCode && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(trainerInfo.trainerCode);
                              toast.success('Código copiado!');
                            }}
                            className="h-8 px-2"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-amfit-text-secondary">
                        Compartilhe este código com seus alunos para que eles possam se cadastrar
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons - Horizontal Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <Card className="border-0 shadow-medium hover:shadow-large transition-all duration-200 bg-white">
                    <CardContent className="p-4">
                      <Button 
                        onClick={() => setActiveTab('evaluation')}
                        variant="amfit-secondary"
                        size="default"
                        className="w-full h-10 sm:h-12 text-sm sm:text-base font-medium"
                      >
                        <div className="flex items-center space-x-2">
                          <ClipboardList className="w-5 h-5" />
                          <span>Nova Avaliação</span>
                        </div>
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-0 shadow-medium hover:shadow-large transition-all duration-200 bg-white">
                    <CardContent className="p-4">
                      <Button 
                        onClick={() => setActiveTab('workout')}
                        variant="amfit-primary"
                        size="default"
                        className="w-full h-10 sm:h-12 text-sm sm:text-base font-medium"
                      >
                        <div className="flex items-center space-x-2">
                          <Dumbbell className="w-5 h-5" />
                          <span>Criar Treino</span>
                        </div>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'students' && (
              <div className="space-y-4">
                <Card className="bg-white border-0 shadow-medium">
                  <CardHeader>
                    <CardTitle className="font-inter text-amfit-text-primary flex items-center justify-between">
                      <div className="flex items-center">
                        <Users className="w-5 h-5 mr-2 text-amfit-text-secondary" />
                        Meus Alunos
                      </div>
                      {trainerInfo?.trainerCode && (
                        <div className="flex items-center space-x-2">
                          <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                            {trainerInfo.trainerCode}
                          </code>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(trainerInfo.trainerCode);
                              toast.success('Código copiado!');
                            }}
                            className="h-7 px-2"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <StudentManagement />
                  </CardContent>
                </Card>
              </div>
            )}

            {(activeTab === 'studentProfile1' || activeTab === 'studentProfile2' || activeTab === 'studentProfile3') && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-montserrat">Perfil do Aluno</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        JS
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">João Silva</h2>
                        <p className="text-gray-600">25 anos • Masculino</p>
                        <p className="text-sm text-gray-500">Cliente desde: 15/12/2023</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-blue-800">Objetivo Principal</p>
                        <p className="font-bold text-blue-900">Emagrecimento</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-green-800">Status</p>
                        <p className="font-bold text-green-900">Ativo</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-montserrat">Navegação</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start" 
                      onClick={() => setActiveTab('studentEvaluations')}
                    >
                      <span className="mr-2">📊</span>
                      Avaliações
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setActiveTab('studentWorkouts')}
                    >
                      <span className="mr-2">🏋</span>
                      Treinos
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setActiveTab('studentNotes')}
                    >
                      <span className="mr-2">📎</span>
                      Notas e Observações
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'studentEvaluations' && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-montserrat">📊 Histórico de Avaliações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border rounded-lg p-4 bg-green-50">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">Avaliação 15/01/2024</h3>
                      <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">Mais recente</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Peso</p>
                        <p className="font-bold">73.2kg</p>
                      </div>
                      <div>
                        <p className="text-gray-600">% Gordura</p>
                        <p className="font-bold">14%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Massa Muscular</p>
                        <p className="font-bold">62kg</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">Avaliação 15/12/2023</h3>
                      <span className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded">Inicial</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Peso</p>
                        <p className="font-bold">78.5kg</p>
                      </div>
                      <div>
                        <p className="text-gray-600">% Gordura</p>
                        <p className="font-bold">18%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Massa Muscular</p>
                        <p className="font-bold">58kg</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'studentWorkouts' && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-montserrat">🏋 Treinos do Aluno</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border rounded-lg p-4 bg-blue-50">
                    <h3 className="font-semibold mb-2">Treino Atual - Semana A</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>• Treino A - Peito e Tríceps</span>
                        <span className="text-green-600">✓ Concluído hoje</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• Treino B - Costas e Bíceps</span>
                        <span className="text-blue-600">📅 Amanhã</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• Treino C - Pernas</span>
                        <span className="text-gray-500">📅 Sexta</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Histórico de Treinos</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>16/01/2024 - Treino A</span>
                        <span className="text-green-600">✓ Concluído</span>
                      </div>
                      <div className="flex justify-between">
                        <span>15/01/2024 - Treino B</span>
                        <span className="text-green-600">✓ Concluído</span>
                      </div>
                      <div className="flex justify-between">
                        <span>12/01/2024 - Treino C</span>
                        <span className="text-green-600">✓ Concluído</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'studentNotes' && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-montserrat">📎 Notas e Observações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Adicionar Nova Observação</label>
                    <textarea 
                      className="w-full p-3 border rounded-lg h-24" 
                      placeholder="Digite suas observações sobre o aluno, evolução, dificuldades, ajustes necessários..."
                    />
                    <Button 
                      className="mt-2 bg-amfit-button text-white hover:bg-amfit-button/90"
                      size="sm"
                    >
                      Salvar Observação
                    </Button>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">Histórico de Observações</h3>
                    
                    <div className="space-y-3">
                      <div className="border-l-4 border-blue-500 pl-4 py-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">16/01/2024</span>
                          <span className="text-xs text-gray-500">Hoje</span>
                        </div>
                        <p className="text-sm text-gray-700">
                          "Excelente progresso! Conseguiu aumentar a carga no supino e está mais motivado. Continuar com o plano atual."
                        </p>
                      </div>
                      
                      <div className="border-l-4 border-green-500 pl-4 py-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">10/01/2024</span>
                          <span className="text-xs text-gray-500">6 dias atrás</span>
                        </div>
                        <p className="text-sm text-gray-700">
                          "Aluno relatou dores nas costas. Ajustei exercícios e incluí mais alongamentos."
                        </p>
                      </div>
                      
                      <div className="border-l-4 border-yellow-500 pl-4 py-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">05/01/2024</span>
                          <span className="text-xs text-gray-500">11 dias atrás</span>
                        </div>
                        <p className="text-sm text-gray-700">
                          "Primeira semana de treino. Aluno está se adaptando bem aos exercícios básicos."
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'evaluation' && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-montserrat flex items-center justify-between">
                      <span>📋 Lista de Alunos</span>
                       <Button 
                         onClick={() => setActiveTab('newEvaluation')}
                         variant="amfit-primary"
                         size="sm"
                         className="text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
                       >
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Nova Avaliação
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {evaluationsLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amfit-primary mx-auto mb-2"></div>
                        <p className="text-sm text-muted-foreground">Carregando avaliações...</p>
                      </div>
                    ) : evaluations.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-2 opacity-30" />
                        <p>Nenhuma avaliação registrada</p>
                        <p className="text-sm">Crie uma nova avaliação para começar</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {evaluations.map((evaluation) => (
                          <div key={evaluation.id} className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold text-amfit-text-primary">
                                Avaliação - {evaluation.createdAt.toLocaleDateString('pt-BR')}
                              </h3>
                              <span className="text-xs bg-amfit-primary/10 text-amfit-primary px-2 py-1 rounded">
                                {evaluation.protocol || 'Completa'}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">Peso</p>
                                <p className="font-bold">{evaluation.weight}kg</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Altura</p>
                                <p className="font-bold">{evaluation.height}cm</p>
                              </div>
                              {evaluation.bodyFat && (
                                <div>
                                  <p className="text-gray-600">% Gordura</p>
                                  <p className="font-bold">{evaluation.bodyFat}%</p>
                                </div>
                              )}
                            </div>
                            {evaluation.notes && (
                              <div className="mt-3 pt-3 border-t">
                                <p className="text-xs text-gray-600 mb-1">Observações:</p>
                                <p className="text-sm text-gray-700">{evaluation.notes}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'newEvaluation' && (
              <div className="space-y-4">
                <ComprehensiveEvaluationForm
                  onSubmit={async (data) => {
                    try {
                      console.log('💾 Avaliação criada com sucesso!');
                      toast.success('Avaliação criada com sucesso!');
                      setActiveTab('evaluation');
                    } catch (error) {
                      console.error('Erro ao salvar avaliação:', error);
                      toast.error('Erro ao salvar avaliação');
                    }
                  }}
                  onCancel={() => {
                    setActiveTab('evaluation');
                  }}
                />
                
              </div>
            )}

            {activeTab === 'workout' && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-montserrat">Criar Treino</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="student-select" className="text-sm font-medium">
                      Selecionar Aluno
                    </Label>
                    <StudentSelector
                      onStudentSelect={(studentId) => {
                        setSelectedStudentForWorkout(studentId);
                        console.log('Aluno selecionado para treino:', studentId);
                      }}
                      selectedStudent={selectedStudentForWorkout}
                      placeholder="Escolha um aluno para criar treino"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Nome do Treino</label>
                    <input type="text" className="w-full p-2 border rounded-lg" placeholder="Treino A - Peito e Tríceps" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Data do Treino</label>
                      <input 
                        type="date" 
                        className="w-full p-2 border rounded-lg"
                        defaultValue={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Horário</label>
                      <input 
                        type="time" 
                        className="w-full p-2 border rounded-lg"
                        defaultValue="08:00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Exercícios Selecionados</label>
                    <div className="space-y-2 mb-4">
                      {workoutExercises.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Dumbbell className="w-12 h-12 mx-auto mb-2 opacity-30" />
                          <p>Nenhum exercício adicionado</p>
                          <p className="text-sm">Clique em "Adicionar Exercício" para começar</p>
                        </div>
                      ) : (
                        workoutExercises.map((item, index) => (
                          <div key={index} className="border rounded-lg p-3 bg-white">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <span className="font-medium">{item.exercise.name}</span>
                                <div className="text-sm text-amfit-text-secondary mt-1">
                                  {item.sets} séries × {item.reps} repetições
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {item.exercise.muscleGroup}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeExercise(index)}
                                className="text-red-500 hover:bg-red-50"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full border-amfit-button text-amfit-button mb-4"
                    onClick={() => setShowExerciseSelection(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Exercício
                  </Button>

                  <WorkoutScheduler 
                    workoutExercises={workoutExercises}
                    onScheduleWorkout={handleScheduleWorkout}
                    preSelectedStudent={selectedStudentForWorkout}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </Tabs>
      </div>

      {/* Modern Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-border shadow-large">
        <div className="flex max-w-6xl mx-auto">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex-1 p-4 text-center transition-all duration-200 ${
              activeTab === 'home' 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Home className="w-6 h-6 mx-auto mb-1" />
            <span className="text-xs font-medium">Início</span>
          </button>
          
          <button
            onClick={() => setActiveTab('evaluation')}
            className={`flex-1 p-4 text-center transition-all duration-200 ${
              activeTab === 'evaluation' 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <ClipboardList className="w-6 h-6 mx-auto mb-1" />
            <span className="text-xs font-medium">Avaliação</span>
          </button>
          
          <button
            onClick={() => setActiveTab('workout')}
            className={`flex-1 p-4 text-center transition-all duration-200 ${
              activeTab === 'workout' 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Dumbbell className="w-6 h-6 mx-auto mb-1" />
            <span className="text-xs font-medium">Treinos</span>
          </button>
          
          <button
            onClick={() => setActiveTab('students')}
            className={`flex-1 p-4 text-center transition-all duration-200 ${
              activeTab === 'students' 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Users className="w-6 h-6 mx-auto mb-1" />
            <span className="text-xs font-medium">Alunos</span>
          </button>
        </div>
      </div>

      {/* Exercise Selection Dialog */}
      <ExerciseSelection
        open={showExerciseSelection}
        onOpenChange={setShowExerciseSelection}
        onExerciseSelect={handleExerciseSelect}
      />
    </div>
  );
};

export default TrainerDashboard;