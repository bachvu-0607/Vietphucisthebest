from sqlalchemy import Column, String, Integer, Boolean, Text, JSON, DateTime
from datetime import datetime
from .database import Base

class EventModel(Base):
    __tablename__ = "events"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True)
    category = Column(String, nullable=False)
    icon = Column(String, default="Sparkles")
    description = Column(Text, nullable=False)
    recommended_dress_code = Column(Text, nullable=False)
    badge = Column(String, default="Gợi ý")

class CostumeModel(Base):
    __tablename__ = "costumes"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True)
    era = Column(String, nullable=False)
    region = Column(String, nullable=False)
    gender = Column(String, default="unisex") # male, female, unisex
    formality = Column(String, default="formal")
    cover_image = Column(String, nullable=False)
    short_description = Column(Text, nullable=False)
    historical_context = Column(Text, nullable=False)
    cultural_significance = Column(Text, nullable=False)
    is_verified_historical_data = Column(Boolean, default=True)
    verification_note = Column(Text, default="")
    components = Column(JSON, default=list) # List of components with layer_order, is_required
    color_variants = Column(JSON, default=list)
    materials = Column(JSON, default=list)
    accessories = Column(JSON, default=list)
    details = Column(JSON, default=list)
    suitability = Column(JSON, default=list) # List of event suitability scores & reasons
    usage_considerations = Column(JSON, default=list)
    styling_guide = Column(JSON, default=dict)

class DraftModel(Base):
    __tablename__ = "fitting_drafts"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, default="Bản phác thảo Việt phục mới")
    event_id = Column(String, nullable=False)
    costume_id = Column(String, nullable=False)
    model_gender = Column(String, default="female")
    model_pose = Column(String, default="standing_formal")
    selected_color_id = Column(String, nullable=False)
    selected_material_id = Column(String, nullable=False)
    selected_accessories = Column(JSON, default=list)
    selected_hairstyle = Column(String, default="")
    selected_footwear = Column(String, default="")
    selected_details = Column(JSON, default=dict)
    selected_background_id = Column(String, default="bg-hoang-thanh")
    remix_style = Column(String, default="traditional")
    custom_prompt = Column(Text, default="")
    visible_layers = Column(JSON, default=dict)
    sketch_data_url = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class AIJobModel(Base):
    __tablename__ = "ai_jobs"

    id = Column(String, primary_key=True, index=True)
    draft_id = Column(String, nullable=True)
    status = Column(String, default="queued") # draft, queued, processing, completed, failed
    costume_id = Column(String, nullable=False)
    costume_name = Column(String, nullable=False)
    event_name = Column(String, default="")
    remix_style = Column(String, default="traditional")
    sketch_data_url = Column(Text, nullable=False)
    result_image_url = Column(Text, nullable=True)
    prompt_used = Column(Text, default="")
    error_message = Column(Text, nullable=True)
    progress = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
