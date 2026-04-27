"""
setup.py - Genera e inicializa data/db.json con la estructura base.

Responsabilidad:
- Crear el archivo db.json con 24 equipos activos (IDs 1-24)
- Inicializar colecciones vacías para usuarios y reservas
- No sobreescribir db.json si ya existe
"""

import json
import os
from pathlib import Path


def generar_db():
    """
    Genera la estructura base de la base de datos.
    
    Returns:
        dict: Estructura de db.json con equipos, usuarios y reservas
    """
    equipos = [{"id": i, "activo": True} for i in range(1, 25)]
    
    return {
        "equipos": equipos,
        "usuarios": [],
        "reservas": []
    }


def crear_db_json():
    """
    Crea el archivo db.json en el directorio data/.
    
    - Verifica si el archivo ya existe para no sobreescribir
    - Crea el directorio data/ si no existe
    - Escribe el JSON con formato legible (indent=2)
    
    Returns:
        bool: True si se creó el archivo, False si ya existía
    """
    # Obtener la ruta del directorio raíz del proyecto (un nivel arriba de python/)
    proyecto_raiz = Path(__file__).parent.parent
    data_dir = proyecto_raiz / "data"
    db_path = data_dir / "db.json"
    
    # Verificar si el archivo ya existe
    if db_path.exists():
        print(f"El archivo {db_path} ya existe. No se sobreescribirá.")
        return False
    
    # Crear el directorio data/ si no existe
    data_dir.mkdir(parents=True, exist_ok=True)
    
    # Generar y escribir la base de datos
    db = generar_db()
    
    with open(db_path, 'w', encoding='utf-8') as f:
        json.dump(db, f, indent=2, ensure_ascii=False)
    
    print(f"Base de datos creada exitosamente en {db_path}")
    print(f"  - {len(db['equipos'])} equipos inicializados")
    print(f"  - Colecciones 'usuarios' y 'reservas' vacías")
    
    return True


if __name__ == "__main__":
    crear_db_json()
