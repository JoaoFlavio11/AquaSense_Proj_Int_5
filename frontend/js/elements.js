const toggleMenu = document.getElementById('toggleMenu');
const sidebar = document.getElementById('sidebar');
const icon = toggleMenu.querySelector('i');

// Função para alternar a visibilidade da sidebar
function toggleSidebar() {
    if (sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        sidebar.classList.add('closed');
        icon.classList.remove('bi-chevron-left');
        icon.classList.add('bi-chevron-right'); // Muda a seta para a direita ao fechar
    } else {
        sidebar.classList.remove('closed');
        sidebar.classList.add('open');
        icon.classList.remove('bi-chevron-right');
        icon.classList.add('bi-chevron-left'); // Muda a seta para a esquerda ao abrir
    }
}

// Adicionar evento de clique ao botão para abrir/fechar a sidebar
toggleMenu.addEventListener('click', toggleSidebar);

// Configurar a largura inicial da sidebar
sidebar.classList.add('open');