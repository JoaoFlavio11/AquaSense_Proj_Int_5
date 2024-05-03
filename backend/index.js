const express = require('express');
const path = require('path');
const admin = require('firebase-admin');

const app = express();

// Caminho para o arquivo JSON de credenciais do Firebase Admin SDK
const serviceAccount = require('../chave-sdk/monitoramento-de-tanque-347a4-firebase-adminsdk-6fubm-dcc62cd1bb.json');

// Inicialize o Firebase com as credenciais
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://monitoramento-de-tanque.firebaseio.com' // Altere para o URL do seu banco de dados
});

const db = admin.firestore();

// Servir arquivos estáticos a partir da pasta 'frontend'
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// Rota para obter dados do tanque de água
app.get('/dados', async (req, res) => {
    try {
        const dadosSnapshot = await db.collection('tanque').get();
        const dados = [];

        // Percorra os documentos na coleção e crie uma lista de dados
        dadosSnapshot.forEach(doc => {
            dados.push({ id: doc.id, ...doc.data() });
        });

        // Envie os dados como resposta em formato JSON
        res.json(dados);
    } catch (error) {
        // Em caso de erro, retorne um código de status 500 com uma mensagem de erro
        res.status(500).json({ erro: 'Erro ao buscar dados' });
    }
});

// Servir o frontend na rota raiz (`/`)
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'html', 'index.html'));
});

// Rota para gerenciamento de tanques
app.get('/tanques', (req, res) => {
    res.sendFile(path.join(frontendPath, 'html', 'tanques.html'));
});


//teste
async function inserirDados() {
    const docRef = db.collection('tanque').doc();

    // Formatar a data
    const dataAtual = new Date();
    const dataFormatada = dataAtual.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    // Insere um novo documento na coleção "tanque"
    await docRef.set({
        timestamp: dataFormatada,
        nome: "Tanque10",
        nivelAgua: 50,
        temperatura: 30.3,
        funcionando: true,
    });

    console.log('Dados inseridos com sucesso!');
}

// Chame a função para inserir dados
inserirDados();



// Função para atualizar o menu do usuário
function atualizarMenuUsuario() {
    const userInfo = document.getElementById('user-info');

    // Verifica se há um usuário autenticado
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // Usuário autenticado
            const userName = user.displayName || 'Usuário';
            const userPhoto = user.photoURL || 'path/to/default/photo.jpg'; // Caminho da foto padrão

            userInfo.innerHTML = `
                <img src="${userPhoto}" alt="Foto de ${userName}" class="user-photo">
                <span>${userName}</span>
                <button id="logout" class="btn btn-light">Sair</button>
            `;

            // Adiciona evento de clique para o botão de logout
            document.getElementById('logout').addEventListener('click', handleLogout);
        } else {
            // Usuário não autenticado
            userInfo.innerHTML = '';
        }
    });
}

// Função para lidar com o logout
async function handleLogout() {
    try {
        await firebase.auth().signOut();
        console.log('Usuário deslogado');
        // Redireciona para a página de login
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Erro ao deslogar:', error);
    }
}

// Chama a função para atualizar o menu do usuário ao carregar a página
window.onload = atualizarMenuUsuario;





// Inicie o servidor na porta 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});



