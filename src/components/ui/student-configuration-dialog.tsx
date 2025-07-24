import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Dumbbell, FileText, User, Edit, BarChart3 } from 'lucide-react';
import { StudentEditDialog } from './student-edit-dialog';

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

interface StudentConfigurationDialogProps {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateWorkout: () => void;
  onCreateAssessment: () => void;
  onEditWorkout: () => void;
  onEditAssessment: () => void;
  onStudentUpdated: () => void;
}

export const StudentConfigurationDialog = ({
  student,
  open,
  onOpenChange,
  onCreateWorkout,
  onCreateAssessment,
  onEditWorkout,
  onEditAssessment,
  onStudentUpdated,
}: StudentConfigurationDialogProps) => {
  const [showEditDialog, setShowEditDialog] = useState(false);

  if (!student) return null;

  const isFullyConfigured = student.workoutConfigured && student.assessmentConfigured;
  const hasPartialConfiguration = student.workoutConfigured || student.assessmentConfigured;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Configuração - {student.name}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Status atual */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {isFullyConfigured
                  ? 'Este aluno já possui treino e avaliação configurados.'
                  : hasPartialConfiguration
                  ? 'Este aluno possui configuração parcial.'
                  : 'Este aluno é novo e precisa de configuração inicial.'
                }
              </AlertDescription>
            </Alert>

            {/* Status dos itens */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Dumbbell className="w-4 h-4" />
                    <span className="text-sm font-medium">Treino</span>
                  </div>
                  <Badge variant={student.workoutConfigured ? "default" : "secondary"}>
                    {student.workoutConfigured ? (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    ) : (
                      <AlertCircle className="w-3 h-3 mr-1" />
                    )}
                    {student.workoutConfigured ? 'Configurado' : 'Pendente'}
                  </Badge>
                </div>
                <Button
                  variant={student.workoutConfigured ? "outline" : "default"}
                  size="sm"
                  className="w-full"
                  onClick={student.workoutConfigured ? onEditWorkout : onCreateWorkout}
                >
                  {student.workoutConfigured ? 'Editar Treino' : 'Criar Treino'}
                </Button>
              </div>

              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm font-medium">Avaliação</span>
                  </div>
                  <Badge variant={student.assessmentConfigured ? "default" : "secondary"}>
                    {student.assessmentConfigured ? (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    ) : (
                      <AlertCircle className="w-3 h-3 mr-1" />
                    )}
                    {student.assessmentConfigured ? 'Configurado' : 'Pendente'}
                  </Badge>
                </div>
                <Button
                  variant={student.assessmentConfigured ? "outline" : "default"}
                  size="sm"
                  className="w-full"
                  onClick={student.assessmentConfigured ? onEditAssessment : onCreateAssessment}
                >
                  {student.assessmentConfigured ? 'Editar Avaliação' : 'Criar Avaliação'}
                </Button>
              </div>
            </div>

            {/* Ações Adicionais */}
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                onClick={() => setShowEditDialog(true)}
                className="flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Editar Dados</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  // TODO: Implementar histórico completo
                  console.log('Ver histórico do aluno:', student.name);
                }}
                className="flex items-center space-x-2"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Ver Histórico</span>
              </Button>
            </div>

            {/* Ações */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <StudentEditDialog
        student={student}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onStudentUpdated={() => {
          onStudentUpdated();
          setShowEditDialog(false);
        }}
        onStudentDeleted={() => {
          onStudentUpdated();
          setShowEditDialog(false);
          onOpenChange(false);
        }}
      />
    </>
  );
};