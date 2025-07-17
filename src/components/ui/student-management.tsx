import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, User, Dumbbell, FileText, Star, MessageSquare } from 'lucide-react';
import { collection, query, where, getDocs, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface Student {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'pending_setup';
  lastWorkout?: Date;
  workoutRating?: number;
  lastComment?: string;
  joinDate: Date;
  goal: string;
  birthdate?: string;
  trainerCode: string;
  workoutConfigured: boolean;
  assessmentConfigured: boolean;
}

export const StudentManagement = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [trainerCode, setTrainerCode] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const setupStudentListener = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.log('❌ Usuário não autenticado');
          setLoading(false);
          return;
        }

        console.log('🔍 Buscando dados do trainer:', user.uid);

        // Buscar dados do trainer para obter o trainerCode
        const trainerDoc = await getDoc(doc(db, 'users', user.uid));
        if (trainerDoc.exists()) {
          const trainerData = trainerDoc.data();
          const code = trainerData.trainerCode;
          console.log('✅ TrainerCode encontrado:', code);
          setTrainerCode(code);
          
          if (code) {
            // Configurar listener em tempo real para alunos
            const studentsQuery = query(
              collection(db, 'users'),
              where('userType', '==', 'TRAINEE'),
              where('trainerCode', '==', code)
            );
            
            console.log('👂 Configurando listener para alunos com código:', code);
            
            unsubscribe = onSnapshot(studentsQuery, (snapshot) => {
              console.log(`📊 Snapshot recebido com ${snapshot.size} documentos`);
              
              const studentsData: Student[] = snapshot.docs.map(doc => {
                const data = doc.data();
                console.log('📝 Dados do aluno:', { id: doc.id, name: data.name, email: data.email });
                return {
                  id: doc.id,
                  name: data.name,
                  email: data.email,
                  goal: data.goal,
                  birthdate: data.birthdate,
                  trainerCode: data.trainerCode,
                  workoutConfigured: data.workoutConfigured || false,
                  assessmentConfigured: data.assessmentConfigured || false,
                  status: (!data.workoutConfigured || !data.assessmentConfigured) ? 'pending_setup' : 'active',
                  joinDate: data.createdAt?.toDate() || new Date(),
                };
              });
              
              setStudents(studentsData);
              console.log(`🎉 Lista atualizada com ${studentsData.length} alunos para o trainer ${code}`);
              
              if (studentsData.length > 0) {
                toast({
                  title: "Alunos carregados",
                  description: `${studentsData.length} aluno(s) encontrado(s)`,
                });
              }
            }, (error) => {
              console.error('❌ Erro no listener:', error);
              toast({
                title: "Erro",
                description: "Erro ao monitorar alunos",
                variant: "destructive",
              });
            });
          } else {
            console.log('❌ TrainerCode não encontrado nos dados do trainer');
          }
        } else {
          console.log('❌ Documento do trainer não encontrado');
        }
      } catch (error) {
        console.error('❌ Erro ao configurar listener:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar lista de alunos",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    setupStudentListener();

    // Cleanup do listener
    return () => {
      if (unsubscribe) {
        console.log('🧹 Limpando listener de alunos');
        unsubscribe();
      }
    };
  }, [toast]);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: Student['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inativo</Badge>;
      case 'pending_setup':
        return <Badge className="bg-orange-100 text-orange-800">Configuração Pendente</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 24) {
      return `${diffHours}h atrás`;
    } else {
      return `${diffDays}d atrás`;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header com código do trainer */}
      {trainerCode && (
        <div className="flex items-center justify-between p-3 bg-amfit-secondary border border-amfit-border rounded-xl">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-amfit-text-primary">Código Personal:</span>
            <code className="text-sm font-mono bg-white px-2 py-1 rounded border">
              {trainerCode}
            </code>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(trainerCode);
              toast({
                title: "Código copiado!",
                description: "O código foi copiado para a área de transferência",
              });
            }}
            className="h-7 px-2"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </Button>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Buscar alunos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Students List */}
      <div className="space-y-3">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-medium">{student.name}</h3>
                    {getStatusBadge(student.status)}
                  </div>
                  <p className="text-sm text-amfit-text-secondary mb-1">
                    {student.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    Objetivo: {student.goal} • Cadastrado {formatDate(student.joinDate)}
                  </p>
                  
                  {student.lastWorkout && (
                    <div className="mt-2 flex items-center space-x-4 text-xs">
                      <span className="text-green-600">
                        Último treino: {formatDate(student.lastWorkout)}
                      </span>
                      {student.workoutRating && (
                        <span className="flex items-center">
                          <Star className="w-3 h-3 text-yellow-500 mr-1" />
                          {student.workoutRating}/5
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedStudent(student)}
                      >
                        Ver Perfil
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle className="font-montserrat">
                          Perfil do Aluno - {selectedStudent?.name}
                        </DialogTitle>
                      </DialogHeader>
                      
                      {selectedStudent && (
                        <Tabs defaultValue="info" className="w-full">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="info">Informações</TabsTrigger>
                            <TabsTrigger value="workouts">Treinos</TabsTrigger>
                            <TabsTrigger value="assessments">Avaliações</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="info" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-1">Nome</label>
                                <p className="text-sm p-2 bg-gray-50 rounded">{selectedStudent.name}</p>
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">E-mail</label>
                                <p className="text-sm p-2 bg-gray-50 rounded">{selectedStudent.email}</p>
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">Objetivo</label>
                                <p className="text-sm p-2 bg-gray-50 rounded">{selectedStudent.goal}</p>
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">Status</label>
                                <div className="p-2">{getStatusBadge(selectedStudent.status)}</div>
                              </div>
                            </div>
                            
                            {selectedStudent.lastComment && (
                              <div>
                                <label className="block text-sm font-medium mb-2">Último Comentário</label>
                                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                  <div className="flex items-start space-x-2">
                                    <MessageSquare className="w-4 h-4 text-blue-600 mt-0.5" />
                                    <div>
                                      <p className="text-sm text-blue-800">"{selectedStudent.lastComment}"</p>
                                      {selectedStudent.workoutRating && (
                                        <div className="flex items-center mt-1">
                                          <Star className="w-3 h-3 text-yellow-500 mr-1" />
                                          <span className="text-xs text-blue-600">
                                            {selectedStudent.workoutRating}/5 estrelas
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </TabsContent>
                          
                          <TabsContent value="workouts" className="space-y-4">
                            <div className="text-center py-8 text-gray-500">
                              <Dumbbell className="w-12 h-12 mx-auto mb-2 opacity-30" />
                              <p>Histórico de treinos será implementado</p>
                              <p className="text-sm">Aqui aparecerá o histórico completo dos treinos</p>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="assessments" className="space-y-4">
                            <div className="text-center py-8 text-gray-500">
                              <FileText className="w-12 h-12 mx-auto mb-2 opacity-30" />
                              <p>Avaliações corporais serão implementadas</p>
                              <p className="text-sm">Aqui aparecerá o histórico de avaliações</p>
                            </div>
                          </TabsContent>
                        </Tabs>
                      )}
                    </DialogContent>
                  </Dialog>
                  
                  {student.status === 'pending_setup' && (
                    <Button 
                      variant="amfit" 
                      size="sm"
                      onClick={() => {
                        // TODO: Implement configuration logic
                        console.log('Configurar aluno:', student.name);
                        toast({
                          title: "Configuração",
                          description: `Configuração para ${student.name} será implementada`,
                        });
                      }}
                    >
                      Configurar
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
            {searchTerm ? 'Tente ajustar sua busca' : 'Compartilhe seu código personal para que alunos se cadastrem'}
          </p>
          {trainerCode && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg inline-block">
              <p className="text-xs text-gray-600 mb-1">Seu código:</p>
              <div className="flex items-center space-x-2">
                <code className="text-sm font-mono bg-white px-2 py-1 rounded border">
                  {trainerCode}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(trainerCode);
                    toast({
                      title: "Código copiado!",
                      description: "O código foi copiado para a área de transferência",
                    });
                  }}
                  className="h-7 px-2"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};