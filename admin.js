// ============================================
// VARIÁVEIS GLOBAIS
// ============================================

const SENHA_ADMIN = 'MeMiFabi';
const USUARIO_ADMIN = 'Admin';

let destaquesData = [];
let cardapioData = { produtos: [] };
let sobreData = { historia: '' };
let configPedidoData = { taxaEntrega: 16.00, itens: [] };

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    verificarLogin();
    inicializarEventListeners();
});

// ============================================
// SISTEMA DE LOGIN
// ============================================

function verificarLogin() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
    
    if (isLoggedIn) {
        mostrarPainel();
    } else {
        mostrarLogin();
    }
}

function mostrarLogin() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminPanel').style.display = 'none';
}

function mostrarPainel() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'flex';
    
    // Pequeno delay para garantir que o DOM está pronto
    setTimeout(() => {
        carregarDados();
    }, 100);
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const usuario = document.getElementById('usuario').value.trim();
    const senha = document.getElementById('senha').value.trim();
    const errorDiv = document.getElementById('loginError');
    
    if (usuario === USUARIO_ADMIN && senha === SENHA_ADMIN) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        mostrarPainel();
    } else {
        errorDiv.textContent = 'Usuário ou senha incorretos!';
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 3000);
    }
});

document.getElementById('btnLogout').addEventListener('click', function() {
    sessionStorage.removeItem('adminLoggedIn');
    mostrarLogin();
    document.getElementById('loginForm').reset();
});

// Fazer logout automático ao sair da página do admin
window.addEventListener('beforeunload', function() {
    sessionStorage.removeItem('adminLoggedIn');
});

// Limpar sessão ao clicar no link "Voltar para Home"
document.addEventListener('DOMContentLoaded', function() {
    const linksVoltarHome = document.querySelectorAll('a[href="index.html"]');
    linksVoltarHome.forEach(link => {
        link.addEventListener('click', function() {
            sessionStorage.removeItem('adminLoggedIn');
        });
    });
});

// ============================================
// NAVEGAÇÃO ENTRE SEÇÕES
// ============================================

function inicializarEventListeners() {
    // Navegação sidebar
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const section = this.dataset.section;
            mostrarSecao(section);
        });
    });
    
    // Botões de adicionar
    document.getElementById('btnAdicionarDestaque').addEventListener('click', () => abrirModalDestaque());
    document.getElementById('btnAdicionarProduto').addEventListener('click', () => abrirModalProduto());
    
    // Importar cardápio do HTML
    const btnImportarCardapio = document.getElementById('btnImportarCardapio');
    if (btnImportarCardapio) {
        btnImportarCardapio.addEventListener('click', importarCardapioDoHTML);
    }
    
    // Formulários
    document.getElementById('formDestaque').addEventListener('submit', salvarDestaque);
    document.getElementById('formProduto').addEventListener('submit', salvarProduto);
    document.getElementById('formSobre').addEventListener('submit', salvarSobre);
    
    // Configurações do Pedido
    const btnSalvarConfigPedido = document.getElementById('btnSalvarConfigPedido');
    if (btnSalvarConfigPedido) {
        btnSalvarConfigPedido.addEventListener('click', salvarConfigPedido);
    }
    const btnCancelarConfigPedido = document.getElementById('btnCancelarConfigPedido');
    if (btnCancelarConfigPedido) {
        btnCancelarConfigPedido.addEventListener('click', cancelarConfigPedido);
    }
    
    // Listener para seleção de produto no formulário de destaques
    const destaqueProduto = document.getElementById('destaqueProduto');
    if (destaqueProduto) {
        destaqueProduto.addEventListener('change', function() {
            const produtoId = this.value;
            if (produtoId) {
                const option = this.options[this.selectedIndex];
                let produto = null;
                
                if (option.dataset.produto) {
                    produto = JSON.parse(option.dataset.produto);
                } else {
                    // Buscar no cardapioData
                    produto = cardapioData.produtos.find(p => p.id === parseInt(produtoId));
                }
                
                if (produto) {
                    preencherDadosDestaque(produto);
                    mostrarPreviewCardProduto(produto);
                }
            } else {
                // Limpar campos se nenhum produto selecionado
                document.getElementById('destaqueNome').value = '';
                document.getElementById('destaqueDescricao').value = '';
                document.getElementById('destaqueImagem').value = '';
                document.getElementById('destaquePreco').value = '';
                ocultarPreviewCardProduto();
            }
        });
    }
    
    // Botões cancelar
    document.getElementById('btnCancelarDestaque').addEventListener('click', fecharModalDestaque);
    document.getElementById('btnCancelarProduto').addEventListener('click', fecharModalProduto);
    document.getElementById('btnCancelarSobre').addEventListener('click', cancelarEdicaoSobre);
    
    // Fechar modais
    document.getElementById('closeModalDestaque').addEventListener('click', fecharModalDestaque);
    document.getElementById('closeModalProduto').addEventListener('click', fecharModalProduto);
    
    // Fechar modal ao clicar fora
    document.getElementById('modalDestaque').addEventListener('click', function(e) {
        if (e.target === this) fecharModalDestaque();
    });
    
    document.getElementById('modalProduto').addEventListener('click', function(e) {
        if (e.target === this) fecharModalProduto();
    });
    
    // Upload de imagem do produto
    const produtoImagemUpload = document.getElementById('produtoImagemUpload');
    if (produtoImagemUpload) {
        produtoImagemUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Validar tipo de arquivo
                if (!file.type.startsWith('image/')) {
                    mostrarToast('Por favor, selecione apenas arquivos de imagem.', 'error');
                    this.value = '';
                    return;
                }
                
                // Validar tamanho (máximo 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    mostrarToast('A imagem deve ter no máximo 5MB.', 'error');
                    this.value = '';
                    return;
                }
                
                // Criar preview e salvar automaticamente
                const reader = new FileReader();
                reader.onload = async function(e) {
                    const previewDiv = document.getElementById('previewImagemProduto');
                    const previewImg = document.getElementById('previewImgProduto');
                    previewImg.src = e.target.result;
                    previewDiv.style.display = 'block';
                    
                    // Gerar nome do arquivo baseado no nome do produto
                    const nomeProduto = document.getElementById('produtoNome').value.trim();
                    const imagemInput = document.getElementById('produtoImagem');
                    let nomeArquivo;
                    let extensao = file.name.split('.').pop();
                    
                    if (nomeProduto) {
                        nomeArquivo = nomeProduto.toLowerCase()
                            .normalize('NFD')
                            .replace(/[\u0300-\u036f]/g, '')
                            .replace(/[^a-z0-9]/g, '-')
                            .replace(/-+/g, '-')
                            .replace(/^-|-$/g, '');
                        imagemInput.value = `assets/sabores/${nomeArquivo}.${extensao}`;
                    } else {
                        // Se não tem nome, usar o nome do arquivo
                        nomeArquivo = file.name.toLowerCase()
                            .normalize('NFD')
                            .replace(/[\u0300-\u036f]/g, '')
                            .replace(/[^a-z0-9.]/g, '-')
                            .replace(/-+/g, '-')
                            .replace(/^-|-$/g, '');
                        imagemInput.value = `assets/sabores/${nomeArquivo}`;
                    }
                    
                    // Armazenar o arquivo e nome para download posterior
                    previewImg.dataset.fileName = `${nomeArquivo}.${extensao}`;
                    previewImg.dataset.fileData = e.target.result;
                    previewImg.dataset.fileOriginal = file; // Armazenar referência ao arquivo original
                    
                    // Não fazer download automático aqui - será feito quando salvar o produto
                    // Apenas armazenar os dados para uso posterior
                    
                    // Criar ou atualizar botão de download (fallback)
                    let btnDownload = document.getElementById('btnDownloadImagem');
                    if (!btnDownload) {
                        btnDownload = document.createElement('button');
                        btnDownload.id = 'btnDownloadImagem';
                        btnDownload.type = 'button';
                        btnDownload.className = 'btn btn-small btn-secondary';
                        btnDownload.style.marginTop = '0.5rem';
                        btnDownload.innerHTML = '💾 Baixar Imagem (se não salvou automaticamente)';
                        previewDiv.appendChild(btnDownload);
                        
                        btnDownload.addEventListener('click', function() {
                            const fileName = previewImg.dataset.fileName;
                            const fileData = previewImg.dataset.fileData;
                            
                            // Criar link de download
                            const link = document.createElement('a');
                            link.href = fileData;
                            link.download = fileName;
                            link.click();
                            
                            mostrarToast(`📥 Imagem "${fileName}" baixada! Salve-a na pasta assets/sabores/`, 'success');
                        });
                    } else {
                        btnDownload.style.display = 'block';
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Gerar caminho da imagem automaticamente quando digitar o nome do produto
    const produtoNome = document.getElementById('produtoNome');
    const produtoImagem = document.getElementById('produtoImagem');
    if (produtoNome && produtoImagem) {
        produtoNome.addEventListener('input', function() {
            const produtoId = document.getElementById('produtoId').value;
            // Só gerar automaticamente se for novo produto (sem ID)
            if (!produtoId) {
                const nome = this.value.trim();
                if (nome) {
                    const nomeArquivo = nome.toLowerCase()
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .replace(/[^a-z0-9]/g, '-')
                        .replace(/-+/g, '-')
                        .replace(/^-|-$/g, '');
                    
                    // Só atualizar se o campo estiver vazio ou com valor padrão
                    const imagemAtual = produtoImagem.value.trim();
                    if (!imagemAtual || imagemAtual === 'assets/sabores/' || imagemAtual === 'assets/sabores') {
                        produtoImagem.value = `assets/sabores/${nomeArquivo}.jpg`;
                    }
                }
            }
        });
    }
    
    // Remover preview
    const removerPreviewProduto = document.getElementById('removerPreviewProduto');
    if (removerPreviewProduto) {
        removerPreviewProduto.addEventListener('click', function() {
            document.getElementById('produtoImagemUpload').value = '';
            document.getElementById('previewImagemProduto').style.display = 'none';
            document.getElementById('previewImgProduto').src = '';
            const btnDownload = document.getElementById('btnDownloadImagem');
            if (btnDownload) {
                btnDownload.style.display = 'none';
            }
        });
    }
}

// Variável global para armazenar a permissão da pasta do projeto
let pastaProjetoHandle = null;

// Caminho fixo do projeto (para referência)
const CAMINHO_PROJETO = 'C:\\Site_litoranea';
const CAMINHO_SABORES = 'C:\\Site_litoranea\\assets\\sabores';

// Função para obter permissão da pasta do projeto (File System Access API)
async function obterPermissaoPastaProjeto() {
    if (!('showDirectoryPicker' in window)) {
        return null; // API não disponível
    }
    
    try {
        // Sempre pedir permissão (não podemos salvar handles entre sessões de forma confiável)
        // Mas vamos tentar usar o handle salvo se ainda estiver válido
        if (pastaProjetoHandle) {
            try {
                // Verificar se o handle ainda é válido tentando acessar
                await pastaProjetoHandle.getDirectoryHandle('assets', { create: false });
                console.log('✅ Reutilizando permissão da pasta anterior');
                return pastaProjetoHandle;
            } catch (error) {
                // Handle inválido, precisamos pedir novamente
                console.log('⚠️ Handle anterior inválido, pedindo nova permissão');
                pastaProjetoHandle = null;
            }
        }
        
        // Pedir permissão para escolher a pasta do projeto
        const mensagem = `📁 IMPORTANTE: Escolha a pasta do projeto:\n\n${CAMINHO_PROJETO}\n\nNavegue até: C: > Site_litoranea`;
        alert(mensagem);
        mostrarToast('📁 Escolha a pasta: C:\\Site_litoranea', 'error');
        
        // Tentar começar no diretório C:\ se possível
        const pastaHandle = await window.showDirectoryPicker({
            mode: 'readwrite'
        });
        
        console.log('✅ Pasta selecionada:', pastaHandle.name);
        
        // Verificar se é a pasta correta (Site_litoranea)
        const nomePasta = pastaHandle.name.toLowerCase();
        const caminhoCompleto = pastaHandle.name.toLowerCase();
        
        // Verificar se contém "site_litoranea" no caminho
        if (!nomePasta.includes('site_litoranea') && !nomePasta.includes('litoranea')) {
            const confirmar = confirm(
                `⚠️ ATENÇÃO: A pasta selecionada não parece ser "Site_litoranea".\n\n` +
                `Pasta selecionada: ${pastaHandle.name}\n\n` +
                `Caminho esperado: ${CAMINHO_PROJETO}\n\n` +
                `A imagem será salva em: ${pastaHandle.name}\\assets\\sabores\\\n\n` +
                `Deseja continuar mesmo assim?`
            );
            if (!confirmar) {
                // Tentar novamente
                return await obterPermissaoPastaProjeto();
            }
        } else {
            console.log('✅ Pasta correta confirmada: Site_litoranea');
        }
        
        console.log('📂 Caminho completo será:', pastaHandle.name + '\\assets\\sabores\\');
        
        // Verificar se é a pasta do projeto (procurar por assets/sabores ou criar)
        try {
            const assetsHandle = await pastaHandle.getDirectoryHandle('assets', { create: true });
            const saboresHandle = await assetsHandle.getDirectoryHandle('sabores', { create: true });
            
            // Salvar referência da pasta para esta sessão
            pastaProjetoHandle = pastaHandle;
            
            console.log('✅ Pasta do projeto confirmada:', pastaHandle.name);
            return pastaHandle;
        } catch (error) {
            // Mesmo que não encontre assets/sabores, vamos criar
            console.log('⚠️ Criando estrutura de pastas...');
            pastaProjetoHandle = pastaHandle;
            return pastaHandle;
        }
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error('❌ Erro ao obter permissão da pasta:', error);
        } else {
            console.log('⚠️ Usuário cancelou a seleção da pasta');
        }
        return null;
    }
}

