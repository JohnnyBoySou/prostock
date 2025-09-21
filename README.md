# 📦 25Stock

## Sistema de Gestão de Estoque Inteligente

25Stock é um sistema completo de gestão de estoque desenvolvido com React Native e Expo, que combina tecnologias modernas com inteligência artificial para oferecer uma experiência completa de gerenciamento de inventário.

## 🚀 Tecnologias Utilizadas

### Frontend & Mobile
- **React Native** 0.76.6 - Framework principal para desenvolvimento mobile
- **Expo** ~52.0.26 - Plataforma para desenvolvimento e distribuição
- **TypeScript** ~5.7.2 - Tipagem estática para JavaScript
- **Styled Components** - Estilização de componentes

### Navegação & Estado
- **React Navigation** - Navegação com Stack e Drawer
- **TanStack React Query** v5 - Gerenciamento de estado servidor
- **AsyncStorage** - Armazenamento local persistente
- **Context API** - Gerenciamento de estado global

### UI & Experiência
- **React Native Reanimated** - Animações performáticas
- **React Native Gesture Handler** - Gestos nativos
- **Lucide React Native** - Biblioteca de ícones
- **React Native SVG** - Renderização de gráficos vetoriais
- **React Native Gifted Charts** - Visualização de dados
- **Moti** - Animações declarativas

### Comunicação & APIs
- **Axios** - Cliente HTTP para APIs
- **OneSignal** - Notificações push
- **Expo Notifications** - Sistema de notificações nativo

### Recursos Avançados
- **Expo Camera** - Captura de fotos e documentos
- **Expo Image Picker** - Seleção de imagens
- **Expo Image Manipulator** - Processamento de imagens
- **Inteligência Artificial** - Leitura automatizada de documentos

## 🎯 Principais Funcionalidades

### 📱 Gestão de Produtos
- ✅ Cadastro, edição e exclusão de produtos
- ✅ Controle de estoque mínimo e máximo
- ✅ Categorização de produtos
- ✅ Importação em massa via CSV
- ✅ Busca e filtros avançados

### 🏪 Gestão de Lojas
- ✅ Suporte a múltiplas lojas
- ✅ Configuração individual por loja
- ✅ Transferência entre lojas

### 🤝 Gestão de Fornecedores
- ✅ Cadastro completo de fornecedores
- ✅ Controle de dados empresariais (CNPJ, Razão Social)
- ✅ Gestão de responsáveis e contatos
- ✅ Importação via CSV

### 👥 Gestão de Usuários
- ✅ Sistema de autenticação completo
- ✅ Diferentes níveis de permissão
- ✅ Perfis de usuário personalizáveis

### 📊 Relatórios e Analytics
- ✅ Relatórios de produtos
- ✅ Relatórios de fornecedores
- ✅ Análises de movimento de estoque
- ✅ Gráficos interativos

### 🤖 Inteligência Artificial
- ✅ Leitura automatizada de documentos
- ✅ Processamento de imagens via câmera
- ✅ Extração de dados de notas fiscais

### 📱 Recursos Mobile
- ✅ Notificações push
- ✅ Modo offline parcial
- ✅ Interface responsiva
- ✅ Suporte a gestos nativos

## 🛠 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Git](https://git-scm.com/)

