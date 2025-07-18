import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, orderBy } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { EvaluationData } from '@/components/ui/evaluation-form';

interface Evaluation extends EvaluationData {
  id: string;
  studentId: string;
  trainerId: string;
  createdAt: Date;
}

export const useEvaluations = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    // Buscar avaliações criadas pelo trainer atual
    const evaluationsQuery = query(
      collection(db, 'evaluations'),
      where('trainerId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      evaluationsQuery,
      (snapshot) => {
        const evaluationsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        })) as Evaluation[];
        
        console.log('📊 Avaliações encontradas:', evaluationsList);
        setEvaluations(evaluationsList);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Erro ao buscar avaliações:', err);
        setError('Erro ao carregar avaliações');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addEvaluation = async (evaluationData: EvaluationData, studentId: string) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Usuário não autenticado');

      const evaluation = {
        ...evaluationData,
        studentId,
        trainerId: user.uid,
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, 'evaluations'), evaluation);
      console.log('💾 Avaliação salva com ID:', docRef.id);
      
      return docRef.id;
    } catch (error) {
      console.error('Erro ao salvar avaliação:', error);
      throw error;
    }
  };

  return {
    evaluations,
    loading,
    error,
    addEvaluation
  };
};