import { useState, useEffect } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
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

    const setupTrainerListener = async () => {
      try {
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
            if (docSnapshot.exists()) {
              const data = docSnapshot.data();
              console.log('✅ Dados do trainer encontrados:', data);
              
              setTrainerInfo({
                id: docSnapshot.id,
                name: data.name,
                email: data.email,
                trainerCode: data.trainerCode,
                instagram: data.instagram,
                createdAt: data.createdAt?.toDate() || new Date(),
              });
              setError(null);
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
      } catch (error) {
        console.error('❌ Erro ao configurar listener do trainer:', error);
        setError('Erro ao configurar busca do trainer');
        setLoading(false);
      }
    };

    setupTrainerListener();

    return () => {
      if (unsubscribe) {
        console.log('🧹 Limpando listener do trainer');
        unsubscribe();
      }
    };
  }, []);

  return { trainerInfo, loading, error };
};