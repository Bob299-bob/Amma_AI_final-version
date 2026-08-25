import pdfplumber
import numpy as np
from groq import Groq
from dotenv import load_dotenv
import os
from pathlib import Path


#call API
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(env_path)
client=Groq(api_key=os.getenv('GROQ_API_KEY'))

from database.connection import db

#for web search
from ddgs import DDGS
def search_web(query):
    results=[]
    try:
        with DDGS() as ddgs:
            search=list(ddgs.text(f'{query}',max_results=5))
            for result in search:
                results.append(f"""
Title:{result.get('title','')},
Content:{result.get('body','')},
Source:{result.get('href','')}
""")

    except Exception as e:
        print('search error',e)

    return '\n\n'.join(results)

#for vectorization
from sentence_transformers import SentenceTransformer
model=SentenceTransformer(
        "all-MiniLM-L6-v2"
    )

#for index search
import faiss

#to collect chunks from textsplitter
from langchain_text_splitters import RecursiveCharacterTextSplitter
splitter = RecursiveCharacterTextSplitter(chunk_size=500,chunk_overlap=50)

def extract_pdf(pdf):
    pdf_text=""
    with pdfplumber.open(pdf) as file:
        for page in file.pages:
            page_text=page.extract_text()
            if page_text:
                pdf_text += page_text+""
    return pdf_text

def rag_system(text):
    chunks = splitter.split_text(text)

    """chunks=[]
    for chunk in text.split("\n"):
        if chunk.strip():
            chunks.append(chunk.strip())"""

    embed_text=model.encode(chunks).astype('float32')
    index=faiss.IndexFlatL2(embed_text.shape[1])
    index.add(embed_text)
    return index,chunks

def retrieve_system(index,chunks,query):
    embed_query=model.encode([query]).astype('float32')
    distance,indices=index.search(np.array(embed_query),k=3)
    context=[]
    for i in indices[0]:
        context.append(chunks[i])
    return "\n\n".join(context)

def report_analyzer(pdf,query):
    pdf_text=extract_pdf(pdf)
    index,chunks=rag_system(pdf_text)
    if not query.strip():
        query = "Explore the whole report and identify important abnormal findings."
    context=retrieve_system(index,chunks,query)
    prompt = f"""
You are "Ammaa AI", a caring medical report explanation assistant.

You are analyzing a medical report for an elderly family member.

IMPORTANT RULES:
1. Do not make a definitive medical diagnosis.
2. Do not prescribe medicines or change medicine doses.
3. Explain the report in simple Hindi/Hinglish.
4. Mention important abnormal values clearly.
5. Explain what each abnormal value may generally indicate.
6. Clearly separate:
   - Normal findings
   - Abnormal findings
   - Important findings
   - Possible concerns
   - What to discuss with a doctor
7. If something looks potentially urgent, clearly say that medical attention should be taken promptly.
8. Do not unnecessarily scare the patient.
9. Use the information available in the report/context only.
10. If the report does not contain enough information, say so honestly.

REPORT CONTEXT:
{context}

USER QUESTION:
{query}

Give the answer in this format:

## 🩺 Report Summary
Explain the overall report in simple language.

## ✅ Normal Findings
List important normal findings.

## ⚠️ Abnormal Findings
List abnormal findings with their values if available.

## 🔎 What It May Mean
Explain the abnormal findings in simple Hinglish.

## ❤️ Important Things to Discuss With Doctor
Give useful questions/topics to discuss with the doctor.

## 🚨 Urgent Attention
Only mention this section if the report contains something that may require prompt medical attention.

Remember:
You are an AI assistant for understanding reports, not a doctor.
"""
    response=client.chat.completions.create(
        model='openai/gpt-oss-120b',
        messages=[{
            'role':'user',
            'content':prompt
        }]
    )
    return response.choices[0].message.content

