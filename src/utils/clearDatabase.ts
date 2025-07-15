import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const clearAllUserData = async () => {
  try {
    console.log('Iniciando limpeza do banco de dados...');
    
    // Buscar todos os usuários
    const usersSnapshot = await getDocs(collection(db, 'users'));
    
    console.log(`Encontrados ${usersSnapshot.size} usuários para deletar`);
    
    // Deletar todos os usuários
    const deletePromises = usersSnapshot.docs.map(userDoc => 
      deleteDoc(doc(db, 'users', userDoc.id))
    );
    
    await Promise.all(deletePromises);
    
    console.log('Banco de dados limpo com sucesso!');
    console.log('Todos os dados de usuários foram removidos.');
    
    return { success: true, message: 'Banco de dados limpo com sucesso!' };
  } catch (error) {
    console.error('Erro ao limpar banco de dados:', error);
    return { success: false, message: 'Erro ao limpar banco de dados' };
  }
};

// Função para executar diretamente no console do navegador
(window as any).clearDatabase = clearAllUserData;
console.log('Função clearDatabase() disponível no console. Execute clearDatabase() para limpar todos os dados.');