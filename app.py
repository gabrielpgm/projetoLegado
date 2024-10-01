from flask import Flask, render_template, request, redirect, url_for, session
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo import MongoClient
import config
import webbrowser  # Importa a biblioteca webbrowser
from threading import Timer  # Importa threading para rodar o servidor e abrir o navegador

app = Flask(__name__)
app.secret_key = config.SECRET_KEY

# Conexão com o MongoDB
client = MongoClient(config.MONGO_URL)
db = client['safedocsbd']  # Substitua pelo nome do seu banco de dados

@app.route('/')
def home():
    return render_template('login.html')

@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']
    
    user = db.users.find_one({'username': username})
    
    if user and check_password_hash(user['password'], password):
        session['username'] = username
        return redirect(url_for('dashboard'))
    else:
        return "Usuário ou senha inválidos", 401

@app.route('/dashboard')
def dashboard():
    if 'username' in session:
        return render_template('dashboard.html')
    else:
        return redirect(url_for('home'))

@app.route('/cadastro_cliente', methods=['GET', 'POST'])
def cadastro_cliente():
    if request.method == 'POST':
        # Implementar a lógica de cadastro de cliente
        return redirect(url_for('dashboard'))
    return render_template('cadastro.html')

@app.route('/busca_cliente', methods=['GET'])
def busca_cliente():
    # Implementar a lógica de busca de clientes
    return render_template('busca.html')

#Busca no banco de dados um cliente especifico pelo ID
@app.route('/cliente/<cliente_id>')
def visualizar_cliente(cliente_id):
    cliente = db.users.find_one({"_id": ObjectId(cliente_id)})
    if not cliente:
        return "Cliente não encontrado", 404
    return render_template('detalhes_cliente.html', cliente=cliente)

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('home'))

def open_browser():
    webbrowser.open_new("http://127.0.0.1:5000/")  # URL que será aberta no navegador

if __name__ == '__main__':
    # Usa um Timer para garantir que o servidor Flask já tenha iniciado antes de abrir o navegador
    Timer(1, open_browser).start()  
    app.run(debug=True)