// Função para buscar dados do backend
async function buscarDados() {
    try {
        // Envia uma solicitação para a rota '/dados' do backend
        const response = await fetch('http://localhost:3000/dados');
        // Converte a resposta para JSON
        const dados = await response.json();

        // Obtenha o elemento container para exibir as tabelas
        const container = document.getElementById('tabelas-tanques');
        container.innerHTML = ''; // Limpa o conteúdo anterior

        // Criar um objeto para agrupar os dados por nome de tanque
        const tanques = {};

        // Agrupar os dados por nome de tanque
        dados.forEach(dado => {
            if (!tanques[dado.nome]) {
                tanques[dado.nome] = [];
            }
            tanques[dado.nome].push(dado);
        });

        // Exibir os dados para cada tanque em uma tabela separada
        Object.keys(tanques).forEach(nomeTanque => {
            const tabela = document.createElement('table');
            tabela.className = 'table';

            // Criar cabeçalho da tabela
            const thead = document.createElement('thead');
            const linhaCabecalho = document.createElement('tr');
            linhaCabecalho.innerHTML = `
                <th>Data</th>
                <th>Nível de água</th>
                <th>Temperatura</th>
                <th>ID do registro</th>
            `;
            thead.appendChild(linhaCabecalho);
            tabela.appendChild(thead);

            // Criar corpo da tabela
            const tbody = document.createElement('tbody');

            tanques[nomeTanque].forEach(dado => {
                const linha = document.createElement('tr');

                // Cria as colunas da linha
                const colunaData = document.createElement('td');
                colunaData.textContent = dado.timestamp;

                const colunaNivelAgua = document.createElement('td');
                colunaNivelAgua.textContent = dado.nivelAgua;

                const colunaTemperatura = document.createElement('td');
                colunaTemperatura.textContent = dado.temperatura;

                const colunaId = document.createElement('td');
                colunaId.textContent = dado.id;

                // Adiciona as colunas à linha
                linha.appendChild(colunaData);
                linha.appendChild(colunaNivelAgua);
                linha.appendChild(colunaTemperatura);
                linha.appendChild(colunaId);

                // Adiciona a linha ao tbody
                tbody.appendChild(linha);
            });

            tabela.appendChild(tbody);

            // Criar um título para o tanque
            const tituloTanque = document.createElement('h3');
            tituloTanque.textContent = nomeTanque;

            // Adicionar o título e a tabela ao container
            container.appendChild(tituloTanque);
            container.appendChild(tabela);
        });
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
}

// Chama a função para buscar dados ao carregar a página
window.onload = buscarDados;
