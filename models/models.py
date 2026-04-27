from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import date


class UsuarioBase(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=100)
    email: EmailStr


class UsuarioCreate(UsuarioBase):
    password: str = Field(..., min_length=6)


class UsuarioResponse(UsuarioBase):
    id: str


class UsuarioInDB(UsuarioBase):
    password: str


class EquipoBase(BaseModel):
    activo: bool = Field(default=True)


class EquipoResponse(EquipoBase):
    id: str


class ReservaBase(BaseModel):
    equipo_id: str
    fecha: date
    hora_inicio: str
    hora_fin: str


class ReservaCreate(ReservaBase):
    usuario_id: str


class ReservaResponse(ReservaBase):
    id: str
    usuario_id: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    success: bool
    usuario: Optional[UsuarioResponse] = None
    message: str
