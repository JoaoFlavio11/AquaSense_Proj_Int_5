if(localStorage.getItem("token") == null){
    alert("Para acessar o conteúdo do sistema é necessário fazer login!");
    window.location.href = ".frontend/assets/html/signin.html";
}

let userLogado = JSON.parse(localStorage.getItem("user"));

let logado = document.querySelector("#logado");
logado.innerHTML = ` Bem vindo, ${userLogado.nome}!`;

function sair(){
    localStorage.removeItem("token");
    localStorage.removeItem("userLogado");
    window.location.href = ".frontend/assets/html/signin.html";
}