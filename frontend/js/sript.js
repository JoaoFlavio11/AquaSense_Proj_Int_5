// Função para buscar dados do backend
async function buscarDados() {
    try {
        const response = await fetch('http://localhost:3000/dados');
        const dados = await response.json();

        // Elemento para exibir os dados do tanque
        const dadosTanque = document.getElementById('dados-tanque');
        dadosTanque.textContent = '';

        // Exibir os dados do tanque
        dados.forEach(dado => {
            const item = document.createElement('div');
            item.textContent = `ID: ${dado.id} - Nível de água: ${dado.nivelAgua}`;
            dadosTanque.appendChild(item);
        });
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
}

// Chame a função para buscar dados ao carregar a página
window.onload = buscarDados;
