/* Q'Massa – triagem de atendimento e envio para o WhatsApp */
(function () {
  const NUMERO = '558186323398'; // +55 81 8632-3398
  const form = document.getElementById('triagem');
  const boxSabores = document.getElementById('sabores');
  const obs = document.getElementById('obs');

  // Dica do campo de observações muda conforme o tipo de cliente
  const DICAS = {
    'Revenda / Lanchonete': 'Ex.: 500 unidades por semana, entrega em Recife',
    'Festa / Aniversário': 'Ex.: 100 convidados, festa dia 20 às 18h',
    'Buffet': 'Ex.: evento para 200 pessoas, dia 15, salgados variados',
    'Consumo próprio': 'Ex.: 50 unidades, para retirar no sábado'
  };

  const marcados = (nome) => [...form.querySelectorAll(`input[name="${nome}"]:checked`)].map((i) => i.value);
  const mostrarErro = (campo, texto) => { form.querySelector(`[data-erro="${campo}"]`).textContent = texto; };

  // Mostra os sabores só quando "Coxinhas" está marcado
  form.addEventListener('change', (e) => {
    if (e.target.name === 'produto') {
      const temCoxinha = marcados('produto').includes('Coxinhas');
      boxSabores.hidden = !temCoxinha;
      if (!temCoxinha) boxSabores.querySelectorAll('input').forEach((i) => (i.checked = false));
    }
    if (e.target.name === 'tipo') obs.placeholder = DICAS[e.target.value] || obs.placeholder;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = form.nome.value.trim();
    const tipo = marcados('tipo')[0];
    const produtos = marcados('produto');
    const sabores = marcados('sabor');
    const observacoes = obs.value.trim();

    // Validação com mensagens claras
    mostrarErro('nome', nome ? '' : 'Informe seu nome completo.');
    mostrarErro('tipo', tipo ? '' : 'Escolha o tipo de cliente.');
    mostrarErro('produto', produtos.length ? '' : 'Marque pelo menos um produto.');
    if (!nome || !tipo || !produtos.length) {
      form.querySelector('.erro:not(:empty)').scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Lista de produtos (coxinhas levam os sabores escolhidos)
    const linhasProdutos = produtos.map((p) =>
      p === 'Coxinhas' && sabores.length ? `• Coxinhas (${sabores.join(', ')})` : `• ${p}`
    );

    // Mensagem formatada (*negrito* é sintaxe do WhatsApp)
    const mensagem = [
      "*Novo pedido / orçamento – Site Q'Massa*",
      '',
      `Olá! Meu nome é *${nome}*.`,
      `*Tipo de cliente:* ${tipo}`,
      '*Produtos de interesse:*',
      ...linhasProdutos,
      `*Quantidade / observações:* ${observacoes || 'Não informado'}`,
      '',
      'Aguardo o retorno. Obrigado!'
    ].join('\n');

    const url = `https://wa.me/${NUMERO}?text=${encodeURIComponent(mensagem)}`;
    // Abre em nova aba; se o navegador bloquear, redireciona na mesma aba
    if (!window.open(url, '_blank', 'noopener')) window.location.href = url;
  });
})();
