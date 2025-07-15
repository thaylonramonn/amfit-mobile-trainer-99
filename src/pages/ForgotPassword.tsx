import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { toast } from 'sonner';
import { ArrowLeft, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email, {
        url: window.location.origin + '/auth',
        handleCodeInApp: false,
      });
      
      toast.success('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
      setTimeout(() => {
        navigate('/auth');
      }, 2000);
    } catch (error: any) {
      console.error('Erro ao enviar e-mail:', error);
      
      if (error.code === 'auth/user-not-found') {
        toast.error('E-mail não encontrado. Verifique o endereço digitado.');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('E-mail inválido. Digite um endereço válido.');
      } else {
        toast.error('Erro ao enviar e-mail de recuperação. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-surface flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Enhanced background elements with blur */}
      <div className="absolute top-16 right-6 w-32 h-32 bg-amfit-brand-orange/15 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-32 left-6 w-40 h-40 bg-amfit-brand-accent/10 rounded-full blur-3xl animate-pulse delay-500" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amfit-brand-success/5 rounded-full blur-strong -z-10" />
      
      <Card className="w-full max-w-sm sm:max-w-md relative z-10 bg-white/80 backdrop-blur-medium border-amfit-card-border shadow-large">
        <CardHeader className="text-center p-4 sm:p-6">
          <div className="flex items-center justify-center mb-4 relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/auth')}
              className="absolute -left-2 -top-2 text-amfit-text-secondary hover:text-amfit-brand-orange transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="w-16 h-16 bg-gradient-orange rounded-full flex items-center justify-center mx-auto mb-4 shadow-orange-glow">
            <Mail className="w-8 h-8 text-white" />
          </div>
          
          <CardTitle className="text-xl sm:text-2xl font-bebas text-amfit-text-primary tracking-wide">
            Recuperar Senha
          </CardTitle>
          <p className="text-amfit-text-secondary mt-2 text-sm sm:text-base px-2">
            Digite seu e-mail para receber as instruções de recuperação
          </p>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handlePasswordReset} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-amfit-text-primary font-medium">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="mt-2 h-12 rounded-xl border-amfit-card-border focus:ring-2 focus:ring-amfit-brand-orange/50 transition-all"
              />
            </div>

            <Button
              type="submit"
              variant="amfit-orange"
              size="amfit"
              className="w-full backdrop-blur-medium"
              disabled={isLoading}
            >
              {isLoading ? 'Enviando...' : 'Enviar E-mail de Recuperação'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/auth')}
              className="text-amfit-text-secondary hover:text-amfit-brand-orange transition-colors duration-300"
            >
              ← Voltar para o Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;