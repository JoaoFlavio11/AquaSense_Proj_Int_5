// Função para lidar com o cadastro
async function handleRegister(event) {
    event.preventDefault(); // Evita o envio do formulário
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Realiza o cadastro com Firebase Authentication
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        console.log('Cadastro bem-sucedido:', userCredential);
        // Redireciona para a página de login após o cadastro
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Erro ao se cadastrar:', error);
        alert('Erro ao se cadastrar: ' + error.message);
    }
}

// Adiciona o evento de envio ao formulário de cadastro
document.getElementById('register-form').addEventListener('submit', handleRegister);
