document.addEventListener('DOMContentLoaded', () => {
    const API_BASE = "http://localhost:8000"; // 로컬 개발 시
    
    const targetButtons = document.querySelectorAll('.target-btn');
    const inputText = document.getElementById('inputText');
    const convertBtn = document.getElementById('convertBtn');
    const outputSection = document.getElementById('outputSection');
    const outputText = document.getElementById('outputText');
    const copyBtn = document.getElementById('copyBtn');
    const loading = document.getElementById('loading');

    let selectedTarget = null;

    // 수신 대상 버튼 클릭 이벤트
    targetButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 기존 active 클래스 제거
            targetButtons.forEach(btn => btn.classList.remove('active'));
            // 클릭된 버튼에 active 클래스 추가
            button.classList.add('active');
            selectedTarget = button.dataset.target;
        });
    });

    // 변환하기 버튼 클릭 이벤트
    convertBtn.addEventListener('click', async () => {
        const text = inputText.value.trim();

        if (!selectedTarget) {
            alert('먼저 받는 사람을 선택해주세요.');
            return;
        }

        if (!text) {
            alert('변환할 내용을 입력해주세요.');
            return;
        }

        // 로딩 시작
        setLoading(true);
        outputSection.style.display = 'none';

        try {
            const response = await fetch(`${API_BASE}/api/convert`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: text,
                    target_audience: selectedTarget
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || '변환 중 오류가 발생했습니다.');
            }

            const data = await response.json();
            
            // 결과 표시
            outputText.value = data.converted_text;
            outputSection.style.display = 'block';
            
            // 결과창으로 스크롤
            outputSection.scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error('Error:', error);
            alert(`오류 발생: ${error.message}`);
        } finally {
            // 로딩 종료
            setLoading(false);
        }
    });

    // 복사하기 버튼 클릭 이벤트
    copyBtn.addEventListener('click', () => {
        const textToCopy = outputText.value;
        
        if (!textToCopy) return;

        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = copyBtn.innerText;
            copyBtn.innerText = '복사 완료! ✅';
            setTimeout(() => {
                copyBtn.innerText = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Copy failed:', err);
            alert('복사에 실패했습니다.');
        });
    });

    // 로딩 상태 제어 함수
    function setLoading(isLoading) {
        if (isLoading) {
            loading.style.display = 'block';
            convertBtn.disabled = true;
            convertBtn.innerText = '변환 중...';
        } else {
            loading.style.display = 'none';
            convertBtn.disabled = false;
            convertBtn.innerText = '변환하기';
        }
    }
});
