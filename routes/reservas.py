from fastapi import APIRouter

router = APIRouter(prefix="/reservas", tags=["Reservas"])


@router.get("/")
async def get_reservas():
    return


@router.get("/fecha/{fecha}")
async def get_reservas_by_fecha():
    return


@router.get("/equipo/{equipo_id}/fecha/{fecha}")
async def get_reservas_equipo_fecha():
    return


@router.get("/disponibilidad/{equipo_id}/{fecha}")
async def get_disponibilidad():
    return


@router.post("/")
async def create_reserva():
    return


@router.delete("/{reserva_id}")
async def delete_reserva():
    return
