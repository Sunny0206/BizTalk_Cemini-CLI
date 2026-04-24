import os
from dotenv import load_dotenv
from langchain_upstage import ChatUpstage
from langchain_core.prompts import ChatPromptTemplate
from backend.prompts.templates import PROMPTS

# 환경 변수 로드
load_dotenv()

class ToneConverter:
    def __init__(self):
        api_key = os.getenv("UPSTAGE_API_KEY")
        if not api_key:
            raise ValueError("UPSTAGE_API_KEY is not set in .env file")
        
        # ChatUpstage 초기화 (모델명은 solar-pro 사용)
        self.llm = ChatUpstage(api_key=api_key, model="solar-pro")

    async def convert(self, text: str, target_audience: str) -> str:
        # 대상에 맞는 시스템 프롬프트 선택
        system_prompt = PROMPTS.get(target_audience, PROMPTS["team"])
        
        # 프롬프트 템플릿 설정
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", "{text}")
        ])
        
        # 체인 생성 및 실행
        chain = prompt | self.llm
        response = await chain.ainvoke({"text": text})
        
        return response.content

# 싱글톤 인스턴스 생성
converter = ToneConverter()
