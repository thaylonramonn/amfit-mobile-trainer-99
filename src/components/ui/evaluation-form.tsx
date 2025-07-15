import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Upload, X, Check } from 'lucide-react';
import { toast } from 'sonner';

interface EvaluationFormProps {
  onSubmit: (data: EvaluationData) => void;
  onCancel: () => void;
}

export interface EvaluationData {
  weight: number;
  bodyFat?: number;
  muscleMass?: number;
  height: number;
  photos: File[];
  notes: string;
  date: Date;
}

export const EvaluationForm = ({ onSubmit, onCancel }: EvaluationFormProps) => {
  const [formData, setFormData] = useState<Partial<EvaluationData>>({
    weight: 0,
    height: 0,
    photos: [],
    notes: '',
    date: new Date(),
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.weight || !formData.height) {
      toast.error('Por favor, preencha peso e altura');
      return;
    }

    onSubmit({
      weight: formData.weight!,
      bodyFat: formData.bodyFat,
      muscleMass: formData.muscleMass,
      height: formData.height!,
      photos: formData.photos || [],
      notes: formData.notes || '',
      date: formData.date || new Date(),
    });
  };

  return (
    <Card className="border-0 shadow-medium max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-inter font-semibold text-xl flex items-center">
          <div className="w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center mr-3">
            <Camera className="w-5 h-5 text-white" />
          </div>
          Nova Avaliação Corporal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Medidas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-sm font-semibold">
                Peso (kg) *
              </Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={formData.weight || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  weight: parseFloat(e.target.value) || 0 
                }))}
                className="h-12"
                placeholder="Ex: 70.5"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height" className="text-sm font-semibold">
                Altura (cm) *
              </Label>
              <Input
                id="height"
                type="number"
                value={formData.height || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  height: parseFloat(e.target.value) || 0 
                }))}
                className="h-12"
                placeholder="Ex: 175"
                required
              />
            </div>
          </div>

          {/* Medidas Opcionais */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bodyFat" className="text-sm font-semibold">
                % Gordura Corporal
              </Label>
              <Input
                id="bodyFat"
                type="number"
                step="0.1"
                value={formData.bodyFat || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  bodyFat: parseFloat(e.target.value) || undefined 
                }))}
                className="h-12"
                placeholder="Ex: 15.2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="muscleMass" className="text-sm font-semibold">
                Massa Muscular (kg)
              </Label>
              <Input
                id="muscleMass"
                type="number"
                step="0.1"
                value={formData.muscleMass || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  muscleMass: parseFloat(e.target.value) || undefined 
                }))}
                className="h-12"
                placeholder="Ex: 45.8"
              />
            </div>
          </div>

          {/* Upload de Fotos */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">
              Fotos da Avaliação
            </Label>
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
                Adicione fotos para acompanhar seu progresso visual
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
            <Label htmlFor="notes" className="text-sm font-semibold">
              Observações
            </Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                notes: e.target.value 
              }))}
              placeholder="Anote como se sente, objetivos, etc..."
              className="min-h-[100px]"
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="amfit-primary"
              className="flex-1"
            >
              <Check className="w-4 h-4 mr-2" />
              Salvar Avaliação
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};