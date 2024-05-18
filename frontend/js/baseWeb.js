//botoes
document.getElementById('login-btn').onclick = function() {
    if (!this.disabled) {
        window.location.href = 'http://localhost:3000/paginaInicial';
    }
};

document.getElementById('register-btn').onclick = function(){
    if(!this.disabled) {
        window.location.href = 'http://localhost:3000/registro';
    }
}

document.getElementById('recover-password-btn').onclick = function() {
    if (!this.disabled) {
        window.location.href = 'http://localhost:3000/recuperarSenha';
    }
};

// função para validar email
function validateEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
}
