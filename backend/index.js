const express = require('express');
const path = require('path');
const admin = require('firebase-admin');

const app = express();

// arquivo JSON credenciais do Firebase Admin SDK
const serviceAccount = require('');// caminho do arquivo firebase admin sdk.json

// Inicialize o Firebase com as credenciais
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://.firebaseio.com' // URL do bd
});

const db = admin.firestore();

// arquivos estáticos diretos da pasta 'frontend'
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// Middleware para parsear o JSON no corpo das requisições
app.use(express.json());

// Rota para pegar os dados do tanque de água
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

// Rota para obter dados do tanque de água filtrados por data
app.get('/dadosFiltrados', async (req, res) => {
    try { 
        const { startDate, endDate } = req.query;
        // Aqui você deve implementar a lógica para buscar dados filtrados por data no seu banco de dados
        // Por exemplo, consulte o banco de dados usando startDate e endDate
        // e retorne os dados filtrados como JSON
        const dadosSnapshot = await db.collection('tanque')
            .where('timestamp', '>=', startDate)
            .where('timestamp', '<=', endDate)
            .get();
        
        const dados = [];

        // Percorra os documentos na coleção e crie uma lista de dados filtrados
        dadosSnapshot.forEach(doc => {
            dados.push({ id: doc.id, ...doc.data() });
        });

        // Envie os dados filtrados como resposta em formato JSON
        res.json(dados);
    } catch (error) {
        // Em caso de erro, retorne um código de status 500 com uma mensagem de erro
        res.status(500).json({ erro: 'Erro ao buscar dados filtrados' });
    }
});

// Rota para gravar dados enviados pelo ESP32
app.post('/gravarDados', async (req, res) => {
    try {
        const { nome, completo, funcionando, temperatura, ph } = req.body;

        // Formatar a data
        const dataAtual = new Date();
        const formatoOriginal = dataAtual.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });

        const formatoPersonalizado = formatoOriginal.replace(', ', ' | ');

        // Referência do documento no Firestore
        const docRef = db.collection('tanque').doc();

        // Inserir um novo documento na coleção "tanque"
        await docRef.set({
            timestamp: formatoPersonalizado,
            nome,
            completo,
            funcionando,
            temperatura,
            ph
        });

        res.status(201).json({ mensagem: 'Dados inseridos com sucesso!' });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao gravar dados' });
    }
});

// Servir o frontend na rota raiz (`/`) 
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'html', 'login.html'));
});

// rota para recuperar senha
app.get('/recuperarSenha', (req, res) => {
    res.sendFile(path.join(frontendPath, 'html', 'recuperarSenha.html')); 
});

// rota para a página principal
app.get('/paginaInicial', (req, res) => {
    res.sendFile(path.join(frontendPath, 'html', 'index.html'));
});

// rota gráficos de temperatura
app.get('/temperatura', (req, res) => {
    res.sendFile(path.join(frontendPath, 'html', 'temperatura.html'));
});

// rota para os gráficos do pH da água
app.get('/ph', (req, res) => {
    res.sendFile(path.join(frontendPath, 'html', 'ph.html'));
});
// criar outras rotas


// Inicie o servidor na porta 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Clique abaixo para acessar o servidor!`);
    console.log(`http://localhost:${PORT}`);
});
