from pymongo import MongoClient

# Configurações do banco de dados MongoDB
MONGO_URL = 'mongodb://localhost:27017'  # URI padrão do MongoDB
client = MongoClient(MONGO_URL)
db = client['safedocsbd']  # Nome do seu banco de dados

# Configurações da aplicação
SECRET_KEY = '123'  # Defina sua chave secreta aqui
