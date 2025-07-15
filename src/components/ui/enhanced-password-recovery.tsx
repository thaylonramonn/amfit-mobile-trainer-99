import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BackButton } from '@/components/ui/back-button';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

const EnhancedPasswordRecovery = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Digite seu e-mail');
      return;
    }

    if (!email.includes('@')) {
      toast.error('Digite um e-mail válido');
      return;
    }

    setIsLoading(true);
    
    try {
      // Configure custom action settings to avoid spam
      await sendPasswordResetEmail(auth, email, {
        url: window.location.origin + '/auth',
        handleCodeInApp: false,
      });
      
      setIsEmailSent(true);
      toast.success('E-mail de recuperação enviado!');
      
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      if (error.code === 'auth/user-not-found') {
        toast.error('E-mail não encontrado em nossa base de dados');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('E-mail inválido');
      } else if (error.code === 'auth/too-many-requests') {
        toast.error('Muitas tentativas. Tente novamente mais tarde.');
      } else {
        toast.error('Erro ao enviar e-mail de recuperação');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-splash-bg flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="font-montserrat text-xl">E-mail Enviado!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <div className="space-y-2">
              <p className="text-amfit-text-secondary">
                Enviamos um link de recuperação para:
              </p>
              <p className="font-medium text-amfit-text-primary">{email}</p>
            </div>
            
            <Alert className="text-left">
              <Mail className="h-4 w-4" />
              <AlertDescription>
                <strong>Dicas importantes:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li>Verifique sua caixa de entrada principal</li>
                  <li>Caso não encontre, verifique a pasta de spam/lixo eletrônico</li>
                  <li>O link é válido por 1 hora</li>
                  <li>Adicione noreply@am-fit-51ef6.firebaseapp.com aos seus contatos</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Button 
                variant="amfit" 
                size="amfit" 
                className="w-full"
                onClick={() => navigate('/auth')}
              >
                Voltar ao Login
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setIsEmailSent(false);
                  setEmail('');
                }}
              >
                Tentar Outro E-mail
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-splash-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center space-x-3 mb-4">
            <BackButton onClick={() => navigate('/auth')} />
            <CardTitle className="font-montserrat text-xl">
              Recuperar Senha
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center mb-4">
              <div className="mx-auto w-16 h-16 bg-amfit-button/10 rounded-full flex items-center justify-center mb-3">
                <Mail className="w-8 h-8 text-amfit-button" />
              </div>
              <p className="text-amfit-text-secondary">
                Digite seu e-mail para receber um link de recuperação de senha
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-amfit-text-primary font-montserrat">
                E-mail cadastrado
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl h-12 border-gray-300 font-montserrat"
                placeholder="seu@email.com"
                disabled={isLoading}
                required
              />
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Vamos enviar um e-mail seguro para sua caixa de entrada principal. 
                Se não aparecer em alguns minutos, verifique a pasta de spam.
              </AlertDescription>
            </Alert>

            <Button
              type="submit"
              variant="amfit"
              size="amfit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/auth')}
                className="text-amfit-text-secondary hover:text-amfit-text-primary"
              >
                Voltar ao login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedPasswordRecovery;