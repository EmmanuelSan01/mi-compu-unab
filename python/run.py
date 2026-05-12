import json, sys

from pathlib import Path
from setup import crear_db_json
from validar_reservas import detectar_conflictos, mostrar_resumen


def obtener_ruta_db() -> Path:
    proyecto_raiz = Path(__file__).parent.parent
    return proyecto_raiz / "data" / "db.json"


def verificar_db_existe() -> bool:
    db_path = obtener_ruta_db()
    
    if not db_path.exists():
        print("Base de datos no encontrada. Ejecutando setup.py...")
        crear_db_json()
    
    return db_path.exists()


def validar_estructura_db(db: dict) -> bool:
    claves_requeridas = ['equipos', 'usuarios', 'reservas']
    
    for clave in claves_requeridas:
        if clave not in db:
            raise ValueError(f"Estructura inválida: falta la clave '{clave}'")
        if not isinstance(db[clave], list):
            raise ValueError(f"Estructura inválida: '{clave}' debe ser una lista")
    
    return True


def cargar_db() -> dict:
    db_path = obtener_ruta_db()
    
    with open(db_path, 'r', encoding='utf-8') as f:
        db = json.load(f)
    
    validar_estructura_db(db)
    
    return db


def mostrar_estado_db(db: dict) -> None:
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
    reservas = db.get('reservas', [])
    
    if not reservas:
        print("No hay reservas para validar.")
        return []
    
    print(f"Validando {len(reservas)} reserva(s)...")
    conflictos = detectar_conflictos(reservas)
    mostrar_resumen(conflictos)
    
    return conflictos


def main():
    print("\n" + "="*60)
    print("SISTEMA DE RESERVAS - SALA DE CÓMPUTO")
    print("="*60)
    
    # Verificar existencia de db.json
    if not verificar_db_existe():
        print("ERROR: No se pudo crear o encontrar la base de datos.")
        sys.exit(1)
    
    # Cargar y validar
    try:
        db = cargar_db()
        print("Base de datos cargada correctamente.")
    except (json.JSONDecodeError, ValueError) as e:
        print(f"ERROR: {e}")
        sys.exit(1)
    
    # Mostrar estado
    mostrar_estado_db(db)
    
    # Validar conflictos
    conflictos = ejecutar_validacion(db)
    
    if conflictos:
        print("ADVERTENCIA: Existen conflictos en las reservas.")
        print("Por favor, resuelva los conflictos antes de continuar.\n")
    else:
        print("Sistema listo para operar.\n")
    
    return conflictos


if __name__ == "__main__":
    main()
