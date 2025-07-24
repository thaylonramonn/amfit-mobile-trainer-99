import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, FileText, Calculator, User } from 'lucide-react';
import { toast } from 'sonner';
import { addDoc, collection } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { EnhancedStudentSelector } from './enhanced-student-selector';

interface Student {
  id: string;
  name: string;
  email: string;
  objective: string;
  birthdate?: any;
  gender?: string;
}

interface ComprehensiveEvaluationData {
  studentId: string;
  studentName: string;
  
  // Anamnese
  previousPhysicalActivity: string;
  modalitiesPracticed: string;
  timeWithoutTraining: string;
  weeklyFrequency: string;
  previousPersonalTrainer: string;
  fitnessLevel: string;
  mainGoal: string;
  bodyFocus: string[];
  motivationLevel: string;
  dislikes: string;
  
  // Saúde e limitações
  healthProblems: string[];
  surgeries: string;
  medications: string;
  currentPain: string;
  
  // Estilo de vida
  nutrition: string;
  sleepHours: string;
  waterIntake: string;
  stressLevel: string;
  alcohol: string;
  smoking: string;
  
  // PAR-Q
  doctorRestriction: string;
  chestPain: string;
  dizziness: string;
  boneProblems: string;
  heartMedication: string;
  specialCare: string;
  
  // Medidas básicas
  weight: number;
  height: number;
  
  // Medidas corporais
  neck?: number;
  shoulder?: number;
  chestRelaxed?: number;
  chestInspired?: number;
  waist?: number;
  abdomen?: number;
  hip?: number;
  wristDiameter?: number;
  rightArmRelaxed?: number;
  rightArmContracted?: number;
  leftArmRelaxed?: number;
  leftArmContracted?: number;
  leftForearm?: number;
  rightForearm?: number;
  rightThigh?: number;
  leftThigh?: number;
  rightCalf?: number;
  leftCalf?: number;
  biStyloid?: number;
  femurDiameter?: number;
  
  // Dobras cutâneas
  protocol?: string;
  pectoral?: number;
  midAxillary?: number;
  triceps?: number;
  subscapular?: number;
  abdominal?: number;
  supraIliac?: number;
  rightThighFold?: number;
  
  // Bioimpedância
  bodyFatPercentage?: number;
  fatMass?: number;
  leanMass?: number;
  
  notes: string;
  date: Date;
}

interface ComprehensiveEvaluationFormProps {
  onSubmit: (data: ComprehensiveEvaluationData) => void;
  onCancel: () => void;
}

