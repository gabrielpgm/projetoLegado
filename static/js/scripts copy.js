function toggleOverlay(mensagem = null) {
    const overlay = document.getElementById('overlay');
    const isHidden = overlay.style.display === 'none' || overlay.style.display === '';

    if (isHidden && mensagem) {
        const mensagemDiv = overlay.querySelector('.mensagem');
        mensagemDiv.innerText = mensagem; // Define a mensagem
        overlay.style.display = 'flex'; // Mostra o overlay
    } else {
        overlay.style.display = 'none'; // Esconde o overlay
    }
}

function usuarioDesativado() {
    toggleOverlay("O usuário está desativado. Favor contactar o Administrador!");
}

function usuarioInvalido() {
    toggleOverlay("Usuário ou senha inválidos!");
}

// funções janela dashboard

function abrirPopup() {
    document.getElementById('overlay').style.display = 'flex'; // Mostra o overlay
}

function fecharPopup() {
    document.getElementById('overlay').style.display = 'none'; // Esconde o overlay
}



// Redirecionar ao clicar no botão "Cadastrar Cliente"
document.getElementById("btndash-cadast").addEventListener("click", function () {
    window.location.href = '/cadastro_cliente';
});

// Redirecionar ao clicar no botão "Buscar Cliente"
document.getElementById("btndash-busca").addEventListener("click", function () {
    window.location.href = '/buscar_cliente';
});

// Redirecionar ao clicar no botão "Gerenciar Usuários"
document.getElementById("btndash-geruser").addEventListener("click", function () {
    window.location.href = '/cadastro_usuario';
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

// Função para exibir documentos em um overlay janela detalhe cliente

function mostrarDocOverlay(url) {
    document.getElementById('doc-frame').src = url;
    document.getElementById('overlay').style.display = 'block';
}

function fecharOverlay() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('doc-frame').src = '';
}

function mostrarComentario(comentario) {
    alert(comentario || 'Sem comentários');
}



function capturarImagem(inputId) {
    console.log("Função capturarImagem chamada com id: " + inputId);
    const inputFile = document.getElementById(inputId);
    
    const constraints = { video: true };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
            console.log("Acesso à câmera concedido.");

            // Criar o elemento de vídeo
            const video = document.createElement('video');
            video.srcObject = stream;
            video.autoplay = true;
            video.playsinline = true;  // Compatibilidade com dispositivos móveis
            video.style.width = "100%";
            video.style.height = "auto";

            console.log("Elemento de vídeo criado.");

            // Criar o overlay específico para a câmera
            const overlay = document.createElement('div');
            overlay.classList.add('camera-overlay');

            console.log("Overlay criado.");

            // Criar o container do vídeo
            const videoContainer = document.createElement('div');
            videoContainer.classList.add('video-container');
            videoContainer.appendChild(video);

            console.log("Video adicionado ao container.");

            // Criar o botão Capturar
            const captureButton = document.createElement('button');
            captureButton.innerText = 'Capturar';
            captureButton.classList.add('capture-button');
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

                stopStream(stream, overlay);
            };

            // Criar o botão Cancelar (X)
            const cancelButton = document.createElement('button');
            cancelButton.classList.add('cancel-button');
            cancelButton.innerHTML = '<i class="fas fa-times"></i>';
            cancelButton.onclick = function () {
                stopStream(stream, overlay);
            };

            // Adicionar os botões e o vídeo ao container
            videoContainer.appendChild(captureButton);
            overlay.appendChild(videoContainer);
            overlay.appendChild(cancelButton);

            // Adicionar o overlay ao corpo do documento
            document.body.appendChild(overlay);
            console.log("Overlay adicionado ao body.");

            // Tornar o overlay visível
            overlay.style.display = 'flex';
        })
        .catch(function (error) {
            console.error("Erro ao acessar a câmera:", error);
        });
}





// Função para parar o stream e remover o overlay
function stopStream(stream, overlay) {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    if (overlay) {
        overlay.remove(); // Remove o overlay do DOM
    }
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
    toggleOverlay('CPF inválido. Verifique os dados.');
}

function cpfDuplicado() {
    toggleOverlay('CPF duplicado. Já existe um cliente com esse CPF.');
}



// funcao janela cadastro.html

function atualizarNomeArquivo(inputId) {
    var input = document.getElementById(inputId);
    var span = document.getElementById('nome-arquivo-' + inputId);

    if (input.files && input.files.length > 0) {
        // Pega o nome do primeiro arquivo selecionado
        var nomeArquivo = input.files[0].name;
        span.textContent = "Arquivo: " + nomeArquivo;
    } else {
        span.textContent = "Arquivo: Nenhum arquivo enviado";
    }
}

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

    // Redirecionar para a URL da página sem filtros
    window.location.href = window.location.pathname; // Isso mantém apenas o caminho da URL atual
}


// funções janela cadastro usuario.

function cadastrarUsuario(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Coleta os dados do formulário
    const form = event.target;
    const nome = form.nome.value;
    const username = form.username.value;
    const senha = form.senha.value;
    const tipo_acesso = form.tipo_acesso.value;

    // Envia os dados para o backend
    fetch('/cadastro_usuario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'nome': nome,
            'username': username,
            'senha': senha,
            'tipo_acesso': tipo_acesso
        })
    })
    .then(response => response.text())
    .then(data => {
        // Atualiza a página com a resposta do servidor
        document.body.innerHTML = data; // Substitui o conteúdo da página pela resposta
    })
    .catch(error => console.error('Erro:', error));
}


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
    toggleOverlay("O usuário informado já está cadastrado. Por favor, utilize um usuário diferente.");
}

function usuarioCadastradoSucesso() {
    toggleOverlay("Usuário cadastrado com sucesso!")
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
document.addEventListener('DOMContentLoaded', function () {
    displayRows(currentPage);
});



// função teste toogle
document.addEventListener("DOMContentLoaded", function () {
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

    // Envia uma requisição AJAX para atualizar o status no backend
    fetch(`/toggle_usuario/${username}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Adicione mais cabeçalhos aqui, se necessário
        },
        body: JSON.stringify({}) // Se precisar enviar dados adicionais, coloque aqui
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao atualizar o status do usuário');
        }
        return response.json(); // Se você retornar algo do backend, processe aqui
    })
    .then(data => {
        console.log('Status do usuário atualizado com sucesso:', data);
    })
    .catch(error => {
        console.error('Erro:', error);
    });
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