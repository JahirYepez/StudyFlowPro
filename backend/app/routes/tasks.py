from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.database.postgresql import get_db
from app.models.subject import Subject
from app.models.task import Task
from app.models.task_category import TaskCategory
from app.models.user import User
from app.schemas.task import TaskCreate, TaskResponse, TaskUpdate
from app.services.activity_log_service import create_activity_log


router = APIRouter(prefix="/tasks", tags=["Tasks"])


def get_user_subject_or_404(
    db: Session,
    subject_id: int,
    current_user: User,
) -> Subject:
    subject = (
        db.query(Subject)
        .filter(
            Subject.id == subject_id,
            Subject.user_id == current_user.id,
        )
        .first()
    )

    if not subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Materia no encontrada.",
        )

    return subject


def get_user_category_or_404(
    db: Session,
    category_id: int,
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


def get_user_task_or_404(
    db: Session,
    task_id: int,
    current_user: User,
) -> Task:
    task = (
        db.query(Task)
        .filter(
            Task.id == task_id,
            Task.user_id == current_user.id,
        )
        .first()
    )

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tarea no encontrada.",
        )

    return task


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
    task_in: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    subject = get_user_subject_or_404(
        db=db,
        subject_id=task_in.subject_id,
        current_user=current_user,
    )

    category_id = None

    if task_in.category_id is not None:
        category = get_user_category_or_404(
            db=db,
            category_id=task_in.category_id,
            current_user=current_user,
        )
        category_id = category.id

    task = Task(
        title=task_in.title.strip(),
        description=task_in.description,
        due_date=task_in.due_date,
        priority=task_in.priority,
        subject_id=subject.id,
        category_id=category_id,
        user_id=current_user.id,
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    create_activity_log(
        current_user=current_user,
        action="create",
        entity="task",
        entity_id=str(task.id),
        message=f"Tarea creada: {task.title}",
    )

    return task


@router.get("", response_model=list[TaskResponse])
def list_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(Task)
        .filter(Task.user_id == current_user.id)
        .order_by(Task.completed.asc(), Task.created_at.desc())
        .all()
    )


@router.patch("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    task_in: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = get_user_task_or_404(
        db=db,
        task_id=task_id,
        current_user=current_user,
    )

    if task_in.subject_id is not None:
        subject = get_user_subject_or_404(
            db=db,
            subject_id=task_in.subject_id,
            current_user=current_user,
        )
        task.subject_id = subject.id

    if task_in.category_id is not None:
        category = get_user_category_or_404(
            db=db,
            category_id=task_in.category_id,
            current_user=current_user,
        )
        task.category_id = category.id

    if task_in.title is not None:
        task.title = task_in.title.strip()

    if task_in.description is not None:
        task.description = task_in.description

    if task_in.due_date is not None:
        task.due_date = task_in.due_date

    if task_in.priority is not None:
        task.priority = task_in.priority

    if task_in.completed is not None:
        task.completed = task_in.completed

    db.commit()
    db.refresh(task)

    create_activity_log(
        current_user=current_user,
        action="update",
        entity="task",
        entity_id=str(task.id),
        message=f"Tarea actualizada: {task.title}",
    )

    return task


@router.patch("/{task_id}/complete", response_model=TaskResponse)
def complete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = get_user_task_or_404(
        db=db,
        task_id=task_id,
        current_user=current_user,
    )

    task.completed = True

    db.commit()
    db.refresh(task)

    create_activity_log(
        current_user=current_user,
        action="complete",
        entity="task",
        entity_id=str(task.id),
        message=f"Tarea completada: {task.title}",
    )

    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = get_user_task_or_404(
        db=db,
        task_id=task_id,
        current_user=current_user,
    )

    task_title = task.title

    has_reminders = any(reminder.user_id == current_user.id for reminder in task.reminders)

    if has_reminders:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="No se puede eliminar la tarea porque tiene recordatorios asociados.",
        )

    db.delete(task)
    db.commit()

    create_activity_log(
        current_user=current_user,
        action="delete",
        entity="task",
        entity_id=str(task_id),
        message=f"Tarea eliminada: {task_title}",
    )
