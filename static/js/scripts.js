
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
