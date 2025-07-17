import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface Notification {
  id: string;
  type: 'workout_completed' | 'new_student' | 'assessment_due';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  studentName?: string;
  rating?: number;
  comments?: string;
}

// Função para criar notificação
export const createNotification = async (
  recipientId: string, 
  type: Notification['type'], 
  title: string, 
  message: string,
  studentName?: string
) => {
  try {
    await addDoc(collection(db, 'notifications'), {
      recipientId,
      type,
      title,
      message,
      studentName,
      timestamp: serverTimestamp(),
      read: false,
      createdAt: new Date()
    });
    console.log('✅ Notificação criada:', { recipientId, type, title });
  } catch (error) {
    console.error('❌ Erro ao criar notificação:', error);
  }
};

export const NotificationSystem = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Buscar notificações do usuário atual
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('recipientId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      const notificationsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      })) as Notification[];
      
      // Ordenar por data mais recente
      notificationsList.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      
      console.log('🔔 Notificações carregadas:', notificationsList.length);
      setNotifications(notificationsList);
    });

    return () => unsubscribe();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins}min atrás`;
    } else if (diffHours < 24) {
      return `${diffHours}h atrás`;
    } else {
      return `${diffDays}d atrás`;
    }
  };

  const renderNotificationContent = (notification: Notification) => {
    switch (notification.type) {
      case 'workout_completed':
        return (
          <div>
            <p className="text-sm">{notification.message}</p>
            {notification.rating && (
              <div className="mt-2">
                <p className="text-xs text-amfit-text-secondary">
                  Avaliação: {'⭐'.repeat(notification.rating)}
                </p>
                {notification.comments && (
                  <p className="text-xs text-amfit-text-secondary mt-1 italic">
                    "{notification.comments}"
                  </p>
                )}
              </div>
            )}
          </div>
        );
      default:
        return <p className="text-sm">{notification.message}</p>;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/20">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-montserrat">Notificações</CardTitle>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  Marcar todas como lidas
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-80">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-amfit-text-secondary">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma notificação</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                        !notification.read ? 'bg-amfit-button/5 border-l-4 border-l-amfit-button' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <span className="text-xs text-amfit-text-secondary">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                      </div>
                      {renderNotificationContent(notification)}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};