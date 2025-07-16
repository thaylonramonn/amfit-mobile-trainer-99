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
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      setError('Usuário não autenticado');
      return;
    }

    console.log('🔍 Buscando dados do trainer:', user.uid);
    
    // Listener em tempo real para dados do trainer
    const unsubscribe = onSnapshot(
      doc(db, 'users', user.uid),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          console.log('✅ Dados do trainer encontrados:', data);
          
          setTrainerInfo({
            id: doc.id,
            name: data.name,
            email: data.email,
            trainerCode: data.trainerCode,
            instagram: data.instagram,
            createdAt: data.createdAt?.toDate() || new Date(),
          });
          setError(null);
        } else {
          console.log('❌ Dados do trainer não encontrados');
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

    return () => unsubscribe();
  }, []);

  return { trainerInfo, loading, error };
};