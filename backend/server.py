from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Cookie
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import asyncio
import random
import resend
import razorpay
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')
RESEND_API_KEY = os.environ.get('RESEND_API_KEY')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID')
RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET')
JWT_SECRET = os.environ.get('JWT_SECRET', 'saathi_secret')
OAUTH_BACKEND_URL = os.environ.get('OAUTH_BACKEND_URL', 'https://demobackend.emergentagent.com')

resend.api_key = RESEND_API_KEY
razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

CRISIS_KEYWORDS = ['suicide', 'kill myself', 'end my life', 'want to die', 'self harm', 'hurt myself', 'no reason to live']
INDIA_HELPLINES = {
    "AASRA": "91-9820466726",
    "Kiran Mental Health": "1800-599-0019",
    "Vandrevala Foundation": "+91-9999666555"
}

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    role: str = "user"
    is_anonymous: bool = False
    created_at: datetime

class UserSession(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    session_token: str
    expires_at: datetime
    created_at: datetime

class OTPRequest(BaseModel):
    email: EmailStr

class OTPVerify(BaseModel):
    email: EmailStr
    otp: str

class AnonymousLogin(BaseModel):
    display_name: Optional[str] = "Anonymous User"

class ChatMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    message_id: str
    session_id: str
    user_id: str
    role: str
    content: str
    is_crisis: bool = False
    timestamp: datetime

class ChatRequest(BaseModel):
    message: str
    session_id: str

class Psychologist(BaseModel):
    model_config = ConfigDict(extra="ignore")
    psychologist_id: str
    name: str
    email: str
    credentials: str
    specialization: List[str]
    years_experience: int
    pricing: int
    rating: float = 0.0
    bio: str
    picture: Optional[str] = None
    approved: bool = False
    created_at: datetime

class PsychologistCreate(BaseModel):
    name: str
    email: EmailStr
    credentials: str
    specialization: List[str]
    years_experience: int
    pricing: int
    bio: str
    picture: Optional[str] = None

class Booking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    booking_id: str
    user_id: str
    psychologist_id: str
    slot_date: str
    slot_time: str
    status: str
    payment_id: Optional[str] = None
    amount: int
    created_at: datetime

class BookingCreate(BaseModel):
    psychologist_id: str
    slot_date: str
    slot_time: str

class SuccessStory(BaseModel):
    model_config = ConfigDict(extra="ignore")
    story_id: str
    category: str
    content: str
    approved: bool = False
    created_at: datetime

class SuccessStoryCreate(BaseModel):
    category: str
    content: str

async def get_authenticator(request: Request):
    session_token = request.cookies.get("session_token")
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.split(" ")[1]
    
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    session_doc = await db.user_sessions.find_one({"session_token": session_token}, {"_id": 0})
    if not session_doc:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    expires_at = session_doc["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired")
    
    user_doc = await db.users.find_one({"user_id": session_doc["user_id"]}, {"_id": 0})
    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")
    
    return User(**user_doc)

@api_router.post("/auth/otp/send")
async def send_otp(req: OTPRequest):
    otp = str(random.randint(100000, 999999))
    expires = datetime.now(timezone.utc) + timedelta(minutes=10)
    
    await db.otp_codes.update_one(
        {"email": req.email},
        {"$set": {"otp": otp, "expires_at": expires.isoformat()}},
        upsert=True
    )
    
    html_content = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4A8B71;">Welcome to Saathi</h2>
        <p>Your OTP code is:</p>
        <h1 style="color: #4A8B71; font-size: 32px; letter-spacing: 4px;">{otp}</h1>
        <p>This code will expire in 10 minutes.</p>
        <p style="color: #8C9E96;">If you didn't request this, please ignore this email.</p>
    </div>
    """
    
    try:
        params = {
            "from": SENDER_EMAIL,
            "to": [req.email],
            "subject": "Your Saathi OTP Code",
            "html": html_content
        }
        await asyncio.to_thread(resend.Emails.send, params)
        return {"status": "success", "message": "OTP sent to email"}
    except Exception as e:
        logger.error(f"Failed to send OTP: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send OTP")

@api_router.post("/auth/otp/verify")
async def verify_otp(req: OTPVerify, response: Response):
    otp_doc = await db.otp_codes.find_one({"email": req.email}, {"_id": 0})
    if not otp_doc:
        raise HTTPException(status_code=400, detail="OTP not found")
    
    if otp_doc["otp"] != req.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    expires_at = datetime.fromisoformat(otp_doc["expires_at"])
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="OTP expired")
    
    user_doc = await db.users.find_one({"email": req.email}, {"_id": 0})
    if not user_doc:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        user_data = {
            "user_id": user_id,
            "email": req.email,
            "name": req.email.split("@")[0],
            "picture": None,
            "role": "user",
            "is_anonymous": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(user_data.copy())
        user_doc = user_data
    
    session_token = f"session_{uuid.uuid4().hex}"
    session_data = {
        "user_id": user_doc["user_id"],
        "session_token": session_token,
        "expires_at": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.user_sessions.insert_one(session_data)
    
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7*24*60*60
    )
    
    await db.otp_codes.delete_one({"email": req.email})
    
    return {"status": "success", "user": user_doc, "session_token": session_token}

@api_router.post("/auth/anonymous")
async def anonymous_login(req: AnonymousLogin, response: Response):
    user_id = f"anon_{uuid.uuid4().hex[:12]}"
    user_data = {
        "user_id": user_id,
        "email": f"{user_id}@anonymous.saathi",
        "name": req.display_name,
        "picture": None,
        "role": "user",
        "is_anonymous": True,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(user_data.copy())
    
    session_token = f"session_{uuid.uuid4().hex}"
    session_data = {
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.user_sessions.insert_one(session_data)
    
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7*24*60*60
    )
    
    return {"status": "success", "user": user_data, "session_token": session_token}

@api_router.post("/auth/google/session")
async def google_auth_session(request: Request, response: Response):
    session_id = request.headers.get("X-Session-ID")
    if not session_id:
        raise HTTPException(status_code=400, detail="Session ID required")
    
    import requests
    resp = requests.get(
        f"{OAUTH_BACKEND_URL}/auth/v1/env/oauth/session-data",
        headers={"X-Session-ID": session_id}
    )
    
    if resp.status_code != 200:
        raise HTTPException(status_code=400, detail="Invalid session")
    
    data = resp.json()
    user_doc = await db.users.find_one({"email": data["email"]}, {"_id": 0})
    if not user_doc:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        user_data = {
            "user_id": user_id,
            "email": data["email"],
            "name": data["name"],
            "picture": data.get("picture"),
            "role": "user",
            "is_anonymous": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(user_data.copy())
        user_doc = user_data
    
    session_token = data["session_token"]
    session_data = {
        "user_id": user_doc["user_id"],
        "session_token": session_token,
        "expires_at": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.user_sessions.insert_one(session_data)
    
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7*24*60*60
    )
    
    return {"status": "success", "user": user_doc, "session_token": session_token}

@api_router.get("/auth/me")
async def get_current_user(request: Request):
    user = await get_authenticator(request)
    return user

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    session_token = request.cookies.get("session_token")
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    response.delete_cookie("session_token", path="/")
    return {"status": "success"}

@api_router.post("/chat")
async def chat_with_ai(req: ChatRequest, request: Request):
    user = await get_authenticator(request)
    
    is_crisis = any(keyword in req.message.lower() for keyword in CRISIS_KEYWORDS)
    
    system_prompt = """You are a compassionate, empathetic relationship support agent for Saathi platform. 
You help users in India dealing with relationship issues like breakups, marriage conflicts, family pressure, compatibility concerns.

Guidelines:
- Always validate emotions first
- Ask clarifying questions
- Be culturally sensitive to Indian family dynamics and arranged marriages
- Provide structured guidance: feelings, causes, next steps, warning signs, when to seek professional help
- Never provide medical diagnoses or legal advice
- Gently encourage professional therapy when needed
- Use warm, non-judgmental language

If the user expresses suicidal thoughts or self-harm intent, acknowledge their pain and strongly encourage immediate professional help."""
    
    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=req.session_id,
        system_message=system_prompt
    ).with_model("openai", "gpt-5.2")
    
    user_message = UserMessage(text=req.message)
    ai_response = await chat.send_message(user_message)
    
    user_msg_id = f"msg_{uuid.uuid4().hex[:12]}"
    ai_msg_id = f"msg_{uuid.uuid4().hex[:12]}"
    
    user_msg_data = {
        "message_id": user_msg_id,
        "session_id": req.session_id,
        "user_id": user.user_id,
        "role": "user",
        "content": req.message,
        "is_crisis": is_crisis,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    
    ai_msg_data = {
        "message_id": ai_msg_id,
        "session_id": req.session_id,
        "user_id": user.user_id,
        "role": "assistant",
        "content": ai_response,
        "is_crisis": False,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    
    await db.chat_messages.insert_many([user_msg_data, ai_msg_data])
    
    return {
        "response": ai_response,
        "is_crisis": is_crisis,
        "helplines": INDIA_HELPLINES if is_crisis else None
    }

@api_router.get("/chat/history/{session_id}")
async def get_chat_history(session_id: str, request: Request, limit: int = 50):
    user = await get_authenticator(request)
    messages = await db.chat_messages.find(
        {"session_id": session_id, "user_id": user.user_id},
        {"_id": 0}
    ).sort("timestamp", 1).limit(limit).to_list(limit)
    return messages

@api_router.delete("/chat/history/{session_id}")
async def delete_chat_history(session_id: str, request: Request):
    user = await get_authenticator(request)
    await db.chat_messages.delete_many({"session_id": session_id, "user_id": user.user_id})
    return {"status": "success"}

@api_router.post("/psychologists", response_model=Psychologist)
async def create_psychologist(req: PsychologistCreate):
    psychologist_id = f"psy_{uuid.uuid4().hex[:12]}"
    psychologist_data = req.model_dump()
    psychologist_data["psychologist_id"] = psychologist_id
    psychologist_data["approved"] = False
    psychologist_data["rating"] = 0.0
    psychologist_data["created_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.psychologists.insert_one(psychologist_data)
    return Psychologist(**psychologist_data)

@api_router.get("/psychologists", response_model=List[Psychologist])
async def get_psychologists(approved_only: bool = True, skip: int = 0, limit: int = 20):
    filter_query = {"approved": True} if approved_only else {}
    psychologists = await db.psychologists.find(filter_query, {"_id": 0}).skip(skip).limit(limit).to_list(limit)
    return psychologists

@api_router.get("/psychologists/{psychologist_id}", response_model=Psychologist)
async def get_psychologist(psychologist_id: str):
    psychologist = await db.psychologists.find_one({"psychologist_id": psychologist_id}, {"_id": 0})
    if not psychologist:
        raise HTTPException(status_code=404, detail="Psychologist not found")
    return Psychologist(**psychologist)

@api_router.post("/bookings/create-order")
async def create_booking_order(req: BookingCreate, request: Request):
    user = await get_authenticator(request)
    
    psychologist = await db.psychologists.find_one({"psychologist_id": req.psychologist_id}, {"_id": 0})
    if not psychologist:
        raise HTTPException(status_code=404, detail="Psychologist not found")
    
    amount = psychologist["pricing"] * 100
    
    razor_order = razorpay_client.order.create({
        "amount": amount,
        "currency": "INR",
        "payment_capture": 1
    })
    
    booking_id = f"booking_{uuid.uuid4().hex[:12]}"
    booking_data = {
        "booking_id": booking_id,
        "user_id": user.user_id,
        "psychologist_id": req.psychologist_id,
        "slot_date": req.slot_date,
        "slot_time": req.slot_time,
        "status": "pending",
        "payment_id": razor_order["id"],
        "amount": psychologist["pricing"],
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.bookings.insert_one(booking_data)
    
    return {
        "booking_id": booking_id,
        "order_id": razor_order["id"],
        "amount": amount,
        "currency": "INR",
        "key": RAZORPAY_KEY_ID
    }

@api_router.post("/bookings/{booking_id}/confirm")
async def confirm_booking(booking_id: str, payment_id: str, request: Request):
    user = await get_authenticator(request)
    
    booking = await db.bookings.find_one({"booking_id": booking_id, "user_id": user.user_id}, {"_id": 0})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    await db.bookings.update_one(
        {"booking_id": booking_id},
        {"$set": {"status": "confirmed", "payment_id": payment_id}}
    )
    
    return {"status": "success", "message": "Booking confirmed"}

@api_router.get("/bookings", response_model=List[Booking])
async def get_user_bookings(request: Request, limit: int = 20):
    user = await get_authenticator(request)
    bookings = await db.bookings.find(
        {"user_id": user.user_id}, 
        {"_id": 0}
    ).sort("created_at", -1).limit(limit).to_list(limit)
    return bookings

@api_router.get("/admin/psychologists")
async def admin_get_psychologists(request: Request):
    user = await get_authenticator(request)
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    psychologists = await db.psychologists.find({}, {"_id": 0}).to_list(1000)
    return psychologists

@api_router.post("/admin/psychologists/{psychologist_id}/approve")
async def approve_psychologist(psychologist_id: str, request: Request):
    user = await get_authenticator(request)
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    await db.psychologists.update_one(
        {"psychologist_id": psychologist_id},
        {"$set": {"approved": True}}
    )
    return {"status": "success"}

@api_router.post("/stories", response_model=SuccessStory)
async def create_success_story(req: SuccessStoryCreate, request: Request):
    user = await get_authenticator(request)
    
    story_id = f"story_{uuid.uuid4().hex[:12]}"
    story_data = req.model_dump()
    story_data["story_id"] = story_id
    story_data["approved"] = False
    story_data["created_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.success_stories.insert_one(story_data)
    return SuccessStory(**story_data)

@api_router.get("/stories", response_model=List[SuccessStory])
async def get_success_stories():
    stories = await db.success_stories.find({"approved": True}, {"_id": 0}).to_list(1000)
    return stories

@api_router.post("/admin/stories/{story_id}/approve")
async def approve_story(story_id: str, request: Request):
    user = await get_authenticator(request)
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    await db.success_stories.update_one(
        {"story_id": story_id},
        {"$set": {"approved": True}}
    )
    return {"status": "success"}

@api_router.get("/")
async def root():
    return {"message": "Saathi API - Confidential Relationship Support Platform"}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
