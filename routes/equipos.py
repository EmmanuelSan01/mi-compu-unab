from fastapi import APIRouter

router = APIRouter(prefix="/equipos", tags=["Equipos"])


@router.get("/")
async def get_equipos():
    return


@router.get("/activos")
async def get_equipos_activos():
    return


@router.get("/{equipo_id}")
async def get_equipo(equipo_id: str):
    return