// Função para salvar imagem na pasta do projeto (modo file://)
async function salvarImagemNaPastaProjeto(file, nomeArquivo, extensao) {
    // Verificar se a File System Access API está disponível
    if (!('showDirectoryPicker' in window)) {
        console.warn('File System Access API não está disponível neste navegador.');
        mostrarToast('⚠️ Seu navegador não suporta salvamento direto. Use Chrome ou Edge, ou faça upload manual.', 'error');
        return false;
    }
    
    try {
        // Obter permissão da pasta do projeto
        const pastaHandle = await obterPermissaoPastaProjeto();
        
        if (!pastaHandle) {
            console.warn('Permissão da pasta não foi concedida ou cancelada.');
            mostrarToast('⚠️ Permissão da pasta não foi concedida. A imagem não foi salva.', 'error');
            return false;
        }
        
        console.log('✅ Permissão da pasta obtida:', pastaHandle.name);
        console.log('📂 Salvando em:', pastaHandle.name + '\\assets\\sabores\\');
        
        // Criar estrutura de pastas se necessário
        let assetsHandle;
        try {
            assetsHandle = await pastaHandle.getDirectoryHandle('assets', { create: true });
            console.log('✅ Pasta assets acessada/criada');
        } catch (error) {
            console.error('❌ Erro ao acessar pasta assets:', error);
            mostrarToast('❌ Erro ao acessar pasta assets. Verifique as permissões.', 'error');
            return false;
        }
        
        let saboresHandle;
        try {
            saboresHandle = await assetsHandle.getDirectoryHandle('sabores', { create: true });
            console.log('✅ Pasta sabores acessada/criada');
        } catch (error) {
            console.error('❌ Erro ao acessar pasta sabores:', error);
            mostrarToast('❌ Erro ao acessar pasta sabores. Verifique as permissões.', 'error');
            return false;
        }
        
        // Criar arquivo na pasta sabores
        const nomeCompleto = `${nomeArquivo}.${extensao}`;
        console.log('💾 Salvando arquivo:', nomeCompleto, 'na pasta sabores');
        
        // Converter file para Blob se necessário
        let blobFile = file;
        if (!(file instanceof Blob) && !(file instanceof File)) {
            blobFile = new Blob([file], { type: file.type || 'image/jpeg' });
        }
        
        const fileHandle = await saboresHandle.getFileHandle(nomeCompleto, { create: true });
        const writable = await fileHandle.createWritable();
        
        // Escrever o arquivo
        await writable.write(blobFile);
        await writable.close();
        
        console.log('✅ Arquivo salvo com sucesso em:', pastaHandle.name + '/assets/sabores/' + nomeCompleto);
        mostrarToast(`✅ Imagem "${nomeCompleto}" salva em assets/sabores/ do projeto!`, 'success');
        return true;
    } catch (error) {
        console.error('❌ Erro ao salvar na pasta do projeto:', error);
        mostrarToast(`❌ Erro ao salvar: ${error.message}`, 'error');
        return false;
    }
}

// Função para fazer upload da imagem para o servidor
async function fazerUploadImagem(file, nomeArquivo, extensao) {
    // Verificar se está em um servidor HTTP (não file://)
    if (window.location.protocol === 'file:') {
        console.log('⚠️ Modo file:// detectado. Tentando salvar na pasta do projeto...');
        console.log('📄 Arquivo recebido:', file);
        console.log('📝 Nome do arquivo:', nomeArquivo, extensao);
        
        // Garantir que temos um File/Blob válido
        let arquivoValido = file;
        if (!(file instanceof File) && !(file instanceof Blob)) {
            console.warn('⚠️ Arquivo não é File nem Blob, tentando converter...');
            // Tentar obter do preview se disponível
            const previewImg = document.getElementById('previewImgProduto');
            if (previewImg && previewImg.dataset.fileData) {
                try {
                    const response = await fetch(previewImg.dataset.fileData);
                    arquivoValido = await response.blob();
                    console.log('✅ Arquivo convertido de base64 para Blob');
                } catch (error) {
                    console.error('❌ Erro ao converter arquivo:', error);
                    return false;
                }
            } else {
                console.error('❌ Não foi possível obter o arquivo');
                return false;
            }
        }
        
        // Tentar salvar diretamente na pasta do projeto
        const sucesso = await salvarImagemNaPastaProjeto(arquivoValido, nomeArquivo, extensao);
        
        if (sucesso) {
            console.log('✅ Imagem salva com sucesso na pasta do projeto!');
            return true;
        } else {
            console.warn('⚠️ Falha ao salvar na pasta do projeto');
            mostrarToast('⚠️ Não foi possível salvar automaticamente. Você precisará fazer upload manual no servidor.', 'error');
            return false;
        }
    }
    
    try {
        // Criar FormData para enviar o arquivo
        const formData = new FormData();
        formData.append('imagem', file);
        formData.append('nomeArquivo', `${nomeArquivo}.${extensao}`);
        formData.append('caminho', 'assets/sabores/');
        
        // Tentar fazer upload para o endpoint PHP
        const endpoint = 'upload-imagem.php';
        
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                const result = await response.json().catch(() => ({ success: true }));
                if (result.success !== false) {
                    mostrarToast(`✅ Imagem "${nomeArquivo}.${extensao}" salva no servidor com sucesso!`, 'success');
                    return true;
                } else {
                    const errorMsg = result.error || 'Erro desconhecido';
                    mostrarToast(`❌ Erro ao salvar: ${errorMsg}`, 'error');
                    return false;
                }
            } else {
                // Tentar ler mensagem de erro
                const errorText = await response.text().catch(() => '');
                mostrarToast(`❌ Erro ${response.status}: ${errorText || 'Não foi possível salvar a imagem'}`, 'error');
                return false;
            }
        } catch (error) {
            // Endpoint não existe ou servidor não está rodando
            console.warn('Erro ao fazer upload:', error);
            
            // Verificar se é erro de conexão (servidor não está rodando)
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                mostrarToast('⚠️ Servidor não está rodando ou upload-imagem.php não foi encontrado. Use um servidor local (XAMPP, WAMP) ou faça upload manual.', 'error');
            } else {
                mostrarToast(`❌ Erro ao fazer upload: ${error.message}`, 'error');
            }
            
            return false;
        }
    } catch (error) {
        console.warn('Erro geral ao fazer upload:', error);
        mostrarToast(`❌ Erro: ${error.message}`, 'error');
        return false;
    }
}

// Função para salvar imagem automaticamente (download direto como fallback)
async function salvarImagemAutomaticamente(file, nomeArquivo, extensao, previewImg) {
    try {
        // Criar blob do arquivo
        const blob = file instanceof Blob ? file : new Blob([file], { type: file.type || 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        
        // Criar link de download invisível
        const link = document.createElement('a');
        link.href = url;
        link.download = `${nomeArquivo}.${extensao}`;
        link.style.display = 'none';
        
        // Adicionar ao DOM, clicar e remover
        document.body.appendChild(link);
        link.click();
        
        // Limpar após um pequeno delay
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 100);
        
        // Mostrar mensagem de sucesso com instruções
        mostrarToast(`📥 Imagem "${nomeArquivo}.${extensao}" baixada! Faça upload manual para assets/sabores/ no servidor.`, 'error');
        
        return true;
    } catch (error) {
        console.warn('Erro ao fazer download automático:', error);
        mostrarToast('⚠️ Use o botão de download para salvar a imagem.', 'error');
        return false;
    }
}

function mostrarSecao(sectionName) {
    // Atualizar navegação
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === sectionName) {
            item.classList.add('active');
        }
    });
    
    // Mostrar seção correspondente
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Converter sectionName para formato correto (configPedido -> ConfigPedido)
    const sectionId = sectionName === 'configPedido' 
        ? 'sectionConfigPedido' 
        : `section${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)}`;
    
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
        sectionElement.classList.add('active');
        
        // Se for a seção de configurações do pedido, carregar os dados
        if (sectionName === 'configPedido') {
            carregarConfigPedido();
        }
    }
    
    // Se estiver em modo file://, verificar se há dados para esta seção
    if (isFileProtocol()) {
        setTimeout(() => {
            verificarDadosSecao(sectionName);
        }, 300);
    }
}

function verificarDadosSecao(sectionName) {
    const temDestaques = localStorage.getItem('admin_destaques');
    const temCardapio = localStorage.getItem('admin_cardapio');
    const temSobre = localStorage.getItem('admin_sobre');
    
    let precisaImportar = false;
    let mensagem = '';
    
    if (sectionName === 'destaques' && !temDestaques) {
        precisaImportar = true;
        mensagem = '📥 Nenhum destaque encontrado. Clique em "Importar JSONs" para carregar destaques.json';
    } else if (sectionName === 'cardapio' && !temCardapio) {
        precisaImportar = true;
        mensagem = '📥 Nenhum produto encontrado. Clique em "Importar JSONs" para carregar cardapio.json';
    } else if (sectionName === 'sobre' && !temSobre) {
        precisaImportar = true;
        mensagem = '📥 Texto não encontrado. Clique em "Importar JSONs" para carregar sobre.json';
    }
    
    if (precisaImportar) {
        mostrarToast(mensagem, 'error');
        
        // Destacar o botão de importar
        const importLabel = document.querySelector('label[for="importJSON"]');
        if (importLabel) {
            importLabel.style.animation = 'pulse 2s infinite';
            importLabel.style.border = '2px solid var(--cor-marrom)';
            importLabel.style.boxShadow = '0 0 10px rgba(255, 143, 163, 0.5)';
            
            // Remover destaque após 5 segundos
            setTimeout(() => {
                importLabel.style.animation = '';
                importLabel.style.border = '';
                importLabel.style.boxShadow = '';
            }, 5000);
        }
        
        // Tentar abrir o diálogo automaticamente
        const importInput = document.getElementById('importJSON');
        if (importInput) {
            setTimeout(() => {
                try {
                    importInput.click();
                } catch (error) {
                    // Navegador bloqueou o click automático (normal por segurança)
                }
            }, 1000);
        }
    }
}

