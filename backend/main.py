from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import convert

app = FastAPI(title="업무 말투 변환기 API")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 실제 배포 시에는 특정 도메인으로 제한하는 것이 좋습니다.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(convert.router, prefix="/api")

@app.get("/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
