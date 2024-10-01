import pymongo

# Conecte ao MongoDB (ajuste a URL se necessário)
client = pymongo.MongoClient("mongodb://localhost:27017/")

# Verifique os bancos de dados disponíveis
dbs = client.list_database_names()
print(dbs)
