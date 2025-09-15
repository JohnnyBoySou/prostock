# 📋 TASKS - Melhorias nas Telas Stack

## 🚨 **CRÍTICAS - Corrigir Imediatamente**

### 1. Erros de Sintaxe
- [x] **src/screens/stack/home/index.js:117** - Remover `Font_Book` solto
- [x] **src/screens/stack/home/index.js** - Importar componente `FadeUp` que está sendo usado mas não importado

### 2. Bugs de Funcionamento
- [x] **src/screens/stack/plans/index.tsx:69** - Corrigir estado inicial `selectedPlan` de 'premium' para 'free' (plano que existe)
- [x] **src/screens/stack/product/add.tsx:59-60** - Corrigir inconsistência: usar `estoque_minimo`/`estoque_maximo` em vez de `min`/`max`

## 🔧 **ALTA PRIORIDADE - Funcionalidade**

### 3. Integração com APIs
- [ ] **src/screens/stack/auth/register.tsx:70-72** - Substituir simulação de API por integração real
- [ ] **src/screens/stack/plans/index.tsx:75-77** - Implementar função `handleSubscribe` real com sistema de pagamento
- [ ] **src/screens/stack/auth/login.tsx:36** - Adicionar tratamento de erro para `OneSignal.login()`

### 4. Validações de Formulário
- [ ] **src/screens/stack/product/add.tsx** - Adicionar validação obrigatória para campo "Nome" na aba "Sobre"
- [ ] **src/screens/stack/auth/register.tsx:63-65** - Melhorar validação de senha (complexidade, confirmação)
- [ ] **src/screens/stack/product/add.tsx** - Padronizar validações entre todas as abas

### 5. Tratamento de Erros
- [ ] **src/screens/stack/home/index.js:24-38** - Adicionar tratamento de erro para `fetchStore()`
- [ ] **src/screens/stack/notify/list.js:10-20** - Melhorar tratamento de erro na query
- [ ] **src/screens/stack/auth/login.tsx:37-38** - Implementar tratamento de erro mais específico

## 🎨 **MÉDIA PRIORIDADE - UX/UI**

### 6. Estados de Loading
- [ ] **src/screens/stack/product/list.js** - Adicionar indicador de loading
- [ ] **src/screens/stack/category/list.js** - Adicionar indicador de loading
- [ ] **src/screens/stack/supplier/list.js** - Adicionar indicador de loading
- [ ] **src/screens/stack/move/list.js** - Adicionar indicador de loading

### 7. Melhorias de Lista
- [ ] **src/screens/stack/notify/list.js:46** - Corrigir `keyExtractor` para usar ID único em vez de index
- [ ] **src/screens/stack/product/list.js** - Mostrar informações de estoque atual nos cards
- [ ] **src/screens/stack/product/list.js** - Adicionar filtros por status ou categoria
- [ ] **src/screens/stack/notify/list.js:51** - Simplificar lógica de paginação

### 8. Navegação e Links
- [ ] **src/screens/stack/auth/onboarding.tsx:9** - Substituir URL hardcoded por constante configurável
- [ ] **src/screens/stack/auth/onboarding.tsx** - Adicionar navegação para tela de registro
- [ ] **src/screens/stack/plans/index.tsx:159** - Implementar navegação de volta real

## 🧹 **BAIXA PRIORIDADE - Limpeza e Organização**

### 9. Limpeza de Código
- [ ] **src/screens/stack/home/index.js:129-276** - Remover código comentado extenso
- [ ] **src/screens/stack/home/index.js:274-276** - Remover imports comentados
- [ ] Padronizar nomenclatura de variáveis (português vs inglês)

### 10. Consistência Visual
- [ ] Padronizar espaçamentos e margens entre telas
- [ ] Unificar cores e estilos de botões
- [ ] Melhorar responsividade em diferentes tamanhos de tela

## 🚀 **MELHORIAS AVANÇADAS - Performance e Acessibilidade**

### 11. Performance
- [ ] Implementar lazy loading para listas grandes
- [ ] Otimizar re-renders com React.memo onde apropriado
- [ ] Implementar pull-to-refresh nas listas

### 12. Acessibilidade
- [ ] Adicionar labels apropriados para screen readers
- [ ] Melhorar contraste de cores
- [ ] Implementar navegação por teclado

### 13. Funcionalidades Adicionais
- [ ] Implementar busca em tempo real
- [ ] Adicionar filtros avançados
- [ ] Implementar ordenação de listas
- [ ] Adicionar confirmação para ações destrutivas

## 📊 **MÉTRICAS DE PROGRESSO**

- [x] **4/4** - Erros críticos corrigidos
- [ ] **0/15** - Melhorias de alta prioridade implementadas
- [ ] **0/12** - Melhorias de média prioridade implementadas
- [ ] **0/10** - Melhorias de baixa prioridade implementadas
- [ ] **0/9** - Melhorias avançadas implementadas

## 🎯 **PRÓXIMOS PASSOS RECOMENDADOS**

1. **Semana 1**: Corrigir todos os erros críticos e bugs
2. **Semana 2**: Implementar integrações de API e validações
3. **Semana 3**: Melhorar UX/UI e estados de loading
4. **Semana 4**: Limpeza de código e melhorias de performance

---

**Última atualização**: $(date)
**Total de tarefas**: 59
**Prioridade crítica**: 5 tarefas
**Prioridade alta**: 15 tarefas
**Prioridade média**: 12 tarefas
**Prioridade baixa**: 10 tarefas
**Melhorias avançadas**: 9 tarefas
