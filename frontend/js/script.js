const sideMenu = document.querySelector('aside');
const menuBtn = document.querySelector('#menu_bar');
const closeBtn = document.querySelector('#end');

const themeToggler = document.querySelector('.cor-tema');

// Adiciona um evento de clique para abrir o menu lateral
menuBtn.addEventListener('click', () => {
    sideMenu.style.display = "block";
});

// Altera o evento de clique para fechar o menu lateral
closeBtn.addEventListener('click', () => {
    sideMenu.style.display = "none"; // Altera para ocultar o menu lateral
});

themeToggler.addEventListener('click',()=>{
    document.body.classList.toggle('dark-theme-variables')

    themeToggler.querySelector('span:nth-child(1)').classList.toggle('active')
    themeToggler.querySelector('span:nth-child(2)').classList.toggle('active')
})