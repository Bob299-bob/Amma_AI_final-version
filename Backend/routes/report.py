from fastapi import APIRouter, UploadFile, File, Form
import tempfile
import os

from services.brain import report_analyzer

router = APIRouter(
    prefix="/api/reports",
    tags=["Reports"]
)


@router.post("/analyze")
async def analyze_report(
    file: UploadFile = File(...),
    query: str = Form("")
):

    temp_path = None

    try:

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".pdf"
        ) as temp:

            temp.write(await file.read())
            temp_path = temp.name

        result = report_analyzer(
            temp_path,
            query
        )

        return {
            "filename": file.filename,
            "analysis": result
        }

    finally:

        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)