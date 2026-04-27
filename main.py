from fastapi import FastAPI

from routes import equipos, reservas, usuarios

app = FastAPI()

app.include_router(usuarios.router)
