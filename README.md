# Sorvetes Litorâneo - Site Responsivo

Site estático responsivo para a sorveteria "Sorvetes Litorâneo", desenvolvido com HTML5, CSS3 e JavaScript puro, incluindo painel administrativo completo e sistema de pedidos integrado.

## 📁 Estrutura do Projeto

```
Site_litoranea/
├── index.html          # Página inicial
├── cardapio.html       # Cardápio completo com filtros
├── sobre.html          # Página sobre a empresa
├── contato.html        # Contato e localização
├── admin.html          # Painel administrativo
├── styles.css          # Estilos CSS (mobile-first)
├── admin.css           # Estilos do painel admin
├── scripts.js          # JavaScript (funcionalidades principais)
├── admin.js            # JavaScript do painel admin
├── destaques.json      # Dados dos destaques (gerenciado pelo admin)
├── cardapio.json       # Dados do cardápio (gerenciado pelo admin)
├── sobre.json          # Texto "Sobre Nós" (gerenciado pelo admin)
├── config-pedido.json  # Configurações de pedidos (taxa, itens, preços)
└── assets/
    ├── logo.png        # Logo da empresa
    ├── hero-1.jpg      # Imagem principal do hero
    ├── praia.jpg       # Imagem da seção sobre
    └── sabores/        # Imagens dos produtos
        ├── picoles-de-fruta.jpg
        ├── picoles-ao-leite.jpg
        └── ... (outras imagens)
```

## 🚀 Como Usar

### 1. Informações Já Preenchidas ✅

- **Telefone**: (13) 3426-1517 ✅
- **WhatsApp**: 551334261517 ✅
- **Endereço**: R. Maria Píres, 174 - Savoy, Itanhaém - SP ✅
- **Ano de fundação**: 2010 ✅
- **Instagram**: https://www.instagram.com/sorveteslitoraneo/ ✅
- **iFood**: Link configurado ✅

### 2. Painel Administrativo 🔐

O site inclui um painel administrativo completo que funciona **100% offline** usando apenas HTML, CSS e JavaScript puro.

#### Acesso ao Painel

1. Abra o arquivo `admin.html` no navegador
2. **Usuário:** `Admin`
3. **Senha:** `MeMiFabi`
4. Clique em "Entrar"

#### Funcionalidades do Painel

**Gerenciar Destaques:**
- Adicionar, editar, excluir e reordenar produtos em destaque na página inicial
- Os dados são salvos em `destaques.json`
- Sistema de drag and drop para reordenar

**Gerenciar Cardápio:**
- Adicionar, editar e excluir produtos do cardápio
- Organizar por setores (Picolés, Sorvetes, Açaí, Potes, Especiais, Coberturas)
- Os dados são salvos em `cardapio.json`

**Editar "Sobre Nós":**
- Editar o texto completo da história da empresa
- Suporte a quebras de linha e parágrafos
- Os dados são salvos em `sobre.json`

**Configurar Pedidos:**
- Gerenciar taxa de entrega
- Configurar produtos, sabores e preços para o sistema de pedidos
- Adicionar, editar e excluir itens do pedido
- Os dados são salvos em `config-pedido.json`

#### Sistema de Importação/Exportação

Como o painel funciona offline (sem servidor), ele usa:

1. **localStorage do navegador** - Dados são salvos automaticamente no navegador
2. **Importar JSONs** - Botão "📥 Importar JSONs" para carregar os arquivos JSON existentes
3. **Exportar JSONs** - Botão "📤 Exportar JSONs" para baixar os arquivos atualizados

**Fluxo de trabalho:**
1. Primeira vez: Clique em "📥 Importar JSONs" e selecione os arquivos `destaques.json`, `cardapio.json`, `sobre.json` e `config-pedido.json`
2. Edite o que precisar - tudo é salvo automaticamente no localStorage
3. Quando quiser atualizar os arquivos no servidor: Clique em "📤 Exportar JSONs" e faça upload dos arquivos baixados

**Nota:** O painel detecta automaticamente se está sendo usado via `file://` (aberto diretamente) ou via servidor HTTP, e adapta o comportamento automaticamente.

### 3. Sistema de Pedidos 🛒

O site possui um sistema completo de pedidos integrado:

**Funcionalidades:**
- Modal de pedidos acessível de qualquer página
- Seleção de produtos e sabores específicos
- Cálculo automático de totais
- Taxa de entrega configurável
- Opção de retirada ou entrega
- Geração automática de mensagem para WhatsApp
- Integração com iFood

**Como funciona:**
1. Cliente clica em "Peça Agora" ou "Adicionar" em um produto
2. Modal de pedidos abre com formulário completo
3. Cliente seleciona produtos, sabores e quantidades
4. Sistema calcula total automaticamente (incluindo taxa de entrega se aplicável)
5. Cliente preenche dados de entrega/retirada
6. Ao enviar, abre WhatsApp com mensagem formatada do pedido

**Configuração:**
- Taxa de entrega e itens são gerenciados pelo painel admin
- Dados salvos em `config-pedido.json`
- Sistema carrega automaticamente do localStorage ou JSON

### 4. Publicar o Site

#### **Opção 1: GitHub Pages (Recomendado)**

1. Crie um repositório no GitHub
2. Faça upload de todos os arquivos
3. Vá em Settings → Pages
4. Selecione a branch `main` e pasta `/root`
5. Acesse `https://seu-usuario.github.io/nome-do-repo`

#### **Opção 2: Netlify (Recomendado para Deploy Rápido)**

**Método 1: Deploy via Drag & Drop (Mais Rápido)**

1. Acesse [Netlify](https://www.netlify.com/)
2. Faça login ou crie uma conta gratuita
3. Na página inicial, arraste e solte a pasta `Site_litoranea` inteira
4. Aguarde o deploy (pode levar alguns minutos)
5. O Netlify gerará uma URL automática
6. Você pode personalizar o nome do site em: Site settings → Change site name

**Método 2: Deploy via GitHub (Recomendado para Atualizações Automáticas)**

1. Crie um repositório no GitHub
2. Faça upload de todos os arquivos do projeto
3. Acesse [Netlify](https://www.netlify.com/) e faça login
4. Clique em "Add new site" → "Import an existing project"
5. Escolha "GitHub" e autorize o Netlify
6. Selecione o repositório criado
7. Configure:
   - **Build command**: Deixe vazio (site estático)
   - **Publish directory**: `.` (raiz do projeto)
8. Clique em "Deploy site"
9. O site será publicado automaticamente e atualizado a cada push no GitHub

#### **Opção 3: Servidor Web Tradicional**

1. Faça upload de todos os arquivos via FTP
2. Certifique-se de manter a estrutura de pastas
3. Acesse via URL do servidor

## ✨ Funcionalidades

### Site Principal

- ✅ Design responsivo (mobile-first)
- ✅ Header fixo com menu colapsável em mobile
- ✅ Hero section com CTA duplo
- ✅ Cards de sabores com imagens
- ✅ Filtros por categoria (creme, fruta, vegano)
- ✅ Busca por nome de sabor
- ✅ **Sistema completo de pedidos com modal**
- ✅ **Seleção de produtos e sabores específicos**
- ✅ **Cálculo automático de totais e taxa de entrega**
- ✅ Integração com WhatsApp (mensagem formatada)
- ✅ Integração com iFood
- ✅ Formulário de contato
- ✅ Mapa Google Maps
- ✅ SEO otimizado (meta tags, schema.org)
- ✅ Acessibilidade (ARIA, contraste, navegação por teclado)
- ✅ Lazy loading de imagens
- ✅ Conteúdo dinâmico carregado de JSONs
- ✅ Atualização automática de conteúdo (localStorage + JSON)

### Painel Administrativo

- ✅ Autenticação por senha
- ✅ Gerenciamento completo de destaques
- ✅ Gerenciamento completo de cardápio
- ✅ Edição de texto "Sobre Nós"
- ✅ **Configuração completa de pedidos (taxa, itens, preços)**
- ✅ Sistema de importação/exportação de JSONs
- ✅ Armazenamento local (localStorage)
- ✅ Funciona 100% offline
- ✅ Interface moderna e responsiva
- ✅ Drag and drop para reordenar destaques
- ✅ Pré-visualização de imagens
- ✅ Validação de formulários
- ✅ Notificações de sucesso/erro

## 🎨 Paleta de Cores

- **Marrom/Rosa**: `#ff8fa3` (cor principal)
- **Marrom Escuro**: `#d65a7a`
- **Branco**: `#ffffff`
- **Bege**: `#fff5f8`
- **Texto**: `#2a2a2a`
- **Texto Claro**: `#666666`

## 📱 Breakpoints Responsivos

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

## 🔧 Tecnologias Utilizadas

- HTML5 semântico
- CSS3 (Grid, Flexbox, Custom Properties)
- JavaScript ES6+ (sem dependências)
- Google Fonts (Playfair Display + Lato)
- Schema.org (microdados)
- localStorage (para painel admin offline)
- Fetch API (para carregar JSONs)

## 📝 Checklist Antes de Publicar

- [x] Telefone e WhatsApp preenchidos
- [x] Link do Instagram adicionado
- [x] Endereço completo preenchido
- [x] Ano de fundação preenchido
- [x] Painel administrativo configurado
- [x] Sistema de importação/exportação funcionando
- [x] Sistema de pedidos implementado
- [x] Configuração de pedidos funcionando
- [x] Testar formulário de pedidos (WhatsApp)
- [x] Testar em diferentes dispositivos
- [x] Verificar links de navegação
- [x] Otimizar imagens (recomendado)
- [x] Testar acessibilidade (navegação por teclado)
- [x] Verificar meta tags e SEO
- [x] Testar painel admin (importar/exportar JSONs)
- [x] Testar sistema de pedidos completo

## 🐛 Solução de Problemas

### Imagens não aparecem
- Verifique se os caminhos estão corretos (case-sensitive)
- Certifique-se de que as imagens estão na pasta `assets/`

### WhatsApp não abre
- Verifique se o número está correto em `scripts.js`
- Formato: `551334261517` (código do país + DDD + número)

### Menu mobile não funciona
- Verifique se o `scripts.js` está carregado
- Abra o console do navegador para ver erros

### Mapa não aparece
- Verifique a conexão com a internet
- Atualize o código do iframe do Google Maps

### Painel admin não carrega dados
- Se estiver usando `file://`, use os botões "📥 Importar JSONs" para carregar os arquivos
- Verifique se os arquivos JSON estão na raiz do projeto
- Abra o console do navegador (F12) para ver mensagens de debug

### Erro ao salvar no painel admin
- Os dados são salvos automaticamente no localStorage
- Use o botão "📤 Exportar JSONs" para baixar os arquivos atualizados
- Faça upload manual dos arquivos JSON no servidor

### Select de itens não carrega no modal de pedidos
- Verifique se o `config-pedido.json` está na raiz do projeto
- Se estiver usando `file://`, importe o JSON no painel admin primeiro
- O sistema carrega automaticamente do localStorage ou JSON
- Abra o console do navegador (F12) para ver mensagens de debug

### Pedidos não calculam corretamente
- Verifique se a taxa de entrega está configurada no painel admin
- Certifique-se de que os preços dos itens estão corretos
- O sistema usa valores do `config-pedido.json` ou localStorage

### Formulário de contato não envia e-mail
- Verifique se o EmailJS está configurado corretamente (veja seção abaixo)
- Confirme que as chaves (Service ID, Template ID, Public Key) estão corretas em `scripts.js`
- Se não estiver configurado, o sistema usa WhatsApp como fallback

## 📧 Configuração do Envio de E-mail (EmailJS)

O formulário de contato está configurado para enviar e-mails para `adm@sorveteslitoraneo.com.br` usando o serviço gratuito EmailJS.

### 🔧 Passo a Passo para Configuração

#### 1. Criar Conta no EmailJS

1. Acesse: https://www.emailjs.com
2. Clique em "Sign Up" e crie uma conta gratuita
3. Confirme seu e-mail

#### 2. Adicionar um Serviço de E-mail

1. No painel do EmailJS, vá em **Email Services**
2. Clique em **Add New Service**
3. Escolha seu provedor de e-mail (Gmail, Outlook, etc.)
4. Siga as instruções para conectar sua conta
5. **Anote o Service ID** que será gerado (ex: `service_abc123`)

#### 3. Criar um Template de E-mail

1. No painel, vá em **Email Templates**
2. Clique em **Create New Template**
3. Configure o template com:

**Subject (Assunto):**
```
Novo Contato - Sorvetes Litorâneo
```

**Content (Conteúdo):**
```
📧 Nova Mensagem de Contato - Sorvetes Litorâneo

Nome: {{from_name}}
E-mail: {{from_email}}
Telefone: {{phone}}

Mensagem:
{{message}}

---
Este e-mail foi enviado através do formulário de contato do site.
```

4. **To Email (Destinatário):** `adm@sorveteslitoraneo.com.br`
5. **From Name:** `{{from_name}}`
6. **From Email:** `{{from_email}}`
7. Clique em **Save**
8. **Anote o Template ID** que será gerado (ex: `template_xyz789`)

#### 4. Obter a Public Key

1. No painel, vá em **Account** → **General**
2. Encontre a seção **API Keys**
3. **Anote a Public Key** (ex: `abcdefghijklmnop`)

#### 5. Configurar no Código

Abra o arquivo `scripts.js` e localize as linhas 1271-1273:

```javascript
const SERVICE_ID = 'YOUR_SERVICE_ID'; // Substitua pelo seu Service ID
const TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // Substitua pelo seu Template ID
const PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Substitua pela sua Public Key
```

Substitua os valores:
- `YOUR_SERVICE_ID` → O Service ID que você anotou
- `YOUR_TEMPLATE_ID` → O Template ID que você anotou
- `YOUR_PUBLIC_KEY` → A Public Key que você anotou

**Exemplo:**
```javascript
const SERVICE_ID = 'service_abc123';
const TEMPLATE_ID = 'template_xyz789';
const PUBLIC_KEY = 'abcdefghijklmnop';
```

#### 6. Testar

1. Abra o site no navegador
2. Vá para a página de Contato
3. Preencha o formulário
4. Clique em "Enviar Mensagem"
5. Verifique se o e-mail chegou em `adm@sorveteslitoraneo.com.br`

### ⚠️ Importante

- O plano gratuito do EmailJS permite **200 e-mails por mês**
- Se precisar de mais, considere o plano pago
- O e-mail será enviado automaticamente quando o formulário for submetido
- Se o EmailJS falhar, o sistema usa WhatsApp como fallback

### 🔒 Segurança

- A Public Key pode ser exposta no código (é segura para uso público)
- NUNCA exponha sua Private Key
- O EmailJS valida automaticamente os e-mails enviados

### 📞 Suporte EmailJS

Se tiver problemas:
1. Verifique o console do navegador (F12) para erros
2. Confirme que todas as IDs estão corretas
3. Verifique se o template está configurado corretamente
4. Consulte a documentação: https://www.emailjs.com/docs

## 📞 Suporte

Para dúvidas ou problemas, verifique:
1. Console do navegador (F12)
2. Estrutura de arquivos
3. Caminhos relativos dos assets
4. Arquivos JSON na raiz do projeto
5. localStorage do navegador (F12 → Application → Local Storage)

## 📄 Licença

Este projeto foi desenvolvido para Sorvetes Litorâneo.

---

**Desenvolvido com ❤️ para Sorvetes Litorâneo** 🍦
