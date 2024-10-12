
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


document.addEventListener("DOMContentLoaded", function() {
    // Redirecionar ao clicar no botão "Cadastrar Cliente"
    document.getElementById("btn-cadast").addEventListener("click", function() {
        window.location.href = '/cadastro_cliente';
    });

    // Redirecionar ao clicar no botão "Buscar Cliente"
    document.getElementById("btn-busca").addEventListener("click", function() {
        window.location.href = '/buscar_cliente';
    });

    // Redirecionar ao clicar no botão "Gerenciar Usuários"
    document.getElementById("btn-geruser").addEventListener("click", function() {
        window.location.href = '/cadastro_usuario';
    });
});








//funcoes janela cadastro.html

function formatarCpf(event) {
    const input = event.target;
    let value = input.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (value.length > 11) value = value.slice(0, 11); // Limita a 11 dígitos
    const formattedCpf = value.replace(/(\d{3})(\d)/, '$1.$2') // Adiciona o primeiro ponto
                                .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona o segundo ponto
                                .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Adiciona o hífen
    input.value = formattedCpf; // Atualiza o valor do input
}

// Função para mostrar a sobreposição de erro
function mostrarOverlay(mensagem) {
    const overlay = document.getElementById('overlay');
    const mensagemDiv = document.createElement('div');
    mensagemDiv.style.backgroundColor = 'white';
    mensagemDiv.style.padding = '20px';
    mensagemDiv.style.borderRadius = '10px';
    mensagemDiv.style.textAlign = 'center';
    mensagemDiv.innerText = mensagem;

    const botaoFechar = document.createElement('button');
    botaoFechar.innerText = 'Fechar';
    botaoFechar.onclick = function () {
        overlay.style.display = 'none';
        overlay.innerHTML = '';  // Limpa o conteúdo para reutilização
    };

    mensagemDiv.appendChild(botaoFechar);
    overlay.appendChild(mensagemDiv);
    overlay.style.display = 'flex'; // Exibe o overlay
}

// Função para capturar imagem
function capturarImagem(inputId) {
    const inputFile = document.getElementById(inputId);
    const constraints = { video: true };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
            const video = document.createElement('video');
            video.srcObject = stream;
            video.autoplay = true;

            const overlay = document.createElement('div');
            overlay.classList.add('overlay');
            overlay.appendChild(video);

            const captureButton = document.createElement('button');
            captureButton.innerText = 'Capturar';
            captureButton.onclick = function () {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0);

                const imageData = canvas.toDataURL('image/png');
                const blob = dataURLtoBlob(imageData);

                const fileName = 'captured-image.png';
                const newFile = new File([blob], fileName, { type: 'image/png' });

                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(newFile);
                inputFile.files = dataTransfer.files;

                inputFile.nextElementSibling.textContent = fileName;

                stopStream(stream, overlay);
            };

            const cancelButton = document.createElement('button');
            cancelButton.innerText = 'Cancelar';
            cancelButton.onclick = function () {
                stopStream(stream, overlay);
            };

            overlay.appendChild(captureButton);
            overlay.appendChild(cancelButton);
            document.body.appendChild(overlay);
        })
        .catch(function (error) {
            console.error("Erro ao acessar a câmera:", error);
        });
}

function stopStream(stream, overlay) {
    stream.getTracks().forEach(track => track.stop());
    document.body.removeChild(overlay);
}

// Função para converter base64 para Blob
function dataURLtoBlob(dataURL) {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

// Funções para CPF inválido e duplicado
function cpfInvalido() {
    mostrarOverlay('CPF inválido. Verifique os dados.');
}

function cpfDuplicado() {
    mostrarOverlay('CPF duplicado. Já existe um cliente com esse CPF.');
}



// funcao janela cadastro.html

function updateFileName(input) {
    const label = input.nextElementSibling; // Obtém o rótulo ao lado do input
    if (input.files.length > 0) {
        label.textContent = input.files[0].name; // Atualiza o texto do rótulo com o nome do arquivo
    } else {
        label.textContent = 'Selecionar arquivo'; // Se nenhum arquivo for selecionado
    }
}

