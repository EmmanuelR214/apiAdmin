import sys
import json
import joblib
import numpy as np
import os

def main():
    # Obtener la ruta absoluta del directorio actual
    current_dir = os.path.dirname(os.path.abspath(__file__))

    # Cargar el modelo y el scaler usando rutas absolutas
    kmeans = joblib.load(os.path.join(current_dir, 'kmeans_model.pkl'))
    scaler = joblib.load(os.path.join(current_dir, 'scaler.pkl'))
    
    # Leer datos del usuario desde stdin
    user_data = json.loads(sys.stdin.read())
    
    # Escalar los datos del usuario
    scaled_data = scaler.transform([[
        user_data['total_gastado'],
        user_data['total_comprado'],
        user_data['num_pedidos'],
        user_data['dias_entre_pedidos'],
        user_data['dias_activo']
    ]])
    
    # Predecir el cluster
    cluster = kmeans.predict(scaled_data)
    
    # Devolver el resultado
    print(json.dumps({'cluster': int(cluster[0])}))

if __name__ == "__main__":
    main()