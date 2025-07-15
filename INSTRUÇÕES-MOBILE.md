# 📱 Como Transformar em App Mobile - AM Fit

## 1. Preparar o Projeto para Mobile

### Instalar Capacitor (já instalado)
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
```

### Inicializar Capacitor (já configurado)
```bash
npx cap init
```

## 2. Exportar para GitHub

1. No Lovable, clique no botão **GitHub** no canto superior direito
2. Conecte sua conta GitHub
3. Clique em **"Export to GitHub"**
4. Crie um repositório: `amfit-mobile-app`

## 3. Fazer Setup Local

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/amfit-mobile-app.git
cd amfit-mobile-app

# 2. Instalar dependências
npm install

# 3. Fazer build do projeto
npm run build
```

## 4. Configurar para Android

```bash
# Adicionar plataforma Android
npx cap add android

# Atualizar dependências nativas
npx cap update android

# Sincronizar arquivos
npx cap sync android

# Abrir no Android Studio
npx cap run android
```

### Pré-requisitos Android:
- ✅ **Android Studio** instalado
- ✅ **Android SDK** configurado
- ✅ **Java JDK 11+** instalado

## 5. Configurar para iOS (apenas Mac)

```bash
# Adicionar plataforma iOS
npx cap add ios

# Atualizar dependências nativas
npx cap update ios

# Sincronizar arquivos
npx cap sync ios

# Abrir no Xcode
npx cap run ios
```

### Pré-requisitos iOS:
- ✅ **macOS** (obrigatório)
- ✅ **Xcode** instalado
- ✅ **iOS Simulator** ou dispositivo iOS

## 6. Testar no Emulador

### Android:
1. Abra **Android Studio**
2. Vá em **Tools** → **AVD Manager**
3. Crie um emulador (ex: Pixel 6, Android 13)
4. Execute: `npx cap run android`

### iOS:
1. Abra **Xcode**
2. Selecione um simulador (ex: iPhone 14)
3. Execute: `npx cap run ios`

## 7. Hot Reload (Desenvolvimento)

O app está configurado para conectar ao Lovable durante desenvolvimento:
- ✅ Edite no Lovable
- ✅ Mudanças aparecem automaticamente no app mobile
- ✅ URL: `https://4e3b7b53-09ea-4b91-b9a1-ffcf0cabf6eb.lovableproject.com`

## 8. Build para Produção

### Android (APK):
```bash
# Build
npm run build
npx cap sync android

# No Android Studio:
# Build → Generate Signed Bundle/APK → APK
```

### iOS (App Store):
```bash
# Build
npm run build
npx cap sync ios

# No Xcode:
# Product → Archive → Distribute App
```

## 9. Funcionalidades Mobile Nativas

O app já está configurado com:
- ✅ **Splash Screen** customizada
- ✅ **Ícone** personalizado (adicionar: `android/app/src/main/res/`)
- ✅ **Hot Reload** para desenvolvimento
- ✅ **Firebase** para autenticação
- ✅ **Design responsivo** mobile-first

## 📋 Checklist Final

- [ ] Firebase configurado
- [ ] Projeto exportado para GitHub
- [ ] Clone local funcionando
- [ ] Android Studio ou Xcode instalado
- [ ] Build de produção testado
- [ ] App rodando no emulador/dispositivo

## 🚀 Próximos Passos

1. **Testar** todas as funcionalidades no mobile
2. **Adicionar ícone** personalizado do AM Fit
3. **Configurar** notificações push (opcional)
4. **Publicar** na Play Store/App Store

---

**Documentação completa:** [Capacitor Mobile Development](https://lovable.dev/blogs/TODO)