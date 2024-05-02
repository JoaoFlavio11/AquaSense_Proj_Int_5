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
                backgroundColor: ['green', 'red'],
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
