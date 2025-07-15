# 🔥 Configuração do Firebase para AM Fit

## 1. Criar Projeto Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Nome do projeto: `AM Fit`
4. Desabilite o Google Analytics (opcional)
5. Clique em "Criar projeto"

## 2. Configurar Authentication

1. No painel do Firebase, vá em **Authentication**
2. Clique em **Primeiros passos**
3. Na aba **Método de login**, habilite:
   - ✅ **E-mail/senha**
4. Clique em **Salvar**

## 3. Configurar Firestore Database

1. No painel do Firebase, vá em **Firestore Database**
2. Clique em **Criar banco de dados**
3. Escolha **Começar no modo de teste**
4. Selecione a localização mais próxima

## 4. Obter Configurações do Projeto

1. No painel do Firebase, clique na **engrenagem ⚙️** → **Configurações do projeto**
2. Na seção **Seus aplicativos**, clique em **</>** (Web)
3. Nome do app: `AM Fit Web`
4. **NÃO** marque "Configurar o Firebase Hosting"
5. Clique em **Registrar app**
6. **COPIE** o objeto `firebaseConfig`

## 5. Atualizar Configurações no Projeto

1. Abra o arquivo `src/lib/firebase.ts`
2. Substitua o objeto `firebaseConfig` pelas suas credenciais:

```typescript
const firebaseConfig = {
  apiKey: "sua-api-key-aqui",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "seu-app-id-aqui"
};
```

## 6. Regras de Segurança do Firestore

No **Firestore Database** → **Regras**, substitua por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários podem ler/escrever apenas seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 7. Estrutura de Dados

O Firestore criará automaticamente a coleção `users` com:

### Para Alunos (TRAINEE):
```json
{
  "name": "Nome do Aluno",
  "email": "email@exemplo.com",
  "birthdate": "1990-01-01",
  "goal": "emagrecimento",
  "userType": "TRAINEE",
  "createdAt": "timestamp"
}
```

### Para Treinadores (TRAINER):
```json
{
  "name": "Nome do Treinador",
  "email": "email@exemplo.com", 
  "instagram": "https://instagram.com/perfil",
  "userType": "TRAINER",
  "createdAt": "timestamp"
}
```

## ✅ Pronto!

Agora o AM Fit está configurado com:
- ✅ Autenticação por e-mail/senha
- ✅ Banco de dados Firestore
- ✅ Diferenciação entre alunos e treinadores
- ✅ Recuperação de senha
- ✅ Dados seguros com regras do Firestore