import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Link, Share2, Check } from 'lucide-react';
import { toast } from 'sonner';

interface WorkoutLinkGeneratorProps {
  workoutData: {
    name: string;
    exercises: Array<{
      exercise: { name: string; muscleGroup: string };
      sets: number;
      reps: string;
    }>;
  };
  onLinkGenerated: (link: string) => void;
}

export const WorkoutLinkGenerator = ({ workoutData, onLinkGenerated }: WorkoutLinkGeneratorProps) => {
  const [generatedLink, setGeneratedLink] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);

  const generateUniqueLink = () => {
    // Generate a unique workout ID
    const workoutId = `workout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // In a real app, this would be saved to Firebase with the workout data
    const baseUrl = window.location.origin;
    const uniqueLink = `${baseUrl}/workout/${workoutId}`;
    
    // Store workout data in localStorage (temporary solution)
    // In production, this would be saved to Firebase
    localStorage.setItem(`workout_${workoutId}`, JSON.stringify({
      ...workoutData,
      createdAt: new Date().toISOString(),
      id: workoutId
    }));
    
    setGeneratedLink(uniqueLink);
    onLinkGenerated(uniqueLink);
    
    toast.success('Link único gerado com sucesso!');
    
    return uniqueLink;
  };

  const copyToClipboard = async () => {
    if (!generatedLink) return;
    
    try {
      await navigator.clipboard.writeText(generatedLink);
      setIsCopied(true);
      toast.success('Link copiado para a área de transferência!');
      
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast.error('Erro ao copiar link');
    }
  };

  const shareLink = async () => {
    if (!generatedLink) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Treino: ${workoutData.name}`,
          text: `Confira seu treino personalizado criado pelo seu personal trainer!`,
          url: generatedLink
        });
      } catch (error) {
        // User cancelled sharing or error occurred
        copyToClipboard();
      }
    } else {
      // Fallback to copy
      copyToClipboard();
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="font-montserrat flex items-center">
          <Link className="w-5 h-5 mr-2" />
          Link do Treino
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!generatedLink ? (
          <div className="text-center">
            <p className="text-amfit-text-secondary mb-4">
              Gere um link único para que seu aluno acesse este treino diretamente
            </p>
            <Button 
              onClick={generateUniqueLink}
              variant="amfit"
              size="amfit"
              className="w-full"
            >
              <Link className="w-4 h-4 mr-2" />
              Gerar Link Único
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-2">Link gerado:</label>
              <div className="flex space-x-2">
                <Input
                  value={generatedLink}
                  readOnly
                  className="flex-1"
                />
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="icon"
                  className={isCopied ? 'text-green-600' : ''}
                >
                  {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={shareLink}
                variant="outline"
                className="flex-1"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>
              
              <Button
                onClick={() => {
                  setGeneratedLink('');
                  setIsCopied(false);
                }}
                variant="ghost"
                className="flex-1"
              >
                Gerar Novo Link
              </Button>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-800">
                <strong>Como usar:</strong> Envie este link para seu aluno via WhatsApp, email ou qualquer aplicativo de mensagem. 
                Ele poderá acessar o treino diretamente no navegador e acompanhar cada exercício com vídeos e instruções.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};