// ============================================
// CARREGAR DADOS DOS JSONs
// ============================================

// Verificar se está usando file:// protocol
function isFileProtocol() {
    return window.location.protocol === 'file:';
}

// Função auxiliar para fazer fetch com melhor tratamento de erros
async function fetchJSON(url) {
    // Verificar se está usando file://
    if (isFileProtocol()) {
        // Tentar carregar do localStorage
        const storageKey = url.replace('.json', '').replace('/', '_');
        const stored = localStorage.getItem(`admin_${storageKey}`);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                console.log(`✅ Carregado ${url} do localStorage`);
                return parsed;
            } catch (e) {
                console.warn(`⚠️ Erro ao parsear ${url} do localStorage:`, e);
            }
        }
        const error = new Error('CORS: Não é possível carregar arquivos usando o protocolo file://. Use localStorage ou importe os arquivos.');
        error.isFileProtocol = true;
        throw error;
    }
    
    try {
        console.log(`📥 Fazendo fetch de ${url}...`);
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-cache'
        });
        
        console.log(`📊 Resposta de ${url}:`, response.status, response.statusText, response.ok);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Arquivo ${url} não encontrado (404). Verifique se o arquivo existe no servidor.`);
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        console.log(`📄 Conteúdo recebido de ${url} (tamanho: ${text.length} chars, primeiros 200 chars):`, text.substring(0, 200));
        
        if (!text.trim()) {
            throw new Error('Arquivo vazio');
        }
        
        const parsed = JSON.parse(text);
        console.log(`✅ JSON parseado de ${url} com sucesso!`);
        console.log(`📦 Estrutura:`, Object.keys(parsed));
        if (parsed.produtos) {
            console.log(`📦 Produtos encontrados: ${parsed.produtos.length}`);
        }
        return parsed;
    } catch (error) {
        console.error(`❌ Erro ao carregar ${url}:`, error);
        console.error(`❌ Detalhes do erro:`, error.message);
        throw error;
    }
}

async function carregarDados() {
    // Verificar se está usando file://
    if (isFileProtocol()) {
        console.log('ℹ️ Modo file:// detectado. Usando localStorage para armazenar dados.');
        console.log('💡 Tentando carregar dados automaticamente...');
        
        // Mostrar botões de importar/exportar
        const fileImportExport = document.getElementById('fileImportExport');
        if (fileImportExport) {
            fileImportExport.style.display = 'flex';
        }
        
        // Tentar carregar do localStorage primeiro
        carregarDadosDoLocalStorage();
        
        // Verificar se há dados no localStorage
        const temDestaques = localStorage.getItem('admin_destaques');
        const temCardapio = localStorage.getItem('admin_cardapio');
        const temSobre = localStorage.getItem('admin_sobre');
        
        // Se não houver dados, tentar importar automaticamente
        if (!temDestaques || !temCardapio || !temSobre) {
            console.log('⚠️ Dados não encontrados no localStorage. Tentando importar automaticamente...');
            // Aguardar um pouco para garantir que o DOM está pronto
            setTimeout(() => {
                tentarImportarJSONsAutomaticamente();
            }, 500);
        }
        
        // Configurar importação/exportação
        configurarImportacaoExportacao();
    }
    
    try {
        // Carregar destaques
        // PRIORIDADE: localStorage primeiro (dados mais recentes), depois JSON
        let destaquesCarregados = false;
        const destaquesStored = localStorage.getItem('admin_destaques');
        if (destaquesStored) {
            try {
                const dadosStored = JSON.parse(destaquesStored);
                if (Array.isArray(dadosStored) && dadosStored.length > 0) {
                    destaquesData = dadosStored;
                    console.log(`✅ Carregados ${destaquesData.length} destaques do localStorage (prioridade)`);
                    renderizarDestaques();
                    destaquesCarregados = true;
                } else {
                    console.log('⚠️ Dados no localStorage estão vazios, tentando carregar do JSON...');
                }
            } catch (e) {
                console.warn('⚠️ Erro ao parsear dados do localStorage, tentando carregar do JSON...', e);
            }
        }
        
        // Se não carregou do localStorage, tentar do JSON
        if (!destaquesCarregados) {
            try {
                console.log('Tentando carregar destaques.json...');
                const dados = await fetchJSON('destaques.json');
                console.log('Dados carregados:', dados);
                if (Array.isArray(dados) && dados.length > 0) {
                    destaquesData = dados;
                    console.log(`✅ Carregados ${destaquesData.length} destaques do JSON com sucesso!`);
                    renderizarDestaques();
                } else if (Array.isArray(dados) && dados.length === 0) {
                    console.warn('⚠️ destaques.json está vazio (array vazio)');
                    destaquesData = [];
                    renderizarDestaques();
                } else {
                    console.warn('❌ Formato inválido em destaques.json. Esperado array. Recebido:', typeof dados, dados);
                    destaquesData = [];
                    renderizarDestaques();
                }
            } catch (error) {
            if (error.isFileProtocol) {
                console.warn('⚠️ Protocolo file:// detectado. Usando dados padrão dos destaques.');
            } else {
                console.error('❌ Erro ao carregar destaques.json:', error);
                console.warn('⚠️ Não foi possível carregar destaques.json. Verifique:');
                console.warn('   1. Se o arquivo existe na mesma pasta que admin.html');
                console.warn('   2. Se está usando um servidor (não file://)');
                console.warn('   3. Se há erros de CORS no console');
            }
            
            // Tentar carregar dados padrão se houver erro
            destaquesData = [
                {
                    "id": 1,
                    "nome": "Picolés de Fruta",
                    "descricao": "Sabores naturais e refrescantes feitos com frutas frescas. Sabores: Açaí, Limão, Maracujá, Uva, Melancia, Groselha, Goiaba, Tangerina",
                    "imagem": "assets/sabores/picoles-de-fruta.jpg",
                    "preco": "2,50"
                },
                {
                    "id": 2,
                    "nome": "Picolés ao Leite",
                    "descricao": "Cremosos e deliciosos, feitos com leite fresco. Sabores: Abacaxi, Chocolate, Coco, Espanhola, Leite condensado, Limão suíço, Milho verde, Morango, Sensação",
                    "imagem": "assets/sabores/picoles-ao-leite.jpg",
                    "preco": "4,00"
                },
                {
                    "id": 3,
                    "nome": "Açaí 120 ml",
                    "descricao": "Açaí cremoso e refrescante. Sabores: Açaí com trufa de leitinho, Açaí com trufa de avelã, Açaí puro",
                    "imagem": "assets/sabores/acai-e-sorbets.jpg",
                    "preco": "8,00"
                }
            ];
            console.log('📝 Usando dados padrão dos destaques');
            renderizarDestaques();
            }
        }
        
        // Carregar cardápio
        let cardapioCarregado = false;
        // Tentar diferentes caminhos, incluindo caminho absoluto baseado na URL atual
        const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/');
        const caminhosCardapio = [
            'cardapio.json',           // Caminho relativo simples
            './cardapio.json',         // Caminho relativo explícito
            '/cardapio.json',           // Caminho absoluto da raiz
            baseUrl + 'cardapio.json',  // Caminho absoluto baseado na URL atual
            window.location.pathname.replace(/\/[^/]*$/, '/') + 'cardapio.json'  // Caminho relativo à pasta atual
        ];
        
        console.log('🔍 Iniciando carregamento do cardápio...');
        console.log('📍 URL atual:', window.location.href);
        console.log('📍 Base URL:', baseUrl);
        console.log('📍 Caminhos que serão testados:', caminhosCardapio);
        console.log('cardapioData antes do carregamento:', cardapioData);
        
        for (const caminho of caminhosCardapio) {
            try {
                console.log(`📂 Tentando carregar cardapio.json do caminho: ${caminho}...`);
                const dados = await fetchJSON(caminho);
                console.log('📦 Dados brutos recebidos:', dados);
                console.log('📦 Tipo dos dados:', typeof dados);
                console.log('📦 dados.produtos existe?', !!dados?.produtos);
                console.log('📦 dados.produtos é array?', Array.isArray(dados?.produtos));
                console.log('📦 Quantidade de produtos:', dados?.produtos?.length);
                
                if (dados && dados.produtos && Array.isArray(dados.produtos) && dados.produtos.length > 0) {
                    cardapioData = dados;
                    console.log(`✅ Carregados ${cardapioData.produtos.length} produtos do cardápio com sucesso!`);
                    console.log(`✅ Caminho que funcionou: ${caminho}`);
                    console.log('✅ Primeiro produto:', cardapioData.produtos[0]);
                    cardapioCarregado = true;
                    // Aguardar um pouco para garantir que o DOM está pronto
                    setTimeout(() => {
                        renderizarProdutos();
                    }, 100);
                    break; // Sair do loop se carregou com sucesso
                } else if (dados && dados.produtos && Array.isArray(dados.produtos) && dados.produtos.length === 0) {
                    console.warn(`⚠️ ${caminho} está vazio (array de produtos vazio)`);
                } else {
                    console.warn(`❌ Formato inválido em ${caminho}. Esperado objeto com propriedade produtos.`);
                    console.warn('   Recebido:', typeof dados, dados);
                    if (dados) {
                        console.warn('   Chaves do objeto:', Object.keys(dados));
                    }
                }
            } catch (error) {
                if (error.isFileProtocol && caminho === caminhosCardapio[0]) {
                    // Só mostrar o erro de file:// uma vez
                    console.warn(`⚠️ Protocolo file:// detectado. Não é possível carregar arquivos JSON.`);
                } else if (!error.isFileProtocol) {
                    console.warn(`⚠️ Não foi possível carregar ${caminho}:`, error.message);
                }
                // Continuar tentando outros caminhos (mas não vai funcionar com file://)
            }
        }
        
        if (!cardapioCarregado) {
            if (isFileProtocol()) {
                console.warn('⚠️ Não foi possível carregar cardapio.json porque está usando file:// protocol.');
                console.warn('💡 Use um servidor HTTP local. Veja as instruções no início do console.');
            } else {
                console.error('❌ Não foi possível carregar cardapio.json de nenhum caminho testado.');
                console.warn('⚠️ Verifique:');
                console.warn('   1. Se o arquivo cardapio.json existe no servidor');
                console.warn('   2. Se o arquivo está na mesma pasta que admin.html');
                console.warn('   3. Se há erros de CORS no console');
                console.warn('   4. Se o servidor permite acesso a arquivos JSON');
                console.warn('   5. Abra o console do navegador (F12) para ver mais detalhes');
            }
            
            // Tentar carregar dados padrão do cardapio.json local (se existir)
            // Isso é útil durante desenvolvimento local
            try {
                console.log('🔄 Tentando carregar dados padrão do cardápio...');
                // Não vamos fazer fetch aqui novamente, já tentamos
                // Mas vamos garantir que cardapioData está inicializado
                if (!cardapioData || !cardapioData.produtos) {
                    cardapioData = { produtos: [] };
                }
            } catch (e) {
                console.error('Erro ao inicializar dados padrão:', e);
                cardapioData = { produtos: [] };
            }
            
            console.log('📝 Usando dados vazios do cardápio. Os produtos precisam ser adicionados manualmente ou o arquivo precisa ser enviado ao servidor.');
            console.log('💡 SOLUÇÃO: Faça upload do arquivo cardapio.json para o servidor na mesma pasta que admin.html');
            
            setTimeout(() => {
                renderizarProdutos();
            }, 100);
        }
        
        // Carregar sobre
        let sobreCarregado = false;
        const baseUrlSobre = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/');
        const caminhosSobre = [
            'sobre.json',           // Caminho relativo simples
            './sobre.json',         // Caminho relativo explícito
            '/sobre.json',           // Caminho absoluto da raiz
            baseUrlSobre + 'sobre.json',  // Caminho absoluto baseado na URL atual
            window.location.pathname.replace(/\/[^/]*$/, '/') + 'sobre.json'  // Caminho relativo à pasta atual
        ];
        
        console.log('🔍 Iniciando carregamento do sobre...');
        console.log('📍 Caminhos que serão testados:', caminhosSobre);
        
        for (const caminho of caminhosSobre) {
            try {
                console.log(`📂 Tentando carregar sobre.json do caminho: ${caminho}...`);
                const dados = await fetchJSON(caminho);
                console.log('📦 Dados brutos recebidos:', dados);
                console.log('📦 Tipo dos dados:', typeof dados);
                console.log('📦 dados.historia existe?', !!dados?.historia);
                
                if (dados && dados.historia !== undefined) {
                    sobreData = dados;
                    console.log(`✅ Carregado sobre.json com sucesso!`);
                    console.log(`✅ Caminho que funcionou: ${caminho}`);
                    console.log(`✅ Tamanho do texto: ${sobreData.historia.length} caracteres`);
                    sobreCarregado = true;
                    
                    const textoHistoria = document.getElementById('textoHistoria');
                    if (textoHistoria) {
                        textoHistoria.value = sobreData.historia.replace(/\\n/g, '\n');
                        console.log('✅ Texto carregado no textarea');
                    } else {
                        console.warn('⚠️ Elemento textoHistoria não encontrado no DOM');
                    }
                    break; // Sair do loop se carregou com sucesso
                } else {
                    console.warn(`⚠️ ${caminho} não contém a propriedade "historia"`);
                    console.warn('   Chaves do objeto:', dados ? Object.keys(dados) : 'dados é null/undefined');
                }
            } catch (error) {
                if (error.isFileProtocol && caminho === caminhosSobre[0]) {
                    // Só mostrar o erro de file:// uma vez
                    console.warn(`⚠️ Protocolo file:// detectado. Não é possível carregar arquivos JSON.`);
                } else if (!error.isFileProtocol) {
                    console.warn(`⚠️ Não foi possível carregar ${caminho}:`, error.message);
                }
                // Continuar tentando outros caminhos (mas não vai funcionar com file://)
            }
        }
        
        if (!sobreCarregado) {
            if (isFileProtocol()) {
                console.warn('⚠️ Não foi possível carregar sobre.json porque está usando file:// protocol.');
                console.warn('💡 Use um servidor HTTP local. Veja as instruções no início do console.');
            } else {
                console.error('❌ Não foi possível carregar sobre.json de nenhum caminho testado.');
                console.warn('⚠️ Verifique:');
                console.warn('   1. Se o arquivo sobre.json existe no servidor');
                console.warn('   2. Se o arquivo está na mesma pasta que admin.html');
                console.warn('   3. Se há erros de CORS no console');
                console.warn('   4. Se o servidor permite acesso a arquivos JSON');
            }
            
            sobreData = { historia: '' };
            console.log('📝 Usando dados vazios do sobre.');
            
            const textoHistoria = document.getElementById('textoHistoria');
            if (textoHistoria) {
                textoHistoria.value = '';
            }
        }
    } catch (error) {
        console.error('Erro geral ao carregar dados:', error);
        mostrarToast('Alguns dados não puderam ser carregados. Verifique o console para mais detalhes.', 'error');
    }
}

