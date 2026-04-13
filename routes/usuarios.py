from fastapi import APIRouter

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])


@router.get("/")
async def get_usuarios():
    return


@router.get("/{usuario_id}")
async def get_usuario():
    return


@router.post("/")
async def create_usuario():
    return


@router.post("/login")
async def login():
    return
