from flask import Flask, render_template, request, redirect, url_for, flash, send_from_directory, session
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo import MongoClient
import config
import webbrowser  # Importa a biblioteca webbrowser
from threading import Timer  # Importa threading para rodar o servidor e abrir o navegador
from bson.objectid import ObjectId  # Importa ObjectId para manipular IDs do MongoDB
import os
from werkzeug.utils import secure_filename


app = Flask(__name__)
app.secret_key = config.SECRET_KEY
app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'static/uploads')


# Conexão com o MongoDB
client = MongoClient(config.MONGO_URL)
db = client['safedocsbd']  # Substitua pelo nome do seu banco de dados
collection = db['clientes'] #collecton dentro do banco

# Função para validar CPF
def validar_cpf(cpf):
    # Remove caracteres que não são dígitos
    cpf = ''.join([char for char in cpf if char.isdigit()])
    
    # Verifica se o CPF tem 11 dígitos
    if len(cpf) != 11:
        return False

    # Verifica se todos os dígitos são iguais (CPFs assim são inválidos)
    if cpf == cpf[0] * len(cpf):
        return False

    # Validação do primeiro dígito verificador
    soma = sum(int(cpf[i]) * (10 - i) for i in range(9))
    primeiro_digito = (soma * 10 % 11) % 10
    if int(cpf[9]) != primeiro_digito:
        return False

    # Validação do segundo dígito verificador
    soma = sum(int(cpf[i]) * (11 - i) for i in range(10))
    segundo_digito = (soma * 10 % 11) % 10
    if int(cpf[10]) != segundo_digito:
        return False

    return True

@app.route('/')
def home():
    return render_template('login.html')

    
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['senha']  # Corrigido para 'senha'

        # Verificar se o usuário existe
        user = db.users.find_one({'username': username})
        # Verificar se o usuário foi encontrado e se a senha está correta
        if user and check_password_hash(user['password'], password):
            # Verificar se o usuário está ativo
            if user['status_usuario']:
                session['username'] = user['username']
                session['nome'] = user['nome']
                return redirect(url_for('dashboard'))  # Redireciona para o dashboard
            else:
                # Usuário desativado
                return render_template('login.html', usuario_desativado=True)

        # Se o usuário não existe ou a senha está incorreta
        return render_template('login.html', usuario_invalido=True)

    return render_template('login.html')


@app.route('/dashboard')
def dashboard():
    if 'username' in session:
        # Obter os detalhes do usuário logado
        user = db.users.find_one({'username': session['username']})
        session['tipo_acesso'] = user['tipo_acesso']  # Adiciona o tipo de acesso à sessão
        return render_template('dashboard.html', tipo_acesso=session['tipo_acesso'])
    else:
        return redirect(url_for('home'))

  
def salvar_arquivo(arquivo, nome_arquivo):
    if arquivo:
        caminho = f'static/uploads/{nome_arquivo}'
        arquivo.save(caminho)
        return caminho
    return None

