from app.core.security import hash_password, verify_password


def test_hash_password_generates_different_value():
    plain_password = "Prueba123"

    hashed_password = hash_password(plain_password)

    assert hashed_password != plain_password
    assert verify_password(plain_password, hashed_password) is True


def test_verify_password_rejects_wrong_password():
    hashed_password = hash_password("Prueba123")

    assert verify_password("Incorrecta123", hashed_password) is False
