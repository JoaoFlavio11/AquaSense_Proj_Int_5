// Função para buscar dados do backend
async function buscarDados() {
    try {
        // Envia uma solicitação para a rota '/dados' do backend
        const response = await fetch('http://localhost:3000/dados');
        
        const dados = await response.json(); // passa para JSON

        // Obtenha o elemento container para exibir as tabelas
        const container = form.container();
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

        // Exibição dos dados em diferentes tabelas
        Object.keys(tanques).forEach(nomeTanque => {
            const divTanque = form.divTanque(); // Div para cada tabela de tanque
            divTanque.className = 'tanque';

            const tituloTanque = form.tituloTanque(); // Criar título para o tanque
            tituloTanque.textContent = nomeTanque;
            divTanque.appendChild(tituloTanque);

            const tabela = form.tabela(); // Cria a tabela para o tanque
            tabela.className = 'table';

            const thead = form.thead(); // Cabeçalho da tabela
            const linhaCabecalho = form.linha(); // Linha do cabeçalho
            linhaCabecalho.innerHTML = `
                <th>Data</th>
                <th>Completo</th>
                <th>Funcionando</th>
                <th>Temperatura</th>
                <th>pH</th>
            `;
            thead.appendChild(linhaCabecalho);
            tabela.appendChild(thead);

            const tbody = form.tbody(); // Corpo da tabela

            tanques[nomeTanque].forEach(dado => {
                const linha = form.linha(); // Cria a linha da tabela

                // Cria as colunas da linha
                const colunaData = form.colunaData();
                const colunaCompleto = form.colunaCompleto();
                const colunaFuncionando = form.colunaFuncionando();
                const colunaTemperatura = form.colunaTemperatura();
                const colunaPh = form.colunaPh();

                // Adiciona dados às colunas
                colunaData.textContent = dado.timestamp;
                colunaCompleto.textContent = dado.completo;
                colunaFuncionando.textContent = dado.funcionando;
                colunaTemperatura.textContent = dado.temperatura;
                colunaPh.textContent = dado.ph;

                // Adiciona as colunas à linha
                linha.appendChild(colunaData);
                linha.appendChild(colunaCompleto);
                linha.appendChild(colunaFuncionando);
                linha.appendChild(colunaTemperatura);
                linha.appendChild(colunaPh);

                // Adiciona a linha ao tbody
                tbody.appendChild(linha);
            });

            tabela.appendChild(tbody); // Adiciona o tbody à tabela
            divTanque.appendChild(tabela); // Adiciona a tabela à div

            container.appendChild(divTanque); // Adiciona a div ao container
        });
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
}

// Chama a função para buscar dados ao carregar a página
buscarDados();

const form = {
    container: () => document.getElementById('tabelas-tanques'),

    divTanque: () => document.createElement('div'),
    tituloTanque: () => document.createElement('h2'),
    tabela: () => document.createElement('table'),
    thead: () => document.createElement('thead'),
    tbody: () => document.createElement('tbody'),
    linha: () => document.createElement('tr'),
    coluna: () => document.createElement('td'),

    colunaData: () => document.createElement('td'),
    colunaCompleto: () => document.createElement('td'),
    colunaFuncionando: () => document.createElement('td'),
    colunaTemperatura: () => document.createElement('td'),
    colunaPh: () => document.createElement('td'),
};