### Para desenvolvimento Android:
- [Android Studio](https://developer.android.com/studio)
- Android SDK

### Para desenvolvimento iOS:
- macOS
- [Xcode](https://developer.apple.com/xcode/)

## ⚡ Instalação e Configuração

1. **Clone o repositório:**
```bash
git clone https://github.com/JohnnyBoySou/25stock.git
cd 25stock
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Inicie o servidor de desenvolvimento:**
```bash
npx expo start
```

## 📱 Scripts Disponíveis

```bash
# Desenvolvimento
npm start                 # Inicia o servidor Expo
npx expo start           # Alternativa para iniciar o servidor
npx expo start --clear   # Inicia limpando o cache

# Build & Deploy
npx expo run:android     # Compila e executa no Android
npx expo run:ios         # Compila e executa no iOS (macOS + Xcode)
npx expo start --web     # Executa versão web

# Build para produção
npx expo build:android   # Build para Android
npx expo build:ios       # Build para iOS
```

## 🏗 Arquitetura do Projeto

```
src/
├── api/              # Camada de comunicação com APIs
│   ├── auth/         # Autenticação
│   ├── product/      # Produtos
│   ├── supplier/     # Fornecedores
│   ├── category/     # Categorias
│   └── user/         # Usuários
├── context/          # Context API para estado global
├── hooks/            # Custom hooks reutilizáveis
├── routes/           # Configuração de navegação
│   ├── main.js       # Roteamento principal
│   ├── stack.js      # Stack navigation
│   └── drawer.js     # Drawer navigation
├── screens/          # Telas da aplicação
│   └── stack/        # Telas organizadas por funcionalidade
├── ui/               # Componentes de interface reutilizáveis
└── assets/           # Recursos estáticos (imagens, fontes)
```

### 🧭 Sistema de Navegação

O 25Stock utiliza **React Navigation v7** com:
- **Stack Navigation**: Para fluxos lineares
- **Drawer Navigation**: Para menu lateral
- **Deep Linking**: Suporte a links profundos (`25stock://`)

### 🎨 Componentes UI

Sistema de design personalizado com:
- Componentes estilizados com Styled Components
- Tema consistente com cores definidas
- Tipografia customizada (Mundial font family)
- Animações fluidas com Reanimated

## 🔧 Configurações do Ambiente

### Caminhos Absolutos
O projeto utiliza **babel-plugin-module-resolver** para imports absolutos:

```javascript
import { Button } from '@/ui'
import { useUser } from '@/context/user'
import { listProducts } from '@/api/product'
```

### Variáveis de Ambiente
Configure as seguintes variáveis:
```env
EXPO_PUBLIC_KEY=your_onesignal_key
EXPO_PUBLIC_API_URL=your_api_url
```

## 📋 API Endpoints

O sistema se comunica com uma API REST que oferece os seguintes recursos:

### Autenticação
- `POST /auth/login` - Login de usuário
- `POST /auth/register` - Registro de usuário
- `POST /auth/logout` - Logout

### Produtos
- `GET /usuarios/produto` - Listar produtos
- `POST /usuarios/produto` - Criar produto
- `PUT /usuarios/produto/:id` - Atualizar produto
- `DELETE /usuarios/produto/:id` - Excluir produto
- `POST /usuarios/upload/produtos` - Importar produtos via CSV

### Fornecedores
- `GET /usuarios/fornecedor` - Listar fornecedores
- `POST /usuarios/fornecedor` - Criar fornecedor
- `PUT /usuarios/fornecedor/:id` - Atualizar fornecedor
- `DELETE /usuarios/fornecedor/:id` - Excluir fornecedor
- `POST /usuarios/upload/fornecedores` - Importar fornecedores via CSV

## 🧪 Recursos de IA

### Leitura de Documentos
- Processamento de imagens via câmera
- Extração automática de dados de notas fiscais
- OCR (Reconhecimento Ótico de Caracteres)
- Suporte a múltiplos formatos de documento

## 📱 Instalação no Dispositivo

### Android
1. Baixe o APK mais recente das [Releases](https://github.com/JohnnyBoySou/25stock/releases)
2. Habilite "Fontes desconhecidas" no Android
3. Instale o APK

### iOS
1. Build através do Xcode
2. Ou use TestFlight para distribuição beta

## 🔧 Desenvolvimento

### Executar com Expo Go
```bash
npx expo start
```
Escaneie o QR code com o app Expo Go

### Build de Desenvolvimento
```bash
# Android
npx expo run:android --variant debug

# iOS  
npx expo run:ios --configuration Debug
```

## 🏃‍♂️ Emulação
### Emuladores Recomendados

**Android:**
- Android Studio Emulator
- [WSA (Windows Subsystem for Android)](https://github.com/MustardChef/WSABuilds/releases/tag/Windows_11_2311.40000.5.0_LTS_3) para Windows
- Dispositivo físico com [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=pt_BR&pli=1)

**iOS:**
- iOS Simulator (Xcode)
- Dispositivo físico com Expo Go

## 🔒 Permissões

O aplicativo requer as seguintes permissões:

### Android
- `CAMERA` - Para captura de documentos
- `READ_EXTERNAL_STORAGE` - Para acessar arquivos
- `WRITE_EXTERNAL_STORAGE` - Para salvar dados
- `RECORD_AUDIO` - Para recursos de áudio

### iOS
- Camera Usage - Para escaneamento de documentos
- Photo Library - Para seleção de imagens

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Diretrizes de Contribuição
- Siga os padrões de código TypeScript
- Adicione testes para novas funcionalidades
- Documente mudanças na API
- Use commits semânticos

## 📄 Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Desenvolvedor

**JohnnyBoySou**
- GitHub: [@JohnnyBoySou](https://github.com/JohnnyBoySou)

---

<div align="center">

**Feito com ❤️ e tecnologias modernas**

[⬆ Voltar ao topo](#-25stock)

</div>
