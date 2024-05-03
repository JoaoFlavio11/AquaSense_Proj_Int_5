// Função para lidar com o login
async function handleLogin(event) {
    event.preventDefault(); // Evita o envio do formulário
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Realiza o login com Firebase Authentication
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        console.log('Login bem-sucedido:', userCredential);
        // Redireciona para a página principal após o login
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Erro ao fazer login: ' + error.message);
    }
}

// Adiciona o evento de envio ao formulário de login
document.getElementById('login-form').addEventListener('submit', handleLogin);