// ============================================
// GERENCIAMENTO DE DESTAQUES
// ============================================

function renderizarDestaques() {
    const container = document.getElementById('listaDestaques');
    if (!container) {
        console.error('Container listaDestaques não encontrado');
        return;
    }
    
    container.innerHTML = '';
    
    console.log('Renderizando destaques. Total:', destaquesData.length);
    console.log('Dados dos destaques:', destaquesData);
    
    if (!destaquesData || destaquesData.length === 0) {
        container.innerHTML = '<p style="color: var(--cor-texto-claro); text-align: center; padding: 2rem;">Nenhum destaque cadastrado ainda. Clique em "+ Adicionar Destaque" para começar.</p>';
        return;
    }
    
    destaquesData.forEach((destaque, index) => {
        const card = criarCardDestaque(destaque, index);
        container.appendChild(card);
    });
    
    // Tornar a lista arrastável
    tornarListaArrastavel(container);
}

function criarCardDestaque(destaque, index) {
    const card = document.createElement('div');
    card.className = 'card-item';
    card.draggable = true;
    card.dataset.index = index;
    card.dataset.id = destaque.id;
    
    card.innerHTML = `
        <div class="card-item-drag-handle" title="Arrastar para reordenar">☰</div>
        <div class="card-item-header">
            <div>
                <h3 class="card-item-title">${destaque.nome}</h3>
            </div>
            <div class="card-item-actions">
                <button class="btn btn-small btn-secondary" onclick="editarDestaque(${destaque.id})">Editar</button>
                <button class="btn btn-small btn-danger" onclick="excluirDestaque(${destaque.id})">Excluir</button>
            </div>
        </div>
        <img src="${destaque.imagem}" alt="${destaque.nome}" class="card-item-image" onerror="this.src='assets/logo.png'">
        <p class="card-item-description">${destaque.descricao}</p>
        <p class="card-item-price">R$ ${destaque.preco}</p>
    `;
    
    // Eventos de drag and drop
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragover', handleDragOver);
    card.addEventListener('drop', handleDrop);
    card.addEventListener('dragend', handleDragEnd);
    
    return card;
}

function abrirModalDestaque(destaqueId = null) {
    const modal = document.getElementById('modalDestaque');
    const form = document.getElementById('formDestaque');
    const title = document.getElementById('modalDestaqueTitle');
    const selectProduto = document.getElementById('destaqueProduto');
    
    form.reset();
    
    // Popular o select com produtos do cardápio
    selectProduto.innerHTML = '<option value="">-- Selecione um produto --</option>';
    
    if (cardapioData && cardapioData.produtos && cardapioData.produtos.length > 0) {
        // Filtrar produtos que já são destaques (exceto o atual sendo editado)
        const produtosJaDestaques = destaquesData
            .filter(d => !destaqueId || d.id !== destaqueId)
            .map(d => d.nome);
        
        cardapioData.produtos.forEach(produto => {
            // Só mostrar produtos que ainda não são destaques (ou o atual se estiver editando)
            if (!produtosJaDestaques.includes(produto.nome) || (destaqueId && destaquesData.find(d => d.id === destaqueId && d.nome === produto.nome))) {
                const option = document.createElement('option');
                option.value = produto.id;
                option.textContent = produto.nome;
                option.dataset.produto = JSON.stringify(produto);
                selectProduto.appendChild(option);
            }
        });
    } else {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'Nenhum produto cadastrado no cardápio';
        option.disabled = true;
        selectProduto.appendChild(option);
    }
    
    if (destaqueId) {
        const destaque = destaquesData.find(d => d.id === destaqueId);
        if (destaque) {
            title.textContent = 'Editar Destaque';
            document.getElementById('destaqueId').value = destaque.id;
            
            // Encontrar o produto correspondente no cardápio
            const produtoCorrespondente = cardapioData.produtos.find(p => p.nome === destaque.nome);
            if (produtoCorrespondente) {
                selectProduto.value = produtoCorrespondente.id;
                preencherDadosDestaque(produtoCorrespondente);
                mostrarPreviewCardProduto(produtoCorrespondente);
            } else {
                // Se não encontrar, preencher com os dados do destaque (produto pode ter sido removido)
                document.getElementById('destaqueNome').value = destaque.nome;
                document.getElementById('destaqueDescricao').value = destaque.descricao;
                document.getElementById('destaqueImagem').value = destaque.imagem;
                document.getElementById('destaquePreco').value = destaque.preco;
                ocultarPreviewCardProduto();
            }
        }
    } else {
        title.textContent = 'Adicionar Destaque';
        document.getElementById('destaqueId').value = '';
        // Limpar campos
        document.getElementById('destaqueNome').value = '';
        document.getElementById('destaqueDescricao').value = '';
        document.getElementById('destaqueImagem').value = '';
        document.getElementById('destaquePreco').value = '';
        ocultarPreviewCardProduto();
    }
    
    modal.classList.add('active');
}

function preencherDadosDestaque(produto) {
    document.getElementById('destaqueNome').value = produto.nome;
    document.getElementById('destaqueDescricao').value = produto.descricao || '';
    document.getElementById('destaqueImagem').value = produto.imagem || '';
    document.getElementById('destaquePreco').value = produto.preco || '';
}

function mostrarPreviewCardProduto(produto) {
    const previewContainer = document.getElementById('previewCardProduto');
    const previewContent = document.getElementById('previewCardContent');
    
    if (!previewContainer || !previewContent) return;
    
    // Criar o card igual ao da página do cardápio
    const extensao = produto.imagem ? produto.imagem.split('.').pop() : 'jpg';
    const tipoImagem = extensao === 'png' ? 'image/png' : 'image/jpeg';
    
    previewContent.innerHTML = `
        <article class="card-sabor" style="max-width: 300px; margin: 0 auto;">
            <picture class="card-image">
                <source srcset="${produto.imagem || 'assets/logo.png'}" type="${tipoImagem}">
                <img src="${produto.imagem || 'assets/logo.png'}" alt="${produto.nome}" loading="lazy" onerror="this.src='assets/logo.png'">
            </picture>
            <div class="card-content">
                <h3 class="card-title">${produto.nome}</h3>
                <p class="card-description">${produto.descricao || ''}</p>
                <div class="card-footer">
                    <span class="btn btn-small" style="pointer-events: none; opacity: 0.7;">R$ ${produto.preco || '0,00'}</span>
                </div>
            </div>
        </article>
    `;
    
    previewContainer.style.display = 'block';
}

function ocultarPreviewCardProduto() {
    const previewContainer = document.getElementById('previewCardProduto');
    if (previewContainer) {
        previewContainer.style.display = 'none';
    }
}

function fecharModalDestaque() {
    document.getElementById('modalDestaque').classList.remove('active');
    document.getElementById('formDestaque').reset();
    ocultarPreviewCardProduto();
}

function salvarDestaque(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const id = formData.get('id');
    const destaque = {
        id: id ? parseInt(id) : Math.max(...destaquesData.map(d => d.id || 0), 0) + 1,
        nome: formData.get('nome'),
        descricao: formData.get('descricao'),
        imagem: formData.get('imagem'),
        preco: formData.get('preco')
    };
    
    if (id) {
        // Editar
        const index = destaquesData.findIndex(d => d.id === parseInt(id));
        if (index !== -1) {
            destaquesData[index] = destaque;
        }
    } else {
        // Adicionar
        destaquesData.push(destaque);
    }
    
    salvarDestaquesJSON();
    if (isFileProtocol()) {
        salvarDadosNoLocalStorage();
    }
    renderizarDestaques();
    fecharModalDestaque();
    mostrarToast('Destaque salvo com sucesso!', 'success');
}

function editarDestaque(id) {
    abrirModalDestaque(id);
}

function excluirDestaque(id) {
    if (confirm('Tem certeza que deseja excluir este destaque?')) {
        destaquesData = destaquesData.filter(d => d.id !== id);
        salvarDestaquesJSON();
        if (isFileProtocol()) {
            salvarDadosNoLocalStorage();
        }
        renderizarDestaques();
        mostrarToast('Destaque excluído com sucesso!', 'success');
    }
}

// Drag and Drop para reordenar
let draggedElement = null;

function handleDragStart(e) {
    draggedElement = this;
    this.style.opacity = '0.5';
}

function handleDragOver(e) {
    e.preventDefault();
    if (this !== draggedElement && this.classList.contains('card-item')) {
        const rect = this.getBoundingClientRect();
        const next = (e.clientY - rect.top) / (rect.bottom - rect.top) > 0.5;
        this.parentNode.insertBefore(draggedElement, next ? this.nextSibling : this);
    }
}

function handleDrop(e) {
    e.preventDefault();
    if (this !== draggedElement && this.classList.contains('card-item')) {
        const rect = this.getBoundingClientRect();
        const next = (e.clientY - rect.top) / (rect.bottom - rect.top) > 0.5;
        this.parentNode.insertBefore(draggedElement, next ? this.nextSibling : this);
    }
}

