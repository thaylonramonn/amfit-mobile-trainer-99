import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface TrainerInfo {
  id: string;
  name: string;
  email: string;
  trainerCode: string;
  instagram?: string;
  createdAt: Date;
}

export const useTrainerInfo = () => {
  const [trainerInfo, setTrainerInfo] = useState<TrainerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: () => void;

    const setupTrainerListener = () => {
      const user = auth.currentUser;
      if (!user) {
        console.log('❌ Usuário não autenticado no hook trainer');
        setLoading(false);
        setError('Usuário não autenticado');
        return;
      }

      console.log('🔍 Buscando dados do trainer:', user.uid);
      
      // Listener em tempo real para dados do trainer
      unsubscribe = onSnapshot(
        doc(db, 'users', user.uid),
        (docSnapshot) => {
          console.log('📊 Snapshot recebido:', { exists: docSnapshot.exists(), id: docSnapshot.id });
          
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            console.log('✅ Dados completos do trainer:', data);
            
            if (!data.trainerCode) {
              console.log('⚠️ TrainerCode não encontrado nos dados');
              setError('Código do trainer não encontrado');
              setLoading(false);
              return;
            }
            
            setTrainerInfo({
              id: docSnapshot.id,
              name: data.name,
              email: data.email,
              trainerCode: data.trainerCode,
              instagram: data.instagram,
              createdAt: data.createdAt?.toDate() || new Date(),
            });
            setError(null);
            console.log('✅ TrainerInfo configurado:', data.trainerCode);
          } else {
            console.log('❌ Documento do trainer não encontrado');
            setError('Dados do trainer não encontrados');
          }
          setLoading(false);
        },
        (error) => {
          console.error('❌ Erro ao buscar dados do trainer:', error);
          setError('Erro ao carregar dados do trainer');
          setLoading(false);
        }
      );
    };

    // Aguardar autenticação
    const authUnsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setupTrainerListener();
      } else {
        setLoading(false);
        setError('Usuário não autenticado');
      }
    });

    return () => {
      if (unsubscribe) {
        console.log('🧹 Limpando listener do trainer');
        unsubscribe();
      }
      authUnsubscribe();
    };
  }, []);

  return { trainerInfo, loading, error };
};