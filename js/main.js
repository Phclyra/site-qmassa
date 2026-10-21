/* Q'Massa – scripts compartilhados (home e contato) */
(function () {
  // Menu mobile: abre/fecha e fecha ao clicar em um link
  const botao = document.querySelector('.menu-btn');
  const nav = document.getElementById('nav');
  if (botao && nav) {
    botao.addEventListener('click', () => {
      const aberto = nav.classList.toggle('aberto');
      botao.setAttribute('aria-expanded', aberto);
    });
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        nav.classList.remove('aberto');
        botao.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Ano atual no rodapé
  const ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();
})();