@app.route('/cadastro_cliente', methods=['GET', 'POST'])
def cadastro_cliente():
    if request.method == 'POST':
        # Formatação do nome para que as primeiras letras sejam maiúsculas e o restante minúsculo
        nome = request.form['nome'].title()
        cpf = request.form['cpf']
        
        # Validação do CPF
        if not validar_cpf(cpf):
            return render_template('cadastro.html', cpf_invalido=True, cliente=None)
        
        # Verificar se o CPF já está cadastrado
        cliente_existente = db.clientes.find_one({'cpf': cpf})
        if cliente_existente:
            # Renderizar a página de cadastro com a mensagem de CPF duplicado
            return render_template('cadastro.html', cpf_duplicado=True, cliente=None)

        # Arquivos e Comentários
        identidade = request.files.get('identidade')
        comentario_identidade = request.form.get('comentario_identidade', '')

        cnh = request.files.get('cnh')
        comentario_cnh = request.form.get('comentario_cnh', '')

        comprovante_endereco = request.files.get('comprovante_endereco')
        comentario_comprovante = request.form.get('comentario_comprovante', '')

        outros = request.files.get('outros')
        comentario_outros = request.form.get('comentario_outros', '')

        caminho_identidade = salvar_arquivo(identidade, identidade.filename) if identidade else None
        caminho_cnh = salvar_arquivo(cnh, cnh.filename) if cnh else None
        caminho_comprovante = salvar_arquivo(comprovante_endereco, comprovante_endereco.filename) if comprovante_endereco else None
        caminho_outros = salvar_arquivo(outros, outros.filename) if outros else None

        # Buscar o último número identificador e incrementar corretamente
        ultimo_cliente = db.clientes.find().sort("numero_identificador", -1).limit(1)
        ultimo_cliente = list(ultimo_cliente)  # Convertendo cursor em lista

        if len(ultimo_cliente) > 0:  # Verificando se há clientes existentes
            novo_numero_identificador = ultimo_cliente[0]['numero_identificador'] + 1
        else:
            novo_numero_identificador = 1

        # Inserir o cliente com os documentos e comentários no banco de dados
        cliente_inserido = db.clientes.insert_one({
            'nome': nome,  # Nome formatado corretamente
            'cpf': cpf,
            'documentos': {
                'identidade': {'arquivo': caminho_identidade, 'comentario': comentario_identidade},
                'cnh': {'arquivo': caminho_cnh, 'comentario': comentario_cnh},
                'comprovante_endereco': {'arquivo': caminho_comprovante, 'comentario': comentario_comprovante},
                'outros': {'arquivo': caminho_outros, 'comentario': comentario_outros}
            },
            'numero_identificador': novo_numero_identificador
        })

        # Redirecionar para a página de detalhes do cliente recém-cadastrado
        return redirect(url_for('visualizar_cliente', numero_identificador=novo_numero_identificador))

    # Renderizando a página de cadastro sem um cliente (para um novo cadastro)
    return render_template('cadastro.html', cliente=None)



@app.route('/detalhe_cliente/<id>')
def detalhe_cliente(id):
    # Aqui você busca o cliente no banco de dados usando o ID
    cliente = collection.find_one({'_id': ObjectId(id)})  # Use ObjectId para buscar no MongoDB
    return render_template('detalhe_cliente.html', cliente=cliente)