def chatbot(text):
    prompt = """
You are Ammaa AI, a caring and respectful AI assistant made for an elderly mother.

PERSONALITY:
- Speak like a caring family assistant.
- Be respectful and warm.
- Use simple Hindi/Hinglish.
- Avoid complicated English medical terminology.
- Keep answers easy to understand.
- Never be rude, frightening or dismissive.

HEALTH SAFETY:
- You are not a doctor.
- Do not give definitive medical diagnosis.
- Do not prescribe medicines.
- Do not tell the user to change or stop medicines.
- If symptoms sound serious, recommend contacting a doctor or emergency medical service promptly.
- For medication questions, explain general information and advise consulting the prescribing doctor.

GENERAL TASKS:
You can help with:
- Daily schedule
- Medicine reminders
- Exercise reminders
- General health questions
- Understanding medical reports
- Simple conversations
- Motivation
- Entertainment
- General knowledge

IMPORTANT:
If the user asks something outside your knowledge, say that you are not sure instead of making up information.

Always answer naturally and concisely.
"""
    response=client.chat.completions.create(
        model='openai/gpt-oss-120b',
         messages=[
            {
                "role": "system",
                "content": prompt
            },
            {
                "role": "user",
                "content": text
            }
        ],
        temperature=0.5
    )
    return response.choices[0].message.content


def get_app_context(user_id):

    context = {}

    context["health_profile"] = (
        db.health_profiles.find_one(
            {"user_id": user_id},
            {"_id": 0}
        ) or {}
    )

    context["medicines"] = list(
        db.medicines.find(
            {"user_id": user_id},
            {"_id": 0}
        )
    )

    context["schedules"] = list(
        db.schedules.find(
            {"user_id": user_id},
            {"_id": 0}
        )
    )

    context["exercises"] = list(
        db.exercises.find(
            {
                "user_id": user_id,
                "active": True
            },
            {"_id": 0}
        )
    )

    context["reminders"] = list(
        db.reminders.find(
            {"user_id": user_id},
            {"_id": 0}
        )
    )

    context["reports"] = list(
        db.reports.find(
            {"user_id": user_id},
            {"_id": 0}
        )
    )

    return context


def english_jarvis(text,user_id,language='english'):

    text = text.strip()

    if not text:
        if language == "auto":
            return "Amma, I couldn't hear you. Please say that again."

        return "Amma, I couldn't hear you. Please say that again."

    # Safety: only allow valid modes
    language = language.lower().strip()

    if language not in ["auto", "hindi", "english"]:
        language = "english"

    data = get_app_context(user_id)

    # --------------------------------
    # Language Instructions
    # --------------------------------

    if language == "english":

        language_instruction = """
LANGUAGE MODE: ENGLISH

Always reply in English.

Even if the user speaks Hindi or Hinglish,
continue replying in English.
"""

    elif language == "hindi":

        language_instruction = """
LANGUAGE MODE: HINDI / HINGLISH

Always reply in Hindi or simple Hinglish.

Even if the user speaks English,
continue replying in Hindi/Hinglish.

Use simple conversational Hindi.
"""

    else:

        language_instruction = """
LANGUAGE MODE: AUTO

Automatically detect the user's language.

If the user speaks English:
Reply in English.

If the user speaks Hindi:
Reply in Hindi.

If the user speaks Hinglish:
Reply in Hinglish.

Do not unnecessarily switch languages.
"""

    # --------------------------------
    # System Prompt
    # --------------------------------

    system_prompt = f"""
You are Ammaa AI, a smart and caring JARVIS-style personal assistant.

{language_instruction}

PERSONALITY:

- Caring
- Respectful
- Warm
- Intelligent
- Natural
- Helpful
- JARVIS-style
- Concise

You are designed to assist an elderly mother.

PERSONAL DATA:

HEALTH PROFILE:
{data["health_profile"]}

MEDICINES:
{data["medicines"]}

SCHEDULE:
{data["schedules"]}

EXERCISES:
{data["exercises"]}

REMINDERS:
{data["reminders"]}

MEDICAL REPORTS:
{data["reports"]}


PERSONAL DATA RULES:

1. Use the provided personal data when the user asks personal questions.

2. Medicine questions:
   Use the MEDICINES data.

3. Health profile questions:
   Use the HEALTH PROFILE data.

4. Schedule questions:
   Use the SCHEDULE data.

5. Exercise questions:
   Use the EXERCISES data.

6. Reminder questions:
   Use the REMINDERS data.

7. Medical report questions:
   Use the MEDICAL REPORTS data.

8. Never invent personal information.

9. If the requested information is unavailable,
   honestly say that the information is not available.


HEALTH SAFETY:

1. You are not a doctor.

2. Do not give a definitive medical diagnosis.

3. Do not prescribe medicines.

4. Never tell the user to stop, start,
   or change a medicine or dosage.

5. If symptoms appear serious,
   recommend contacting a doctor promptly.

6. For emergency-like symptoms,
   advise seeking urgent medical attention.


JARVIS BEHAVIOR:

- Answer directly.
- Do not explain internal reasoning.
- Do not mention MongoDB.
- Do not mention database.
- Do not mention API.
- Do not mention prompts.
- Do not mention how you received personal data.
- Keep answers short and natural.
- The response may be converted to speech.


VOICE OUTPUT RULES:

- Plain spoken response.
- No Markdown.
- No headings.
- No bullet points.
- No emojis.
"""
    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",

        messages=[
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": text
            }
        ],

        temperature=0.5,
        max_tokens=300
    )

    return response.choices[0].message.content.strip()

