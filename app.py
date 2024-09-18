from flask import Flask, render_template, request, redirect, url_for, session, flash
from pymongo import MongoClient
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
app.secret_key = 'your_secret_key'

# Conexão com MongoDB
client = MongoClient('localhost', 27017)
db = client['conselho_classe']
users = db['users']
documentos = db['documentos']

# Configuração de upload
app.config['UPLOAD_FOLDER'] = 'static/uploads'

# Rota de login
@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = users.find_one({"username": username, "password": password})
        if user:
            session['loggedin'] = True
            session['username'] = user['username']
            return redirect(url_for('upload'))
        else:
            flash('Login ou senha incorretos!')
    return render_template('login.html')

# Rota de upload de arquivos
@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if 'loggedin' in session:
        if request.method == 'POST':
            file = request.files['file']
            if file:
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

                documentos.insert_one({
                    'username': session['username'],
                    'nome_arquivo': filename,
                    'caminho_arquivo': os.path.join(app.config['UPLOAD_FOLDER'], filename),
                    'tipo_arquivo': file.mimetype
                })

                flash('Arquivo carregado com sucesso!')
        return render_template('upload.html')
    return redirect(url_for('login'))

# Logout
@app.route('/logout')
def logout():
    session.pop('loggedin', None)
    session.pop('username', None)
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)
