// ============================================
// VARIÁVEIS GLOBAIS
// ============================================

const PHONE_WHATSAPP = '551334261517';
let itensPedido = [];

// ============================================
// NAVEGAÇÃO MOBILE
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
        });
        
        // Fechar menu ao clicar em um link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
            });
        });
        
        // Fechar menu ao clicar fora
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && navMenu.classList.contains('active')) {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
            }
        });
    }
});

// ============================================
// HEADER FIXO COM SCROLL
// ============================================

window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    }
});

// ============================================
// MODAL DE PEDIDOS
// ============================================

function abrirModal() {
    const modal = document.getElementById('modalPedido');
    if (modal) {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        document.body.style.overflowX = 'hidden';
        
        // Focar no primeiro campo
        const primeiroInput = modal.querySelector('input');
        if (primeiroInput) {
            setTimeout(() => primeiroInput.focus(), 100);
        }
    }
}

function fecharModal() {
    const modal = document.getElementById('modalPedido');
    if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        document.body.style.overflowX = '';
    }
}

// Botões para abrir modal
document.addEventListener('DOMContentLoaded', function() {
    const btnPedirAgora = document.getElementById('btnPedirAgora');
    const btnHeroPedir = document.getElementById('btnHeroPedir');
    const modalClose = document.getElementById('modalClose');
    const btnCancelar = document.getElementById('btnCancelar');
    
    if (btnPedirAgora) {
        btnPedirAgora.addEventListener('click', abrirModal);
    }
    
    if (btnHeroPedir) {
        btnHeroPedir.addEventListener('click', abrirModal);
    }
    
    if (modalClose) {
        modalClose.addEventListener('click', fecharModal);
    }
    
    if (btnCancelar) {
        btnCancelar.addEventListener('click', fecharModal);
    }
    
    // Fechar modal ao clicar fora
    const modal = document.getElementById('modalPedido');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                fecharModal();
            }
        });
    }
    
    // Fechar modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            fecharModal();
        }
    });
});

// ============================================
// ADICIONAR ITENS AO PEDIDO
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const botoesAdicionar = document.querySelectorAll('[data-sabor]');
    
    botoesAdicionar.forEach(botao => {
        botao.addEventListener('click', function() {
            const itemNome = this.getAttribute('data-sabor');
            const preco = this.getAttribute('data-preco');
            
            // Abrir modal primeiro
            abrirModal();
            
            // Aguardar um pouco para o modal abrir e os elementos estarem disponíveis
            setTimeout(() => {
                const selectSaborAdicionar = document.getElementById('selectSaborAdicionar');
                const selectSaborEspecifico = document.getElementById('selectSaborEspecifico');
                
                if (selectSaborAdicionar) {
                    // Verificar se o select já foi populado
                    if (selectSaborAdicionar.options.length <= 1) {
                        // Se não foi populado, aguardar mais um pouco
                        setTimeout(() => {
                            selectSaborAdicionar.value = itemNome;
                            const event = new Event('change', { bubbles: true });
                            selectSaborAdicionar.dispatchEvent(event);
                        }, 200);
                    } else {
                        // Selecionar o item no select
                        selectSaborAdicionar.value = itemNome;
                        
                        // Disparar o evento change para carregar os sabores específicos
                        const event = new Event('change', { bubbles: true });
                        selectSaborAdicionar.dispatchEvent(event);
                    }
                }
            }, 100);
            
            // Feedback visual
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
});

// ============================================
// GERENCIAR ITENS DO PEDIDO NO MODAL
// ============================================

function atualizarListaItens() {
    const itensPedidoDiv = document.getElementById('itensPedido');
    if (!itensPedidoDiv) return;
    
    itensPedidoDiv.innerHTML = '';
    
    if (itensPedido.length === 0) {
        itensPedidoDiv.innerHTML = '<p>Nenhum item adicionado ainda.</p>';
        return;
    }
    
    itensPedido.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item-pedido';
        
        // Separar produto e sabor para exibição
        const produto = item.produto || (item.saborCompleto ? item.saborCompleto.split(' - ')[0] : item.sabor);
        const sabor = item.sabor || (item.saborCompleto && item.saborCompleto.includes(' - ') ? item.saborCompleto.split(' - ')[1] : '');
        
        itemDiv.innerHTML = `
            <div class="item-produto-sabor">
                <span class="item-produto">${produto}</span>
                ${sabor ? `<span class="item-sabor-texto">${sabor}</span>` : ''}
            </div>
            <input type="number" class="item-quantidade" data-index="${index}" 
                   value="${item.quantidade}" min="1" aria-label="Quantidade">
            <span class="item-preco">R$ ${item.preco}</span>
            <button type="button" class="btn-remover-item" data-index="${index}" 
                    aria-label="Remover item"></button>
        `;
        itensPedidoDiv.appendChild(itemDiv);
    });
    
    // Event listeners para edição
    const inputs = itensPedidoDiv.querySelectorAll('.item-quantidade');
    const botoesRemover = itensPedidoDiv.querySelectorAll('.btn-remover-item');
    
    inputs.forEach(input => {
        input.addEventListener('change', function() {
            const index = parseInt(this.getAttribute('data-index'));
            const quantidade = parseInt(this.value);
            if (quantidade > 0) {
                itensPedido[index].quantidade = quantidade;
            }
        });
    });
    
    botoesRemover.forEach(botao => {
        botao.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            itensPedido.splice(index, 1);
            atualizarListaItens();
        });
    });
}