function handleDragEnd(e) {
    this.style.opacity = '1';
    
    // Reordenar array baseado na nova ordem do DOM
    const container = document.getElementById('listaDestaques');
    const novosDestaques = [];
    container.querySelectorAll('.card-item').forEach(card => {
        const id = parseInt(card.dataset.id);
        const destaque = destaquesData.find(d => d.id === id);
        if (destaque) {
            novosDestaques.push(destaque);
        }
    });
    
    destaquesData = novosDestaques;
    salvarDestaquesJSON();
    renderizarDestaques();
    mostrarToast('Ordem dos destaques atualizada!', 'success');
}

function tornarListaArrastavel(container) {
    // Já implementado nos cards individuais
}

// ============================================
// GERENCIAMENTO DE CARDÁPIO
// ============================================

function renderizarProdutos() {
    console.log('🎨 Iniciando renderização de produtos...');
    const container = document.getElementById('listaProdutos');
    if (!container) {
        console.error('❌ Container listaProdutos não encontrado no DOM');
        console.error('   Verifique se o elemento <div id="listaProdutos"> existe no HTML');
        return;
    }
    
    console.log('✅ Container encontrado:', container);
    container.innerHTML = '';
    
    console.log('🔍 Verificando dados do cardápio para renderizar...');
    console.log('   cardapioData:', cardapioData);
    console.log('   cardapioData existe?', !!cardapioData);
    console.log('   cardapioData.produtos:', cardapioData?.produtos);
    console.log('   cardapioData.produtos existe?', !!cardapioData?.produtos);
    console.log('   cardapioData.produtos é array?', Array.isArray(cardapioData?.produtos));
    console.log('   Quantidade de produtos:', cardapioData?.produtos?.length);
    
    if (!cardapioData) {
        console.error('❌ cardapioData é null ou undefined');
        container.innerHTML = '<p style="color: var(--cor-texto-claro); text-align: center; padding: 2rem;">Erro: dados do cardápio não foram inicializados.</p>';
        return;
    }
    
    if (!cardapioData.produtos) {
        console.error('❌ cardapioData.produtos não existe');
        container.innerHTML = '<p style="color: var(--cor-texto-claro); text-align: center; padding: 2rem;">Erro: estrutura de dados inválida. Propriedade "produtos" não encontrada.</p>';
        return;
    }
    
    if (!Array.isArray(cardapioData.produtos)) {
        console.error('❌ cardapioData.produtos não é um array. Tipo:', typeof cardapioData.produtos);
        container.innerHTML = '<p style="color: var(--cor-texto-claro); text-align: center; padding: 2rem;">Erro: "produtos" deve ser um array.</p>';
        return;
    }
    
    if (cardapioData.produtos.length === 0) {
        const mensagem = `
            <div style="text-align: center; padding: 2rem; background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; margin: 1rem 0;">
                <p style="color: #856404; font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem;">
                    ⚠️ Nenhum produto cadastrado ainda
                </p>
                <p style="color: #856404; margin-bottom: 1rem;">
                    O arquivo <strong>cardapio.json</strong> não foi encontrado no servidor ou está vazio.
                </p>
                <p style="color: #856404; font-size: 0.9rem; margin-bottom: 1rem;">
                    💡 <strong>Soluções:</strong>
                </p>
                <ul style="text-align: left; color: #856404; font-size: 0.9rem; max-width: 600px; margin: 0 auto 1rem;">
                    <li>Clique em <strong>"📥 Importar do Cardápio"</strong> para importar os produtos da página de cardápio</li>
                    <li>Faça upload do arquivo <code>cardapio.json</code> para o servidor na mesma pasta que <code>admin.html</code></li>
                    <li>Ou clique em <strong>"+ Adicionar Produto"</strong> para cadastrar produtos manualmente</li>
                </ul>
                <p style="color: #856404; font-size: 0.85rem;">
                    Abra o console do navegador (F12) para ver mais detalhes sobre o erro.
                </p>
            </div>
        `;
        container.innerHTML = mensagem;
        
        // Mostrar botão de importar se estiver oculto
        const btnImportar = document.getElementById('btnImportarCardapio');
        if (btnImportar) {
            btnImportar.style.display = 'inline-block';
        }
        
        console.warn('⚠️ Cardápio vazio (0 produtos)');
        console.warn('💡 Dica: Verifique o console para ver se houve erro ao carregar cardapio.json');
        return;
    } else {
        // Ocultar botão de importar se houver produtos
        const btnImportar = document.getElementById('btnImportarCardapio');
        if (btnImportar) {
            btnImportar.style.display = 'none';
        }
    }
    
    console.log(`✅ Renderizando ${cardapioData.produtos.length} produtos`);
    let produtosRenderizados = 0;
    cardapioData.produtos.forEach((produto, index) => {
        try {
            console.log(`  📦 Produto ${index + 1}/${cardapioData.produtos.length}: ${produto.nome || 'SEM NOME'}`);
            if (!produto.id) {
                console.warn(`     ⚠️ Produto sem ID:`, produto);
            }
            const card = criarCardProduto(produto);
            if (card) {
                container.appendChild(card);
                produtosRenderizados++;
            } else {
                console.error(`     ❌ Erro ao criar card para produto:`, produto);
            }
        } catch (error) {
            console.error(`     ❌ Erro ao renderizar produto ${index + 1}:`, error);
            console.error('     Produto:', produto);
        }
    });
    console.log(`✅ Renderização concluída! ${produtosRenderizados} produtos renderizados de ${cardapioData.produtos.length} totais.`);
}

function criarCardProduto(produto) {
    const card = document.createElement('div');
    card.className = 'card-item';
    
    const saboresTexto = produto.sabores && produto.sabores.length > 0 
        ? produto.sabores.join(', ') 
        : 'Sem sabores específicos';
    
    card.innerHTML = `
        <div class="card-item-header">
            <div>
                <h3 class="card-item-title">${produto.nome}</h3>
                <small style="color: var(--cor-texto-claro);">${produto.categoria} - ${produto.setor}</small>
            </div>
            <div class="card-item-actions">
                <button class="btn btn-small btn-secondary" onclick="editarProduto(${produto.id})">Editar</button>
                <button class="btn btn-small btn-danger" onclick="excluirProduto(${produto.id})">Excluir</button>
            </div>
        </div>
        <img src="${produto.imagem}" alt="${produto.nome}" class="card-item-image" onerror="this.src='assets/logo.png'">
        <p class="card-item-description">${produto.descricao}</p>
        <p class="card-item-price">R$ ${produto.preco}</p>
        <p style="font-size: 0.9rem; color: var(--cor-texto-claro); margin-top: 0.5rem;">
            <strong>Sabores:</strong> ${saboresTexto}
        </p>
    `;
    
    return card;
}

function abrirModalProduto(produtoId = null) {
    const modal = document.getElementById('modalProduto');
    const form = document.getElementById('formProduto');
    const title = document.getElementById('modalProdutoTitle');
    
    form.reset();
    
    // Limpar preview
    document.getElementById('previewImagemProduto').style.display = 'none';
    document.getElementById('previewImgProduto').src = '';
    document.getElementById('produtoImagemUpload').value = '';
    
    if (produtoId) {
        const produto = cardapioData.produtos.find(p => p.id === produtoId);
        if (produto) {
            title.textContent = 'Editar Produto';
            document.getElementById('produtoId').value = produto.id;
            document.getElementById('produtoNome').value = produto.nome;
            document.getElementById('produtoCategoria').value = produto.categoria;
            document.getElementById('produtoSetor').value = produto.setor;
            document.getElementById('produtoCategoriaFiltro').value = produto.categoriaFiltro;
            document.getElementById('produtoDescricao').value = produto.descricao;
            document.getElementById('produtoPreco').value = produto.preco;
            document.getElementById('produtoImagem').value = produto.imagem;
            document.getElementById('produtoSabores').value = produto.sabores ? produto.sabores.join('\n') : '';
            
            // Mostrar preview da imagem existente
            if (produto.imagem) {
                const previewDiv = document.getElementById('previewImagemProduto');
                const previewImg = document.getElementById('previewImgProduto');
                previewImg.src = produto.imagem;
                previewDiv.style.display = 'block';
            }
        }
    } else {
        title.textContent = 'Adicionar Produto';
        document.getElementById('produtoId').value = '';
        // Definir valor padrão para o campo de imagem
        document.getElementById('produtoImagem').value = 'assets/sabores/';
    }
    
    modal.classList.add('active');
}

function fecharModalProduto() {
    document.getElementById('modalProduto').classList.remove('active');
    document.getElementById('formProduto').reset();
    document.getElementById('previewImagemProduto').style.display = 'none';
    document.getElementById('previewImgProduto').src = '';
    document.getElementById('produtoImagemUpload').value = '';
    const btnDownload = document.getElementById('btnDownloadImagem');
    if (btnDownload) {
        btnDownload.style.display = 'none';
    }
}

async function salvarProduto(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const id = formData.get('id');
    const saboresTexto = formData.get('sabores').trim();
    const sabores = saboresTexto ? saboresTexto.split('\n').map(s => s.trim()).filter(s => s) : [];
    
    let caminhoImagem = formData.get('imagem');
    
    // Se houver upload de imagem, tentar salvar no servidor
    const fileInput = document.getElementById('produtoImagemUpload');
    if (fileInput && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        // Gerar caminho da imagem baseado no nome do produto
        const nomeProduto = formData.get('nome').trim();
        if (nomeProduto) {
            const nomeArquivo = nomeProduto.toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');
            const extensao = file.name.split('.').pop();
            caminhoImagem = `assets/sabores/${nomeArquivo}.${extensao}`;
            
            // Atualizar o campo de imagem
            document.getElementById('produtoImagem').value = caminhoImagem;
            
            // Tentar fazer upload/salvar a imagem
            if (window.location.protocol === 'file:') {
                mostrarToast('💾 Salvando imagem na pasta do projeto...', 'error');
            } else {
                mostrarToast('⏳ Fazendo upload da imagem...', 'error');
            }
            
            const uploadSucesso = await fazerUploadImagem(file, nomeArquivo, extensao);
            
            if (!uploadSucesso) {
                // Se salvamento falhou, verificar o motivo
                if (window.location.protocol === 'file:') {
                    // Em modo file://, tentar novamente ou avisar
                    const tentarNovamente = confirm(
                        `⚠️ Não foi possível salvar a imagem na pasta do projeto.\n\n` +
                        `Possíveis causas:\n` +
                        `- Navegador não suporta File System Access API (use Chrome ou Edge)\n` +
                        `- Permissão foi negada ou cancelada\n\n` +
                        `Deseja tentar novamente? (será pedido para escolher a pasta)`
                    );
                    
                    if (tentarNovamente) {
                        // Resetar handle e tentar novamente
                        pastaProjetoHandle = null;
                        const tentativa2 = await fazerUploadImagem(file, nomeArquivo, extensao);
                        if (!tentativa2) {
                            const confirmar = confirm(
                                `⚠️ Ainda não foi possível salvar a imagem.\n\n` +
                                `O produto será salvo, mas você precisará fazer upload da imagem manualmente para o servidor.\n\n` +
                                `Deseja continuar?`
                            );
                            if (!confirmar) {
                                return; // Cancelar salvamento do produto
                            }
                        }
                    } else {
                        const confirmar = confirm(
                            `⚠️ A imagem não foi salva.\n\n` +
                            `O produto será salvo, mas você precisará fazer upload da imagem manualmente para o servidor.\n\n` +
                            `Deseja continuar?`
                        );
                        if (!confirmar) {
                            return; // Cancelar salvamento do produto
                        }
                    }
                } else {
                    // Em servidor HTTP mas upload falhou
                    mostrarToast('⚠️ Upload falhou. Verifique se upload-imagem.php está no servidor.', 'error');
                    const confirmar = confirm(
                        `⚠️ Não foi possível fazer upload da imagem para o servidor.\n\n` +
                        `O produto será salvo, mas a imagem não aparecerá no site até você fazer upload manual.\n\n` +
                        `Deseja continuar?`
                    );
                    if (!confirmar) {
                        return; // Cancelar salvamento do produto
                    }
                }
            }
        }
    } else if (caminhoImagem && !caminhoImagem.endsWith('/')) {
        // Verificar se a imagem existe (só funciona em servidor HTTP, não em file://)
        const nomeArquivo = caminhoImagem.split('/').pop();
        
        // Tentar verificar se a imagem existe no servidor
        if (window.location.protocol !== 'file:') {
            try {
                const imgTest = new Image();
                imgTest.onload = () => {
                    console.log('✅ Imagem existe no servidor');
                };
                imgTest.onerror = () => {
                    mostrarToast(`⚠️ A imagem "${nomeArquivo}" não foi encontrada no servidor. Certifique-se de que ela está na pasta assets/sabores/`, 'error');
                };
                imgTest.src = caminhoImagem;
            } catch (error) {
                console.warn('Erro ao verificar imagem:', error);
            }
        } else {
            mostrarToast(`ℹ️ Certifique-se de que a imagem "${nomeArquivo}" está salva na pasta assets/sabores/`, 'error');
        }
    }
    
    const produto = {
        id: id ? parseInt(id) : Math.max(...cardapioData.produtos.map(p => p.id || 0), 0) + 1,
        nome: formData.get('nome'),
        categoria: formData.get('categoria'),
        setor: formData.get('setor'),
        categoriaFiltro: formData.get('categoriaFiltro'),
        descricao: formData.get('descricao'),
        preco: formData.get('preco'),
        imagem: caminhoImagem,
        sabores: sabores
    };
    
    if (id) {
        // Editar
        const index = cardapioData.produtos.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
            cardapioData.produtos[index] = produto;
        }
    } else {
        // Adicionar
        cardapioData.produtos.push(produto);
    }
    
        salvarCardapioJSON();
        if (isFileProtocol()) {
            salvarDadosNoLocalStorage();
        }
        renderizarProdutos();
        fecharModalProduto();
        mostrarToast('Produto salvo com sucesso!', 'success');
}

