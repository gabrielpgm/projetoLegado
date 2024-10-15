
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

// Função para exibir documentos em um overlay
function mostrarDocOverlay(url) {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '1000';

    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.style.width = '80%';
    iframe.style.height = '80%';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '10px';

    const botaoFechar = document.createElement('button');
    botaoFechar.innerText = 'Fechar';
    botaoFechar.style.position = 'absolute';
    botaoFechar.style.top = '20px';
    botaoFechar.style.right = '20px';
    botaoFechar.onclick = function () {
        document.body.removeChild(overlay);
    };

    overlay.appendChild(iframe);
    overlay.appendChild(botaoFechar);
    document.body.appendChild(overlay);
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

// funcao janela busca.html

function formatarCpf(event) {
    const input = event.target;
    let value = input.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (value.length > 11) value = value.slice(0, 11); // Limita a 11 dígitos
    const formattedCpf = value.replace(/(\d{3})(\d)/, '$1.$2') // Adiciona o primeiro ponto
                               .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona o segundo ponto
                               .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Adiciona o hífen
    input.value = formattedCpf; // Atualiza o valor do input
}

function limparCampos() {
    // Limpar os campos de busca
    document.querySelector('input[name="nome"]').value = '';
    document.querySelector('input[name="cpf"]').value = '';
    
    // Submeter o formulário sem filtros para restaurar o estado original
    document.querySelector('form').submit();
}

// funções janela cadastro usuario.
function mostrarOverlayCadastroUsuario(mensagem) {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '1000';

    const mensagemDiv = document.createElement('div');
    mensagemDiv.style.backgroundColor = 'white';
    mensagemDiv.style.padding = '20px';
    mensagemDiv.style.borderRadius = '10px';
    mensagemDiv.style.textAlign = 'center';
    mensagemDiv.innerText = mensagem;

    const botaoFechar = document.createElement('button');
    botaoFechar.innerText = 'Fechar';
    botaoFechar.onclick = function () {
        document.body.removeChild(overlay);
    };

    mensagemDiv.appendChild(botaoFechar);
    overlay.appendChild(mensagemDiv);
    document.body.appendChild(overlay);
}

function usuarioDuplicado() {
    mostrarOverlayCadastroUsuario("O usuário informado já está cadastrado. Por favor, utilize um usuário diferente.");
}

function usuarioCadastradoSucesso(){
    mostrarOverlayCadastroUsuario("Usuário cadastrado com sucesso!")
}


// função pagina de gerenciar usuário.
function toggleUsuario(username, button) {
    // Altere o estado do usuário (ativado/desativado)
    const isActive = button.classList.contains('active');

    // Aqui você pode fazer uma requisição AJAX para o seu backend se necessário
    fetch(`/toggle_usuario/${username}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: !isActive }) // Envia o novo estado
    })
    .then(response => {
        if (response.ok) {
            // Atualiza a interface do usuário
            button.classList.toggle('active', !isActive);
            button.classList.toggle('inactive', isActive);
            button.textContent = isActive ? 'Ativar' : 'Desativar';
        } else {
            // Lida com erros
            console.error('Erro ao atualizar o status do usuário');
        }
    })
    .catch(error => {
        console.error('Erro ao fazer a requisição:', error);
    });
}

// Quantidade de usuários por página
const rowsPerPage = 5; 
let currentPage = 1;
const rows = document.querySelectorAll('.custom-row-user');
const totalPages = Math.ceil(rows.length / rowsPerPage);

// Função para atualizar a exibição dos usuários
function displayRows(page) {
    const start = (page - 1) * rowsPerPage;
    const end = page * rowsPerPage;

    rows.forEach((row, index) => {
        if (index >= start && index < end) {
            row.style.display = 'block'; // Exibe a linha
        } else {
            row.style.display = 'none'; // Oculta a linha
        }
    });

    // Atualiza os controles de navegação
    document.getElementById('page-info').innerText = `Página ${page}`;
    document.getElementById('prev-btn').disabled = page === 1;
    document.getElementById('next-btn').disabled = page === totalPages;
}

// Função para ir para a próxima página
function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        displayRows(currentPage);
    }
}

// Função para ir para a página anterior
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayRows(currentPage);
    }
}

// Inicializa a exibição com a primeira página
document.addEventListener('DOMContentLoaded', function() {
    displayRows(currentPage);
});



// função teste toogle
document.addEventListener("DOMContentLoaded", function() {
    // Ao carregar a página, aplique a classe correta (ativo/inativo) com base no atributo data-status
    const userRows = document.querySelectorAll('.custom-row-user');
    
    userRows.forEach(row => {
        const status = row.getAttribute('data-status');
        if (status === 'active') {
            row.classList.add('user-active');
        } else {
            row.classList.add('user-inactive');
        }
    });
});

function toggleUserStatus(username) {
    // Seleciona a linha do usuário e os ícones correspondentes
    const userRow = document.getElementById(`user-${username}`);
    const thumbUpIcon = document.getElementById(`thumb-up-${username}`);
    const thumbDownIcon = document.getElementById(`thumb-down-${username}`);

    // Verifica se o usuário está ativo ou inativo
    const isActive = userRow.classList.contains('user-active');

    // Alterna a classe CSS da linha do usuário e a exibição dos ícones
    if (isActive) {
        userRow.classList.remove('user-active');
        userRow.classList.add('user-inactive');
        thumbUpIcon.style.display = 'none'; // Esconde o ícone de thumbs-up
        thumbDownIcon.style.display = 'inline'; // Mostra o ícone de thumbs-down
        userRow.setAttribute('data-status', 'inactive'); // Atualiza o atributo de status
    } else {
        userRow.classList.remove('user-inactive');
        userRow.classList.add('user-active');
        thumbUpIcon.style.display = 'inline'; // Mostra o ícone de thumbs-up
        thumbDownIcon.style.display = 'none'; // Esconde o ícone de thumbs-down
        userRow.setAttribute('data-status', 'active'); // Atualiza o atributo de status
    }

    // Aqui você pode também enviar uma requisição Ajax ou similar
    // para atualizar o status no backend, se necessário.
}

function resetPassword(username) {
    // Seleciona os ícones de lock e unlock
    const lockIcon = document.getElementById(`lock-${username}`);
    const unlockIcon = document.getElementById(`unlock-${username}`);

    // Faz uma requisição AJAX para redefinir a senha no backend
    fetch(`/resetar_senha/${username}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (response.ok) {
            // Alterna os ícones: esconde o lock, mostra o unlock
            lockIcon.style.display = 'none';
            unlockIcon.style.display = 'inline';
        } else {
            console.error('Falha ao redefinir a senha.');
        }
    })
    .catch(error => console.error('Erro na requisição:', error));
}




