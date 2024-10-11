/* funções janela login.
function mostrarOverlay(mensagem) {
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');

    const mensagemDiv = document.createElement('div');
    mensagemDiv.classList.add('mensagem');

    mensagemDiv.innerText = mensagem;

    const botaoFechar = document.createElement('button');
    botaoFechar.innerText = 'Fechar';
    botaoFechar.onclick = function () {
        document.body.removeChild(overlay);
    };

    mensagemDiv.appendChild(botaoFechar);
    overlay.appendChild(mensagemDiv);
    document.body.appendChild(overlay);
}*/
function mostrarOverlay(mensagem) {
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'flex'; // Mostra o overlay
    const mensagemDiv = overlay.querySelector('.mensagem');
    mensagemDiv.innerText = mensagem; // Define a mensagem
}

function fecharPopup() {
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'none'; // Esconde o overlay
}


function usuarioDesativado() {
    mostrarOverlay("O usuário está desativado. Favor contactar o Administrador!");
}

function usuarioInvalido() {
    mostrarOverlay("Usuário ou senha inválidos!");
}

// funções janela dashboard

function abrirPopup() {
    document.getElementById('overlay').style.display = 'flex'; // Mostra o overlay
}

function fecharPopup() {
    document.getElementById('overlay').style.display = 'none'; // Esconde o overlay
}
