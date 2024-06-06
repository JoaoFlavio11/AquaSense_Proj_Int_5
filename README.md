# Projeto Integrador AquaSense

Neste projeto, desenvolvemos um sistema de monitoramento de tanques de água utilizando um chip ESP32, sensores de PH, temperatura e nível de água. O sistema inclui um banco de dados no Firestore e é executado em um servidor Node.js, que contém o frontend do site.

## Estrutura do Projeto
**1.** Os sensores são colocados no tanque de água.
**2.** O ESP32 grava os dados coletados e envia para o servidor.
**3.** A API envia os dados ao firestore, através de uma rota POST.
**4.** O frontend, exibe ao usuário os dados buscados e tratados pela API.

## Funcionalidades
- Monitorar o PH, a temperatura e o nível de água dos tanques.
- Interface web para visualização dos dados.
- Armazenamento de dados no Firestore.
- Autenticação e login de usuários.

## Tecnologias Utilizadas
- **ESP32**: Microcontrolador utilizado para capturar os dados dos sensores.
- **Sensores**: PH, temperatura e nível de água.
- **Firebase Firestore**: Banco de dados NoSQL para armazenar os dados coletados.
- **Node.js**: Plataforma de desenvolvimento para o servidor backend.
- **HTML/CSS/JS**: Tecnologias de frontend para construção da interface web.

## Configuração e Execução

### Pré-requisitos
- Node.js instalado
- Conta no Firebase configurada com Firestore

### Passos para execução
1. Clone o repositório:
   ```
   git clone https://github.com/seu-usuario/seu-repositorio.git
   ```

2. Navegue até o diretório `backend` e instale as dependências:
   ```
   cd backend
   npm install
   ```

3. Configure o Firebase com suas credenciais em `backend/firebase/monitoramento/index.js` e `frontend/firebase/firebaseConfig.js`.

4. Inicie o servidor Node.js:
   ```sh
   node index.js
   ```

5. Abra o arquivo `frontend/html/index.html` no seu navegador para acessar a interface web.

## Estrutura dos Arquivos

### Backend

- `backend/firebase/monitoramento/index.js`: Lógica para interação com o Firestore.
- `backend/node_modules`: Dependências do Node.js.
- `backend/package.json`: Arquivo de configuração do Node.js.

### Database

- `database/appconfig.json`: Configurações da aplicação.
- `database/tanque.json`: Dados simulados do tanque.

### Frontend

- `frontend/assets`: Arquivos estáticos como imagens e ícones.
- `frontend/css`: Arquivos de estilo.
- `frontend/firebase`: Configuração e scripts do Firebase.
- `frontend/html`: Páginas HTML.
- `frontend/js`: Scripts JavaScript.

## Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir um problema ou enviar uma solicitação de pull request.


## Contato

Seu Nome - [@seuusuario](https://twitter.com/seuusuario) - seuemail@example.com


Sinta-se à vontade para ajustar o conteúdo conforme necessário para melhor se adequar ao seu projeto específico.
