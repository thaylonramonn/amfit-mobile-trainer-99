import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface TraineeInfo {
  id: string;
  name: string;
  email: string;
  trainerCode: string;
  goal: string;
  createdAt: Date;
}

export const useTraineeInfo = () => {
  const [traineeInfo, setTraineeInfo] = useState<TraineeInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: () => void;

    const setupTraineeListener = () => {
      const user = auth.currentUser;
      if (!user) {
        console.log('❌ Usuário não autenticado no hook trainee');
        setLoading(false);
        setError('Usuário não autenticado');
        return;
      }

      console.log('🔍 Buscando dados do trainee:', user.uid);
      
      // Listener em tempo real para dados do trainee
      unsubscribe = onSnapshot(
        doc(db, 'users', user.uid),
        (docSnapshot) => {
          console.log('📊 Snapshot trainee recebido:', { exists: docSnapshot.exists(), id: docSnapshot.id });
          
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            console.log('✅ Dados completos do trainee:', data);
            
            setTraineeInfo({
              id: docSnapshot.id,
              name: data.name,
              email: data.email,
              trainerCode: data.trainerCode,
              goal: data.goal,
              createdAt: data.createdAt?.toDate() || new Date(),
            });
            setError(null);
            console.log('✅ TraineeInfo configurado');
          } else {
            console.log('❌ Documento do trainee não encontrado');
            setError('Dados do trainee não encontrados');
          }
          setLoading(false);
        },
        (error) => {
          console.error('❌ Erro ao buscar dados do trainee:', error);
          setError('Erro ao carregar dados do trainee');
          setLoading(false);
        }
      );
    };

    // Aguardar autenticação
    const authUnsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setupTraineeListener();
      } else {
        setLoading(false);
        setError('Usuário não autenticado');
      }
    });

    return () => {
      if (unsubscribe) {
        console.log('🧹 Limpando listener do trainee');
        unsubscribe();
      }
      authUnsubscribe();
    };
  }, []);

  return { traineeInfo, loading, error };
};