function editarProduto(id) {
    abrirModalProduto(id);
}

function excluirProduto(id) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        cardapioData.produtos = cardapioData.produtos.filter(p => p.id !== id);
        salvarCardapioJSON();
        if (isFileProtocol()) {
            salvarDadosNoLocalStorage();
        }
        renderizarProdutos();
        mostrarToast('Produto excluído com sucesso!', 'success');
    }
}

// ============================================
// IMPORTAR CARDÁPIO DO HTML
// ============================================

async function importarCardapioDoHTML() {
    if (!confirm('Deseja importar os produtos da página de cardápio? Isso irá substituir os produtos atuais.')) {
        return;
    }
    
    try {
        console.log('📥 Iniciando importação do cardápio do HTML...');
        
        // Dados padrão baseados no cardapio.html
        const produtosPadrao = [
            {
                id: 1,
                nome: "Picolés de Fruta",
                categoria: "fruta",
                setor: "picolés",
                categoriaFiltro: "fruta vegano",
                descricao: "Sabores naturais e refrescantes feitos com frutas frescas do litoral. Sabores: Açaí, Limão, Maracujá, Uva, Melancia, Groselha, Goiaba, Tangerina",
                preco: "2,50",
                imagem: "assets/sabores/picoles-de-fruta.jpg",
                sabores: ["Açaí", "Limão", "Maracujá", "Uva", "Melancia", "Groselha", "Goiaba", "Tangerina"]
            },
            {
                id: 2,
                nome: "Picolés ao Leite",
                categoria: "creme",
                setor: "picolés",
                categoriaFiltro: "creme",
                descricao: "Cremosos e deliciosos, feitos com leite fresco. Sabores: Abacaxi, Chocolate, Coco, Espanhola, Leite condensado, Limão suíço, Milho verde, Morango, Sensação",
                preco: "4,00",
                imagem: "assets/sabores/picoles-ao-leite.jpg",
                sabores: ["Abacaxi", "Chocolate", "Coco", "Espanhola", "Leite condensado", "Limão suíço", "Milho verde", "Morango", "Sensação"]
            },
            {
                id: 3,
                nome: "Picolés Especiais",
                categoria: "creme",
                setor: "picolés",
                categoriaFiltro: "creme",
                descricao: "Picolés com cobertura especial. Sabores: Brigadeiro, Crocante, Skimo, Tentação, Napolitano",
                preco: "8,00",
                imagem: "assets/sabores/picoles-especiais.jpg",
                sabores: ["Brigadeiro", "Crocante", "Skimo", "Tentação", "Napolitano"]
            },
            {
                id: 4,
                nome: "Copão 430 ml",
                categoria: "creme",
                setor: "sorvetes",
                categoriaFiltro: "creme",
                descricao: "Sorvete artesanal servido em copão de 430ml. Sabores: Blue ice, Chocolate, Coco, Flocos, Milho verde, Morango, Napolitano, Passas ao rum",
                preco: "8,00",
                imagem: "assets/sabores/copao.png",
                sabores: ["Blue ice", "Chocolate", "Coco", "Flocos", "Milho verde", "Morango", "Napolitano", "Passas ao rum"]
            },
            {
                id: 5,
                nome: "Sundae Plus",
                categoria: "creme",
                setor: "sorvetes",
                categoriaFiltro: "creme",
                descricao: "Sorvete cremoso com coberturas deliciosas e toppings especiais. Sabores: Chocolate, Morango",
                preco: "8,00",
                imagem: "assets/sabores/sundae.jpg",
                sabores: ["Chocolate", "Morango"]
            },
            {
                id: 6,
                nome: "Sorvete Diet",
                categoria: "creme",
                setor: "sorvetes",
                categoriaFiltro: "creme",
                descricao: "Delicioso e sem açúcar, para quem busca uma opção mais leve",
                preco: "0,00",
                imagem: "assets/sabores/sorvete-diet.jpg",
                sabores: []
            },
            {
                id: 7,
                nome: "Açaí 120 ml",
                categoria: "fruta",
                setor: "açaí",
                categoriaFiltro: "fruta vegano",
                descricao: "Açaí cremoso e refrescante. Sabores: Açaí com trufa de leitinho, Açaí com trufa de avelã, Açaí puro",
                preco: "8,00",
                imagem: "assets/sabores/acai-e-sorbets.jpg",
                sabores: ["Açaí com trufa de leitinho", "Açaí com trufa de avelã", "Açaí puro"]
            },
            {
                id: 8,
                nome: "Potes 1,5L (Recheados)",
                categoria: "creme",
                setor: "potes",
                categoriaFiltro: "creme",
                descricao: "Potes familiares com 1,5 litros de sorvete artesanal recheado. Sabores: Bombom de avelã, Brigadeiro, Chocolate, Crocante, Churros, Espanhola, Flocos, Morango, Morango trufado, Napolitano, Ninho trufado, Passas ao rum, Pistache, Prestígio, Torta de limão",
                preco: "29,50",
                imagem: "assets/sabores/potes-1-5l.jpg",
                sabores: ["Bombom de avelã", "Brigadeiro", "Chocolate", "Crocante", "Churros", "Espanhola", "Flocos", "Morango", "Morango trufado", "Napolitano", "Ninho trufado", "Passas ao rum", "Pistache", "Prestígio", "Torta de limão"]
            },
            {
                id: 9,
                nome: "Caixa 10L",
                categoria: "creme",
                setor: "potes",
                categoriaFiltro: "creme",
                descricao: "Caixa grande com 10 litros, ideal para eventos e festas",
                preco: "0,00",
                imagem: "assets/sabores/caixa-10l.jpg",
                sabores: []
            },
            {
                id: 10,
                nome: "Copo Mirim 200 ml (Recheado)",
                categoria: "creme",
                setor: "especiais",
                categoriaFiltro: "creme",
                descricao: "Copo pequeno com 200ml de sorvete recheado. Sabores: Brigadeiro, Morango, Prestígio, Romeu e Julieta",
                preco: "4,50",
                imagem: "assets/sabores/copinho.jpg",
                sabores: ["Brigadeiro", "Morango", "Prestígio", "Romeu e Julieta"]
            },
            {
                id: 11,
                nome: "Bolinhos",
                categoria: "creme",
                setor: "especiais",
                categoriaFiltro: "creme",
                descricao: "Deliciosos bolinhos de sorvete, perfeitos para o lanche",
                preco: "0,00",
                imagem: "assets/sabores/bolinhos.jpg",
                sabores: []
            },
            {
                id: 12,
                nome: "Esfirras",
                categoria: "creme",
                setor: "especiais",
                categoriaFiltro: "creme",
                descricao: "Esfirras recheadas com sorvete artesanal",
                preco: "0,00",
                imagem: "assets/sabores/esfirras.jpg",
                sabores: []
            },
            {
                id: 13,
                nome: "Coberturas 1,3kg",
                categoria: "creme",
                setor: "coberturas",
                categoriaFiltro: "creme",
                descricao: "Coberturas deliciosas em embalagem de 1,3kg. Sabores: Chocolate (R$ 16,00), Morango (R$ 14,00), Caramelo (R$ 14,00)",
                preco: "14,00",
                imagem: "assets/sabores/cobertura1300g.png",
                sabores: ["Chocolate (R$ 16,00)", "Morango (R$ 14,00)", "Caramelo (R$ 14,00)"]
            },
            {
                id: 14,
                nome: "Coberturas 250g",
                categoria: "creme",
                setor: "coberturas",
                categoriaFiltro: "creme",
                descricao: "Coberturas deliciosas em embalagem de 250g. Sabores: Chocolate (R$ 4,50), Morango (R$ 4,20), Caramelo (R$ 4,20)",
                preco: "4,20",
                imagem: "assets/sabores/cobertura270g.png",
                sabores: ["Chocolate (R$ 4,50)", "Morango (R$ 4,20)", "Caramelo (R$ 4,20)"]
            }
        ];
        
        cardapioData = { produtos: produtosPadrao };
        console.log(`✅ Importados ${produtosPadrao.length} produtos do cardápio padrão`);
        
        // Salvar no JSON
        await salvarCardapioJSON();
        
        // Renderizar
        renderizarProdutos();
        
        mostrarToast(`✅ ${produtosPadrao.length} produtos importados com sucesso!`, 'success');
    } catch (error) {
        console.error('❌ Erro ao importar cardápio:', error);
        mostrarToast('Erro ao importar cardápio. Verifique o console.', 'error');
    }
}

// ============================================
// GERENCIAMENTO DE SOBRE
// ============================================

function salvarSobre(e) {
    e.preventDefault();
    
    const texto = document.getElementById('textoHistoria').value;
    sobreData.historia = texto;
    
    salvarSobreJSON();
    if (isFileProtocol()) {
        salvarDadosNoLocalStorage();
    }
    mostrarToast('Texto salvo com sucesso!', 'success');
}

function cancelarEdicaoSobre() {
    document.getElementById('textoHistoria').value = sobreData.historia.replace(/\\n/g, '\n');
    mostrarToast('Edição cancelada.', 'error');
}

// ============================================
// SALVAR DADOS NOS JSONs
// ============================================

async function salvarDestaquesJSON() {
    // Salvar no localStorage (funciona offline)
    if (isFileProtocol()) {
        salvarDadosNoLocalStorage();
        mostrarToast('Dados salvos no navegador!', 'success');
    } else {
        // Se estiver em servidor HTTP, tentar salvar via fetch (mas não há PHP, então usar localStorage também)
        try {
            salvarDadosNoLocalStorage();
            mostrarToast('Dados salvos! Use "Exportar JSONs" para baixar os arquivos.', 'success');
        } catch (error) {
            console.error('Erro ao salvar destaques:', error);
            downloadJSON(destaquesData, 'destaques.json');
            mostrarToast('Arquivo JSON gerado. Faça o download e substitua o arquivo destaques.json no servidor.', 'error');
        }
    }
}

