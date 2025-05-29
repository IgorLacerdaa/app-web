// tabs.js
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    // Remove 'active' de todos os botões e abas
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    // Adiciona 'active' ao botão e à aba correspondente
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});