import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Login realizado com sucesso!');
      
      // Buscar tipo de usuário e navegar para dashboard apropriado
      const user = userCredential.user;
      console.log('Usuário logado:', user.uid);
      
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      console.log('Documento existe?', userDoc.exists());
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('Dados do usuário:', userData);
        console.log('UserType encontrado:', userData.userType);
        
        // Salvar tipo de usuário no localStorage para autenticação persistente
        const userType = userData.userType;
        localStorage.setItem('amfit_user_type', userType === 'TRAINER' ? 'trainer' : 'trainee');
        
        if (userData.userType === 'TRAINER') {
          console.log('Redirecionando para trainer dashboard');
          navigate('/trainer-dashboard');
        } else if (userData.userType === 'TRAINEE') {
          console.log('Redirecionando para trainee dashboard');
          navigate('/trainee-dashboard');
        } else {
          console.log('UserType não definido, assumindo trainee');
          localStorage.setItem('amfit_user_type', 'trainee');
          navigate('/trainee-dashboard');
        }
      } else {
        console.log('Documento do usuário não encontrado no Firestore');
        toast.error('Erro: Dados do usuário não encontrados. Contate o suporte.');
        return;
      }
    } catch (error: any) {
      const errorMessage = error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential'
        ? 'Email ou senha errada, ou esse email não foi cadastrado'
        : error.message || 'Erro ao fazer login';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  return (
    <form onSubmit={handleLogin} className="space-y-6 w-full">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-amfit-text-primary font-montserrat">
          E-mail
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-xl h-12 border-gray-300 font-montserrat"
          placeholder="seu@email.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-amfit-text-primary font-montserrat">
          Senha
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-xl h-12 border-gray-300 font-montserrat"
          placeholder="Sua senha"
        />
      </div>

      <Button
        type="submit"
        variant="amfit"
        size="amfit"
        className="w-4/5 mx-auto block"
        disabled={loading}
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </Button>

      <Link
        to="/forgot-password"
        className="text-sm text-amfit-text-primary underline font-montserrat block mx-auto"
      >
        Esqueci minha senha
      </Link>
    </form>
  );
};

export default LoginForm;