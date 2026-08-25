from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.connection import db
from routes.profile import router as profile_router
from routes.medicine import router as medicine_router
from routes.schedule import router as schedule_router
from routes.excercise import router as exercise_router
from routes.reminder import router as reminder_router
from routes.chat import router as chat_router
from routes.report import router as reports_router
from routes.englishchat import router as english_chat
from routes.entertainment import router as entertainment_router
from routes.auth import router as auth_router

app=FastAPI(
    title='Amma Ai app',
    description='Backend for amma ai app',
    version='1.0.0'
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5174",
        "http://127.0.0.1:5174",

        # Agar future me Vite 5173 par chale
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(profile_router)
app.include_router(medicine_router)
app.include_router(schedule_router)
app.include_router(exercise_router)
app.include_router(reminder_router)
app.include_router(chat_router)
app.include_router(reports_router)
app.include_router(english_chat)
app.include_router(entertainment_router)
app.include_router(auth_router)

@app.get('/')
def Home():
    return{
        'message':'Connection established'
    }
@app.get('/api/health')
def health_check():
    return{
        'status':'ok',
        'message':'Backend is working'
    }

@app.get('/api/database')
def database_test():
    try:
        db.command('ping')
        return{
            'status':'ok',
            'message':'mongodb is connected'
        }
    
    except Exception as e:
        return{
            'status':'error',
            'message':str(e)
        }