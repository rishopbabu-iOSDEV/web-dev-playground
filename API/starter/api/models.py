"""Request and response bodies as Pydantic models (Module 7)."""
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class MessageIn(BaseModel):
    """What the contact form sends."""

    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    message: str = Field(min_length=1, max_length=2000)


class MessageOut(BaseModel):
    """What the owner reads back."""

    id: int
    name: str
    email: str
    message: str
    sent_at: datetime
    is_read: bool


class MessagePatch(BaseModel):
    """The only thing the owner changes on a message."""

    is_read: bool


class ProjectPatch(BaseModel):
    """Only the fields that were sent. A typo like "projectName" is a loud 422."""

    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")

    project_name: str | None = Field(None, min_length=1, max_length=150)
    description: str | None = Field(None, max_length=2000)


class AppointmentIn(BaseModel):
    """One request that adds a company, a period, a role, a project and its skills."""

    model_config = ConfigDict(str_strip_whitespace=True)

    company_name: str = Field(min_length=1, max_length=150)
    role_title: str = Field(min_length=1, max_length=150)
    start_date: date
    end_date: date | None = None
    project_name: str = Field(min_length=1, max_length=150)
    skill_ids: list[int] = []
    headline: str | None = Field(None, max_length=300)
