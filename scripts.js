// ============================================
// VARIÁVEIS GLOBAIS
// ============================================

const PHONE_WHATSAPP = '551334261517';
let itensPedido = [];

// ============================================
// NAVEGAÇÃO MOBILE
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu && nav) {
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
        
        // Popular o select de itens quando o modal abrir (caso ainda não esteja populado)
        setTimeout(() => {
            popularSelectItens();
        }, 100);
        
        // Focar no primeiro campo
        const primeiroInput = modal.querySelector('input');
        if (primeiroInput) {
            setTimeout(() => primeiroInput.focus(), 100);
        }
        
        // Atualizar o total quando o modal é aberto
        setTimeout(() => {
            atualizarTotal();
        }, 150);
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
    try {
        const btnPedirAgora = document.getElementById('btnPedirAgora');
        const btnHeroPedir = document.getElementById('btnHeroPedir');
        const modalClose = document.getElementById('modalClose');
        const btnCancelar = document.getElementById('btnCancelar');
        
        if (btnPedirAgora) {
            btnPedirAgora.addEventListener('click', function(e) {
                e.preventDefault();
                abrirModal();
            });
        }
        
        if (btnHeroPedir) {
            btnHeroPedir.addEventListener('click', function(e) {
                e.preventDefault();
                abrirModal();
            });
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
    } catch (error) {
        console.error('Erro ao inicializar botões do modal:', error);
    }
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
        atualizarTotal();
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
                atualizarTotal();
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
    
    atualizarTotal();
}

function atualizarTotal() {
    const totalPedidoElement = document.getElementById('totalPedido');
    if (!totalPedidoElement) return;
    
    // Calcular total dos itens
    const totalItens = itensPedido.reduce((sum, item) => {
        const preco = parseFloat(item.preco.replace(',', '.'));
        return sum + (preco * item.quantidade);
    }, 0);
    
    // Verificar se é entrega e adicionar taxa
    const formaEntrega = document.getElementById('formaEntrega');
    let taxaEntrega = 0;
    
    if (formaEntrega && formaEntrega.value === 'entrega') {
        // Carregar taxa de entrega do localStorage ou usar padrão
        const taxaSalva = localStorage.getItem('config_pedido_taxa');
        taxaEntrega = taxaSalva ? parseFloat(taxaSalva) : 16.00;
    }
    
    const total = totalItens + taxaEntrega;
    
    // Atualizar exibição do total
    if (taxaEntrega > 0) {
        totalPedidoElement.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.25rem;">
                <span style="font-size: 0.9rem; color: var(--cor-texto-claro);">
                    Subtotal: R$ ${totalItens.toFixed(2).replace('.', ',')}
                </span>
                <span style="font-size: 0.9rem; color: var(--cor-texto-claro);">
                    Taxa de Entrega: R$ ${taxaEntrega.toFixed(2).replace('.', ',')}
                </span>
                <span style="font-weight: bold; font-size: 1.1rem;">
                    Total: R$ ${total.toFixed(2).replace('.', ',')}
                </span>
            </div>
        `;
    } else {
        totalPedidoElement.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }
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

// Variável global para armazenar estrutura de itens
let itensComSabores = {};

// Função para carregar estrutura de itens
function carregarEstruturaItens() {
    const itensComSaboresSalvos = localStorage.getItem('config_pedido_itensComSabores');
    const itensSalvos = localStorage.getItem('config_pedido_itens');
    const precosSalvos = localStorage.getItem('config_pedido_precos');
    
    itensComSabores = {};
    
    // Se houver estrutura completa salva, usar ela
    if (itensComSaboresSalvos) {
        try {
            itensComSabores = JSON.parse(itensComSaboresSalvos);
        } catch (e) {
            console.warn('Erro ao carregar itensComSabores do localStorage:', e);
        }
    }
    
    // Se não houver estrutura completa, tentar construir a partir da lista de itens
    if (Object.keys(itensComSabores).length === 0 && itensSalvos) {
        try {
            const itens = JSON.parse(itensSalvos);
            itens.forEach(item => {
                if (!itensComSabores[item.produto]) {
                    itensComSabores[item.produto] = {
                        preco: item.preco,
                        sabores: []
                    };
                }
                if (!itensComSabores[item.produto].sabores.includes(item.sabor)) {
                    itensComSabores[item.produto].sabores.push(item.sabor);
                }
            });
        } catch (e) {
            console.warn('Erro ao construir itensComSabores:', e);
        }
    }
    
    // Se ainda não tiver estrutura, usar valores padrão
    if (Object.keys(itensComSabores).length === 0) {
        const precosItens = precosSalvos ? JSON.parse(precosSalvos) : {};
        
        // Estrutura de dados padrão com itens e seus sabores específicos
        itensComSabores = {
            'Picolés de Fruta': {
                preco: precosItens['Picolés de Fruta'] || '2,50',
                sabores: ['Açaí', 'Limão', 'Maracujá', 'Uva', 'Melancia', 'Groselha', 'Goiaba', 'Tangerina']
            },
            'Picolés ao Leite': {
                preco: precosItens['Picolés ao Leite'] || '4,00',
                sabores: ['Abacaxi', 'Chocolate', 'Coco', 'Espanhola', 'Leite condensado', 'Limão suíço', 'Milho verde', 'Morango', 'Sensação']
            },
            'Picolés Especiais': {
                preco: precosItens['Picolés Especiais'] || '8,00',
                sabores: ['Brigadeiro', 'Crocante', 'Skimo', 'Tentação', 'Napolitano']
            },
            'Açaí 120 ml': {
                preco: precosItens['Açaí 120 ml'] || '8,00',
                sabores: ['Açaí com trufa de leitinho', 'Açaí com trufa de avelã', 'Açaí puro']
            },
            'Sundae Plus': {
                preco: precosItens['Sundae Plus'] || '8,00',
                sabores: ['Chocolate', 'Morango']
            },
            'Potes 1,5L (Recheados)': {
                preco: precosItens['Potes 1,5L (Recheados)'] || '29,50',
                sabores: ['Bombom de avelã', 'Brigadeiro', 'Chocolate', 'Crocante', 'Churros', 'Espanhola', 'Flocos', 'Morango', 'Morango trufado', 'Napolitano', 'Ninho trufado', 'Passas ao rum', 'Pistache', 'Prestígio', 'Torta de limão']
            },
            'Copão 430 ml': {
                preco: precosItens['Copão 430 ml'] || '8,00',
                sabores: ['Blue ice', 'Chocolate', 'Coco', 'Flocos', 'Milho verde', 'Morango', 'Napolitano', 'Passas ao rum']
            },
            'Copo Mirim 200 ml (Recheado)': {
                preco: precosItens['Copo Mirim 200 ml (Recheado)'] || '4,50',
                sabores: ['Brigadeiro', 'Morango', 'Prestígio', 'Romeu e Julieta']
            },
            'Coberturas 1,3kg': {
                preco: precosItens['Coberturas 1,3kg'] || '0,00',
                sabores: ['Chocolate (R$ 16,00)', 'Morango (R$ 14,00)', 'Caramelo (R$ 14,00)']
            },
            'Coberturas 250g': {
                preco: precosItens['Coberturas 250g'] || '0,00',
                sabores: ['Chocolate (R$ 4,50)', 'Morango (R$ 4,20)', 'Caramelo (R$ 4,20)']
            },
            'Sorvete Diet': {
                preco: precosItens['Sorvete Diet'] || '0,00',
                sabores: ['Sem sabor específico']
            },
            'Caixa 10L': {
                preco: precosItens['Caixa 10L'] || '0,00',
                sabores: ['Sem sabor específico']
            },
            'Bolinhos': {
                preco: precosItens['Bolinhos'] || '0,00',
                sabores: ['Sem sabor específico']
            },
            'Esfirras': {
                preco: precosItens['Esfirras'] || '0,00',
                sabores: ['Sem sabor específico']
            }
        };
    }
    
    return itensComSabores;
}

// Função para popular o select de itens
function popularSelectItens() {
    const selectSaborAdicionar = document.getElementById('selectSaborAdicionar');
    if (!selectSaborAdicionar) return;
    
    // Carregar estrutura de itens se ainda não foi carregada
    if (Object.keys(itensComSabores).length === 0) {
        carregarEstruturaItens();
    }
    
    // Verificar se já está populado (mais de 1 opção = já tem itens além do placeholder)
    if (selectSaborAdicionar.options.length > 1) {
        return; // Já está populado
    }
    
    // Limpar opções existentes (exceto a primeira que é o placeholder)
    selectSaborAdicionar.innerHTML = '<option value="">Selecione um item</option>';
    
    // Popular com os itens
    Object.keys(itensComSabores).forEach(itemNome => {
        const option = document.createElement('option');
        option.value = itemNome;
        option.textContent = itemNome;
        option.dataset.preco = itensComSabores[itemNome].preco;
        selectSaborAdicionar.appendChild(option);
    });
}

// Adicionar novo item manualmente
document.addEventListener('DOMContentLoaded', function() {
    const btnAdicionarItem = document.getElementById('btnAdicionarItem');
    const selectSaborAdicionar = document.getElementById('selectSaborAdicionar');
    const selectSaborEspecifico = document.getElementById('selectSaborEspecifico');
    
    // Carregar estrutura de itens
    carregarEstruturaItens();
    
    // Popular o select de itens
    popularSelectItens();
    
    // Função para recarregar estrutura de itens
    function recarregarEstruturaItens() {
        carregarEstruturaItens();
        popularSelectItens();
        
        // Atualizar preços dos itens já adicionados ao pedido
        const itensSalvos = localStorage.getItem('config_pedido_itens');
        if (itensSalvos) {
            try {
                const itens = JSON.parse(itensSalvos);
                itensPedido.forEach(item => {
                    const itemConfig = itens.find(i => i.produto === item.produto && i.sabor === item.sabor);
                    if (itemConfig) {
                        item.preco = itemConfig.preco;
                    } else if (itensComSabores[item.produto]) {
                        item.preco = itensComSabores[item.produto].preco;
                    }
                });
            } catch (e) {
                console.warn('Erro ao atualizar preços dos itens:', e);
            }
        }
        
        atualizarListaItens();
    }
    
    // Atualizar quando as configurações mudarem
    window.addEventListener('configPedidoAtualizado', function() {
        recarregarEstruturaItens();
    });
    
    // Monitorar mudanças no localStorage (para quando admin salvar em outra aba/janela)
    window.addEventListener('storage', function(e) {
        if (e.key === 'config_pedido_taxa' || e.key === 'config_pedido_precos' || e.key === 'config_pedido_itens' || e.key === 'config_pedido_itensComSabores') {
            recarregarEstruturaItens();
        }
    });
    
    // Quando selecionar um item, mostrar os sabores específicos
    if (selectSaborAdicionar) {
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
            let saborEspecifico = '';
            
            if (sabores && sabores.length > 0 && sabores[0] !== 'Sem sabor específico') {
                if (!selectSaborEspecificoAtual || !selectSaborEspecificoAtual.value || selectSaborEspecificoAtual.style.display === 'none' || selectSaborEspecificoAtual.style.display === '') {
                    alert('Por favor, selecione o sabor específico antes de adicionar.');
                    return;
                }
                
                saborEspecifico = selectSaborEspecificoAtual.value.trim();
                saborCompleto = `${itemSelecionado} - ${saborEspecifico}`;
                
                // Buscar preço específico do sabor na lista de itens configurados
                const itensConfig = localStorage.getItem('config_pedido_itens');
                if (itensConfig) {
                    try {
                        const itens = JSON.parse(itensConfig);
                        const itemConfig = itens.find(i => i.produto === itemSelecionado && i.sabor === saborEspecifico);
                        if (itemConfig) {
                            precoFinal = itemConfig.preco;
                        }
                    } catch (e) {
                        console.warn('Erro ao buscar preço específico:', e);
                    }
                }
                
                // Extrair preço das coberturas se houver (fallback)
                if (itemSelecionado === 'Coberturas 1,3kg' || itemSelecionado === 'Coberturas 250g') {
                    const matchPreco = saborEspecifico.match(/R\$ ([\d,]+)/);
                    if (matchPreco && precoFinal === preco) {
                        precoFinal = matchPreco[1];
                    }
                }
            }
            
            // Separar produto e sabor (já definido acima)
            let produto = itemSelecionado;
            
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
            const formaEntrega = document.getElementById('formaEntrega');
            const endereco = document.getElementById('endereco').value.trim();
            const observacoes = document.getElementById('observacoes').value.trim();
            
            if (!nome || !telefone || !formaEntrega || !formaEntrega.value || !endereco) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            const mensagem = gerarMensagemWhatsApp(nome, telefone, endereco, observacoes);
            const urlWhatsApp = gerarWhatsappPedido(mensagem);
            
            window.open(urlWhatsApp, '_blank', 'noopener,noreferrer');
        });
        
        // Event listener para atualizar total quando forma de entrega mudar
        const formaEntrega = document.getElementById('formaEntrega');
        if (formaEntrega) {
            formaEntrega.addEventListener('change', function() {
                atualizarTotal();
            });
        }
        
        // Atualizar total quando configurações mudarem (taxa de entrega)
        window.addEventListener('configPedidoAtualizado', function() {
            atualizarTotal();
        });
        
        // Monitorar mudanças na taxa de entrega via storage
        window.addEventListener('storage', function(e) {
            if (e.key === 'config_pedido_taxa') {
                atualizarTotal();
            }
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
    
    // Forma de entrega
    const formaEntrega = document.getElementById('formaEntrega');
    const formaEntregaTexto = formaEntrega && formaEntrega.value === 'entrega' ? 'Entrega' : 'Retirada';
    mensagem += `*Forma de Entrega:* ${formaEntregaTexto}\n`;
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
    
    // Calcular total dos itens
    const totalItens = itensPedido.reduce((sum, item) => {
        const preco = parseFloat(item.preco.replace(',', '.'));
        return sum + (preco * item.quantidade);
    }, 0);
    
    // Adicionar taxa de entrega se for entrega
    let taxaEntrega = 0;
    if (formaEntrega && formaEntrega.value === 'entrega') {
        // Carregar taxa de entrega do localStorage ou usar padrão
        const taxaSalva = localStorage.getItem('config_pedido_taxa');
        taxaEntrega = taxaSalva ? parseFloat(taxaSalva) : 16.00;
        mensagem += `*Subtotal:* R$ ${totalItens.toFixed(2).replace('.', ',')}\n`;
        mensagem += `*Taxa de Entrega:* R$ ${taxaEntrega.toFixed(2).replace('.', ',')}\n`;
    }
    
    const total = totalItens + taxaEntrega;
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
// CARREGAR DADOS DOS JSONs PARA AS PÁGINAS
// ============================================

// Carregar destaques na página inicial
async function carregarDestaques() {
    const container = document.getElementById('destaquesContainer');
    if (!container) return;
    
    let destaques = null;
    
    // SEMPRE verificar localStorage primeiro (prioridade para alterações do admin)
    try {
        const destaquesStored = localStorage.getItem('admin_destaques');
        if (destaquesStored) {
            destaques = JSON.parse(destaquesStored);
            console.log('✅ Carregado destaques.json do localStorage (alterações do admin)');
        }
    } catch (error) {
        console.warn('Erro ao carregar do localStorage:', error);
    }
    
    // Se não encontrou no localStorage, tentar fetch do arquivo JSON (servidor HTTP)
    if (!destaques) {
        try {
            const response = await fetch('destaques.json');
            if (response.ok) {
                destaques = await response.json();
                console.log('✅ Carregado destaques.json do servidor');
            }
        } catch (error) {
            console.warn('Não foi possível carregar destaques.json. Usando conteúdo estático.');
        }
    }
    
    // Se encontrou dados, atualizar o conteúdo
    if (destaques && Array.isArray(destaques) && destaques.length > 0) {
        container.innerHTML = '';
        destaques.forEach(destaque => {
            const card = document.createElement('article');
            card.className = 'card-sabor';
            
            const extensao = destaque.imagem.split('.').pop();
            const tipoImagem = extensao === 'png' ? 'image/png' : 'image/jpeg';
            
            card.innerHTML = `
                <picture class="card-image">
                    <source srcset="${destaque.imagem}" type="${tipoImagem}">
                    <img src="${destaque.imagem}" alt="${destaque.nome}" loading="lazy">
                </picture>
                <div class="card-content">
                    <h3 class="card-title">${destaque.nome}</h3>
                    <p class="card-description">${destaque.descricao}</p>
                    <div class="card-footer">
                        <button class="btn btn-small" data-sabor="${destaque.nome}" data-preco="${destaque.preco}">Adicionar</button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
        
        // Reativar event listeners dos botões "Adicionar"
        reativarBotoesAdicionar();
        console.log(`✅ Destaques atualizados: ${destaques.length} item(ns)`);
    } else {
        console.log('ℹ️ Usando conteúdo estático (fallback)');
    }
}

// Carregar cardápio na página de cardápio
async function carregarCardapio() {
    const container = document.getElementById('cardsGrid');
    if (!container) return;
    
    let dados = null;
    
    // SEMPRE verificar localStorage primeiro (prioridade para alterações do admin)
    try {
        const cardapioStored = localStorage.getItem('admin_cardapio');
        if (cardapioStored) {
            dados = JSON.parse(cardapioStored);
            console.log('✅ Carregado cardapio.json do localStorage (alterações do admin)');
        }
    } catch (error) {
        console.warn('Erro ao carregar do localStorage:', error);
    }
    
    // Se não encontrou no localStorage, tentar fetch do arquivo JSON (servidor HTTP)
    if (!dados) {
        try {
            const response = await fetch('cardapio.json');
            if (response.ok) {
                dados = await response.json();
                console.log('✅ Carregado cardapio.json do servidor');
            }
        } catch (error) {
            console.warn('Não foi possível carregar cardapio.json. Usando conteúdo estático.');
        }
    }
    
    // Se encontrou dados, atualizar o conteúdo
    if (dados && dados.produtos && Array.isArray(dados.produtos) && dados.produtos.length > 0) {
        // Verificar se já tem conteúdo estático
        const temConteudoEstatico = container.querySelectorAll('.setor-cardapio').length > 0;
        
        // Agrupar produtos por setor
        const produtosPorSetor = {};
        dados.produtos.forEach(produto => {
            if (!produtosPorSetor[produto.setor]) {
                produtosPorSetor[produto.setor] = [];
            }
            produtosPorSetor[produto.setor].push(produto);
        });
        
        // Limpar conteúdo estático se existir
        if (temConteudoEstatico) {
            container.innerHTML = '';
        }
        
        // Ordem dos setores
        const ordemSetores = ['picolés', 'sorvetes', 'açaí', 'potes', 'especiais', 'coberturas'];
        const nomesSetores = {
            'picolés': 'Picolés',
            'sorvetes': 'Sorvetes',
            'açaí': 'Açaí',
            'potes': 'Potes e Embalagens Grandes',
            'especiais': 'Produtos Especiais',
            'coberturas': 'Coberturas'
        };
        
        ordemSetores.forEach(setor => {
            if (produtosPorSetor[setor] && produtosPorSetor[setor].length > 0) {
                const setorDiv = document.createElement('div');
                setorDiv.className = 'setor-cardapio';
                setorDiv.setAttribute('data-setor', setor);
                
                const titulo = document.createElement('h2');
                titulo.className = 'setor-titulo';
                titulo.textContent = nomesSetores[setor] || setor;
                setorDiv.appendChild(titulo);
                
                const cardsGrid = document.createElement('div');
                cardsGrid.className = 'cards-grid';
                
                produtosPorSetor[setor].forEach(produto => {
                    const card = criarCardProduto(produto);
                    cardsGrid.appendChild(card);
                });
                
                setorDiv.appendChild(cardsGrid);
                container.appendChild(setorDiv);
            }
        });
        
        // Reativar event listeners dos botões "Adicionar"
        reativarBotoesAdicionar();
        
        // Reativar filtros após carregar
        setTimeout(() => {
            if (typeof window.filtrarCards === 'function') {
                window.filtrarCards();
            }
        }, 100);
        
        console.log(`✅ Cardápio atualizado: ${dados.produtos.length} produto(s)`);
    } else {
        console.log('ℹ️ Usando conteúdo estático (fallback)');
    }
}

// Criar card de produto para o cardápio
function criarCardProduto(produto) {
    const card = document.createElement('article');
    card.className = 'card-sabor';
    card.setAttribute('data-categoria', produto.categoriaFiltro || 'creme');
    
    const extensao = produto.imagem.split('.').pop();
    const tipoImagem = extensao === 'png' ? 'image/png' : 'image/jpeg';
    
    card.innerHTML = `
        <picture class="card-image">
            <source srcset="${produto.imagem}" type="${tipoImagem}">
            <img src="${produto.imagem}" alt="${produto.nome}" loading="lazy">
        </picture>
        <div class="card-content">
            <h3 class="card-title">${produto.nome}</h3>
            <p class="card-description">${produto.descricao}</p>
            <div class="card-footer">
                <button class="btn btn-small" data-sabor="${produto.nome}" data-preco="${produto.preco}">Adicionar</button>
            </div>
        </div>
    `;
    
    return card;
}

// Carregar texto "Sobre Nós"
async function carregarSobre() {
    const container = document.getElementById('historiaContainer');
    if (!container) return;
    
    let dados = null;
    
    // SEMPRE verificar localStorage primeiro (prioridade para alterações do admin)
    try {
        const sobreStored = localStorage.getItem('admin_sobre');
        if (sobreStored) {
            dados = JSON.parse(sobreStored);
            console.log('✅ Carregado sobre.json do localStorage (alterações do admin)');
        }
    } catch (error) {
        console.warn('Erro ao carregar do localStorage:', error);
    }
    
    // Se não encontrou no localStorage, tentar fetch do arquivo JSON (servidor HTTP)
    if (!dados) {
        try {
            const response = await fetch('sobre.json');
            if (response.ok) {
                dados = await response.json();
                console.log('✅ Carregado sobre.json do servidor');
            }
        } catch (error) {
            console.warn('Não foi possível carregar sobre.json. Usando conteúdo estático.');
        }
    }
    
    // Se encontrou dados, atualizar o conteúdo
    if (dados && dados.historia) {
        // Processar quebras de linha: \n\n vira parágrafo, \n vira <br>
        const texto = dados.historia
            .replace(/\r\n/g, '\n')  // Normalizar quebras de linha
            .replace(/\r/g, '\n');
        
        // Dividir por parágrafos (duas quebras de linha)
        const paragrafos = texto.split(/\n\n+/).filter(p => p.trim());
        
        // Renderizar parágrafos
        container.innerHTML = paragrafos.map(p => {
            // Substituir quebras de linha simples por <br> dentro do parágrafo
            const paragrafoComBr = p.trim().replace(/\n/g, '<br>');
            return `<p>${paragrafoComBr}</p>`;
        }).join('');
        
        console.log(`✅ Texto "Nossa História" atualizado com ${paragrafos.length} parágrafo(s)`);
    } else {
        console.log('ℹ️ Usando conteúdo estático (fallback)');
    }
}

// Reativar event listeners dos botões "Adicionar" após carregar dados dinâmicos
function reativarBotoesAdicionar() {
    const botoesAdicionar = document.querySelectorAll('.card-sabor .btn-small[data-sabor]');
    botoesAdicionar.forEach(btn => {
        btn.addEventListener('click', function() {
            const sabor = this.getAttribute('data-sabor');
            const preco = this.getAttribute('data-preco');
            
            // Abrir modal e pré-selecionar o item
            abrirModal();
            
            setTimeout(() => {
                const selectSaborAdicionar = document.getElementById('selectSaborAdicionar');
                if (selectSaborAdicionar && selectSaborAdicionar.options.length > 0) {
                    selectSaborAdicionar.value = sabor;
                    const event = new Event('change', { bubbles: true });
                    selectSaborAdicionar.dispatchEvent(event);
                }
            }, 200);
        });
    });
}

// Carregar dados quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Carregar destaques se estiver na página inicial
    if (document.getElementById('destaquesContainer')) {
        carregarDestaques();
        
        // Listener para detectar mudanças no localStorage e atualizar automaticamente
        window.addEventListener('storage', function(e) {
            if (e.key === 'admin_destaques') {
                console.log('🔄 Alteração detectada no localStorage. Atualizando destaques...');
                carregarDestaques();
            }
        });
        
        // Também verificar quando a página ganha foco (caso tenha editado em outra aba)
        window.addEventListener('focus', function() {
            carregarDestaques();
        });
        
        // Verificar periodicamente se houve mudanças (para mesma aba)
        let ultimosDestaques = localStorage.getItem('admin_destaques');
        setInterval(function() {
            const destaquesAtual = localStorage.getItem('admin_destaques');
            if (destaquesAtual !== ultimosDestaques) {
                ultimosDestaques = destaquesAtual;
                console.log('🔄 Alteração detectada no localStorage. Atualizando destaques...');
                carregarDestaques();
            }
        }, 1000); // Verificar a cada 1 segundo
    }
    
    // Carregar cardápio se estiver na página de cardápio
    if (document.getElementById('cardsGrid')) {
        carregarCardapio();
        
        // Listener para detectar mudanças no localStorage e atualizar automaticamente
        window.addEventListener('storage', function(e) {
            if (e.key === 'admin_cardapio') {
                console.log('🔄 Alteração detectada no localStorage. Atualizando cardápio...');
                carregarCardapio();
            }
        });
        
        // Também verificar quando a página ganha foco (caso tenha editado em outra aba)
        window.addEventListener('focus', function() {
            carregarCardapio();
        });
        
        // Verificar periodicamente se houve mudanças (para mesma aba)
        let ultimoCardapio = localStorage.getItem('admin_cardapio');
        setInterval(function() {
            const cardapioAtual = localStorage.getItem('admin_cardapio');
            if (cardapioAtual !== ultimoCardapio) {
                ultimoCardapio = cardapioAtual;
                console.log('🔄 Alteração detectada no localStorage. Atualizando cardápio...');
                carregarCardapio();
            }
        }, 1000); // Verificar a cada 1 segundo
    }
    
    // Carregar sobre se estiver na página sobre
    if (document.getElementById('historiaContainer')) {
        carregarSobre();
        
        // Listener para detectar mudanças no localStorage e atualizar automaticamente
        window.addEventListener('storage', function(e) {
            if (e.key === 'admin_sobre') {
                console.log('🔄 Alteração detectada no localStorage. Atualizando página...');
                carregarSobre();
            }
        });
        
        // Também verificar quando a página ganha foco (caso tenha editado em outra aba)
        window.addEventListener('focus', function() {
            carregarSobre();
        });
        
        // Verificar periodicamente se houve mudanças (para mesma aba)
        let ultimoSobre = localStorage.getItem('admin_sobre');
        setInterval(function() {
            const sobreAtual = localStorage.getItem('admin_sobre');
            if (sobreAtual !== ultimoSobre) {
                ultimoSobre = sobreAtual;
                console.log('🔄 Alteração detectada no localStorage. Atualizando página...');
                carregarSobre();
            }
        }, 1000); // Verificar a cada 1 segundo
    }
});

