import time
from ollama import chat
import requests
from sqlalchemy import Result

def call_ollama_chat(
    message: str,
    model: str = "exaone3.5:7.8b",
    system_prompt: str = "너는 초보자를 돕는 친절한 AI 강사다.",
    temperature: float = 0.4,
    top_p: float = 0.6,
    num_predict: int = 512,
):
    # Ollama chat() 함수로 모델 응답과 소용 시간을 반환한다

    start_time = time.perf_counter()  # 시작 시간 기록 (현재시간 기록)
    # Ollama chat() 함수 호출
    response = chat(
        model = model,
        messages = [{"role": "system",
                     "content": system_prompt},
                    {"role": "user",
                     "content": message}],
        options={"temperature": temperature,
                 "top_p": top_p,
                 "num_predict": num_predict},
        think=False
    )

    # ollama 응답 시간 측정
    elapsed_time = round(time.perf_counter() - start_time, 3) # 끝나는 시간 - 시작 시간 = 경과시간

    return {
        "model" : model,
        "message" : response.message.content,
        "elapsed_time" : elapsed_time,
    }

# 로컬의 모델 목록 가져오기
OLLAMA_TAGS_URL = "http://localhost:11434/api/tags"
def get_ollama_models():
    # ollama api를 통해 로컬 모델 목록을 가져온다
    response = requests.get(
        OLLAMA_TAGS_URL,
        timeout=30
    )
    # 응답 실패(4XX, 5XX) 시 예외 발생
    response.raise_for_status()

    data = response.json()
    print(data)

    models = data.get("models", [])

    models_list = [model["name"] for model in models]
    return models_list

if __name__ == "__main__":
    print("\n채팅 층답 테스트(결과를 기다려주세요.) ; ")
    result = call_ollama_chat(message="Local LLMd이 무엇인지 초보자에게 설명해줘.")
    print("\n모델:", result["model"])
    print("소요 시간:", result["elapsed_time"], "초")
    print("응답:")
    print(result["message"])

    models = get_ollama_models()
    print("사용 가능한 모델 목록:")
    print(models)
