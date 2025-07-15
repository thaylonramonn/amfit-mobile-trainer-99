import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const WhoAreYou = () => {
  const navigate = useNavigate();

  const handleTraineeClick = () => {
    navigate('/auth?type=trainee');
  };

  const handleTrainerClick = () => {
    navigate('/auth?type=trainer');
  };

  return (
    <div className="min-h-screen bg-gradient-surface flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Enhanced background decoration with blur effects */}
      <div className="absolute top-16 right-6 w-40 h-40 bg-amfit-orange/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-32 left-6 w-48 h-48 bg-amfit-text-secondary/15 rounded-full blur-3xl animate-pulse delay-300" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amfit-text-muted/5 rounded-full blur-strong -z-10" />
      
      <div className="text-center space-y-8 max-w-sm sm:max-w-md w-full relative z-10 animate-slide-up px-2">
        {/* Enhanced Typography Hierarchy - Mobile First */}
        <div className="space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bebas text-amfit-text-primary tracking-wider leading-tight">
            Quem é você na 
            <span className="text-amfit-text-primary block mt-2">AM Fit?</span>
          </h1>
          
          <div className="w-12 sm:w-16 h-1 bg-gradient-primary mx-auto rounded-full" />
          
          <p className="text-lg sm:text-xl text-amfit-text-secondary font-inter font-light leading-relaxed px-4">
            Com estratégia, o resultado 
            <span className="text-amfit-orange font-medium"> encontra você</span>.
          </p>
        </div>
        
        {/* Enhanced Button Layout - Mobile Optimized */}
        <div className="space-y-5 mt-12">
          <Button
            onClick={handleTraineeClick}
            variant="amfit-orange"
            size="amfit"
            className="w-full max-w-sm mx-auto block group backdrop-blur-medium"
          >
            <span className="flex items-center justify-center gap-3">
              <span className="text-2xl group-hover:scale-110 transition-transform duration-300">💪</span>
              <span className="font-semibold text-base sm:text-lg">Quero ser treinado</span>
            </span>
          </Button>
          
          <Button
            onClick={handleTrainerClick}
            variant="amfit-primary"
            size="amfit"
            className="w-full max-w-sm mx-auto block group backdrop-blur-medium"
          >
            <span className="flex items-center justify-center gap-3">
              <span className="text-2xl group-hover:scale-110 transition-transform duration-300">🏋️</span>
              <span className="font-semibold text-base sm:text-lg">Sou treinador</span>
            </span>
          </Button>
        </div>
        
        {/* Subtle bottom decoration */}
        <div className="flex justify-center pt-8">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-amfit-orange/50 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-amfit-text-secondary/60 rounded-full animate-pulse delay-150" />
            <div className="w-2 h-2 bg-amfit-orange/50 rounded-full animate-pulse delay-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhoAreYou;