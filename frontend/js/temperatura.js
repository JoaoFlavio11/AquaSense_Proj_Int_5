// Função para buscar dados do backend
async function buscarDados() {
    try {
        // Envia uma solicitação para a rota '/dados' do backend
        const response = await fetch('http://localhost:3000/dados');
        // Converte a resposta para JSON
        const dados = await response.json();

        // Agrupar tanques por funcionamento
        const tanquesFuncionando = dados.filter(dado => dado.funcionando).length;
        const tanquesNaoFuncionando = dados.filter(dado => !dado.funcionando).length;

        // Configurar dados para o gráfico
        const data = {
            labels: ['Funcionando', 'Não Funcionando'],
            datasets: [{
                label: 'Estado dos Tanques',
                data: [tanquesFuncionando, tanquesNaoFuncionando],
                backgroundColor: ['blue', 'red'],
            }],
        };

        // Configurações do gráfico
        const config = {
            type: 'doughnut', // Pode ser 'pie' ou qualquer outro tipo de gráfico compatível com Chart.js
            data: data,
            options: {
                responsive: true,
            },
        };

        // Renderizar o gráfico
        const ctx = document.getElementById('tanquesChart').getContext('2d');
        new Chart(ctx, config);

    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
}

// Chama a função para buscar dados e renderizar o gráfico ao carregar a página
window.onload = buscarDados;

// Função para criar um gráfico com a temperatura dos tanques
async function criarGraficosPorTanque() {
    try {
        // Envia uma solicitação para a rota '/dados' do backend
        const response = await fetch('http://localhost:3000/dados');
        // Converte a resposta para JSON
        const dados = await response.json();

        // Criar um objeto para agrupar os dados por nome de tanque
        const tanques = {};

        // Agrupar os dados por nome de tanque
        dados.forEach(dado => {
            if (!tanques[dado.nome]) {
                tanques[dado.nome] = [];
            }
            tanques[dado.nome].push(dado);
        });

        // Para cada tanque, criar um gráfico
        Object.keys(tanques).forEach(nomeTanque => {
            const dadosTanque = tanques[nomeTanque];

            // Configurar dados para o gráfico
            const data = {
                labels: dadosTanque.map(dado => dado.timestamp), // Usar o timestamp como rótulo
                datasets: [{
                    data: dadosTanque.map(dado => dado.temperatura), // Usar a temperatura como dados
                    backgroundColor: 'blue', // Cor laranja para o gráfico
                }],
            };

            // Configurações do gráfico
            const config = {
                type: 'line', // Tipo de gráfico: linha
                data: data,
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: `Temperatura do ${nomeTanque}`,
                            font: {
                                size: 18, // Tamanho da fonte
                                color: '#000', // Cor do texto (preto)
                            },
                        },
                        legend: {
                            display: false,
                        }
                    },
                },
            };

            // Renderizar o gráfico em uma div específica para cada tanque
            const divTanque = document.createElement('div');
            divTanque.className = 'tanque-chart';
            const canvas = document.createElement('canvas');
            canvas.className = 'chart';
            canvas.id = `temperaturaChart${nomeTanque}`; // Adicionar um id único para cada gráfico
            divTanque.appendChild(canvas);
            document.getElementById('graficos-tanques').appendChild(divTanque);

            // Renderizar o gráfico
            const ctx = canvas.getContext('2d');
            new Chart(ctx, config);
        });

    } catch (error) {
        console.error('Erro ao buscar dados para os gráficos de temperatura:', error);
    }
}

// Chama a função para criar os gráficos de temperatura ao carregar a página
window.onload = function() {
    // Chama a função para criar os gráficos por tanque
    criarGraficosPorTanque();
};

