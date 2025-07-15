import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';

interface WorkoutCompletionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (comment: string, rating: number) => void;
}

export function WorkoutCompletionDialog({ 
  open, 
  onOpenChange, 
  onSubmit 
}: WorkoutCompletionDialogProps) {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);

  const handleSubmit = () => {
    onSubmit(comment, rating);
    setComment('');
    setRating(0);
  };

  const handleCancel = () => {
    onOpenChange(false);
    setComment('');
    setRating(0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-montserrat">
            🎉 Parabéns! Como foi seu treino?
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Rating */}
          <div className="text-center">
            <p className="text-sm font-medium mb-3">Avalie seu treino:</p>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-colors"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Deixe um comentário (opcional):
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ex: Treino foi ótimo! Me senti muito forte hoje 💪"
              className="min-h-[100px] resize-none"
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {comment.length}/200 caracteres
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            className="flex-1 bg-amfit-button hover:bg-amfit-button/90"
            disabled={rating === 0}
          >
            Finalizar Treino
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}