async function salvarCardapioJSON() {
    // Salvar no localStorage (funciona offline)
    if (isFileProtocol()) {
        salvarDadosNoLocalStorage();
        mostrarToast('Dados salvos no navegador!', 'success');
    } else {
        // Se estiver em servidor HTTP, tentar salvar via fetch (mas não há PHP, então usar localStorage também)
        try {
            salvarDadosNoLocalStorage();
            mostrarToast('Dados salvos! Use "Exportar JSONs" para baixar os arquivos.', 'success');
        } catch (error) {
            console.error('Erro ao salvar cardápio:', error);
            downloadJSON(cardapioData, 'cardapio.json');
            mostrarToast('Arquivo JSON gerado. Faça o download e substitua o arquivo cardapio.json no servidor.', 'error');
        }
    }
}

async function salvarSobreJSON() {
    // Salvar no localStorage (funciona offline)
    if (isFileProtocol()) {
        salvarDadosNoLocalStorage();
        mostrarToast('Dados salvos no navegador!', 'success');
    } else {
        // Se estiver em servidor HTTP, tentar salvar via fetch (mas não há PHP, então usar localStorage também)
        try {
            salvarDadosNoLocalStorage();
            mostrarToast('Dados salvos! Use "Exportar JSONs" para baixar os arquivos.', 'success');
        } catch (error) {
            console.error('Erro ao salvar sobre:', error);
            downloadJSON(sobreData, 'sobre.json');
            mostrarToast('Arquivo JSON gerado. Faça o download e substitua o arquivo sobre.json no servidor.', 'error');
        }
    }
}

// Função auxiliar para download de JSON (fallback quando não há backend)
function downloadJSON(data, filename) {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ============================================
// LOCALSTORAGE E IMPORT/EXPORT (para file://)
// ============================================

function salvarDadosNoLocalStorage() {
    try {
        if (destaquesData && destaquesData.length > 0) {
            localStorage.setItem('admin_destaques', JSON.stringify(destaquesData));
        }
        if (cardapioData && cardapioData.produtos) {
            localStorage.setItem('admin_cardapio', JSON.stringify(cardapioData));
        }
        if (sobreData && sobreData.historia) {
            localStorage.setItem('admin_sobre', JSON.stringify(sobreData));
        }
        console.log('✅ Dados salvos no localStorage');
    } catch (error) {
        console.error('❌ Erro ao salvar no localStorage:', error);
    }
}

function carregarDadosDoLocalStorage() {
    try {
        // Carregar destaques
        const destaquesStored = localStorage.getItem('admin_destaques');
        if (destaquesStored) {
            const parsed = JSON.parse(destaquesStored);
            if (Array.isArray(parsed) && parsed.length > 0) {
                destaquesData = parsed;
                console.log(`✅ Carregados ${destaquesData.length} destaques do localStorage`);
                renderizarDestaques();
            }
        }
        
        // Carregar cardápio
        const cardapioStored = localStorage.getItem('admin_cardapio');
        if (cardapioStored) {
            const parsed = JSON.parse(cardapioStored);
            if (parsed && parsed.produtos && Array.isArray(parsed.produtos)) {
                cardapioData = parsed;
                console.log(`✅ Carregados ${cardapioData.produtos.length} produtos do localStorage`);
                renderizarProdutos();
            }
        }
        
        // Carregar sobre
        const sobreStored = localStorage.getItem('admin_sobre');
        if (sobreStored) {
            const parsed = JSON.parse(sobreStored);
            if (parsed && parsed.historia) {
                sobreData = parsed;
                console.log(`✅ Carregado texto do sobre do localStorage`);
                const textoHistoria = document.getElementById('textoHistoria');
                if (textoHistoria) {
                    textoHistoria.value = sobreData.historia.replace(/\\n/g, '\n');
                }
            }
        }
    } catch (error) {
        console.error('❌ Erro ao carregar do localStorage:', error);
    }
}

function processarArquivosImportados(files) {
    const filesArray = Array.from(files);
    let importados = 0;
    let processados = 0;
    
    if (filesArray.length === 0) {
        return;
    }
    
    filesArray.forEach(file => {
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const content = JSON.parse(event.target.result);
                const fileName = file.name.toLowerCase();
                
                if (fileName.includes('destaques')) {
                    if (Array.isArray(content)) {
                        destaquesData = content;
                        renderizarDestaques();
                        salvarDadosNoLocalStorage();
                        importados++;
                        console.log('✅ Destaques importados automaticamente');
                    }
                } else if (fileName.includes('cardapio')) {
                    if (content.produtos && Array.isArray(content.produtos)) {
                        cardapioData = content;
                        renderizarProdutos();
                        salvarDadosNoLocalStorage();
                        importados++;
                        console.log('✅ Cardápio importado automaticamente');
                    }
                } else if (fileName.includes('sobre')) {
                    if (content.historia) {
                        sobreData = content;
                        const textoHistoria = document.getElementById('textoHistoria');
                        if (textoHistoria) {
                            textoHistoria.value = sobreData.historia.replace(/\\n/g, '\n');
                        }
                        salvarDadosNoLocalStorage();
                        importados++;
                        console.log('✅ Sobre importado automaticamente');
                    }
                }
                
                processados++;
                if (processados === filesArray.length) {
                    if (importados > 0) {
                        mostrarToast(`✅ ${importados} arquivo(s) importado(s) automaticamente!`, 'success');
                    }
                }
            } catch (error) {
                console.error(`Erro ao importar ${file.name}:`, error);
                processados++;
                if (processados === filesArray.length && importados === 0) {
                    mostrarToast('⚠️ Erro ao importar arquivos. Verifique se são JSONs válidos.', 'error');
                }
            }
        };
        reader.readAsText(file);
    });
}

function tentarImportarJSONsAutomaticamente() {
    const importInput = document.getElementById('importJSON');
    const importLabel = document.querySelector('label[for="importJSON"]');
    
    if (!importInput) {
        return;
    }
    
    // Verificar se já há dados
    const temDestaques = localStorage.getItem('admin_destaques');
    const temCardapio = localStorage.getItem('admin_cardapio');
    const temSobre = localStorage.getItem('admin_sobre');
    
    // Se já tem todos os dados, não precisa importar
    if (temDestaques && temCardapio && temSobre) {
        return;
    }
    
    // Destacar o botão de importar
    if (importLabel) {
        importLabel.style.animation = 'pulse 2s infinite';
        importLabel.style.border = '2px solid var(--cor-marrom)';
        importLabel.style.boxShadow = '0 0 10px rgba(255, 143, 163, 0.5)';
    }
    
    // Mostrar mensagem clara
    mostrarToast('📥 Clique em "Importar JSONs" ou selecione os arquivos automaticamente...', 'error');
    
    // Tentar abrir o diálogo de seleção automaticamente após um pequeno delay
    // Nota: Alguns navegadores podem bloquear isso por questões de segurança
    setTimeout(() => {
        try {
            importInput.click();
        } catch (error) {
            console.log('Não foi possível abrir o diálogo automaticamente. Clique no botão "Importar JSONs".');
            if (importLabel) {
                importLabel.style.animation = '';
            }
        }
    }, 1500);
    
    // Remover destaque após 5 segundos
    setTimeout(() => {
        if (importLabel) {
            importLabel.style.animation = '';
            importLabel.style.border = '';
            importLabel.style.boxShadow = '';
        }
    }, 5000);
}

function configurarImportacaoExportacao() {
    const importInput = document.getElementById('importJSON');
    const exportBtn = document.getElementById('exportJSONs');
    
    if (importInput) {
        importInput.addEventListener('change', function(e) {
            const files = e.target.files;
            processarArquivosImportados(files);
            
            // Limpar input após processar
            setTimeout(() => {
                importInput.value = '';
            }, 1000);
        });
    }
    
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            try {
                // Exportar destaques
                if (destaquesData && destaquesData.length > 0) {
                    downloadJSON(destaquesData, 'destaques.json');
                }
                
                // Exportar cardápio
                if (cardapioData && cardapioData.produtos) {
                    setTimeout(() => downloadJSON(cardapioData, 'cardapio.json'), 300);
                }
                
                // Exportar sobre
                if (sobreData && sobreData.historia) {
                    setTimeout(() => downloadJSON(sobreData, 'sobre.json'), 600);
                }
                
                mostrarToast('✅ JSONs exportados! Verifique a pasta de downloads.', 'success');
            } catch (error) {
                console.error('Erro ao exportar:', error);
                mostrarToast('Erro ao exportar JSONs', 'error');
            }
        });
    }
}

// ============================================
// CONFIGURAÇÕES DO PEDIDO
// ============================================

// Lista padrão de itens com preços (mesma estrutura do scripts.js)
const ITENS_PADRAO = {
    'Picolés de Fruta': { preco: '2,50', sabores: ['Açaí', 'Limão', 'Maracujá', 'Uva', 'Melancia', 'Groselha', 'Goiaba', 'Tangerina'] },
    'Picolés ao Leite': { preco: '4,00', sabores: ['Abacaxi', 'Chocolate', 'Coco', 'Espanhola', 'Leite condensado', 'Limão suíço', 'Milho verde', 'Morango', 'Sensação'] },
    'Picolés Especiais': { preco: '8,00', sabores: ['Brigadeiro', 'Crocante', 'Skimo', 'Tentação', 'Napolitano'] },
    'Açaí 120 ml': { preco: '8,00', sabores: ['Açaí com trufa de leitinho', 'Açaí com trufa de avelã', 'Açaí puro'] },
    'Sundae Plus': { preco: '8,00', sabores: ['Chocolate', 'Morango'] },
    'Potes 1,5L (Recheados)': { preco: '29,50', sabores: ['Bombom de avelã', 'Brigadeiro', 'Chocolate', 'Crocante', 'Churros', 'Espanhola', 'Flocos', 'Morango', 'Morango trufado', 'Napolitano', 'Ninho trufado', 'Passas ao rum', 'Pistache', 'Prestígio', 'Torta de limão'] },
    'Copão 430 ml': { preco: '8,00', sabores: ['Blue ice', 'Chocolate', 'Coco', 'Flocos', 'Milho verde', 'Morango', 'Napolitano', 'Passas ao rum'] },
    'Copo Mirim 200 ml (Recheado)': { preco: '4,50', sabores: ['Brigadeiro', 'Morango', 'Prestígio', 'Romeu e Julieta'] },
    'Coberturas 1,3kg': { preco: '0,00', sabores: ['Chocolate (R$ 16,00)', 'Morango (R$ 14,00)', 'Caramelo (R$ 14,00)'] },
    'Coberturas 250g': { preco: '0,00', sabores: ['Chocolate (R$ 4,50)', 'Morango (R$ 4,20)', 'Caramelo (R$ 4,20)'] },
    'Sorvete Diet': { preco: '0,00', sabores: ['Sem sabor específico'] },
    'Caixa 10L': { preco: '0,00', sabores: ['Sem sabor específico'] },
    'Bolinhos': { preco: '0,00', sabores: ['Sem sabor específico'] },
    'Esfirras': { preco: '0,00', sabores: ['Sem sabor específico'] }
};

