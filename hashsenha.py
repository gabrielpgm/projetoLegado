import bcrypt

# Função para hash da senha
def hash_password(password1):
    hashed = bcrypt.hashpw(password1.encode('utf-8'), bcrypt.gensalt())
    return hashed.decode('utf-8')  # Decodifica para string

# Exemplo de uso
password1 = "123"
hashed_password = hash_password(password1)
print(hashed_password)
