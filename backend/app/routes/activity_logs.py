from fastapi import APIRouter, Depends

from app.core.security import get_current_user
from app.models.user import User
from app.schemas.activity_log import ActivityLogResponse
from app.services.activity_log_service import list_activity_logs


router = APIRouter(prefix="/activity-logs", tags=["Activity Logs"])


@router.get("", response_model=list[ActivityLogResponse])
def get_activity_logs(
    current_user: User = Depends(get_current_user),
):
    return list_activity_logs(current_user=current_user)