function gerarOpcoesSabores(saborAtual) {
    const sabores = [
        'Picolés de Fruta',
        'Picolés ao Leite',
        'Picolés Especiais',
        'Açaí 120 ml',
        'Sundae Plus',
        'Potes 1,5L (Recheados)',
        'Copão 430 ml',
        'Copo Mirim 200 ml (Recheado)',
        'Coberturas 1,3kg',
        'Coberturas 250g',
        'Sorvete Diet',
        'Caixa 10L',
        'Bolinhos',
        'Esfirras'
    ];
    
    return sabores.map(sabor => 
        `<option value="${sabor}" ${sabor === saborAtual ? 'selected' : ''}>${sabor}</option>`
    ).join('');
}

// Adicionar novo item manualmente
document.addEventListener('DOMContentLoaded', function() {
    const btnAdicionarItem = document.getElementById('btnAdicionarItem');
    const selectSaborAdicionar = document.getElementById('selectSaborAdicionar');
    const selectSaborEspecifico = document.getElementById('selectSaborEspecifico');
    
    // Estrutura de dados com itens e seus sabores específicos
    const itensComSabores = {
        'Picolés de Fruta': {
            preco: '2,50',
            sabores: ['Açaí', 'Limão', 'Maracujá', 'Uva', 'Melancia', 'Groselha', 'Goiaba', 'Tangerina']
        },
        'Picolés ao Leite': {
            preco: '4,00',
            sabores: ['Abacaxi', 'Chocolate', 'Coco', 'Espanhola', 'Leite condensado', 'Limão suíço', 'Milho verde', 'Morango', 'Sensação']
        },
        'Picolés Especiais': {
            preco: '8,00',
            sabores: ['Brigadeiro', 'Crocante', 'Skimo', 'Tentação', 'Napolitano']
        },
        'Açaí 120 ml': {
            preco: '8,00',
            sabores: ['Açaí com trufa de leitinho', 'Açaí com trufa de avelã', 'Açaí puro']
        },
        'Sundae Plus': {
            preco: '8,00',
            sabores: ['Chocolate', 'Morango']
        },
        'Potes 1,5L (Recheados)': {
            preco: '29,50',
            sabores: ['Bombom de avelã', 'Brigadeiro', 'Chocolate', 'Crocante', 'Churros', 'Espanhola', 'Flocos', 'Morango', 'Morango trufado', 'Napolitano', 'Ninho trufado', 'Passas ao rum', 'Pistache', 'Prestígio', 'Torta de limão']
        },
        'Copão 430 ml': {
            preco: '8,00',
            sabores: ['Blue ice', 'Chocolate', 'Coco', 'Flocos', 'Milho verde', 'Morango', 'Napolitano', 'Passas ao rum']
        },
        'Copo Mirim 200 ml (Recheado)': {
            preco: '4,50',
            sabores: ['Brigadeiro', 'Morango', 'Prestígio', 'Romeu e Julieta']
        },
        'Coberturas 1,3kg': {
            preco: '0,00',
            sabores: ['Chocolate (R$ 16,00)', 'Morango (R$ 14,00)', 'Caramelo (R$ 14,00)']
        },
        'Coberturas 250g': {
            preco: '0,00',
            sabores: ['Chocolate (R$ 4,50)', 'Morango (R$ 4,20)', 'Caramelo (R$ 4,20)']
        },
        'Sorvete Diet': {
            preco: '0,00',
            sabores: ['Sem sabor específico']
        },
        'Caixa 10L': {
            preco: '0,00',
            sabores: ['Sem sabor específico']
        },
        'Bolinhos': {
            preco: '0,00',
            sabores: ['Sem sabor específico']
        },
        'Esfirras': {
            preco: '0,00',
            sabores: ['Sem sabor específico']
        }
    };
    
    // Preencher o select de itens
    if (selectSaborAdicionar) {
        Object.keys(itensComSabores).forEach(itemNome => {
            const option = document.createElement('option');
            option.value = itemNome;
            option.textContent = itemNome;
            option.dataset.preco = itensComSabores[itemNome].preco;
            selectSaborAdicionar.appendChild(option);
        });
        
        // Quando selecionar um item, mostrar os sabores específicos
        selectSaborAdicionar.addEventListener('change', function() {
            const itemSelecionado = this.value;
            
            // Limpar o select de sabores específicos
            if (selectSaborEspecifico) {
                selectSaborEspecifico.innerHTML = '<option value="">Selecione o sabor</option>';
                selectSaborEspecifico.style.display = 'none';
                selectSaborEspecifico.classList.remove('visible');
                selectSaborEspecifico.value = '';
            }
            
            if (itemSelecionado && itensComSabores[itemSelecionado]) {
                const sabores = itensComSabores[itemSelecionado].sabores;
                
                if (selectSaborEspecifico && sabores.length > 0 && sabores[0] !== 'Sem sabor específico') {
                    // Limpar opções anteriores
                    selectSaborEspecifico.innerHTML = '<option value="">Selecione o sabor</option>';
                    
                    sabores.forEach(sabor => {
                        const option = document.createElement('option');
                        option.value = sabor;
                        option.textContent = sabor;
                        selectSaborEspecifico.appendChild(option);
                    });
                    
                    selectSaborEspecifico.style.display = 'flex';
                    selectSaborEspecifico.classList.add('visible');
                } else if (selectSaborEspecifico) {
                    // Se não tem sabores específicos, ocultar o select
                    selectSaborEspecifico.innerHTML = '<option value="">Selecione o sabor</option>';
                    selectSaborEspecifico.style.display = 'none';
                    selectSaborEspecifico.classList.remove('visible');
                }
            }
        });
    }
    
    if (btnAdicionarItem) {
        btnAdicionarItem.addEventListener('click', function() {
            // Re-obter os elementos para garantir que estão atualizados
            const selectSaborAdicionarAtual = document.getElementById('selectSaborAdicionar');
            const selectSaborEspecificoAtual = document.getElementById('selectSaborEspecifico');
            
            if (!selectSaborAdicionarAtual || !selectSaborAdicionarAtual.value) {
                alert('Por favor, selecione um item antes de adicionar.');
                return;
            }
            
            const itemSelecionado = selectSaborAdicionarAtual.value.trim();
            
            // Verificar se o item existe na estrutura de dados
            if (!itensComSabores[itemSelecionado]) {
                alert('Item não encontrado. Por favor, selecione um item válido.');
                return;
            }
            
            const selectedOption = selectSaborAdicionarAtual.options[selectSaborAdicionarAtual.selectedIndex];
            const preco = selectedOption ? (selectedOption.dataset.preco || itensComSabores[itemSelecionado].preco) : itensComSabores[itemSelecionado].preco;
            const sabores = itensComSabores[itemSelecionado].sabores;
            
            // Verificar se precisa escolher sabor específico
            let saborCompleto = itemSelecionado;
            let precoFinal = preco;
            
            if (sabores && sabores.length > 0 && sabores[0] !== 'Sem sabor específico') {
                if (!selectSaborEspecificoAtual || !selectSaborEspecificoAtual.value || selectSaborEspecificoAtual.style.display === 'none' || selectSaborEspecificoAtual.style.display === '') {
                    alert('Por favor, selecione o sabor específico antes de adicionar.');
                    return;
                }
                
                const saborEspecifico = selectSaborEspecificoAtual.value.trim();
                saborCompleto = `${itemSelecionado} - ${saborEspecifico}`;
                
                // Extrair preço das coberturas se houver
                if (itemSelecionado === 'Coberturas 1,3kg' || itemSelecionado === 'Coberturas 250g') {
                    const matchPreco = saborEspecifico.match(/R\$ ([\d,]+)/);
                    if (matchPreco) {
                        precoFinal = matchPreco[1];
                    }
                }
            }
            
            // Separar produto e sabor
            let produto = itemSelecionado;
            let saborEspecifico = '';
            
            if (sabores && sabores.length > 0 && sabores[0] !== 'Sem sabor específico') {
                saborEspecifico = selectSaborEspecificoAtual.value.trim();
            }
            
            itensPedido.push({
                produto: produto,
                sabor: saborEspecifico,
                saborCompleto: saborCompleto, // Mantido para compatibilidade
                preco: precoFinal,
                quantidade: 1
            });
            
            atualizarListaItens();
            
            // Resetar os selects
            selectSaborAdicionarAtual.value = '';
            if (selectSaborEspecificoAtual) {
                selectSaborEspecificoAtual.innerHTML = '<option value="">Selecione o sabor</option>';
                selectSaborEspecificoAtual.style.display = 'none';
                selectSaborEspecificoAtual.classList.remove('visible');
                selectSaborEspecificoAtual.value = '';
            }
        });
    }
});

