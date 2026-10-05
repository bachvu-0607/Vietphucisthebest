from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class EventSchema(BaseModel):
    id: str
    name: str
    slug: str
    category: str
    icon: str
    description: str
    recommended_dress_code: str
    badge: str

    class Config:
        from_attributes = True

class SuitabilityItem(BaseModel):
    eventId: str
    score: int
    label: str
    reason: str

class CostumeSchema(BaseModel):
    id: str
    name: str
    slug: str
    era: str
    region: str
    gender: str
    formality: str
    cover_image: str
    short_description: str
    historical_context: str
    cultural_significance: str
    is_verified_historical_data: bool
    verification_note: str
    components: List[Dict[str, Any]]
    color_variants: List[Dict[str, Any]]
    materials: List[Dict[str, Any]]
    accessories: List[Dict[str, Any]]
    details: List[Dict[str, Any]]
    suitability: List[Dict[str, Any]]
    usage_considerations: List[str]
    styling_guide: Dict[str, Any]

    class Config:
        from_attributes = True

class DraftCreateSchema(BaseModel):
    id: Optional[str] = None
    title: str = "Bản phác thảo Việt phục mới"
    event_id: str
    costume_id: str
    model_gender: str = "female"
    model_pose: str = "standing_formal"
    selected_color_id: str
    selected_material_id: str
    selected_accessories: List[str] = []
    selected_hairstyle: Optional[str] = ""
    selected_footwear: Optional[str] = ""
    selected_details: Dict[str, Any] = {}
    selected_background_id: str = "bg-hoang-thanh"
    remix_style: str = "traditional"
    custom_prompt: Optional[str] = ""
    visible_layers: Dict[str, bool] = {}
    sketch_data_url: Optional[str] = ""

class DraftResponseSchema(DraftCreateSchema):
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class AIJobCreateSchema(BaseModel):
    draft_id: Optional[str] = None
    costume_id: str
    costume_name: str
    event_name: str = ""
    remix_style: str = "traditional"
    sketch_data_url: str
    color_name: Optional[str] = None
    material_name: Optional[str] = None
    accessories: Optional[List[str]] = None
    background_name: Optional[str] = None
    custom_prompt: Optional[str] = None

class AIJobResponseSchema(BaseModel):
    id: str
    draft_id: Optional[str]
    status: str
    costume_id: str
    costume_name: str
    event_name: str
    remix_style: str
    sketch_data_url: str
    result_image_url: Optional[str]
    prompt_used: str
    error_message: Optional[str]
    progress: int
    created_at: datetime
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True
