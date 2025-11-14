# Sorvetes Litorâneo - Site Responsivo

Site estático responsivo para a sorveteria "Sorvetes Litorâneo", desenvolvido com HTML5, CSS3 e JavaScript puro.

## 📁 Estrutura do Projeto

```
Site_litoranea/
├── index.html          # Página inicial
├── cardapio.html       # Cardápio completo com filtros
├── sobre.html          # Página sobre a empresa
├── contato.html        # Contato e localização
├── styles.css          # Estilos CSS (mobile-first)
├── scripts.js          # JavaScript (funcionalidades)
├── README.md           # Este arquivo
└── assets/
    ├── logo.png        # Logo da empresa
    ├── hero-1.jpg      # Imagem principal do hero
    └── sabores/        # Imagens dos produtos
        ├── picolés de fruta.jpg
        ├── picolés ao leite.jpg
        └── ... (outras imagens)
```

## 🚀 Como Usar

### 1. Informações Já Preenchidas ✅

As seguintes informações foram preenchidas com base no Instagram:

- **Telefone**: (13) 3426-1517 ✅
- **WhatsApp**: 551334261517 ✅
- **Cidade**: Guarujá, SP ✅
- **Ano de fundação**: 2010 ✅
- **Instagram**: https://www.instagram.com/sorveteslitoraneo/ ✅
- **Link do Instagram**: Adicionado no footer de todas as páginas ✅

### 2. Informações que Precisam ser Verificadas no Instagram

#### **Preços dos Produtos** ⚠️
- Todas as linhas com `R$ [INSERIR]` nos arquivos `index.html` e `cardapio.html`
- Verifique os preços no Instagram ou entre em contato via WhatsApp

#### **Endereço Completo** ⚠️
- **contato.html**: Atualmente mostra "Guarujá, SP - Baixada Santista"
- Verifique o endereço completo no perfil do Instagram e atualize
- Atualize também o iframe do Google Maps (linha ~110) com o endereço correto

#### **Horário de Funcionamento** ⚠️
- **contato.html**: Atualmente mostra "Segunda a Domingo: 10h às 22h" (genérico)
- Verifique os horários reais no Instagram e atualize se necessário

#### **URL do Site** (quando tiver)
- **index.html** (Schema.org): Atualmente aponta para o Instagram
- Quando o site estiver publicado, atualize com a URL real

#### **scripts.js**
- **Linha 4**: `PHONE_WHATSAPP` já está configurado como `'551334261517'`
- Se necessário alterar, modifique a constante no início do arquivo

### 2. Atualizar Mapa do Google Maps

1. Acesse [Google Maps](https://www.google.com/maps)
2. Busque o endereço da sorveteria
3. Clique em "Compartilhar" → "Incorporar um mapa"
4. Copie o código do iframe
5. Substitua o iframe em `contato.html` (linha ~80)

### 3. Otimizar Imagens (Opcional mas Recomendado)

Para melhor performance, converta as imagens para WebP:

```bash
# Usando cwebp (Google)
cwebp assets/hero-1.jpg -o assets/hero-1.webp -q 80

# Ou use ferramentas online como:
# - https://squoosh.app/
# - https://cloudconvert.com/
```

Depois, atualize as tags `<picture>` nos HTMLs para incluir WebP como source.

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
3. Na página inicial, arraste e solte a pasta `Site_litoranea` inteira na área "Want to deploy a new site without connecting to Git? Drag and drop your site output folder here"
4. Aguarde o deploy (pode levar alguns minutos)
5. O Netlify gerará uma URL automática (ex: `sorveteslitoraneo-123abc.netlify.app`)
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

**Configurações Importantes:**
- O arquivo `netlify.toml` já está configurado
- O arquivo `_redirects` garante que todas as rotas funcionem corretamente
- Para personalizar o domínio: Site settings → Domain management → Add custom domain

#### **Opção 3: Servidor Web Tradicional**

1. Faça upload de todos os arquivos via FTP
2. Certifique-se de manter a estrutura de pastas
3. Acesse via URL do servidor

## ✨ Funcionalidades

- ✅ Design responsivo (mobile-first)
- ✅ Header fixo com menu colapsável em mobile
- ✅ Hero section com CTA duplo
- ✅ Cards de sabores com imagens
- ✅ Filtros por categoria (creme, fruta, vegano)
- ✅ Busca por nome de sabor
- ✅ Modal de pedidos
- ✅ Integração com WhatsApp
- ✅ Formulário de contato
- ✅ Mapa Google Maps
- ✅ SEO otimizado (meta tags, schema.org)
- ✅ Acessibilidade (ARIA, contraste, navegação por teclado)
- ✅ Lazy loading de imagens

## 🎨 Paleta de Cores

- **Azul Escuro**: `#1e3a5f`
- **Azul Médio**: `#2d5a87`
- **Azul Claro**: `#4a90c2`
- **Azul Muito Claro**: `#e8f4f8`
- **Branco**: `#ffffff`
- **Creme**: `#faf8f3`

## 📱 Breakpoints Responsivos

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

## 🔧 Tecnologias Utilizadas

- HTML5 semântico
- CSS3 (Grid, Flexbox, Custom Properties)
- JavaScript ES6+ (sem dependências)
- Google Fonts (Poppins + Inter)
- Schema.org (microdados)

## 📝 Checklist Antes de Publicar

- [x] Telefone e WhatsApp preenchidos
- [x] Link do Instagram adicionado
- [x] Cidade e estado preenchidos
- [x] Ano de fundação preenchido
- [ ] **Verificar e preencher todos os preços** (consultar Instagram)
- [ ] **Atualizar endereço completo** (verificar no Instagram)
- [ ] **Atualizar iframe do Google Maps** com endereço correto
- [ ] **Verificar horário de funcionamento** (confirmar no Instagram)
- [ ] Testar formulário de pedidos (WhatsApp)
- [ ] Testar em diferentes dispositivos
- [ ] Verificar links de navegação
- [ ] Otimizar imagens (recomendado)
- [ ] Testar acessibilidade (navegação por teclado)
- [ ] Verificar meta tags e SEO
- [ ] Atualizar URL do site no Schema.org quando publicado

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

## 📞 Suporte

Para dúvidas ou problemas, verifique:
1. Console do navegador (F12)
2. Estrutura de arquivos
3. Caminhos relativos dos assets

## 📄 Licença

Este projeto foi desenvolvido para Sorvetes Litorâneo.

---

**Desenvolvido com ❤️ para Sorvetes Litorâneo**

"# litoranea" 