// ============================================
// FORMULÁRIO DE PEDIDO
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const formPedido = document.getElementById('formPedido');
    if (formPedido) {
        formPedido.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (itensPedido.length === 0) {
                alert('Por favor, adicione pelo menos um item ao pedido.');
                return;
            }
            
            const nome = document.getElementById('nome').value.trim();
            const telefone = document.getElementById('telefone').value.trim();
            const endereco = document.getElementById('endereco').value.trim();
            const observacoes = document.getElementById('observacoes').value.trim();
            
            if (!nome || !telefone || !endereco) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            const mensagem = gerarMensagemWhatsApp(nome, telefone, endereco, observacoes);
            const urlWhatsApp = gerarWhatsappPedido(mensagem);
            
            window.open(urlWhatsApp, '_blank', 'noopener,noreferrer');
        });
    }
    
    // Máscara de telefone
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                if (value.length <= 10) {
                    value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
                } else {
                    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                }
                e.target.value = value;
            }
        });
    }
    
    const telefoneContatoInput = document.getElementById('telefoneContato');
    if (telefoneContatoInput) {
        telefoneContatoInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                if (value.length <= 10) {
                    value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
                } else {
                    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                }
                e.target.value = value;
            }
        });
    }
});

function gerarMensagemWhatsApp(nome, telefone, endereco, observacoes) {
    let mensagem = `🍦 *Pedido - Sorvetes Litorâneo*\n\n`;
    mensagem += `*Cliente:* ${nome}\n`;
    mensagem += `*Telefone:* ${telefone}\n`;
    mensagem += `*Endereço:* ${endereco}\n\n`;
    mensagem += `*Itens do Pedido:*\n`;
    
    itensPedido.forEach((item, index) => {
        // Separar produto e sabor
        const produto = item.produto || (item.saborCompleto ? item.saborCompleto.split(' - ')[0] : item.sabor);
        const sabor = item.sabor || (item.saborCompleto && item.saborCompleto.includes(' - ') ? item.saborCompleto.split(' - ')[1] : '');
        
        if (sabor) {
            mensagem += `${index + 1}. ${produto} - ${sabor}\n`;
        } else {
            mensagem += `${index + 1}. ${produto}\n`;
        }
        mensagem += `   Qtd: ${item.quantidade} | Preço: R$ ${item.preco}\n\n`;
    });
    
    // Calcular total
    const total = itensPedido.reduce((sum, item) => {
        const preco = parseFloat(item.preco.replace(',', '.'));
        return sum + (preco * item.quantidade);
    }, 0);
    
    mensagem += `*Total: R$ ${total.toFixed(2).replace('.', ',')}*\n`;
    
    if (observacoes) {
        mensagem += `\n*Observações:*\n${observacoes}`;
    }
    
    return mensagem;
}

