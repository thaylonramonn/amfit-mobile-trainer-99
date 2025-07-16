import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Users } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  workoutConfigured: boolean;
  assessmentConfigured: boolean;
}

interface StudentSelectorProps {
  onStudentSelect: (studentId: string) => void;
  selectedStudent?: string;
  placeholder?: string;
}

export const StudentSelector = ({ onStudentSelect, selectedStudent, placeholder = "Selecione um aluno" }: StudentSelectorProps) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.log('❌ Usuário não autenticado para buscar alunos');
          setLoading(false);
          return;
        }

        console.log('🔍 Buscando alunos para seleção...');
        
        // Buscar dados do trainer primeiro
        const trainerDoc = await getDocs(query(
          collection(db, 'users'),
          where('userType', '==', 'TRAINER'),
        ));

        let trainerCode = '';
        trainerDoc.forEach(doc => {
          if (doc.id === user.uid) {
            trainerCode = doc.data().trainerCode;
          }
        });

        if (!trainerCode) {
          console.log('❌ TrainerCode não encontrado');
          setLoading(false);
          return;
        }

        console.log('✅ TrainerCode encontrado:', trainerCode);

        // Buscar alunos
        const studentsQuery = query(
          collection(db, 'users'),
          where('userType', '==', 'TRAINEE'),
          where('trainerCode', '==', trainerCode)
        );

        const studentsSnapshot = await getDocs(studentsQuery);
        const studentsData: Student[] = [];

        studentsSnapshot.forEach(doc => {
          const data = doc.data();
          studentsData.push({
            id: doc.id,
            name: data.name,
            email: data.email,
            workoutConfigured: data.workoutConfigured || false,
            assessmentConfigured: data.assessmentConfigured || false,
          });
        });

        console.log(`📊 ${studentsData.length} alunos encontrados para seleção`);
        setStudents(studentsData);
      } catch (error) {
        console.error('❌ Erro ao buscar alunos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, []);

  if (loading) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Carregando alunos..." />
        </SelectTrigger>
      </Select>
    );
  }

  if (students.length === 0) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Nenhum aluno cadastrado" />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select value={selectedStudent} onValueChange={onStudentSelect}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder}>
          {selectedStudent && students.find(s => s.id === selectedStudent)?.name}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {students.map((student) => (
          <SelectItem key={student.id} value={student.id}>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>{student.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};