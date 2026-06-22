from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.database.postgresql import get_db
from app.models.task import Task
from app.models.task_category import TaskCategory
from app.models.user import User
from app.schemas.task_category import (
    TaskCategoryCreate,
    TaskCategoryResponse,
    TaskCategoryUpdate,
)
from app.services.activity_log_service import create_activity_log


router = APIRouter(prefix="/task-categories", tags=["Task Categories"])


def get_user_task_category_or_404(
    category_id: int,
    db: Session,
    current_user: User,
) -> TaskCategory:
    category = (
        db.query(TaskCategory)
        .filter(
            TaskCategory.id == category_id,
            TaskCategory.user_id == current_user.id,
        )
        .first()
    )

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoria no encontrada.",
        )

    return category


@router.post("", response_model=TaskCategoryResponse, status_code=status.HTTP_201_CREATED)
def create_task_category(
    category_in: TaskCategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    category = TaskCategory(
        name=category_in.name.strip(),
        color=category_in.color,
        user_id=current_user.id,
    )

    try:
        db.add(category)
        db.commit()
        db.refresh(category)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe una categoria con ese nombre.",
        )

    create_activity_log(
        current_user=current_user,
        action="create",
        entity="task_category",
        entity_id=str(category.id),
        message=f"Categoria de tarea creada: {category.name}",
    )

    return category


@router.get("", response_model=list[TaskCategoryResponse])
def list_task_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(TaskCategory)
        .filter(TaskCategory.user_id == current_user.id)
        .order_by(TaskCategory.created_at.desc())
        .all()
    )


@router.patch("/{category_id}", response_model=TaskCategoryResponse)
def update_task_category(
    category_id: int,
    category_in: TaskCategoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    category = get_user_task_category_or_404(
        category_id=category_id,
        db=db,
        current_user=current_user,
    )

    if category_in.name is not None:
        category.name = category_in.name.strip()

    if category_in.color is not None:
        category.color = category_in.color

    try:
        db.commit()
        db.refresh(category)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe una categoria con ese nombre.",
        )

    create_activity_log(
        current_user=current_user,
        action="update",
        entity="task_category",
        entity_id=str(category.id),
        message=f"Categoria de tarea actualizada: {category.name}",
    )

    return category


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    category = get_user_task_category_or_404(
        category_id=category_id,
        db=db,
        current_user=current_user,
    )

    has_tasks = (
        db.query(Task)
        .filter(
            Task.category_id == category.id,
            Task.user_id == current_user.id,
        )
        .count()
        > 0
    )

    if has_tasks:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="No se puede eliminar la categoria porque tiene tareas asociadas.",
        )

    category_name = category.name

    db.delete(category)
    db.commit()

    create_activity_log(
        current_user=current_user,
        action="delete",
        entity="task_category",
        entity_id=str(category_id),
        message=f"Categoria de tarea eliminada: {category_name}",
    )