export const ComprehensiveEvaluationForm = ({ onSubmit, onCancel }: ComprehensiveEvaluationFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<Partial<ComprehensiveEvaluationData>>({
    bodyFocus: [],
    healthProblems: [],
    date: new Date(),
    notes: ''
  });

  const steps = [
    { title: 'Aluno', icon: User },
    { title: 'Anamnese', icon: FileText },
    { title: 'Objetivos', icon: FileText },
    { title: 'PAR-Q', icon: FileText },
    { title: 'Medidas', icon: Calculator },
    { title: 'Perímetros', icon: Calculator },
    { title: 'Dobras/Bio', icon: Calculator },
    { title: 'Finalizar', icon: FileText }
  ];

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateArrayField = (field: string, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentArray = (prev as any)[field] || [];
      if (checked) {
        return { ...prev, [field]: [...currentArray, value] };
      } else {
        return { ...prev, [field]: currentArray.filter((item: string) => item !== value) };
      }
    });
  };

  const calculateBMI = () => {
    if (formData.weight && formData.height) {
      const heightInMeters = formData.height / 100;
      return (formData.weight / (heightInMeters * heightInMeters)).toFixed(1);
    }
    return null;
  };

  const calculateBodyFat = () => {
    if (formData.protocol === 'pollock7' && selectedStudent?.gender) {
      const { pectoral = 0, midAxillary = 0, triceps = 0, subscapular = 0, abdominal = 0, supraIliac = 0, rightThighFold = 0 } = formData;
      const sumFolds = pectoral + midAxillary + triceps + subscapular + abdominal + supraIliac + rightThighFold;
      
      // Fórmula simplificada de Pollock (7 dobras)
      if (selectedStudent.gender === 'masculino') {
        const bodyFat = 495 / (1.112 - 0.00043499 * sumFolds + 0.00000055 * sumFolds * sumFolds - 0.00028826 * (new Date().getFullYear() - new Date(selectedStudent.birthdate).getFullYear())) - 450;
        return Math.max(0, bodyFat).toFixed(1);
      } else {
        const bodyFat = 495 / (1.097 - 0.00046971 * sumFolds + 0.00000056 * sumFolds * sumFolds - 0.00012828 * (new Date().getFullYear() - new Date(selectedStudent.birthdate).getFullYear())) - 450;
        return Math.max(0, bodyFat).toFixed(1);
      }
    }
    return null;
  };

  const handleSubmit = async () => {
    if (!selectedStudent) {
      toast.error('Selecione um aluno primeiro');
      return;
    }

    if (!formData.weight || !formData.height) {
      toast.error('Peso e altura são obrigatórios');
      return;
    }

    try {
      const evaluationData: ComprehensiveEvaluationData = {
        ...formData,
        studentId: selectedStudent.id,
        studentName: selectedStudent.name,
        weight: formData.weight!,
        height: formData.height!,
        date: new Date()
      } as ComprehensiveEvaluationData;

      // Salvar no Firebase
      const user = auth.currentUser;
      if (!user) throw new Error('Usuário não autenticado');

      const evaluation = {
        ...evaluationData,
        trainerId: user.uid,
        createdAt: new Date(),
        bmi: calculateBMI(),
        bodyFatCalculated: calculateBodyFat(),
      };

      await addDoc(collection(db, 'evaluations'), evaluation);
      
      toast.success('Avaliação criada com sucesso!');
      onSubmit(evaluationData);
      
    } catch (error) {
      console.error('Erro ao salvar avaliação:', error);
      toast.error('Erro ao salvar avaliação');
    }
  };

  const nextStep = () => {
    if (currentStep === 0 && !selectedStudent) {
      toast.error('Selecione um aluno primeiro');
      return;
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-amfit-text-primary mb-2">Seleção do Aluno</h3>
              <p className="text-sm text-amfit-text-secondary">
                Selecione um aluno existente ou cadastre um novo para iniciar a avaliação
              </p>
            </div>
            <EnhancedStudentSelector
              onStudentSelected={(studentId, studentData) => {
                setSelectedStudent(studentData);
                setFormData(prev => ({
                  ...prev,
                  studentId,
                  studentName: studentData.name
                }));
              }}
              selectedStudent={selectedStudent}
            />
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-amfit-text-primary">Anamnese</h3>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold mb-3 block">Já praticou atividade física antes?</Label>
                <RadioGroup value={formData.previousPhysicalActivity} onValueChange={(value) => updateFormData('previousPhysicalActivity', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sim" id="physical-yes" />
                    <Label htmlFor="physical-yes">Sim</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nao" id="physical-no" />
                    <Label htmlFor="physical-no">Não</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="modalities">Qual/quais modalidades?</Label>
                <Input
                  id="modalities"
                  value={formData.modalitiesPracticed || ''}
                  onChange={(e) => updateFormData('modalitiesPracticed', e.target.value)}
                  placeholder="Ex: Musculação, corrida, futebol..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeWithout">Há quanto tempo está sem treinar?</Label>
                <Input
                  id="timeWithout"
                  value={formData.timeWithoutTraining || ''}
                  onChange={(e) => updateFormData('timeWithoutTraining', e.target.value)}
                  placeholder="Ex: 6 meses, 1 ano..."
                />
              </div>

              <div>
                <Label className="text-sm font-semibold mb-3 block">Frequência ideal de treinos por semana:</Label>
                <RadioGroup value={formData.weeklyFrequency} onValueChange={(value) => updateFormData('weeklyFrequency', value)}>
                  {['1x', '2x', '3x', '4x ou mais'].map((freq) => (
                    <div key={freq} className="flex items-center space-x-2">
                      <RadioGroupItem value={freq} id={`freq-${freq}`} />
                      <Label htmlFor={`freq-${freq}`}>{freq}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label className="text-sm font-semibold mb-3 block">Já treinou com personal trainer?</Label>
                <RadioGroup value={formData.previousPersonalTrainer} onValueChange={(value) => updateFormData('previousPersonalTrainer', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sim" id="personal-yes" />
                    <Label htmlFor="personal-yes">Sim</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nao" id="personal-no" />
                    <Label htmlFor="personal-no">Não</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-sm font-semibold mb-3 block">Nível atual de condicionamento:</Label>
                <RadioGroup value={formData.fitnessLevel} onValueChange={(value) => updateFormData('fitnessLevel', value)}>
                  {['Iniciante', 'Intermediário', 'Avançado'].map((level) => (
                    <div key={level} className="flex items-center space-x-2">
                      <RadioGroupItem value={level.toLowerCase()} id={`level-${level.toLowerCase()}`} />
                      <Label htmlFor={`level-${level.toLowerCase()}`}>{level}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-semibold mb-3 block">Saúde e Limitações</Label>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Problemas de saúde:</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Coluna', 'Joelho', 'Ombro', 'Coração', 'Hipertensão', 'Diabetes', 'Ansiedade/Depressão', 'Nenhum'].map((problem) => (
                        <div key={problem} className="flex items-center space-x-2">
                          <Checkbox
                            id={`health-${problem}`}
                            checked={formData.healthProblems?.includes(problem) || false}
                            onCheckedChange={(checked) => updateArrayField('healthProblems', problem, checked as boolean)}
                          />
                          <Label htmlFor={`health-${problem}`} className="text-sm">{problem}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="surgeries">Cirurgias ou lesões:</Label>
                    <Textarea
                      id="surgeries"
                      value={formData.surgeries || ''}
                      onChange={(e) => updateFormData('surgeries', e.target.value)}
                      placeholder="Descreva cirurgias ou lesões anteriores..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medications">Medicações contínuas:</Label>
                    <Input
                      id="medications"
                      value={formData.medications || ''}
                      onChange={(e) => updateFormData('medications', e.target.value)}
                      placeholder="Liste medicamentos em uso..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentPain">Dores ou limitações atuais:</Label>
                    <Textarea
                      id="currentPain"
                      value={formData.currentPain || ''}
                      onChange={(e) => updateFormData('currentPain', e.target.value)}
                      placeholder="Descreva dores ou limitações..."
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-semibold mb-3 block">Estilo de Vida</Label>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Como descreveria a alimentação?</Label>
                    <RadioGroup value={formData.nutrition} onValueChange={(value) => updateFormData('nutrition', value)}>
                      {['Equilibrada', 'Às vezes equilibrada', 'Desorganizada', 'Segue dieta com nutricionista'].map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.toLowerCase().replace(/\s/g, '-')} id={`nutrition-${option.toLowerCase().replace(/\s/g, '-')}`} />
                          <Label htmlFor={`nutrition-${option.toLowerCase().replace(/\s/g, '-')}`}>{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Horas de sono por noite:</Label>
                    <RadioGroup value={formData.sleepHours} onValueChange={(value) => updateFormData('sleepHours', value)}>
                      {['Menos de 5h', '6-7h', '8h ou mais'].map((hours) => (
                        <div key={hours} className="flex items-center space-x-2">
                          <RadioGroupItem value={hours.toLowerCase()} id={`sleep-${hours.toLowerCase()}`} />
                          <Label htmlFor={`sleep-${hours.toLowerCase()}`}>{hours}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Ingestão de água por dia:</Label>
                    <RadioGroup value={formData.waterIntake} onValueChange={(value) => updateFormData('waterIntake', value)}>
                      {['Menos de 1 litro', '1 a 2 litros', 'Mais de 2 litros'].map((water) => (
                        <div key={water} className="flex items-center space-x-2">
                          <RadioGroupItem value={water.toLowerCase()} id={`water-${water.toLowerCase()}`} />
                          <Label htmlFor={`water-${water.toLowerCase()}`}>{water}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Nível de estresse:</Label>
                    <RadioGroup value={formData.stressLevel} onValueChange={(value) => updateFormData('stressLevel', value)}>
                      {['Baixo', 'Médio', 'Alto'].map((stress) => (
                        <div key={stress} className="flex items-center space-x-2">
                          <RadioGroupItem value={stress.toLowerCase()} id={`stress-${stress.toLowerCase()}`} />
                          <Label htmlFor={`stress-${stress.toLowerCase()}`}>{stress}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Bebida alcoólica:</Label>
                      <RadioGroup value={formData.alcohol} onValueChange={(value) => updateFormData('alcohol', value)}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="sim" id="alcohol-yes" />
                          <Label htmlFor="alcohol-yes">Sim</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="nao" id="alcohol-no" />
                          <Label htmlFor="alcohol-no">Não</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-2 block">Fuma:</Label>
                      <RadioGroup value={formData.smoking} onValueChange={(value) => updateFormData('smoking', value)}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="sim" id="smoking-yes" />
                          <Label htmlFor="smoking-yes">Sim</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="nao" id="smoking-no" />
                          <Label htmlFor="smoking-no">Não</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-amfit-text-primary">Objetivos de Treino</h3>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold mb-3 block">Principal objetivo:</Label>
                <RadioGroup value={formData.mainGoal} onValueChange={(value) => updateFormData('mainGoal', value)}>
                  {['Emagrecimento', 'Ganho de massa muscular', 'Definição corporal', 'Reabilitação', 'Condicionamento', 'Estética corporal'].map((goal) => (
                    <div key={goal} className="flex items-center space-x-2">
                      <RadioGroupItem value={goal.toLowerCase().replace(/\s/g, '-')} id={`goal-${goal.toLowerCase().replace(/\s/g, '-')}`} />
                      <Label htmlFor={`goal-${goal.toLowerCase().replace(/\s/g, '-')}`}>{goal}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label className="text-sm font-semibold mb-3 block">Partes do corpo para focar:</Label>
                <div className="grid grid-cols-2 gap-2">
                  {['Abdômen', 'Glúteos', 'Pernas', 'Braços', 'Costas'].map((part) => (
                    <div key={part} className="flex items-center space-x-2">
                      <Checkbox
                        id={`focus-${part}`}
                        checked={formData.bodyFocus?.includes(part) || false}
                        onCheckedChange={(checked) => updateArrayField('bodyFocus', part, checked as boolean)}
                      />
                      <Label htmlFor={`focus-${part}`}>{part}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold mb-3 block">Nível de motivação:</Label>
                <RadioGroup value={formData.motivationLevel} onValueChange={(value) => updateFormData('motivationLevel', value)}>
                  {['Baixo', 'Médio', 'Alto'].map((level) => (
                    <div key={level} className="flex items-center space-x-2">
                      <RadioGroupItem value={level.toLowerCase()} id={`motiv-${level.toLowerCase()}`} />
                      <Label htmlFor={`motiv-${level.toLowerCase()}`}>{level}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dislikes">O que não gosta de fazer nos treinos?</Label>
                <Textarea
                  id="dislikes"
                  value={formData.dislikes || ''}
                  onChange={(e) => updateFormData('dislikes', e.target.value)}
                  placeholder="Ex: exercícios de cardio, agachamento..."
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-amfit-text-primary">PAR-Q (Questionário de Aptidão Física)</h3>
            
            <div className="space-y-4">
              {[
                { key: 'doctorRestriction', text: 'Alguma vez um médico disse que você deve evitar exercícios sem supervisão?' },
                { key: 'chestPain', text: 'Você sente dor no peito durante esforço físico?' },
                { key: 'dizziness', text: 'Já sentiu tontura ou desmaio durante exercícios?' },
                { key: 'boneProblems', text: 'Tem algum problema ósseo/articular que limita movimentos?' },
                { key: 'heartMedication', text: 'Toma medicamento para pressão alta ou coração?' },
                { key: 'specialCare', text: 'Precisa de cuidados especiais para atividade física?' }
              ].map((question) => (
                <div key={question.key}>
                  <Label className="text-sm font-medium mb-3 block">{question.text}</Label>
                  <RadioGroup value={(formData as any)[question.key]} onValueChange={(value) => updateFormData(question.key, value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sim" id={`${question.key}-yes`} />
                      <Label htmlFor={`${question.key}-yes`}>Sim</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="nao" id={`${question.key}-no`} />
                      <Label htmlFor={`${question.key}-no`}>Não</Label>
                    </div>
                  </RadioGroup>
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-amfit-text-primary">Medidas Básicas</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Peso (kg) *</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight || ''}
                  onChange={(e) => updateFormData('weight', parseFloat(e.target.value))}
                  placeholder="70.0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="height">Altura (cm) *</Label>
                <Input
                  id="height"
                  type="number"
                  step="0.1"
                  value={formData.height || ''}
                  onChange={(e) => updateFormData('height', parseFloat(e.target.value))}
                  placeholder="175.0"
                />
              </div>
            </div>

            {formData.weight && formData.height && (
              <Card className="bg-amfit-button/10">
                <CardContent className="p-4">
                  <div className="text-center">
                    <h4 className="font-medium mb-2">IMC Calculado</h4>
                    <div className="text-2xl font-bold text-amfit-button">
                      {calculateBMI()}
                    </div>
                    <p className="text-sm text-amfit-text-secondary mt-1">
                      {(() => {
                        const bmi = parseFloat(calculateBMI() || '0');
                        if (bmi < 18.5) return 'Abaixo do peso';
                        if (bmi < 25) return 'Peso normal';
                        if (bmi < 30) return 'Sobrepeso';
                        return 'Obesidade';
                      })()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-amfit-text-primary">Medidas Corporais (Perímetros)</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: 'neck', label: 'Pescoço (cm)' },
                { key: 'shoulder', label: 'Ombro (cm)' },
                { key: 'chestRelaxed', label: 'Peito relaxado (cm)' },
                { key: 'chestInspired', label: 'Peito inspirado (cm)' },
                { key: 'waist', label: 'Cintura (cm)' },
                { key: 'abdomen', label: 'Abdômen (cm)' },
                { key: 'hip', label: 'Quadril (cm)' },
                { key: 'wristDiameter', label: 'Diâmetro punho (cm)' },
                { key: 'rightArmRelaxed', label: 'Braço D relaxado (cm)' },
                { key: 'rightArmContracted', label: 'Braço D contraído (cm)' },
                { key: 'leftArmRelaxed', label: 'Braço E relaxado (cm)' },
                { key: 'leftArmContracted', label: 'Braço E contraído (cm)' },
                { key: 'rightForearm', label: 'Antebraço direito (cm)' },
                { key: 'leftForearm', label: 'Antebraço esquerdo (cm)' },
                { key: 'rightThigh', label: 'Coxa direita (cm)' },
                { key: 'leftThigh', label: 'Coxa esquerda (cm)' },
                { key: 'rightCalf', label: 'Panturrilha direita (cm)' },
                { key: 'leftCalf', label: 'Panturrilha esquerda (cm)' },
                { key: 'biStyloid', label: 'Bi estiloide (cm)' },
                { key: 'femurDiameter', label: 'Diâmetro fêmur (cm)' }
              ].map((measure) => (
                <div key={measure.key} className="space-y-2">
                  <Label htmlFor={measure.key}>{measure.label}</Label>
                  <Input
                    id={measure.key}
                    type="number"
                    step="0.1"
                    value={(formData as any)[measure.key] || ''}
                    onChange={(e) => updateFormData(measure.key, parseFloat(e.target.value))}
                    placeholder="0.0"
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-amfit-text-primary">Composição Corporal</h3>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold mb-3 block">Protocolo:</Label>
                <Select value={formData.protocol} onValueChange={(value) => updateFormData('protocol', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o protocolo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pollock7">Pollock 7 Dobras</SelectItem>
                    <SelectItem value="bioimpedancia">Bioimpedância</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.protocol === 'pollock7' && (
                <div className="space-y-4">
                  <h4 className="font-medium">Dobras Cutâneas (mm)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { key: 'pectoral', label: 'Peitoral (mm)' },
                      { key: 'midAxillary', label: 'Axilar média (mm)' },
                      { key: 'triceps', label: 'Tríceps (mm)' },
                      { key: 'subscapular', label: 'Subescapular (mm)' },
                      { key: 'abdominal', label: 'Abdominal (mm)' },
                      { key: 'supraIliac', label: 'Supra ilíaca (mm)' },
                      { key: 'rightThighFold', label: 'Coxa direita (mm)' }
                    ].map((fold) => (
                      <div key={fold.key} className="space-y-2">
                        <Label htmlFor={fold.key}>{fold.label}</Label>
                        <Input
                          id={fold.key}
                          type="number"
                          step="0.1"
                          value={(formData as any)[fold.key] || ''}
                          onChange={(e) => updateFormData(fold.key, parseFloat(e.target.value))}
                          placeholder="0.0"
                        />
                      </div>
                    ))}
                  </div>

                  {selectedStudent && calculateBodyFat() && (
                    <Card className="bg-amfit-button/10">
                      <CardContent className="p-4">
                        <div className="text-center">
                          <h4 className="font-medium mb-2">% Gordura Calculado</h4>
                          <div className="text-2xl font-bold text-amfit-button">
                            {calculateBodyFat()}%
                          </div>
                          <p className="text-sm text-amfit-text-secondary mt-1">
                            Protocolo Pollock 7 dobras
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {formData.protocol === 'bioimpedancia' && (
                <div className="space-y-4">
                  <h4 className="font-medium">Dados da Bioimpedância</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bodyFatPercentage">% Gordura corporal</Label>
                      <Input
                        id="bodyFatPercentage"
                        type="number"
                        step="0.1"
                        value={formData.bodyFatPercentage || ''}
                        onChange={(e) => updateFormData('bodyFatPercentage', parseFloat(e.target.value))}
                        placeholder="0.0"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="fatMass">Massa gorda (kg)</Label>
                      <Input
                        id="fatMass"
                        type="number"
                        step="0.1"
                        value={formData.fatMass || ''}
                        onChange={(e) => updateFormData('fatMass', parseFloat(e.target.value))}
                        placeholder="0.0"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="leanMass">Massa magra (kg)</Label>
                      <Input
                        id="leanMass"
                        type="number"
                        step="0.1"
                        value={formData.leanMass || ''}
                        onChange={(e) => updateFormData('leanMass', parseFloat(e.target.value))}
                        placeholder="0.0"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-amfit-text-primary">Finalizar Avaliação</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Observações (opcional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ''}
                  onChange={(e) => updateFormData('notes', e.target.value)}
                  placeholder="Observações adicionais sobre a avaliação..."
                  rows={4}
                />
              </div>

              {selectedStudent && (
                <Card className="bg-amfit-secondary">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-3">Resumo da Avaliação</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Aluno:</span>
                        <span className="font-medium">{selectedStudent.name}</span>
                      </div>
                      {formData.weight && (
                        <div className="flex justify-between">
                          <span>Peso:</span>
                          <span>{formData.weight} kg</span>
                        </div>
                      )}
                      {formData.height && (
                        <div className="flex justify-between">
                          <span>Altura:</span>
                          <span>{formData.height} cm</span>
                        </div>
                      )}
                      {calculateBMI() && (
                        <div className="flex justify-between">
                          <span>IMC:</span>
                          <span>{calculateBMI()}</span>
                        </div>
                      )}
                      {formData.protocol && (
                        <div className="flex justify-between">
                          <span>Protocolo:</span>
                          <span>{formData.protocol === 'pollock7' ? 'Pollock 7 Dobras' : 'Bioimpedância'}</span>
                        </div>
                      )}
                      {calculateBodyFat() && (
                        <div className="flex justify-between">
                          <span>% Gordura:</span>
                          <span>{calculateBodyFat()}%</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold font-montserrat">Avaliação Física Completa</h2>
          <Badge variant="outline">{currentStep + 1} de {steps.length}</Badge>
        </div>
        <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2" />
        
         {/* Steps Navigation */}
         <div className="flex items-center justify-between mt-4 text-xs">
           {steps.map((step, index) => {
             const StepIcon = step.icon;
             return (
               <div 
                 key={index} 
                 className={`flex flex-col items-center space-y-1 ${
                   index <= currentStep ? 'text-amfit-button' : 'text-gray-400'
                 } min-w-0 flex-1`}
               >
                 <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                   index <= currentStep ? 'bg-amfit-button text-white' : 'bg-gray-200'
                 }`}>
                   <StepIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                 </div>
                 <span className="text-center text-xs sm:text-sm leading-tight px-1 break-words">
                   {step.title}
                 </span>
               </div>
             );
           })}
         </div>
      </div>

      {/* Step Content */}
      <Card className="min-h-[600px]">
        <CardContent className="p-6">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={currentStep === 0 ? onCancel : prevStep}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          {currentStep === 0 ? 'Cancelar' : 'Anterior'}
        </Button>

        {currentStep === steps.length - 1 ? (
          <Button onClick={handleSubmit} className="bg-amfit-button hover:bg-amfit-button/90">
            Finalizar Avaliação
          </Button>
        ) : (
          <Button onClick={nextStep}>
            Próximo
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};