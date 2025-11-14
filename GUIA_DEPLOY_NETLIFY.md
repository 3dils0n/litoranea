# 🚀 Guia de Deploy no Netlify - Sorvetes Litorâneo

Este guia vai te ajudar a publicar o site no Netlify de forma simples e rápida.

## 📋 Pré-requisitos

- Conta no Netlify (gratuita): [Criar conta](https://app.netlify.com/signup)
- Todos os arquivos do projeto prontos

## 🎯 Método 1: Deploy via Drag & Drop (Mais Rápido)

### Passo a Passo:

1. **Acesse o Netlify**
   - Vá para: https://app.netlify.com/
   - Faça login ou crie uma conta

2. **Prepare os arquivos**
   - Certifique-se de que todos os arquivos estão na pasta `Site_litoranea`
   - Não precisa comprimir em ZIP, apenas selecione a pasta

3. **Faça o Deploy**
   - Na página inicial do Netlify, você verá uma área com o texto:
     "Want to deploy a new site without connecting to Git? Drag and drop your site output folder here"
   - **Arraste e solte a pasta `Site_litoranea` inteira** nessa área
   - Aguarde o processamento (pode levar 1-3 minutos)

4. **Aguarde o Deploy**
   - Você verá uma barra de progresso
   - Quando terminar, aparecerá uma URL como: `sorveteslitoraneo-abc123.netlify.app`

5. **Personalize o Nome do Site**
   - Clique em "Site settings" (ou "Site configuration")
   - Vá em "Change site name"
   - Digite: `sorveteslitoraneo` (ou o nome que preferir)
   - Sua URL será: `sorveteslitoraneo.netlify.app`

## 🎯 Método 2: Deploy via GitHub (Recomendado)

Este método permite atualizações automáticas sempre que você fizer alterações no código.

### Passo a Passo:

1. **Crie um Repositório no GitHub**
   - Acesse: https://github.com/new
   - Nome do repositório: `sorvetes-litoraneo` (ou outro nome)
   - Marque como "Public" ou "Private" (sua escolha)
   - Clique em "Create repository"

2. **Faça Upload dos Arquivos**
   - No GitHub, clique em "uploading an existing file"
   - Arraste todos os arquivos da pasta `Site_litoranea`
   - **IMPORTANTE**: Não arraste a pasta inteira, arraste os arquivos de dentro dela
   - Faça commit com a mensagem: "Initial commit"

3. **Conecte ao Netlify**
   - Acesse: https://app.netlify.com/
   - Clique em "Add new site" → "Import an existing project"
   - Escolha "GitHub" e autorize o Netlify a acessar seus repositórios
   - Selecione o repositório que você acabou de criar

4. **Configure o Deploy**
   - **Build command**: Deixe vazio (não precisa compilar nada)
   - **Publish directory**: `.` (ponto, significa a raiz do projeto)
   - Clique em "Deploy site"

5. **Pronto!**
   - O site será publicado automaticamente
   - A cada vez que você fizer alterações no GitHub, o Netlify atualizará o site automaticamente

## 🔧 Configurações Adicionais

### Personalizar Domínio

1. No Netlify, vá em: Site settings → Domain management
2. Clique em "Add custom domain"
3. Digite seu domínio (ex: `sorveteslitoraneo.com.br`)
4. Siga as instruções para configurar o DNS

### Configurações de Build

O arquivo `netlify.toml` já está configurado com:
- Pasta de publicação: raiz do projeto
- Redirecionamentos para SPA
- Versão do Node (se necessário)

## ❓ Problemas Comuns

### "Site não abre" ou "404 Not Found"

**Solução:**
- Verifique se o arquivo `index.html` está na raiz do projeto
- Certifique-se de que o `netlify.toml` está configurado corretamente
- Verifique os logs de deploy no Netlify (Deploys → Latest deploy → Deploy log)

### "Imagens não aparecem"

**Solução:**
- Verifique se a pasta `assets` foi enviada corretamente
- Verifique os caminhos das imagens nos arquivos HTML
- Os caminhos devem ser relativos: `assets/sabores/nome.jpg`

### "JavaScript não funciona"

**Solução:**
- Verifique se o arquivo `scripts.js` está na raiz
- Verifique se o caminho no HTML está correto: `<script src="scripts.js"></script>`
- Abra o Console do navegador (F12) para ver erros

### "CSS não carrega"

**Solução:**
- Verifique se o arquivo `styles.css` está na raiz
- Verifique se o caminho no HTML está correto: `<link rel="stylesheet" href="styles.css">`

## 📝 Checklist Antes do Deploy

- [ ] Todos os arquivos HTML estão na raiz
- [ ] Pasta `assets` com todas as imagens
- [ ] Arquivo `styles.css` na raiz
- [ ] Arquivo `scripts.js` na raiz
- [ ] Arquivo `netlify.toml` criado
- [ ] Arquivo `_redirects` criado (opcional, mas recomendado)
- [ ] Testado localmente (abrir `index.html` no navegador)

## 🎉 Após o Deploy

1. **Teste todas as páginas:**
   - Home: `https://seu-site.netlify.app/`
   - Cardápio: `https://seu-site.netlify.app/cardapio.html`
   - Sobre: `https://seu-site.netlify.app/sobre.html`
   - Contato: `https://seu-site.netlify.app/contato.html`

2. **Teste em dispositivos móveis:**
   - Use o modo responsivo do navegador (F12 → Toggle device toolbar)
   - Ou teste no celular acessando a URL

3. **Compartilhe o link:**
   - Adicione a URL no Instagram
   - Compartilhe com clientes
   - Atualize o Schema.org no `index.html` com a URL real

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs de deploy no Netlify
2. Teste o site localmente primeiro
3. Verifique a documentação do Netlify: https://docs.netlify.com/

---

**Boa sorte com o deploy! 🚀**

