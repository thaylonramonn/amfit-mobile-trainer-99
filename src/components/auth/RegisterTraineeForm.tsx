import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

const RegisterTraineeForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthdate: '',
    goal: '',
    trainerCode: '',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { name, email, password, confirmPassword, goal, trainerCode } = formData;
    
    if (!name || !email || !password || !confirmPassword || !goal || !trainerCode) {
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

      // Salvar dados no Firestore
      console.log('💾 Salvando dados do aluno no Firestore...');
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        birthdate: formData.birthdate || null,
        goal,
        trainerCode,
        userType: 'TRAINEE',
        createdAt: new Date(),
        workoutConfigured: false,
        assessmentConfigured: false,
      });

      console.log('✅ Aluno cadastrado com sucesso:', { name, email, trainerCode });

      toast({
        title: "Conta criada com sucesso! 🎉",
        description: `Olá ${name}! Seu personal trainer foi notificado e já pode ver você na lista de alunos.`,
      });
      
      // Salvar tipo de usuário no localStorage
      localStorage.setItem('amfit_user_type', 'trainee');
      navigate('/trainee-dashboard');
      
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
        <Label htmlFor="birthdate" className="text-amfit-text-primary font-montserrat">
          Data de nascimento (opcional)
        </Label>
        <Input
          id="birthdate"
          type="date"
          value={formData.birthdate}
          onChange={(e) => handleInputChange('birthdate', e.target.value)}
          className="rounded-xl h-12 border-gray-300 font-montserrat"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="goal" className="text-amfit-text-primary font-montserrat">
          Objetivo principal *
        </Label>
        <Select onValueChange={(value) => handleInputChange('goal', value)}>
          <SelectTrigger className="rounded-xl h-12 border-gray-300 font-montserrat">
            <SelectValue placeholder="Escolha seu objetivo" />
          </SelectTrigger>
          <SelectContent className="bg-background border border-gray-300 shadow-lg">
            <SelectItem value="emagrecimento">Emagrecimento</SelectItem>
            <SelectItem value="hipertrofia">Hipertrofia</SelectItem>
            <SelectItem value="saude">Saúde geral</SelectItem>
            <SelectItem value="condicionamento">Condicionamento físico</SelectItem>
            <SelectItem value="outros">Outros</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="trainer-code" className="text-amfit-text-primary font-montserrat">
          Código do Personal *
        </Label>
        <Input
          id="trainer-code"
          type="text"
          placeholder="Digite o código fornecido pelo seu personal"
          value={formData.trainerCode || ''}
          onChange={(e) => handleInputChange('trainerCode', e.target.value)}
          className="rounded-xl h-12 border-gray-300 font-montserrat"
        />
        <p className="text-xs text-amfit-text-secondary">
          Solicite este código ao seu personal trainer
        </p>
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

export default RegisterTraineeForm;