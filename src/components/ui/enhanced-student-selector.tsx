import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, User, Plus, Users } from 'lucide-react';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { StudentRegistrationForm } from './student-registration-form';

interface Student {
  id: string;
  name: string;
  email: string;
  objective: string;
  birthdate?: any;
  gender?: string;
}

interface EnhancedStudentSelectorProps {
  onStudentSelected: (studentId: string, studentData: Student) => void;
  selectedStudent?: Student | null;
}

export const EnhancedStudentSelector = ({ onStudentSelected, selectedStudent }: EnhancedStudentSelectorProps) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showRegistration, setShowRegistration] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.log('❌ Usuário não autenticado');
          setLoading(false);
          return;
        }

        console.log('🔍 Buscando alunos para seleção...');
        
        // Buscar trainerCode do trainer atual
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

        // Setup real-time listener para alunos
        const studentsQuery = query(
          collection(db, 'users'),
          where('userType', '==', 'TRAINEE'),
          where('trainerCode', '==', trainerCode)
        );

        const unsubscribe = onSnapshot(studentsQuery, (snapshot) => {
          const studentsData: Student[] = [];
          
          snapshot.forEach(doc => {
            const data = doc.data();
            studentsData.push({
              id: doc.id,
              name: data.name,
              email: data.email || '',
              objective: data.objective || data.goal || '',
              birthdate: data.birthdate,
              gender: data.gender,
            });
          });

          console.log(`📊 ${studentsData.length} alunos encontrados para seleção`);
          setStudents(studentsData);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('❌ Erro ao buscar alunos:', error);
        setLoading(false);
      }
    };

    loadStudents();
  }, []);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStudentSelect = (student: Student) => {
    onStudentSelected(student.id, student);
    setIsDialogOpen(false);
  };

  const handleStudentRegistered = (studentId: string) => {
    setShowRegistration(false);
    // Find the newly registered student
    const newStudent = students.find(s => s.id === studentId);
    if (newStudent) {
      handleStudentSelect(newStudent);
    }
  };

  if (selectedStudent) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amfit-button/10 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-amfit-button" />
              </div>
              <div>
                <h3 className="font-medium">{selectedStudent.name}</h3>
                <p className="text-sm text-amfit-text-secondary">
                  {selectedStudent.objective || 'Objetivo não informado'}
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsDialogOpen(true)}
            >
              Alterar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full">
        <CardContent className="p-4">
          <Button 
            variant="outline" 
            className="w-full h-16 border-dashed border-2"
            onClick={() => setIsDialogOpen(true)}
          >
            <div className="flex flex-col items-center space-y-2">
              <Users className="w-6 h-6 text-amfit-text-secondary" />
              <span className="text-sm">Selecionar ou Cadastrar Aluno</span>
            </div>
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-montserrat">
              {showRegistration ? 'Cadastrar Novo Aluno' : 'Selecionar Aluno'}
            </DialogTitle>
          </DialogHeader>
          
          {showRegistration ? (
            <StudentRegistrationForm
              onStudentRegistered={handleStudentRegistered}
              onCancel={() => setShowRegistration(false)}
            />
          ) : (
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar alunos por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* New Student Button */}
              <Button 
                variant="outline" 
                className="w-full border-dashed"
                onClick={() => setShowRegistration(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar Novo Aluno
              </Button>

              {/* Students List */}
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {loading ? (
                  <div className="text-center py-8 text-gray-500">
                    <User className="w-12 h-12 mx-auto mb-2 opacity-30 animate-pulse" />
                    <p>Carregando alunos...</p>
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <User className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p>Nenhum aluno encontrado</p>
                    <p className="text-sm">
                      {searchTerm ? 'Tente ajustar sua busca' : 'Cadastre um novo aluno'}
                    </p>
                  </div>
                ) : (
                  filteredStudents.map((student) => (
                    <Card 
                      key={student.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleStudentSelect(student)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-amfit-button/10 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-amfit-button" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{student.name}</h4>
                            <p className="text-sm text-amfit-text-secondary">
                              {student.email || 'Email não informado'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {student.objective || 'Objetivo não informado'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};