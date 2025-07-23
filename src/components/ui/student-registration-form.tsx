import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface StudentData {
  name: string;
  birthdate: Date;
  gender: string;
  email: string;
  objective: string;
}

interface StudentRegistrationFormProps {
  onStudentRegistered: (studentId: string) => void;
  onCancel: () => void;
}

export const StudentRegistrationForm = ({ onStudentRegistered, onCancel }: StudentRegistrationFormProps) => {
  const [formData, setFormData] = useState<Partial<StudentData>>({
    name: '',
    gender: '',
    email: '',
    objective: ''
  });
  const [birthdate, setBirthdate] = useState<Date>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !birthdate || !formData.gender || !formData.objective) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Usuário não autenticado');

      // Buscar trainerCode do personal
      const trainerQuery = query(
        collection(db, 'users'),
        where('userType', '==', 'TRAINER')
      );
      const trainerSnapshot = await getDocs(trainerQuery);
      let trainerCode = '';
      
      trainerSnapshot.forEach(doc => {
        if (doc.id === user.uid) {
          trainerCode = doc.data().trainerCode;
        }
      });

      if (!trainerCode) {
        throw new Error('Código do personal não encontrado');
      }

      // Criar novo documento do aluno
      const studentData = {
        ...formData,
        birthdate: birthdate,
        userType: 'TRAINEE',
        trainerCode: trainerCode,
        trainerId: user.uid,
        workoutConfigured: false,
        assessmentConfigured: false,
        createdAt: new Date(),
        isTemporary: true // Flag para indicar que é um cadastro temporário para avaliação
      };

      const docRef = await addDoc(collection(db, 'users'), studentData);
      
      toast.success('Aluno cadastrado com sucesso!');
      onStudentRegistered(docRef.id);
      
    } catch (error) {
      console.error('Erro ao cadastrar aluno:', error);
      toast.error('Erro ao cadastrar aluno');
    } finally {
      setLoading(false);
    }
  };

  const objectives = [
    'Emagrecimento',
    'Ganho de massa muscular',
    'Definição corporal',
    'Reabilitação',
    'Condicionamento físico',
    'Saúde geral',
    'Preparação esportiva'
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center font-montserrat">Cadastrar Novo Aluno</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Digite o nome completo"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Data de Nascimento *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !birthdate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {birthdate ? format(birthdate, "PPP", { locale: ptBR }) : "Selecione a data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={birthdate}
                  onSelect={setBirthdate}
                  disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Sexo *</Label>
            <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o sexo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="masculino">Masculino</SelectItem>
                <SelectItem value="feminino">Feminino</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail (opcional)</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="email@exemplo.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="objective">Objetivo da Avaliação *</Label>
            <Select value={formData.objective} onValueChange={(value) => setFormData(prev => ({ ...prev, objective: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o objetivo" />
              </SelectTrigger>
              <SelectContent>
                {objectives.map((objective) => (
                  <SelectItem key={objective} value={objective}>
                    {objective}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? 'Cadastrando...' : 'Cadastrar Aluno'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};