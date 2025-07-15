import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import LoginForm from '@/components/auth/LoginForm';
import RegisterTraineeForm from '@/components/auth/RegisterTraineeForm';
import RegisterTrainerForm from '@/components/auth/RegisterTrainerForm';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userType = searchParams.get('type') || 'trainee';
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const renderForm = () => {
    if (mode === 'login') {
      return <LoginForm />;
    }
    
    return userType === 'trainer' ? <RegisterTrainerForm /> : <RegisterTraineeForm />;
  };

  return (
    <div className="min-h-screen bg-gradient-surface flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Enhanced background elements with blur */}
      <div className="absolute top-0 left-0 w-full h-80 bg-gradient-to-b from-amfit-orange/10 via-amfit-text-secondary/5 to-transparent" />
      <div className="absolute top-24 right-6 w-32 h-32 bg-amfit-orange/15 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-32 left-6 w-40 h-40 bg-amfit-text-secondary/10 rounded-full blur-3xl animate-pulse delay-500" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amfit-text-muted/5 rounded-full blur-strong -z-10" />

      <div className="text-center space-y-6 max-w-sm sm:max-w-md w-full relative z-10 animate-slide-up">
        {/* Enhanced header section - Mobile First */}
        <div className="space-y-4 px-2">
          <div className="w-12 h-1 bg-gradient-orange mx-auto rounded-full" />
          <h1 className="text-2xl sm:text-3xl font-bebas text-amfit-text-primary tracking-wide">
            {mode === 'login' ? 'Bem-vindo de volta' : 'Criar conta'}
          </h1>
          <p className="text-base sm:text-lg text-amfit-text-secondary font-inter leading-relaxed px-2">
            {mode === 'login' 
              ? 'Entre com sua conta para continuar sua jornada fitness.'
              : 'Crie sua conta e comece sua transformação hoje.'
            }
          </p>
        </div>
        
        {/* Enhanced navigation buttons - Mobile Optimized */}
        {mode === 'login' ? (
          <div className="space-y-4 px-2">
            <Button
              onClick={() => setMode('login')}
              variant="amfit-orange"
              size="amfit"
              className="w-full max-w-sm mx-auto block backdrop-blur-medium"
            >
              Entrar com minha conta
            </Button>
            
            <Button
              onClick={() => setMode('register')}
              variant="amfit-secondary"
              size="amfit"
              className="w-full max-w-sm mx-auto block backdrop-blur-medium"
            >
              Criar nova conta
            </Button>
            
            {/* Botão para voltar à seleção de tipo de usuário */}
            <Button
              onClick={() => navigate('/who-are-you')}
              variant="ghost"
              size="default"
              className="w-full max-w-sm mx-auto block text-amfit-text-secondary hover:text-amfit-orange transition-colors duration-300"
            >
              ← Escolher outro tipo de usuário
            </Button>
          </div>
        ) : (
          <div className="space-y-4 px-2">
            <Button
              onClick={() => setMode('login')}
              variant="amfit-secondary"
              size="amfit"
              className="w-full max-w-sm mx-auto block backdrop-blur-medium"
            >
              ← Voltar para login
            </Button>
            
            {/* Botão para voltar à seleção de tipo de usuário */}
            <Button
              onClick={() => navigate('/who-are-you')}
              variant="ghost"
              size="default"
              className="w-full max-w-sm mx-auto block text-amfit-text-secondary hover:text-amfit-orange transition-colors duration-300"
            >
              ← Escolher outro tipo de usuário
            </Button>
          </div>
        )}
        
        {/* Enhanced form container - Mobile Optimized */}
        <div className="mt-8 px-2">
          <div className="bg-white/70 backdrop-blur-medium rounded-2xl border border-amfit-border shadow-medium p-4 sm:p-6">
            {renderForm()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;