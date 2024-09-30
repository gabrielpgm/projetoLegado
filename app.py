from flask import Flask, render_template, request, redirect, url_for, session
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
import os

app = Flask(__name__)
app.config['MONGO_URI'] = "mongodb://localhost:27017/meu_banco"
app.config['UPLOAD_FOLDER'] = os.path.join('static', 'uploads')
app.secret_key = 'sua_chave_secreta'

mongo = PyMongo(app)

# Página de login
@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        # Logica de autenticação
        return redirect(url_for('home'))
    return render_template('login.html')

# Página inicial (menu)
@app.route('/home')
def home():
    return render_template('base.html')

# Página de cadastro de clientes
@app.route('/cadastro', methods=['GET', 'POST'])
def cadastro():
    if request.method == 'POST':
        nome = request.form['nome']
        email = request.form['email']
        arquivo = request.files['arquivo']
        
        if arquivo and allowed_file(arquivo.filename):
            # Salvar arquivo no MongoDB
            mongo.save_file(arquivo.filename, arquivo)
            mongo.db.clientes.insert_one({
                'nome': nome,
                'email': email,
                'arquivo': arquivo.filename
            })
        return redirect(url_for('busca'))
    return render_template('cadastro.html')

# Página de busca de clientes
@app.route('/busca')
def busca():
    clientes = mongo.db.clientes.find()
    return render_template('busca.html', clientes=clientes)

# Função para verificar tipos permitidos
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'pdf', 'png', 'jpg', 'jpeg'}

if __name__ == '__main__':
    app.run(debug=True)
