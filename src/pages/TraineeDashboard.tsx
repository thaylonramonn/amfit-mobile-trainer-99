import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Play, Activity, Target, Calendar, User, Settings, LogOut, Weight, Home, Plus } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { toast } from 'sonner';
import { UserMenu } from '@/components/ui/user-menu';
import { BackButton } from '@/components/ui/back-button';
import { NotificationPermission } from '@/components/ui/notification-permission';
import { EvaluationForm, EvaluationData } from '@/components/ui/evaluation-form';

const TraineeDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  
  const [evaluations, setEvaluations] = useState<EvaluationData[]>([]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logout realizado com sucesso!');
      navigate('/');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  const handleCompleteWorkout = () => {
    // TODO: Navigate to workout session or show completion dialog
    navigate('/workout/demo123');
  };


  return (
    <div className="min-h-screen bg-gradient-surface">
      <NotificationPermission />
      {/* Modern Header - Igual ao do Personal */}
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
                <span className="text-xs sm:text-sm font-medium">Aluno</span>
              </div>
              <span className="text-lg">💪</span>
            </div>
          </div>
          <UserMenu />
        </div>
      </div>

      {/* Main Content - Mobile Optimized */}
      <div className="flex-1 p-4 sm:p-6 pb-24 max-w-6xl mx-auto">
        {activeTab === 'home' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Progresso e Meta - Design atualizado similar ao personal */}
            <Card className="border-0 shadow-medium bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="font-inter font-semibold text-lg sm:text-xl flex items-center text-amfit-text-primary">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amfit-primary rounded-xl flex items-center justify-center mr-3">
                    <Target className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  Meu Progresso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
                  <div className="bg-white border border-amfit-border p-3 sm:p-4 rounded-xl text-center">
                    <Weight className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 text-amfit-text-secondary" />
                    <h3 className="font-bold text-xl sm:text-2xl text-amfit-text-primary">—</h3>
                    <p className="text-xs sm:text-sm text-amfit-text-secondary font-medium">Peso Atual</p>
                  </div>
                  <div className="bg-white border border-amfit-border p-3 sm:p-4 rounded-xl text-center">
                    <Target className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 text-amfit-orange" />
                    <h3 className="font-bold text-xl sm:text-2xl text-amfit-text-primary">—</h3>
                    <p className="text-xs sm:text-sm text-amfit-text-secondary font-medium">Meta</p>
                  </div>
                </div>
                
                <div className="p-3 sm:p-4 bg-amfit-secondary border border-amfit-border rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-amfit-text-primary">Status da Avaliação</span>
                    <div className="w-2 h-2 bg-amfit-orange rounded-full animate-pulse" />
                  </div>
                  <Progress value={0} className="w-full h-2 mb-2" />
                  <p className="text-xs text-amfit-text-secondary">Aguardando primeira avaliação do seu personal trainer</p>
                </div>
              </CardContent>
            </Card>

            {/* Treino do Dia - Design atualizado */}
            <Card className="border-0 shadow-medium bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="font-inter font-semibold text-lg sm:text-xl flex items-center text-amfit-text-primary">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amfit-primary rounded-xl flex items-center justify-center mr-3">
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  Treino de Hoje
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-amfit-text-secondary">
                  <div className="w-12 h-12 bg-amfit-secondary rounded-xl flex items-center justify-center mx-auto mb-4 border border-amfit-border">
                    <Play className="w-6 h-6 text-amfit-text-secondary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-amfit-text-primary">Nenhum treino agendado</h3>
                  <p className="text-amfit-text-secondary max-w-sm mx-auto">Seu personal irá agendar um treino personalizado em breve</p>
                </div>
              </CardContent>
            </Card>

            {/* Treinos da Semana - Design atualizado */}
            <Card className="border-0 shadow-medium bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="font-inter font-semibold text-lg sm:text-xl flex items-center text-amfit-text-primary">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amfit-primary rounded-xl flex items-center justify-center mr-3">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  Treinos da Semana
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'].map((day, index) => (
                    <div key={day} className="flex justify-between items-center p-3 sm:p-4 bg-amfit-secondary rounded-xl border border-amfit-border">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-amfit-text-secondary rounded-full" />
                        <span className="font-medium text-amfit-text-primary">{day}</span>
                      </div>
                      <span className="text-xs sm:text-sm text-amfit-text-secondary bg-white px-3 py-1 rounded-lg border border-amfit-border">Aguardando</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'workouts' && (
          <Card className="border-0 shadow-medium bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="font-inter font-semibold text-lg sm:text-xl flex items-center text-amfit-text-primary">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amfit-primary rounded-xl flex items-center justify-center mr-3">
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                Meus Treinos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-amfit-text-secondary">
                <div className="w-12 h-12 bg-amfit-secondary rounded-xl flex items-center justify-center mx-auto mb-4 border border-amfit-border">
                  <Activity className="w-6 h-6 text-amfit-text-secondary" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-amfit-text-primary">Nenhum treino cadastrado</h3>
                <p className="text-amfit-text-secondary max-w-sm mx-auto">Seu personal irá criar treinos personalizados especialmente para você</p>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'evaluation' && (
          <div className="space-y-4">
            <Card className="border-0 shadow-medium bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="font-inter font-semibold text-lg sm:text-xl flex items-center text-amfit-text-primary">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amfit-primary rounded-xl flex items-center justify-center mr-3">
                    <Target className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  Minhas Avaliações
                </CardTitle>
              </CardHeader>
              <CardContent>
                {evaluations.length === 0 ? (
                  <div className="text-center py-8 text-amfit-text-secondary">
                    <div className="w-12 h-12 bg-amfit-secondary rounded-xl flex items-center justify-center mx-auto mb-4 border border-amfit-border">
                      <Target className="w-6 h-6 text-amfit-text-secondary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-amfit-text-primary">Nenhuma avaliação registrada</h3>
                    <p className="text-amfit-text-secondary max-w-sm mx-auto mb-6">
                      Seu personal trainer criará avaliações para você. Você pode adicionar fotos quando solicitado.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {evaluations.map((evaluation, index) => (
                      <Card key={index} className="border border-border">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold">
                                {evaluation.date.toLocaleDateString('pt-BR')}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Avaliação #{index + 1}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">{evaluation.weight}kg</p>
                              <p className="text-sm text-muted-foreground">
                                {evaluation.height}cm
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex gap-2">
                              {evaluation.photos.slice(0, 3).map((photo, photoIndex) => (
                                <img
                                  key={photoIndex}
                                  src={URL.createObjectURL(photo)}
                                  alt={`Foto ${photoIndex + 1}`}
                                  className="w-12 h-12 object-cover rounded-lg border"
                                />
                              ))}
                              {evaluation.photos.length > 3 && (
                                <div className="w-12 h-12 bg-muted rounded-lg border flex items-center justify-center text-xs">
                                  +{evaluation.photos.length - 3}
                                </div>
                              )}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-primary border-primary hover:bg-primary hover:text-white"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Adicionar Foto
                            </Button>
                          </div>
                          {evaluation.notes && (
                            <p className="text-sm text-muted-foreground mt-3">
                              {evaluation.notes}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}


        {activeTab === 'history' && (
          <Card className="border-0 shadow-medium bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="font-inter font-semibold text-lg sm:text-xl flex items-center text-amfit-text-primary">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amfit-primary rounded-xl flex items-center justify-center mr-3">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                Histórico de Treinos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-amfit-text-secondary">
                <div className="w-12 h-12 bg-amfit-secondary rounded-xl flex items-center justify-center mx-auto mb-4 border border-amfit-border">
                  <Calendar className="w-6 h-6 text-amfit-text-secondary" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-amfit-text-primary">Nenhum treino realizado</h3>
                <p className="text-amfit-text-secondary max-w-sm mx-auto">Quando você completar treinos, eles aparecerão aqui no seu histórico</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modern Bottom Navigation - Igual ao do Personal */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-amfit-border shadow-large">
        <div className="flex max-w-6xl mx-auto">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex-1 p-4 text-center transition-all duration-200 ${
              activeTab === 'home' 
                ? 'text-amfit-primary bg-amfit-primary/10' 
                : 'text-amfit-text-secondary hover:text-amfit-text-primary hover:bg-amfit-secondary/50'
            }`}
          >
            <Home className="w-6 h-6 mx-auto mb-1" />
            <span className="text-xs font-medium">Início</span>
          </button>
          
          <button
            onClick={() => setActiveTab('workouts')}
            className={`flex-1 p-4 text-center transition-all duration-200 ${
              activeTab === 'workouts' 
                ? 'text-amfit-primary bg-amfit-primary/10' 
                : 'text-amfit-text-secondary hover:text-amfit-text-primary hover:bg-amfit-secondary/50'
            }`}
          >
            <Activity className="w-6 h-6 mx-auto mb-1" />
            <span className="text-xs font-medium">Treinos</span>
          </button>
          
          <button
            onClick={() => setActiveTab('evaluation')}
            className={`flex-1 p-4 text-center transition-all duration-200 ${
              activeTab === 'evaluation' 
                ? 'text-amfit-primary bg-amfit-primary/10' 
                : 'text-amfit-text-secondary hover:text-amfit-text-primary hover:bg-amfit-secondary/50'
            }`}
          >
            <Target className="w-6 h-6 mx-auto mb-1" />
            <span className="text-xs font-medium">Avaliação</span>
          </button>
          
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 p-4 text-center transition-all duration-200 ${
              activeTab === 'history' 
                ? 'text-amfit-primary bg-amfit-primary/10' 
                : 'text-amfit-text-secondary hover:text-amfit-text-primary hover:bg-amfit-secondary/50'
            }`}
          >
            <Calendar className="w-6 h-6 mx-auto mb-1" />
            <span className="text-xs font-medium">Histórico</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TraineeDashboard;