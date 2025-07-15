import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

const RegisterTrainerForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    instagram: '',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { name, email, password, confirmPassword } = formData;
    
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Gerar código único do trainer
      const timestamp = Date.now().toString(36).toUpperCase();
      const randomPart = Math.random().toString(36).substr(2, 6).toUpperCase();
      const trainerCode = `PERS-${new Date().getFullYear()}-${timestamp}${randomPart}`;
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        instagram: formData.instagram || null,
        userType: 'TRAINER',
        trainerCode,
        createdAt: new Date(),
      });

      toast({
        title: "Sucesso",
        description: "Conta de treinador criada com sucesso!",
      });
      
      // Salvar tipo de usuário no localStorage
      localStorage.setItem('amfit_user_type', 'trainer');
      navigate('/trainer-dashboard');
      
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar conta",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-amfit-text-primary font-montserrat">
          Nome completo *
        </Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="rounded-xl h-12 border-gray-300 font-montserrat"
          placeholder="Seu nome completo"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-amfit-text-primary font-montserrat">
          E-mail *
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className="rounded-xl h-12 border-gray-300 font-montserrat"
          placeholder="seu@email.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-amfit-text-primary font-montserrat">
          Senha *
        </Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          className="rounded-xl h-12 border-gray-300 font-montserrat"
          placeholder="Mínimo 6 caracteres"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-amfit-text-primary font-montserrat">
          Confirmar senha *
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          className="rounded-xl h-12 border-gray-300 font-montserrat"
          placeholder="Digite a senha novamente"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="instagram" className="text-amfit-text-primary font-montserrat">
          Instagram profissional (opcional)
        </Label>
        <Input
          id="instagram"
          type="url"
          value={formData.instagram}
          onChange={(e) => handleInputChange('instagram', e.target.value)}
          className="rounded-xl h-12 border-gray-300 font-montserrat"
          placeholder="https://instagram.com/seuperfil"
        />
      </div>

      <Button
        type="submit"
        variant="amfit"
        size="amfit"
        className="w-4/5 mx-auto block mt-8"
        disabled={loading}
      >
        {loading ? 'Criando conta...' : 'Cadastrar'}
      </Button>
    </form>
  );
};

export default RegisterTrainerForm;