// ============================================
// FILTROS E BUSCA - CARDÁPIO
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const filtroBtns = document.querySelectorAll('.filtro-btn');
    const inputBusca = document.getElementById('busca');
    const cardsGrid = document.getElementById('cardsGrid');
    const semResultados = document.getElementById('semResultados');
    
    // Tornar variável global para poder ser acessada após carregamento dinâmico
    window.categoriaAtiva = 'todos';
    
    // Filtros por categoria
    filtroBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Atualizar botão ativo
            filtroBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            window.categoriaAtiva = this.getAttribute('data-categoria');
            filtrarCards();
        });
    });
    
    // Busca por texto
    if (inputBusca) {
        inputBusca.addEventListener('input', function() {
            filtrarCards();
        });
    }
    
    // Tornar função global para poder ser chamada após carregamento dinâmico
    window.filtrarCards = function() {
        const cardsGridAtual = document.getElementById('cardsGrid');
        if (!cardsGridAtual) return;
        
        const inputBuscaAtual = document.getElementById('busca');
        const semResultadosAtual = document.getElementById('semResultados');
        const termoBusca = inputBuscaAtual ? inputBuscaAtual.value.toLowerCase().trim() : '';
        const cards = cardsGridAtual.querySelectorAll('.card-sabor');
        const setores = cardsGridAtual.querySelectorAll('.setor-cardapio');
        let cardsVisiveis = 0;
        
        // Filtrar cards
        cards.forEach(card => {
            const categorias = card.getAttribute('data-categoria') ? card.getAttribute('data-categoria').toLowerCase() : '';
            const titulo = card.querySelector('.card-title') ? card.querySelector('.card-title').textContent.toLowerCase() : '';
            const descricao = card.querySelector('.card-description') ? card.querySelector('.card-description').textContent.toLowerCase() : '';
            
            const matchCategoria = window.categoriaAtiva === 'todos' || categorias.includes(window.categoriaAtiva);
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
        
        // Ocultar setores sem cards visíveis
        setores.forEach(setor => {
            const cardsNoSetor = setor.querySelectorAll('.card-sabor');
            const temCardVisivel = Array.from(cardsNoSetor).some(card => card.style.display !== 'none');
            
            if (temCardVisivel) {
                setor.style.display = 'block';
            } else {
                setor.style.display = 'none';
            }
        });
        
        // Mostrar/ocultar mensagem de sem resultados
        if (semResultadosAtual) {
            if (cardsVisiveis === 0) {
                semResultadosAtual.style.display = 'block';
            } else {
                semResultadosAtual.style.display = 'none';
            }
        }
    };
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

