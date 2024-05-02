import firebase from 'firebase/app';
import 'firebase/auth';
import db from '../firebase/monitoramento-de-tanque-347a4-firebase-adminsdk-6fubm-dcc62cd1bb.json'; // Importe o arquivo firebase.js que contém a configuração do Firebase

// Inicialize o Firebase
firebase.initializeApp({
    // Adicione as configurações do seu projeto Firebase aqui
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://monitoramento-de-tanque.firebaseio.com'
});

const auth = firebase.auth();

// Função para lidar com o login
async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value;

    try {
        await auth.signInWithEmailAndPassword(email, senha);
        document.getElementById('message').textContent = 'Login realizado com sucesso!';
        // Redirecionar para a página principal ou outra página após o login bem-sucedido
    } catch (error) {
        document.getElementById('message').textContent = 'Erro ao fazer login: ' + error.message;
    }
}

// Função para lidar com o registro
async function handleRegister() {
    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value;

    try {
        await auth.createUserWithEmailAndPassword(email, senha);
        document.getElementById('message').textContent = 'Registro realizado com sucesso!';
        // Redirecionar para a página principal ou outra página após o registro bem-sucedido
    } catch (error) {
        document.getElementById('message').textContent = 'Erro ao registrar-se: ' + error.message;
    }
}

// Adicionar ouvintes de evento para os botões de login e registro
document.getElementById('login-form').addEventListener('submit', handleLogin);
document.getElementById('register-btn').addEventListener('click', handleRegister);