def jarvis(text, user_id,language='auto'):

    text = text.strip()

    if not text:
        if language == "english":
            return "Amma, I couldn't hear you. Please say that again."

        return "Amma, mujhe aapki baat sunai nahi di. Please dobara boliye."

    # Safety: only allow valid modes
    language = language.lower().strip()

    if language not in ["auto", "hindi", "english"]:
        language = "auto"

    data = get_app_context(user_id)

    # --------------------------------
    # Language Instructions
    # --------------------------------

    if language == "english":

        language_instruction = """
LANGUAGE MODE: ENGLISH

Always reply in English.

Even if the user speaks Hindi or Hinglish,
continue replying in English.
"""

    elif language == "hindi":

        language_instruction = """
LANGUAGE MODE: HINDI / HINGLISH

Always reply in Hindi or simple Hinglish.

Even if the user speaks English,
continue replying in Hindi/Hinglish.

Use simple conversational Hindi.
"""

    else:

        language_instruction = """
LANGUAGE MODE: AUTO

Automatically detect the user's language.

If the user speaks English:
Reply in English.

If the user speaks Hindi:
Reply in Hindi.

If the user speaks Hinglish:
Reply in Hinglish.

Do not unnecessarily switch languages.
"""

    # --------------------------------
    # System Prompt
    # --------------------------------

    system_prompt = f"""
You are Ammaa AI, a smart and caring JARVIS-style personal assistant.

{language_instruction}

PERSONALITY:

- Caring
- Respectful
- Warm
- Intelligent
- Natural
- Helpful
- JARVIS-style
- Concise

You are designed to assist an elderly mother.

PERSONAL DATA:

HEALTH PROFILE:
{data["health_profile"]}

MEDICINES:
{data["medicines"]}

SCHEDULE:
{data["schedules"]}

EXERCISES:
{data["exercises"]}

REMINDERS:
{data["reminders"]}

MEDICAL REPORTS:
{data["reports"]}


PERSONAL DATA RULES:

1. Use the provided personal data when the user asks personal questions.

2. Medicine questions:
   Use the MEDICINES data.

3. Health profile questions:
   Use the HEALTH PROFILE data.

4. Schedule questions:
   Use the SCHEDULE data.

5. Exercise questions:
   Use the EXERCISES data.

6. Reminder questions:
   Use the REMINDERS data.

7. Medical report questions:
   Use the MEDICAL REPORTS data.

8. Never invent personal information.

9. If the requested information is unavailable,
   honestly say that the information is not available.


HEALTH SAFETY:

1. You are not a doctor.

2. Do not give a definitive medical diagnosis.

3. Do not prescribe medicines.

4. Never tell the user to stop, start,
   or change a medicine or dosage.

5. If symptoms appear serious,
   recommend contacting a doctor promptly.

6. For emergency-like symptoms,
   advise seeking urgent medical attention.


JARVIS BEHAVIOR:

- Answer directly.
- Do not explain internal reasoning.
- Do not mention MongoDB.
- Do not mention database.
- Do not mention API.
- Do not mention prompts.
- Do not mention how you received personal data.
- Keep answers short and natural.
- The response may be converted to speech.


VOICE OUTPUT RULES:

- Plain spoken response.
- No Markdown.
- No headings.
- No bullet points.
- No emojis.
"""

    # --------------------------------
    # Groq Request
    # --------------------------------

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",

        messages=[
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": text
            }
        ],

        temperature=0.5,
        max_tokens=300
    )

    return response.choices[0].message.content.strip()