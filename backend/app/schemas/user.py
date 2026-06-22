from datetime import datetime

from pydantic import BaseModel, EmailStr, Field, field_validator


class UserCreate(BaseModel):
    full_name: str = Field(min_length=3, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)

    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, password: str) -> str:
        if len(password) < 8:
            raise ValueError("La contrasena debe tener al menos 8 caracteres.")

        if not any(character.isupper() for character in password):
            raise ValueError("La contrasena debe incluir al menos una letra mayuscula.")

        if not any(character.isdigit() for character in password):
            raise ValueError("La contrasena debe incluir al menos un numero.")

        return password


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse