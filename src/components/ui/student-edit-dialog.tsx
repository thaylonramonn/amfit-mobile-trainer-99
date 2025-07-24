import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Student {
  id: string;
  name: string;
  email: string;
  objective: string;
  birthdate?: any;
  gender?: string;
  workoutConfigured: boolean;
  assessmentConfigured: boolean;
}

interface StudentEditDialogProps {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStudentUpdated: () => void;
  onStudentDeleted: () => void;
}

export const StudentEditDialog = ({
  student,
  open,
  onOpenChange,
  onStudentUpdated,
  onStudentDeleted,
}: StudentEditDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    objective: '',
    gender: ''
  });
  const [birthdate, setBirthdate] = useState<Date>();
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [yearInput, setYearInput] = useState('');

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        email: student.email || '',
        objective: student.objective || '',
        gender: student.gender || ''
      });
      
      if (student.birthdate) {
        let date;
        if (student.birthdate.toDate) {
          date = student.birthdate.toDate();
        } else if (typeof student.birthdate === 'string') {
          date = new Date(student.birthdate);
        } else {
          date = student.birthdate;
        }
        setBirthdate(date);
        setYearInput(date.getFullYear().toString());
      }
    }
  }, [student]);

  const objectives = [
    'Emagrecimento',
    'Ganho de massa muscular',
    'Definição corporal',
    'Reabilitação',
    'Condicionamento físico',
    'Saúde geral',
    'Preparação esportiva'
  ];

  const handleSave = async () => {
    if (!student) return;

    if (!formData.name || !birthdate || !formData.gender || !formData.objective) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    
    try {
      const updateData = {
        ...formData,
        birthdate: birthdate,
        updatedAt: new Date()
      };

      await updateDoc(doc(db, 'users', student.id), updateData);
      
      toast.success('Dados do aluno atualizados com sucesso!');
      onStudentUpdated();
      onOpenChange(false);
      
    } catch (error) {
      console.error('Erro ao atualizar aluno:', error);
      toast.error('Erro ao atualizar dados do aluno');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!student) return;

    setLoading(true);
    
    try {
      await deleteDoc(doc(db, 'users', student.id));
      
      toast.success('Aluno removido com sucesso!');
      onStudentDeleted();
      setShowDeleteDialog(false);
      onOpenChange(false);
      
    } catch (error) {
      console.error('Erro ao remover aluno:', error);
      toast.error('Erro ao remover aluno');
    } finally {
      setLoading(false);
    }
  };

  const handleYearChange = () => {
    const year = parseInt(yearInput);
    if (year >= 1900 && year <= new Date().getFullYear()) {
      const newDate = new Date(year, birthdate?.getMonth() || 0, birthdate?.getDate() || 1);
      setBirthdate(newDate);
    }
  };

  if (!student) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Editar Aluno - {student.name}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
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
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label className="text-xs text-gray-500">Ano</Label>
                    <Input
                      type="number"
                      value={yearInput}
                      onChange={(e) => setYearInput(e.target.value)}
                      onBlur={handleYearChange}
                      placeholder="Ex: 1990"
                      min={1900}
                      max={new Date().getFullYear()}
                    />
                  </div>
                  <div className="flex-2">
                    <Label className="text-xs text-gray-500">Dia e Mês</Label>
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
                          {birthdate ? format(birthdate, "dd/MM/yyyy", { locale: ptBR }) : "Selecione a data"}
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
                </div>
              </div>
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
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@exemplo.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="objective">Objetivo *</Label>
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
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)} 
                className="flex-1"
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSave} 
                className="flex-1" 
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o aluno "{student.name}"? 
              Esta ação não pode ser desfeita e todos os dados relacionados (treinos, avaliações) serão perdidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? 'Excluindo...' : 'Excluir Aluno'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};