function gerarWhatsappPedido(mensagem) {
    return `https://wa.me/${PHONE_WHATSAPP}?text=${encodeURIComponent(mensagem)}`;
}

// ============================================
// FILTROS E BUSCA - CARDÁPIO
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const filtroBtns = document.querySelectorAll('.filtro-btn');
    const inputBusca = document.getElementById('busca');
    const cardsGrid = document.getElementById('cardsGrid');
    const semResultados = document.getElementById('semResultados');
    
    let categoriaAtiva = 'todos';
    let termoBusca = '';
    
    // Filtros por categoria
    filtroBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Atualizar botão ativo
            filtroBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            categoriaAtiva = this.getAttribute('data-categoria');
            filtrarCards();
        });
    });
    
    // Busca por texto
    if (inputBusca) {
        inputBusca.addEventListener('input', function() {
            termoBusca = this.value.toLowerCase().trim();
            filtrarCards();
        });
    }
    
    function filtrarCards() {
        if (!cardsGrid) return;
        
        const cards = cardsGrid.querySelectorAll('.card-sabor');
        let cardsVisiveis = 0;
        
        cards.forEach(card => {
            const categorias = card.getAttribute('data-categoria').toLowerCase();
            const titulo = card.querySelector('.card-title').textContent.toLowerCase();
            const descricao = card.querySelector('.card-description').textContent.toLowerCase();
            
            const matchCategoria = categoriaAtiva === 'todos' || categorias.includes(categoriaAtiva);
            const matchBusca = !termoBusca || 
                             titulo.includes(termoBusca) || 
                             descricao.includes(termoBusca);
            
            if (matchCategoria && matchBusca) {
                card.style.display = 'block';
                cardsVisiveis++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Mostrar/ocultar mensagem de sem resultados
        if (semResultados) {
            if (cardsVisiveis === 0) {
                semResultados.style.display = 'block';
            } else {
                semResultados.style.display = 'none';
            }
        }
    }
});

// ============================================
// FORMULÁRIO DE CONTATO
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const formContato = document.getElementById('formContato');
    if (formContato) {
        formContato.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nome = document.getElementById('nomeContato').value.trim();
            const email = document.getElementById('emailContato').value.trim();
            const telefone = document.getElementById('telefoneContato').value.trim();
            const mensagem = document.getElementById('mensagemContato').value.trim();
            
            if (!nome || !email || !mensagem) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            // Validar email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor, insira um e-mail válido.');
                return;
            }
            
            // Gerar mensagem para WhatsApp
            let msgContato = `📧 *Contato - Sorvetes Litorâneo*\n\n`;
            msgContato += `*Nome:* ${nome}\n`;
            msgContato += `*E-mail:* ${email}\n`;
            if (telefone) {
                msgContato += `*Telefone:* ${telefone}\n`;
            }
            msgContato += `\n*Mensagem:*\n${mensagem}`;
            
            const urlWhatsApp = `https://wa.me/${PHONE_WHATSAPP}?text=${encodeURIComponent(msgContato)}`;
            window.open(urlWhatsApp, '_blank', 'noopener,noreferrer');
            
            // Limpar formulário
            formContato.reset();
            alert('Redirecionando para o WhatsApp...');
        });
    }
});

// ============================================
// LAZY LOADING DE IMAGENS
// ============================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });
    
    document.addEventListener('DOMContentLoaded', function() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ============================================
// VALIDAÇÃO DE FORMULÁRIOS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form[novalidate]');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
                
                // Focar no primeiro campo inválido
                const primeiroInvalido = form.querySelector(':invalid');
                if (primeiroInvalido) {
                    primeiroInvalido.focus();
                    primeiroInvalido.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
            
            form.classList.add('was-validated');
        });
    });
});

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Atualizar lista de itens se houver itens salvos
    if (itensPedido.length > 0) {
        atualizarListaItens();
    }
    
    console.log('Sorvetes Litorâneo - Site carregado com sucesso!');
});

