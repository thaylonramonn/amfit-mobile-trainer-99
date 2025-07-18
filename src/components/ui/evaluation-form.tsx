import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Camera, Upload, X, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface EvaluationFormProps {
  onSubmit: (data: EvaluationData) => void;
  onCancel: () => void;
}

export interface EvaluationData {
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
  
  // Medidas corporais
  neck: number;
  shoulder: number;
  chestRelaxed: number;
  chestInspired: number;
  waist: number;
  abdomen: number;
  hip: number;
  wristDiameter: number;
  rightArmRelaxed: number;
  rightArmContracted: number;
  leftArmRelaxed: number;
  leftArmContracted: number;
  leftForearm: number;
  rightForearm: number;
  rightThigh: number;
  leftThigh: number;
  rightCalf: number;
  leftCalf: number;
  biStyloid: number;
  femurDiameter: number;
  
  // Dados básicos
  weight: number;
  height: number;
  bodyFat?: number;
  
  // Dobras cutâneas
  protocol: string;
  subscapular?: number;
  triceps?: number;
  pectoral?: number;
  midAxillary?: number;
  supraIliac?: number;
  abdominal?: number;
  rightThighFold?: number;
  leftThighFold?: number;
  
  photos: File[];
  notes: string;
  date: Date;
}

export const EvaluationForm = ({ onSubmit, onCancel }: EvaluationFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<EvaluationData>>({
    previousPhysicalActivity: '',
    modalitiesPracticed: '',
    timeWithoutTraining: '',
    weeklyFrequency: '',
    previousPersonalTrainer: '',
    fitnessLevel: '',
    mainGoal: '',
    bodyFocus: [],
    motivationLevel: '',
    dislikes: '',
    healthProblems: [],
    surgeries: '',
    medications: '',
    currentPain: '',
    nutrition: '',
    sleepHours: '',
    waterIntake: '',
    stressLevel: '',
    alcohol: '',
    smoking: '',
    doctorRestriction: '',
    chestPain: '',
    dizziness: '',
    boneProblems: '',
    heartMedication: '',
    specialCare: '',
    weight: 0,
    height: 0,
    photos: [],
    notes: '',
    date: new Date(),
    protocol: ''
  });
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (files: FileList | null) => {
    if (!files) return;
    
    const imageFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (imageFiles.length === 0) {
      toast.error('Por favor, selecione apenas arquivos de imagem');
      return;
    }

    setFormData(prev => ({
      ...prev,
      photos: [...(prev.photos || []), ...imageFiles]
    }));
    
    toast.success(`${imageFiles.length} foto(s) adicionada(s)`);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFileChange(e.dataTransfer.files);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos?.filter((_, i) => i !== index) || []
    }));
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.weight || !formData.height) {
      toast.error('Por favor, preencha peso e altura');
      return;
    }

    onSubmit(formData as EvaluationData);
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
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
                  value={formData.modalitiesPracticed}
                  onChange={(e) => updateFormData('modalitiesPracticed', e.target.value)}
                  placeholder="Ex: Musculação, corrida, futebol..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeWithout">Há quanto tempo está sem treinar (se for o caso)?</Label>
                <Input
                  id="timeWithout"
                  value={formData.timeWithoutTraining}
                  onChange={(e) => updateFormData('timeWithoutTraining', e.target.value)}
                  placeholder="Ex: 6 meses, 1 ano..."
                />
              </div>

              <div>
                <Label className="text-sm font-semibold mb-3 block">Frequência ideal de treinos por semana:</Label>
                <RadioGroup value={formData.weeklyFrequency} onValueChange={(value) => updateFormData('weeklyFrequency', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1x" id="freq-1" />
                    <Label htmlFor="freq-1">1x</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2x" id="freq-2" />
                    <Label htmlFor="freq-2">2x</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3x" id="freq-3" />
                    <Label htmlFor="freq-3">3x</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="4x-mais" id="freq-4" />
                    <Label htmlFor="freq-4">4x ou mais</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-sm font-semibold mb-3 block">Já treinou com personal trainer antes?</Label>
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
                <Label className="text-sm font-semibold mb-3 block">Nível atual de condicionamento físico:</Label>
                <RadioGroup value={formData.fitnessLevel} onValueChange={(value) => updateFormData('fitnessLevel', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="iniciante" id="level-beg" />
                    <Label htmlFor="level-beg">Iniciante</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="intermediario" id="level-int" />
                    <Label htmlFor="level-int">Intermediário</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="avancado" id="level-adv" />
                    <Label htmlFor="level-adv">Avançado</Label>
                  </div>
                </RadioGroup>
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
                <Label className="text-sm font-semibold mb-3 block">Qual o principal objetivo?</Label>
                <RadioGroup value={formData.mainGoal} onValueChange={(value) => updateFormData('mainGoal', value)}>
                  {['Emagrecimento', 'Ganho de massa muscular', 'Definição corporal', 'Reabilitação', 'Condicionamento', 'Estética corporal'].map((goal) => (
                    <div key={goal} className="flex items-center space-x-2">
                      <RadioGroupItem value={goal.toLowerCase().replace(/\s/g, '-')} id={`goal-${goal.toLowerCase().replace(/\s/g, '-')}`} />
                      <Label htmlFor={`goal-${goal.toLowerCase().replace(/\s/g, '-')}`}>{goal}</Label>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="outro" id="goal-other" />
                    <Label htmlFor="goal-other">Outro:</Label>
                    <Input placeholder="Especifique..." className="ml-2" />
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-sm font-semibold mb-3 block">Parte(s) do corpo que deseja focar mais:</Label>
                <div className="grid grid-cols-2 gap-2">
                  {['Abdômen', 'Glúteos', 'Pernas', 'Braços', 'Costas'].map((part) => (
                    <div key={part} className="flex items-center space-x-2">
                      <Checkbox
                        id={`focus-${part.toLowerCase()}`}
                        checked={formData.bodyFocus?.includes(part) || false}
                        onCheckedChange={(checked) => updateArrayField('bodyFocus', part, checked as boolean)}
                      />
                      <Label htmlFor={`focus-${part.toLowerCase()}`}>{part}</Label>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2">
                    <Checkbox id="focus-other" />
                    <Label htmlFor="focus-other">Outros:</Label>
                    <Input placeholder="Especifique..." className="ml-2" />
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold mb-3 block">Nível de motivação atual para treinar:</Label>
                <RadioGroup value={formData.motivationLevel} onValueChange={(value) => updateFormData('motivationLevel', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="baixo" id="motiv-low" />
                    <Label htmlFor="motiv-low">Baixo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medio" id="motiv-med" />
                    <Label htmlFor="motiv-med">Médio</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="alto" id="motiv-high" />
                    <Label htmlFor="motiv-high">Alto</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dislikes">Alguma coisa que a pessoa não gosta de fazer nos treinos?</Label>
                <Textarea
                  id="dislikes"
                  value={formData.dislikes}
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
                { key: 'doctorRestriction', text: 'Alguma vez um médico já disse que você deve evitar exercícios sem supervisão ou liberação especial?' },
                { key: 'chestPain', text: 'Você sente dor ou desconforto no peito durante esforço físico ou atividades diárias?' },
                { key: 'dizziness', text: 'Já sentiu tontura, perda de equilíbrio ou desmaio durante ou após exercícios?' },
                { key: 'boneProblems', text: 'Você tem algum problema ósseo, articular ou muscular que limita seus movimentos?' },
                { key: 'heartMedication', text: 'Está tomando algum medicamento para pressão alta, coração ou outra condição relacionada?' },
                { key: 'specialCare', text: 'Alguma condição de saúde faz com que você precise de cuidados especiais ao praticar atividade física?' }
              ].map((question) => (
                <div key={question.key}>
                  <Label className="text-sm font-semibold mb-3 block">{question.text}</Label>
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

            <Separator />

            <div className="space-y-4">
              <h4 className="font-semibold text-amfit-text-primary">Saúde e Limitações</h4>
              
              <div>
                <Label className="text-sm font-semibold mb-3 block">Já teve ou tem algum problema de saúde?</Label>
                <div className="grid grid-cols-2 gap-2">
                  {['Coluna', 'Joelho', 'Ombro', 'Coração', 'Hipertensão', 'Diabetes', 'Ansiedade/Depressão', 'Nenhum'].map((problem) => (
                    <div key={problem} className="flex items-center space-x-2">
                      <Checkbox
                        id={`health-${problem.toLowerCase()}`}
                        checked={formData.healthProblems?.includes(problem) || false}
                        onCheckedChange={(checked) => updateArrayField('healthProblems', problem, checked as boolean)}
                      />
                      <Label htmlFor={`health-${problem.toLowerCase()}`}>{problem}</Label>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2">
                    <Checkbox id="health-other" />
                    <Label htmlFor="health-other">Outro:</Label>
                    <Input placeholder="Especifique..." className="ml-2" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="surgeries">Já passou por alguma cirurgia ou lesão?</Label>
                <Textarea
                  id="surgeries"
                  value={formData.surgeries}
                  onChange={(e) => updateFormData('surgeries', e.target.value)}
                  placeholder="Descreva..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medications">Usa medicação contínua? Qual?</Label>
                <Input
                  id="medications"
                  value={formData.medications}
                  onChange={(e) => updateFormData('medications', e.target.value)}
                  placeholder="Ex: Losartana, Metformina..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentPain">Tem alguma dor ou limitação atual para se movimentar?</Label>
                <Textarea
                  id="currentPain"
                  value={formData.currentPain}
                  onChange={(e) => updateFormData('currentPain', e.target.value)}
                  placeholder="Descreva..."
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-amfit-text-primary">Medidas Corporais</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Peso (kg) *</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight || ''}
                  onChange={(e) => updateFormData('weight', parseFloat(e.target.value) || 0)}
                  placeholder="Ex: 70.5"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Altura (cm) *</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.height || ''}
                  onChange={(e) => updateFormData('height', parseFloat(e.target.value) || 0)}
                  placeholder="Ex: 175"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { key: 'neck', label: 'Pescoço (cm)' },
                { key: 'shoulder', label: 'Ombro (cm)' },
                { key: 'chestRelaxed', label: 'Peito relaxado (cm)' },
                { key: 'chestInspired', label: 'Peito inspirado (cm)' },
                { key: 'waist', label: 'Cintura (cm)' },
                { key: 'abdomen', label: 'Abdômen (cm)' },
                { key: 'hip', label: 'Quadril (cm)' },
                { key: 'wristDiameter', label: 'Diâmetro do punho (cm)' },
                { key: 'rightArmRelaxed', label: 'Braço direito relaxado (cm)' },
                { key: 'rightArmContracted', label: 'Braço direito contraído (cm)' },
                { key: 'leftArmRelaxed', label: 'Braço esquerdo relaxado (cm)' },
                { key: 'leftArmContracted', label: 'Braço esquerdo contraído (cm)' },
                { key: 'leftForearm', label: 'Antebraço esquerdo (cm)' },
                { key: 'rightForearm', label: 'Antebraço direito (cm)' },
                { key: 'rightThigh', label: 'Coxa direita (cm)' },
                { key: 'leftThigh', label: 'Coxa esquerda (cm)' },
                { key: 'rightCalf', label: 'Panturrilha direita (cm)' },
                { key: 'leftCalf', label: 'Panturrilha esquerda (cm)' },
                { key: 'biStyloid', label: 'Bi estiloide (cm)' },
                { key: 'femurDiameter', label: 'Diâmetro fêmur (cm)' }
              ].map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={field.key}>{field.label}</Label>
                  <Input
                    id={field.key}
                    type="number"
                    step="0.1"
                    value={(formData as any)[field.key] || ''}
                    onChange={(e) => updateFormData(field.key, parseFloat(e.target.value) || 0)}
                    placeholder="0.0"
                  />
                </div>
              ))}
            </div>

            <div className="bg-amfit-secondary/20 p-4 rounded-lg">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => toast.info('Funcionalidade de composição corporal em desenvolvimento')}
              >
                <Camera className="w-4 h-4 mr-2" />
                Composição Corporal
              </Button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-amfit-text-primary">Dobras Cutâneas & Finalização</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="protocol">Protocolo</Label>
                <Select value={formData.protocol} onValueChange={(value) => updateFormData('protocol', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o protocolo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pollock-7">Pollock 7 dobras</SelectItem>
                    <SelectItem value="bioimpedancia">Bioimpedância</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.protocol === 'pollock-7' && (
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: 'bodyFat', label: '% Gordura' },
                    { key: 'subscapular', label: 'Subescapular (mm)' },
                    { key: 'triceps', label: 'Tríceps (mm)' },
                    { key: 'pectoral', label: 'Peitoral (mm)' },
                    { key: 'midAxillary', label: 'Axilar média (mm)' },
                    { key: 'supraIliac', label: 'Supra ilíaca (mm)' },
                    { key: 'abdominal', label: 'Abdominal (mm)' },
                    { key: 'rightThighFold', label: 'Coxa direita (mm)' },
                    { key: 'leftThighFold', label: 'Coxa esquerda (mm)' }
                  ].map((field) => (
                    <div key={field.key} className="space-y-2">
                      <Label htmlFor={field.key}>{field.label}</Label>
                      <Input
                        id={field.key}
                        type="number"
                        step="0.1"
                        value={(formData as any)[field.key] || ''}
                        onChange={(e) => updateFormData(field.key, parseFloat(e.target.value) || 0)}
                        placeholder="0.0"
                      />
                    </div>
                  ))}
                </div>
              )}

              {formData.protocol === 'bioimpedancia' && (
                <div className="space-y-2">
                  <Label htmlFor="bodyFat">% Gordura Corporal</Label>
                  <Input
                    id="bodyFat"
                    type="number"
                    step="0.1"
                    value={formData.bodyFat || ''}
                    onChange={(e) => updateFormData('bodyFat', parseFloat(e.target.value) || 0)}
                    placeholder="Ex: 15.2"
                  />
                </div>
              )}
            </div>

            {/* Upload de Fotos */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Fotos da Avaliação</Label>
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
                  dragActive 
                    ? 'border-amfit-orange bg-amfit-orange/5' 
                    : 'border-border hover:border-amfit-orange/50'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDrag}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
              >
                <Camera className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-3">
                  Adicione fotos para acompanhar o progresso visual
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileChange(e.target.files)}
                  className="hidden"
                  id="photo-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('photo-upload')?.click()}
                  className="mb-2"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Escolher Fotos
                </Button>
                <p className="text-xs text-muted-foreground">
                  Ou arraste as fotos aqui
                </p>
              </div>

              {/* Preview das Fotos */}
              {formData.photos && formData.photos.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {formData.photos.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-border"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Observações */}
            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes || ''}
                onChange={(e) => updateFormData('notes', e.target.value)}
                placeholder="Anote como se sente, objetivos, etc..."
                className="min-h-[100px]"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="border-0 shadow-medium max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="font-inter font-semibold text-xl flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center mr-3">
              <Camera className="w-5 h-5 text-white" />
            </div>
            Nova Avaliação Corporal Completa
          </div>
          <div className="text-sm font-normal text-muted-foreground">
            Etapa {currentStep} de 5
          </div>
        </CardTitle>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-brand h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancelar
            </Button>
            
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="flex items-center"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>
            )}
            
            {currentStep < 5 ? (
              <Button
                type="button"
                variant="amfit-primary"
                onClick={nextStep}
                className="flex items-center"
              >
                Próximo
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                variant="amfit-primary"
                className="flex items-center"
              >
                <Check className="w-4 h-4 mr-2" />
                Salvar Avaliação
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};