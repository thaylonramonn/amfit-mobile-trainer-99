import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import amFitLogo from '@/assets/am-fit-logo.png';

const SplashScreen = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) return;
      
      if (user) {
        // Verificar tipo de usuário no localStorage
        const userType = localStorage.getItem('amfit_user_type');
        if (userType === 'trainer') {
          navigate('/trainer-dashboard');
        } else if (userType === 'trainee') {
          navigate('/trainee-dashboard');
        } else {
          // Se não tem tipo salvo, vai para seleção
          navigate('/who-are-you');
        }
      } else {
        navigate('/who-are-you');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, user, loading]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
      {/* Solid black background */}
      <div className="absolute inset-0" style={{ backgroundColor: '#000000' }} />
      
      {/* Centered logo with subtle fade animation */}
      <div className="relative z-10 animate-fade-in px-4">
        <div className="relative">
          <img 
            src={amFitLogo} 
            alt="AM Fit Logo" 
            className="w-48 h-48 sm:w-56 sm:h-56 object-contain relative z-10 drop-shadow-2xl animate-fade-in"
            style={{ 
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
              animation: 'fadeInSubtle 2s ease-out'
            }}
          />
        </div>
      </div>
      
      {/* Simple loading indicator */}
      <div className="absolute bottom-16 sm:bottom-24 left-1/2 transform -translate-x-1/2 px-4">
        <div className="w-32 sm:w-40 h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white animate-pulse rounded-full w-1/3" />
        </div>
        <p className="text-white/70 text-xs sm:text-sm text-center mt-4 font-inter tracking-wider">
          Carregando...
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;