@app.route('/buscar_cliente', methods=['GET', 'POST'])
def buscar_cliente():
    if request.method == 'POST':
        nome = request.form.get('nome')
        cpf = request.form.get('cpf')

        query = {}
        if nome:
            query['nome'] = {'$regex': nome, '$options': 'i'}
        if cpf:
            query['cpf'] = cpf

        # Paginando resultados
        page = int(request.args.get('page', 1))
        limit = 10
        skip = (page - 1) * limit

        clientes = list(db.clientes.find(query).skip(skip).limit(limit))
        total_clientes = db.clientes.count_documents(query)
        total_pages = (total_clientes // limit) + (1 if total_clientes % limit > 0 else 0)

        return render_template('busca.html', clientes=clientes, page=page, total_pages=total_pages)

    return render_template('busca.html')



@app.route('/busca_cliente', methods=['GET', 'POST'])
def busca_cliente():
    clientes = []
    page = request.args.get('page', 1, type=int)  # Pega a página atual da URL, padrão é 1
    total_pages = 1

    # Definir o número de documentos por página
    documentos_por_pagina = 7

    if request.method == 'POST':
        nome = request.form.get('nome', '').strip()
        cpf = request.form.get('cpf', '').strip()

        # Criar a consulta com base nos campos preenchidos
        query = {}
        if nome:
            query['nome'] = {'$regex': nome, '$options': 'i'}  # Busca insensível a maiúsculas
        if cpf:
            query['cpf'] = cpf  # Busca exata por CPF

        # Executar a consulta no banco de dados
        clientes = list(db.clientes.find(query))
    else:
        # Busca todos os clientes cadastrados
        clientes = list(db.clientes.find())

    # Calcular total_pages e aplicar paginação
    total_clientes = len(clientes)
    total_pages = (total_clientes + documentos_por_pagina - 1) // documentos_por_pagina  # Arredonda para cima
    skip_count = (page - 1) * documentos_por_pagina  # Quantidade de documentos a pular

    # Aplicar paginação
    clientes = clientes[skip_count:skip_count + documentos_por_pagina]

    # Renderiza a tabela de clientes na página de busca, passando 'page' e 'total_pages'
    return render_template('busca.html', clientes=clientes, page=page, total_pages=total_pages)



@app.route('/baixar_arquivo/<tipo>/<arquivo>', methods=['GET'])
def baixar_arquivo(tipo, arquivo):
    # Caminho completo para o arquivo dentro da pasta de uploads
    caminho_arquivo = os.path.join('static/uploads', arquivo)
    
    # Verificando se o arquivo existe fisicamente no diretório
    if not os.path.exists(caminho_arquivo):
        return "Arquivo não encontrado no servidor.", 404
    
    # Retornando o arquivo para download
    return send_from_directory('static/uploads', arquivo, as_attachment=True)


@app.route('/visualizar_cliente/<int:numero_identificador>')  # Especificando que é um int
def visualizar_cliente(numero_identificador):
    cliente = db.clientes.find_one({"numero_identificador": numero_identificador})
    
    if not cliente:
        # Se o cliente não for encontrado, redirecionar ou mostrar uma mensagem de erro
        flash('Cliente não encontrado.')
        return redirect(url_for('busca_cliente'))
    
    # Garantir que o cliente tenha a estrutura de documentos
    if 'documentos' not in cliente:
        cliente['documentos'] = {
            "identidade": {"arquivo": None, "comentario": ""},
            "cnh": {"arquivo": None, "comentario": ""},
            "comprovante_endereco": {"arquivo": None, "comentario": ""},
            "outros": {"arquivo": None, "comentario": ""}
        }

    return render_template('detalhe_cliente.html', cliente=cliente, modo='visualizar')



@app.route('/editar_cliente/<int:numero_identificador>', methods=['GET', 'POST'])
def editar_cliente(numero_identificador):
    if 'username' not in session:
        return redirect(url_for('home'))

    cliente = db.clientes.find_one({"numero_identificador": numero_identificador})

    if not cliente:
        flash('Cliente não encontrado.')
        return redirect(url_for('busca_cliente'))

    if request.method == 'POST':
        # Atualizando os dados do cliente sem alterar o numero_identificador
        nome = request.form['nome']
        cpf = request.form['cpf']

        # Comentários
        comentario_identidade = request.form.get('comentario_identidade', '')
        comentario_cnh = request.form.get('comentario_cnh', '')
        comentario_comprovante = request.form.get('comentario_comprovante', '')
        comentario_outros = request.form.get('comentario_outros', '')

        # Inicializando o dicionário de documentos com valores existentes
        documentos = {
            "identidade": {
                "arquivo": cliente['documentos'].get('identidade', {}).get('arquivo'),
                "comentario": comentario_identidade
            },
            "cnh": {
                "arquivo": cliente['documentos'].get('cnh', {}).get('arquivo'),
                "comentario": comentario_cnh
            },
            "comprovante_endereco": {
                "arquivo": cliente['documentos'].get('comprovante_endereco', {}).get('arquivo'),
                "comentario": comentario_comprovante
            },
            "outros": {
                "arquivo": cliente['documentos'].get('outros', {}).get('arquivo'),
                "comentario": comentario_outros
            }
        }

        # Atualiza o arquivo somente se um novo arquivo for enviado
        def salvar_documento(campo, tipo_documento):
            if campo in request.files and request.files[campo]:
                arquivo = request.files[campo]
                # Extrair a extensão original do arquivo
                extensao = arquivo.filename.split('.')[-1]  # Obtém a extensão
                novo_nome = f'{tipo_documento}_{numero_identificador}.{extensao}'  # Mantém a extensão original
                return salvar_arquivo(arquivo, novo_nome)
            return None

        # Salva os documentos mantendo a extensão original
        documentos['identidade']['arquivo'] = salvar_documento('identidade', 'identidade') or documentos['identidade']['arquivo']
        documentos['cnh']['arquivo'] = salvar_documento('cnh', 'cnh') or documentos['cnh']['arquivo']
        documentos['comprovante_endereco']['arquivo'] = salvar_documento('comprovante_endereco', 'comprovante_endereco') or documentos['comprovante_endereco']['arquivo']
        documentos['outros']['arquivo'] = salvar_documento('outros', 'outros') or documentos['outros']['arquivo']

        # Atualizando os dados do cliente no banco de dados
        db.clientes.update_one(
            {"numero_identificador": numero_identificador},
            {
                "$set": {
                    "nome": nome,
                    "cpf": cpf,
                    "documentos": documentos
                }
            }
        )

        flash('Dados do cliente atualizados com sucesso!')
        return redirect(url_for('visualizar_cliente', numero_identificador=numero_identificador))


    # Extrair apenas o nome do arquivo sem o caminho
    if cliente:
        for doc_key in cliente['documentos']:
            arquivo_atual = cliente['documentos'][doc_key].get('arquivo')
            if arquivo_atual:  # Verifica se arquivo_atual não é None
                cliente['documentos'][doc_key]['arquivo'] = os.path.basename(arquivo_atual)

    return render_template('cadastro.html', cliente=cliente, modo='editar')


@app.route('/cadastro_usuario', methods=['GET', 'POST'])
def cadastro_usuario():
    usuarios = list(db.users.find())  # Busca todos os usuários cadastrados

    if request.method == 'POST':
        nome = request.form['nome']
        username = request.form['username']
        senha = request.form['senha']
        tipo_acesso = request.form['tipo_acesso']

        # Verificar se o nome de usuário já existe
        usuario_existente = db.users.find_one({'username': username})
        if usuario_existente:
            return render_template('cadastro_usuario.html', usuario_duplicado=True, usuarios=usuarios)

        # Hash da senha
        senha_hash = generate_password_hash(senha)

        # Salvar o novo usuário no banco de dados
        db.users.insert_one({
            'nome': nome,
            'username': username,
            'password': senha_hash,
            'tipo_acesso': tipo_acesso
        })

        return render_template('cadastro_usuario.html', usuario_cadastrado=True, usuarios=usuarios)

    return render_template('cadastro_usuario.html', usuarios=usuarios)

@app.route('/toggle_usuario/<username>', methods=['POST'])
def toggle_usuario(username):
    usuario = db.users.find_one({'username': username})
    if usuario:
        novo_status = not usuario['status_usuario']  # Inverte o status
        db.users.update_one({'username': username}, {'$set': {'status_usuario': novo_status}})
    return redirect(url_for('cadastro_usuario'))  # Redireciona de volta para a página de cadastro


@app.route('/resetar_senha/<username>', methods=['POST'])
def resetar_senha(username):
    senha_hash = generate_password_hash('123')  # Cria o hash da senha padrão
    db.users.update_one({'username': username}, {'$set': {'password': senha_hash}})
    return redirect(url_for('cadastro_usuario'))  # Redireciona de volta para a página de cadastro

@app.route('/alterar_senha', methods=['POST'])
def alterar_senha():
    senha_anterior = request.form['senha_anterior']
    nova_senha = request.form['nova_senha']
    confirmar_senha = request.form['confirmar_senha']

    # Verifique se a nova senha e a confirmação são iguais
    if nova_senha != confirmar_senha:
        return render_template('dashboard.html', erro='As senhas não conferem.')

    # Verifique se a senha anterior está correta
    username = session['username']
    user = db.users.find_one({'username': username})
    if user and check_password_hash(user['password'], senha_anterior):
        # Atualiza a senha
        db.users.update_one({'username': username}, {'$set': {'password': generate_password_hash(nova_senha)}})
        return render_template('dashboard.html', sucesso='Senha alterada com sucesso.')
    else:
        return render_template('dashboard.html', erro='Senha anterior incorreta.')


@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('home'))

def open_browser():
    if os.environ.get('WERKZEUG_RUN_MAIN') == 'true':  # Apenas abre o navegador na execução principal
        webbrowser.open_new("http://127.0.0.1:5000/")  # URL que será aberta no navegador

if __name__ == '__main__':
    # Usa um Timer para garantir que o servidor Flask já tenha iniciado antes de abrir o navegador
    Timer(1, open_browser).start()  
    app.run(debug=True)