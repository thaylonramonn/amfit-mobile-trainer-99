import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Bell, BellOff, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export const NotificationPermission = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Check if notifications are supported
    if ('Notification' in window) {
      setPermission(Notification.permission);
      
      // Show dialog if permission not yet determined
      if (Notification.permission === 'default') {
        setShowDialog(true);
      }
    }
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window) {
      try {
        const result = await Notification.requestPermission();
        setPermission(result);
        
        if (result === 'granted') {
          toast.success('Notificações ativadas! Você receberá avisos importantes.');
          // Send a test notification
          new Notification('AM Fit', {
            body: 'Notificações ativadas com sucesso! 💪',
            icon: '/favicon.ico'
          });
        } else if (result === 'denied') {
          toast.error('Notificações bloqueadas. Você pode ativar nas configurações do navegador.');
        }
        
        setShowDialog(false);
      } catch (error) {
        console.error('Error requesting notification permission:', error);
        toast.error('Erro ao solicitar permissão para notificações');
      }
    } else {
      toast.error('Seu navegador não suporta notificações');
    }
  };

  const dismissDialog = () => {
    setShowDialog(false);
    toast.info('Você pode ativar as notificações a qualquer momento nas configurações');
  };

  if (!('Notification' in window)) {
    return null;
  }

  return (
    <>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="font-montserrat flex items-center">
              <Bell className="w-6 h-6 mr-2 text-amfit-button" />
              Ativar Notificações
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-amfit-button/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-amfit-button" />
              </div>
              <p className="text-sm text-amfit-text-secondary">
                Receba notificações sobre:
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                <span>Novos treinos criados pelo seu personal</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                <span>Lembretes de treinos agendados</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                <span>Atualizações importantes</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={dismissDialog}
                className="flex-1"
              >
                Agora não
              </Button>
              <Button 
                onClick={requestPermission}
                className="flex-1 bg-black hover:bg-black/90 text-white"
              >
                Ativar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notification Status Indicator */}
      {permission === 'granted' && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-100 border border-green-300 rounded-lg p-2 flex items-center space-x-2">
            <Bell className="w-4 h-4 text-green-600" />
            <span className="text-xs text-green-800">Notificações ativas</span>
          </div>
        </div>
      )}
    </>
  );
};

// Utility function to send notifications
export const sendNotification = (title: string, body: string, options?: NotificationOptions) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/favicon.ico',
      ...options
    });
  }
};