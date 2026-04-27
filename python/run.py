"""
run.py - Punto de entrada único del proyecto.

Responsabilidad:
- Verificar y crear db.json si no existe (ejecutando setup.py)
- Validar la estructura del JSON
- Ejecutar validación de conflictos antes de arrancar
- (Futuro) Lanzar json-server para servir la API REST
"""

import json
import sys
from pathlib import Path

# Importar módulos del proyecto
from setup import crear_db_json
from validar_reservas import detectar_conflictos, mostrar_resumen


def obtener_ruta_db() -> Path:
    """
    Obtiene la ruta al archivo db.json.
    
    Returns:
        Path: Ruta absoluta al archivo db.json
    """
    proyecto_raiz = Path(__file__).parent.parent
    return proyecto_raiz / "data" / "db.json"


def verificar_db_existe() -> bool:
    """
    Verifica si db.json existe; si no, ejecuta setup.py.
    
    Returns:
        bool: True si el archivo existe (o fue creado), False si hubo error
    """
    db_path = obtener_ruta_db()
    
    if not db_path.exists():
        print("Base de datos no encontrada. Ejecutando setup.py...")
        crear_db_json()
    
    return db_path.exists()


def validar_estructura_db(db: dict) -> bool:
    """
    Valida que el JSON tenga la estructura mínima requerida.
    
    Args:
        db: Diccionario con el contenido de db.json
    
    Returns:
        bool: True si la estructura es válida
    
    Raises:
        ValueError: Si falta alguna clave requerida
    """
    claves_requeridas = ['equipos', 'usuarios', 'reservas']
    
    for clave in claves_requeridas:
        if clave not in db:
            raise ValueError(f"Estructura inválida: falta la clave '{clave}'")
        if not isinstance(db[clave], list):
            raise ValueError(f"Estructura inválida: '{clave}' debe ser una lista")
    
    return True


def cargar_db() -> dict:
    """
    Carga y valida el contenido de db.json.
    
    Returns:
        dict: Contenido del archivo db.json
    
    Raises:
        FileNotFoundError: Si el archivo no existe
        json.JSONDecodeError: Si el JSON es inválido
        ValueError: Si la estructura no es correcta
    """
    db_path = obtener_ruta_db()
    
    with open(db_path, 'r', encoding='utf-8') as f:
        db = json.load(f)
    
    validar_estructura_db(db)
    
    return db


def mostrar_estado_db(db: dict) -> None:
    """
    Muestra un resumen del estado actual de la base de datos.
    
    Args:
        db: Diccionario con el contenido de db.json
    """
    equipos_activos = sum(1 for e in db['equipos'] if e.get('activo', False))
    
    print("\n" + "="*60)
    print("ESTADO DE LA BASE DE DATOS")
    print("="*60)
    print(f"  Equipos totales:    {len(db['equipos'])}")
    print(f"  Equipos activos:    {equipos_activos}")
    print(f"  Usuarios:           {len(db['usuarios'])}")
    print(f"  Reservas:           {len(db['reservas'])}")
    print("="*60 + "\n")


def ejecutar_validacion(db: dict) -> list:
    """
    Ejecuta la validación de conflictos sobre las reservas.
    
    Args:
        db: Diccionario con el contenido de db.json
    
    Returns:
        list: Lista de conflictos detectados
    """
    reservas = db.get('reservas', [])
    
    if not reservas:
        print("No hay reservas para validar.")
        return []
    
    print(f"Validando {len(reservas)} reserva(s)...")
    conflictos = detectar_conflictos(reservas)
    mostrar_resumen(conflictos)
    
    return conflictos


def main():
    """
    Punto de entrada principal del sistema.
    
    Flujo:
    1. Verificar que db.json existe (crear si es necesario)
    2. Cargar y validar la estructura del JSON
    3. Mostrar estado de la base de datos
    4. Ejecutar validación de conflictos
    """
    print("\n" + "="*60)
    print("SISTEMA DE RESERVAS - SALA DE CÓMPUTO")
    print("="*60)
    
    # Paso 1: Verificar existencia de db.json
    if not verificar_db_existe():
        print("ERROR: No se pudo crear o encontrar la base de datos.")
        sys.exit(1)
    
    # Paso 2: Cargar y validar
    try:
        db = cargar_db()
        print("Base de datos cargada correctamente.")
    except (json.JSONDecodeError, ValueError) as e:
        print(f"ERROR: {e}")
        sys.exit(1)
    
    # Paso 3: Mostrar estado
    mostrar_estado_db(db)
    
    # Paso 4: Validar conflictos
    conflictos = ejecutar_validacion(db)
    
    if conflictos:
        print("ADVERTENCIA: Existen conflictos en las reservas.")
        print("Por favor, resuelva los conflictos antes de continuar.\n")
    else:
        print("Sistema listo para operar.\n")
    
    return conflictos


if __name__ == "__main__":
    main()
