"""
validar_reservas.py - Algoritmo central de detección de conflictos por solapamiento.

Responsabilidad:
- Detectar conflictos de solapamiento entre reservas sobre el mismo equipo
- Comparar intervalos de tiempo usando objetos datetime
- Retornar lista de conflictos con información detallada
"""

from datetime import datetime


def a_datetime(fecha: str, hora: str) -> datetime:
    """
    Combina fecha 'YYYY-MM-DD' y hora 'HH:MM' en un objeto datetime.
    
    Args:
        fecha: Fecha en formato 'YYYY-MM-DD'
        hora: Hora en formato 'HH:MM' (24 horas)
    
    Returns:
        datetime: Objeto datetime combinando fecha y hora
    """
    return datetime.strptime(f"{fecha} {hora}", "%Y-%m-%d %H:%M")


def detectar_conflictos(reservas: list) -> list:
    """
    Detecta conflictos de solapamiento entre reservas.
    
    Algoritmo:
    - Compara cada par de reservas (i, j) donde j > i
    - Solo compara reservas del mismo equipo
    - Detecta solapamiento usando: NOT (fin1 <= inicio2 OR fin2 <= inicio1)
    
    Args:
        reservas: Lista de diccionarios con las reservas.
                  Cada reserva debe tener: id, equipo_id, fecha, hora_inicio, hora_fin
    
    Returns:
        list: Lista de conflictos encontrados, cada uno con:
              - reserva_1: ID de la primera reserva
              - reserva_2: ID de la segunda reserva
              - equipo_id: ID del equipo en conflicto
              - detalle: Descripción legible del solapamiento
    """
    conflictos = []
    n = len(reservas)
    
    for i in range(n):
        for j in range(i + 1, n):
            r1 = reservas[i]
            r2 = reservas[j]
            
            # Equipos distintos nunca conflictan
            if r1['equipo_id'] != r2['equipo_id']:
                continue
            
            # Convertir a datetime para comparación
            inicio1 = a_datetime(r1['fecha'], r1['hora_inicio'])
            fin1 = a_datetime(r1['fecha'], r1['hora_fin'])
            inicio2 = a_datetime(r2['fecha'], r2['hora_inicio'])
            fin2 = a_datetime(r2['fecha'], r2['hora_fin'])
            
            # Condición de solapamiento (De Morgan sobre NO-solapamiento):
            # Hay solapamiento si NOT (fin1 <= inicio2 OR fin2 <= inicio1)
            hay_solapamiento = not (fin1 <= inicio2 or fin2 <= inicio1)
            
            if hay_solapamiento:
                conflictos.append({
                    'reserva_1': r1['id'],
                    'reserva_2': r2['id'],
                    'equipo_id': r1['equipo_id'],
                    'detalle': (
                        f"Conflicto en equipo {r1['equipo_id']}: "
                        f"Reserva {r1['id']} ({r1['fecha']} {r1['hora_inicio']}-{r1['hora_fin']}) "
                        f"se solapa con Reserva {r2['id']} ({r2['fecha']} {r2['hora_inicio']}-{r2['hora_fin']})"
                    )
                })
    
    return conflictos


def mostrar_resumen(conflictos: list) -> None:
    """
    Muestra un resumen de los conflictos detectados.
    
    Args:
        conflictos: Lista de conflictos retornada por detectar_conflictos()
    """
    if not conflictos:
        print("No se detectaron conflictos de solapamiento.")
        return
    
    print(f"\n{'='*60}")
    print(f"ALERTA: Se detectaron {len(conflictos)} conflicto(s) de solapamiento")
    print(f"{'='*60}\n")
    
    for i, conflicto in enumerate(conflictos, 1):
        print(f"{i}. {conflicto['detalle']}")
    
    print()


if __name__ == "__main__":
    # Ejemplo de uso para testing
    reservas_ejemplo = [
        {
            "id": 1,
            "equipo_id": 1,
            "fecha": "2026-05-01",
            "hora_inicio": "10:00",
            "hora_fin": "12:00"
        },
        {
            "id": 2,
            "equipo_id": 1,
            "fecha": "2026-05-01",
            "hora_inicio": "11:00",
            "hora_fin": "13:00"
        },
        {
            "id": 3,
            "equipo_id": 2,
            "fecha": "2026-05-01",
            "hora_inicio": "10:00",
            "hora_fin": "12:00"
        }
    ]
    
    conflictos = detectar_conflictos(reservas_ejemplo)
    mostrar_resumen(conflictos)
