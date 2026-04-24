from fastapi import APIRouter, HTTPException
from backend.models.schemas import ConvertRequest, ConvertResponse
from backend.services.tone_converter import converter

router = APIRouter()

@router.post("/convert", response_model=ConvertResponse)
async def convert_tone(request: ConvertRequest):
    try:
        converted_text = await converter.convert(
            text=request.text, 
            target_audience=request.target_audience
        )
        return ConvertResponse(
            converted_text=converted_text,
            target_audience=request.target_audience,
            original_text=request.text
        )
    except Exception as e:
        # 실제 운영 환경에서는 로깅을 추가하는 것이 좋습니다.
        raise HTTPException(status_code=500, detail=f"LLM API 호출 중 오류가 발생했습니다: {str(e)}")
