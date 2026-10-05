from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
from datetime import datetime

from .database import engine, get_db, Base
from .models import EventModel, CostumeModel, DraftModel, AIJobModel
from .schemas import (
    EventSchema,
    CostumeSchema,
    DraftCreateSchema,
    DraftResponseSchema,
    AIJobCreateSchema,
    AIJobResponseSchema
)

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Việt Phục Remix API",
    description="Hệ thống quản lý dữ liệu, phối thử và xử lý AI cho trang phục cổ truyền Việt Nam",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/events", response_model=List[EventSchema])
def list_events(db: Session = Depends(get_db)):
    return db.query(EventModel).all()

@app.get("/api/costumes", response_model=List[CostumeSchema])
def list_costumes(
    event_id: Optional[str] = Query(None),
    gender: Optional[str] = Query(None),
    era: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(CostumeModel)
    costumes = query.all()

    if event_id:
        costumes = [
            c for c in costumes
            if any(s.get("eventId") == event_id for s in (c.suitability or []))
        ]
    if gender and gender != "all":
        costumes = [c for c in costumes if c.gender in [gender, "unisex"]]
    if era and era != "all":
        costumes = [c for c in costumes if era.lower() in c.era.lower()]

    return costumes

@app.get("/api/costumes/{costume_id}", response_model=CostumeSchema)
def get_costume(costume_id: str, db: Session = Depends(get_db)):
    costume = db.query(CostumeModel).filter(
        (CostumeModel.id == costume_id) | (CostumeModel.slug == costume_id)
    ).first()
    if not costume:
        raise HTTPException(status_code=404, detail="Không tìm thấy bộ Việt phục yêu cầu.")
    return costume

@app.get("/api/drafts", response_model=List[DraftResponseSchema])
def list_drafts(db: Session = Depends(get_db)):
    return db.query(DraftModel).order_by(DraftModel.updated_at.desc()).all()

@app.post("/api/drafts", response_model=DraftResponseSchema)
def save_draft(payload: DraftCreateSchema, db: Session = Depends(get_db)):
    draft_id = payload.id or f"draft-{uuid.uuid4().hex[:8]}"
    existing = db.query(DraftModel).filter(DraftModel.id == draft_id).first()

    if existing:
        for k, v in payload.dict(exclude_unset=True).items():
            if k != "id":
                setattr(existing, k, v)
        existing.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(existing)
        return existing
    else:
        new_draft = DraftModel(
            id=draft_id,
            **payload.dict(exclude={"id"})
        )
        db.add(new_draft)
        db.commit()
        db.refresh(new_draft)
        return new_draft

@app.delete("/api/drafts/{draft_id}")
def delete_draft(draft_id: str, db: Session = Depends(get_db)):
    draft = db.query(DraftModel).filter(DraftModel.id == draft_id).first()
    if not draft:
        raise HTTPException(status_code=404, detail="Bản phác thảo không tồn tại.")
    db.delete(draft)
    db.commit()
    return {"success": True, "message": "Đã xóa bản phác thảo."}

@app.get("/api/ai/jobs", response_model=List[AIJobResponseSchema])
def list_ai_jobs(db: Session = Depends(get_db)):
    return db.query(AIJobModel).order_by(AIJobModel.created_at.desc()).all()

@app.get("/api/ai/jobs/{job_id}", response_model=AIJobResponseSchema)
def get_ai_job(job_id: str, db: Session = Depends(get_db)):
    job = db.query(AIJobModel).filter(AIJobModel.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Không tìm thấy yêu cầu AI.")
    return job

@app.post("/api/ai/jobs", response_model=AIJobResponseSchema)
def create_ai_job(
    payload: AIJobCreateSchema,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    job_id = f"job-{uuid.uuid4().hex[:8]}"
    new_job = AIJobModel(
        id=job_id,
        draft_id=payload.draft_id,
        status="queued",
        costume_id=payload.costume_id,
        costume_name=payload.costume_name,
        event_name=payload.event_name,
        remix_style=payload.remix_style,
        sketch_data_url=payload.sketch_data_url,
        prompt_used=f"Vietnamese Costume: {payload.costume_name}, Style: {payload.remix_style}",
        progress=5,
        created_at=datetime.utcnow()
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    # In production, background_tasks.add_task(process_ai_worker, job_id)
    return new_job