async function carregarConfigPedido() {
    try {
        // Tentar carregar do localStorage primeiro (modo file://)
        if (isFileProtocol()) {
            const stored = localStorage.getItem('admin_configPedido');
            if (stored) {
                configPedidoData = JSON.parse(stored);
                console.log('✅ Configurações do pedido carregadas do localStorage');
            } else {
                // Inicializar com valores padrão
                configPedidoData = {
                    taxaEntrega: 16.00,
                    itens: []
                };
                // Preencher com itens padrão
                Object.keys(ITENS_PADRAO).forEach(itemNome => {
                    const item = ITENS_PADRAO[itemNome];
                    item.sabores.forEach(sabor => {
                        // Extrair preço do sabor se houver (ex: "Chocolate (R$ 16,00)")
                        let preco = item.preco;
                        if (sabor.includes('(R$')) {
                            const match = sabor.match(/\(R\$ ([\d,]+)\)/);
                            if (match) {
                                preco = match[1];
                            }
                        }
                        configPedidoData.itens.push({
                            id: Date.now() + Math.random(),
                            produto: itemNome,
                            sabor: sabor.replace(/\s*\(R\$ [\d,]+\).*$/, '').trim(),
                            preco: preco
                        });
                    });
                });
            }
        } else {
            // Tentar carregar do JSON
            try {
                const dados = await fetchJSON('config-pedido.json');
                configPedidoData = dados;
                console.log('✅ Configurações do pedido carregadas do JSON');
            } catch (error) {
                console.warn('⚠️ config-pedido.json não encontrado. Usando valores padrão.');
                configPedidoData = {
                    taxaEntrega: 16.00,
                    itens: []
                };
                // Preencher com itens padrão
                Object.keys(ITENS_PADRAO).forEach(itemNome => {
                    const item = ITENS_PADRAO[itemNome];
                    item.sabores.forEach(sabor => {
                        // Extrair preço do sabor se houver
                        let preco = item.preco;
                        if (sabor.includes('(R$')) {
                            const match = sabor.match(/\(R\$ ([\d,]+)\)/);
                            if (match) {
                                preco = match[1];
                            }
                        }
                        configPedidoData.itens.push({
                            id: Date.now() + Math.random(),
                            produto: itemNome,
                            sabor: sabor.replace(/\s*\(R\$ [\d,]+\).*$/, '').trim(),
                            preco: preco
                        });
                    });
                });
            }
        }
        
        renderizarConfigPedido();
    } catch (error) {
        console.error('Erro ao carregar configurações do pedido:', error);
        mostrarToast('Erro ao carregar configurações', 'error');
    }
}

function renderizarConfigPedido() {
    // Atualizar campo de taxa de entrega
    const taxaInput = document.getElementById('taxaEntrega');
    if (taxaInput) {
        taxaInput.value = configPedidoData.taxaEntrega || 16.00;
    }
    
    // Renderizar tabela de preços
    const tbody = document.getElementById('tbodyPrecosItens');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (!configPedidoData.itens || configPedidoData.itens.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="padding: 2rem; text-align: center; color: var(--cor-texto-claro);">
                    Nenhum item cadastrado. Clique em "+ Adicionar Item" para começar.
                </td>
            </tr>
        `;
        return;
    }
    
    // Agrupar por produto para melhor visualização
    const itensPorProduto = {};
    configPedidoData.itens.forEach(item => {
        if (!itensPorProduto[item.produto]) {
            itensPorProduto[item.produto] = [];
        }
        itensPorProduto[item.produto].push(item);
    });
    
    // Ordenar itens por produto
    const produtosOrdenados = Object.keys(itensPorProduto).sort();
    
    // Renderizar cada item agrupado por produto
    produtosOrdenados.forEach(produtoNome => {
        const itensDoProduto = itensPorProduto[produtoNome];
        
        itensDoProduto.forEach((item, index) => {
            const tr = document.createElement('tr');
            tr.style.cssText = 'border-bottom: 1px solid var(--cor-bege-escuro);';
            tr.className = 'item-linha';
            tr.dataset.itemId = item.id;
            
            const isFirstRow = index === 0;
            const rowspan = itensDoProduto.length;
            
            tr.innerHTML = `
                ${isFirstRow ? `<td rowspan="${rowspan}" style="padding: 1rem; font-weight: bold; color: var(--cor-marrom); vertical-align: top; border-right: 1px solid var(--cor-bege-escuro);">${item.produto}</td>` : ''}
                <td style="padding: 1rem; border-right: 1px solid var(--cor-bege-escuro);">${item.sabor || 'Sem sabor específico'}</td>
                <td style="padding: 1rem; text-align: right; border-right: 1px solid var(--cor-bege-escuro);">
                    <div style="display: flex; align-items: center; justify-content: flex-end; gap: 0.5rem;">
                        <span>R$</span>
                        <input 
                            type="text" 
                            class="preco-input-tabela" 
                            data-item-id="${String(item.id)}"
                            value="${item.preco}" 
                            style="width: 100px; padding: 0.5rem; border: 2px solid var(--cor-bege-escuro); border-radius: 6px; text-align: right;"
                            placeholder="0,00"
                        >
                    </div>
                </td>
                <td style="padding: 1rem; text-align: center;">
                    <div style="display: flex; gap: 0.5rem; justify-content: center;">
                        <button type="button" class="btn btn-small btn-secondary" onclick="editarItemPreco('${item.id}')" title="Editar">
                            ✏️
                        </button>
                        <button type="button" class="btn btn-small btn-danger" onclick="excluirItemPreco('${item.id}')" title="Excluir">
                            🗑️
                        </button>
                    </div>
                </td>
            `;
            
            tbody.appendChild(tr);
        });
    });
}

function salvarConfigPedido() {
    try {
        // Obter taxa de entrega
        const taxaInput = document.getElementById('taxaEntrega');
        if (taxaInput) {
            configPedidoData.taxaEntrega = parseFloat(taxaInput.value) || 16.00;
        }
        
        // Obter preços dos itens da tabela
        const precosInputs = document.querySelectorAll('.preco-input-tabela');
        precosInputs.forEach(input => {
            const itemId = input.dataset.itemId;
            const preco = input.value.trim().replace(',', '.');
            if (itemId && preco !== '') {
                // Converter itemId para número se necessário (pode vir como string do HTML)
                const itemIdNum = isNaN(itemId) ? itemId : parseFloat(itemId);
                const item = configPedidoData.itens.find(i => {
                    // Comparar tanto como string quanto como número
                    return String(i.id) === String(itemId) || i.id === itemIdNum;
                });
                if (item) {
                    // Converter para formato brasileiro (virgula)
                    item.preco = parseFloat(preco).toFixed(2).replace('.', ',');
                    console.log(`✅ Preço atualizado para ${item.produto} - ${item.sabor}: ${item.preco}`);
                } else {
                    console.warn(`⚠️ Item não encontrado com ID: ${itemId} (tipo: ${typeof itemId})`);
                    console.log('Itens disponíveis:', configPedidoData.itens.map(i => ({ id: i.id, tipo: typeof i.id, produto: i.produto })));
                }
            } else {
                if (!itemId) {
                    console.warn('⚠️ Campo de preço sem itemId');
                }
                if (preco === '') {
                    console.warn('⚠️ Campo de preço vazio');
                }
            }
        });
        
        // Salvar
        salvarConfigPedidoJSON();
        
        // Atualizar localStorage se estiver em modo file://
        if (isFileProtocol()) {
            localStorage.setItem('admin_configPedido', JSON.stringify(configPedidoData));
        }
        
        mostrarToast('✅ Configurações salvas com sucesso!', 'success');
        
        // Converter estrutura para compatibilidade com scripts.js
        // Criar objeto itensComSabores a partir da lista de itens
        const itensComSaboresObj = {};
        configPedidoData.itens.forEach(item => {
            if (!itensComSaboresObj[item.produto]) {
                itensComSaboresObj[item.produto] = {
                    preco: item.preco,
                    sabores: []
                };
            }
            // Adicionar sabor se não existir
            if (!itensComSaboresObj[item.produto].sabores.includes(item.sabor)) {
                itensComSaboresObj[item.produto].sabores.push(item.sabor);
            }
            // Se o preço for diferente e não for 0,00, usar o primeiro preço não-zero
            if (item.preco !== '0,00' && itensComSaboresObj[item.produto].preco === '0,00') {
                itensComSaboresObj[item.produto].preco = item.preco;
            }
        });
        
        // Criar objeto de preços simples para compatibilidade
        const precosItens = {};
        Object.keys(itensComSaboresObj).forEach(produto => {
            precosItens[produto] = itensComSaboresObj[produto].preco;
        });
        
        // Atualizar scripts.js via localStorage para atualização em tempo real
        localStorage.setItem('config_pedido_taxa', configPedidoData.taxaEntrega.toString());
        localStorage.setItem('config_pedido_precos', JSON.stringify(precosItens));
        localStorage.setItem('config_pedido_itens', JSON.stringify(configPedidoData.itens));
        localStorage.setItem('config_pedido_itensComSabores', JSON.stringify(itensComSaboresObj));
        
        // Disparar evento customizado para atualizar scripts.js
        window.dispatchEvent(new CustomEvent('configPedidoAtualizado'));
        
    } catch (error) {
        console.error('Erro ao salvar configurações:', error);
        mostrarToast('Erro ao salvar configurações', 'error');
    }
}

function cancelarConfigPedido() {
    // Recarregar os dados originais
    carregarConfigPedido();
    mostrarToast('Alterações canceladas.', 'error');
}

function salvarConfigPedidoJSON() {
    // Garantir que os IDs sejam números (caso tenham sido convertidos para string)
    configPedidoData.itens.forEach(item => {
        if (typeof item.id === 'string' && !isNaN(item.id)) {
            item.id = parseFloat(item.id);
        }
    });
    
    if (isFileProtocol()) {
        // Em modo file://, salvar no localStorage
        localStorage.setItem('admin_configPedido', JSON.stringify(configPedidoData));
        console.log('✅ Configurações salvas no localStorage');
        console.log('Total de itens salvos:', configPedidoData.itens.length);
    } else {
        // Tentar salvar via fetch (requer backend)
        fetch('salvar-config-pedido.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(configPedidoData)
        }).catch(error => {
            console.warn('Não foi possível salvar no servidor. Fazendo download...');
            downloadJSON(configPedidoData, 'config-pedido.json');
        });
    }
}

function editarItemPreco(itemId) {
    const item = configPedidoData.itens.find(i => i.id === itemId);
    if (!item) return;
    
    const novoProduto = prompt('Produto:', item.produto);
    if (novoProduto === null) return;
    
    const novoSabor = prompt('Sabor:', item.sabor);
    if (novoSabor === null) return;
    
    const novoPreco = prompt('Preço (R$):', item.preco);
    if (novoPreco === null) return;
    
    item.produto = novoProduto.trim();
    item.sabor = novoSabor.trim();
    item.preco = novoPreco.trim().replace(',', '.').replace('.', ',');
    
    renderizarConfigPedido();
    mostrarToast('✅ Item atualizado! Não esqueça de salvar as configurações.', 'success');
}

function excluirItemPreco(itemId) {
    if (!confirm('Tem certeza que deseja excluir este item?')) return;
    
    configPedidoData.itens = configPedidoData.itens.filter(i => i.id !== itemId);
    renderizarConfigPedido();
    mostrarToast('✅ Item excluído! Não esqueça de salvar as configurações.', 'success');
}

function adicionarItemPreco() {
    const produto = prompt('Nome do Produto:');
    if (!produto || !produto.trim()) return;
    
    const sabor = prompt('Sabor (ou "Sem sabor específico"):', 'Sem sabor específico');
    if (sabor === null) return;
    
    const preco = prompt('Preço (R$):', '0,00');
    if (preco === null) return;
    
    const novoItem = {
        id: Date.now() + Math.random(),
        produto: produto.trim(),
        sabor: sabor.trim() || 'Sem sabor específico',
        preco: preco.trim().replace(',', '.').replace('.', ',')
    };
    
    configPedidoData.itens.push(novoItem);
    renderizarConfigPedido();
    mostrarToast('✅ Item adicionado! Não esqueça de salvar as configurações.', 'success');
}

// ============================================
// TOAST NOTIFICATION
// ============================================

function mostrarToast(mensagem, tipo = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = mensagem;
    toast.className = `toast ${tipo} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ============================================
// FUNÇÕES GLOBAIS (para onclick nos cards)
// ============================================

window.editarDestaque = editarDestaque;
window.excluirDestaque = excluirDestaque;
window.editarProduto = editarProduto;
window.excluirProduto = excluirProduto;

